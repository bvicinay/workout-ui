# Workout Dashboard — API Spec & Frontend Development Guide

This document is a complete specification for building a React + Vite + Recharts frontend dashboard that consumes the Workout API. It contains everything needed: API endpoints with real sample responses, data semantics, visualization guidance, and development setup.

---

## Table of Contents

1. [Development Setup](#development-setup)
2. [API Overview](#api-overview)
3. [Data Domain Context](#data-domain-context)
4. [API Endpoints — Full Reference](#api-endpoints--full-reference)
5. [Response Format & Error Handling](#response-format--error-handling)
6. [Dashboard Views & Visualization Guide](#dashboard-views--visualization-guide)
7. [Data Characteristics & Edge Cases](#data-characteristics--edge-cases)

---

## Development Setup

### API Server (already built)

The backend API is a separate project. To run it locally for frontend development:

```bash
cd /path/to/workout-api
python dev_server.py --port 8000
```

This starts the API at `http://localhost:8000`. No authentication is needed for local development.

### Frontend Project (to be built)

Use React + Vite + Recharts:

```bash
npm create vite@latest workout-dashboard -- --template react-ts
cd workout-dashboard
npm install recharts react-router-dom
npm install -D @types/react-router-dom
```

### Connecting Frontend to API

Configure the API base URL to be switchable between local dev and production:

```typescript
// src/config.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

The Vite dev server should proxy API requests to avoid CORS issues during development. Add to `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

With this proxy config, frontend code calls `/api/exercises` which Vite forwards to `http://localhost:8000/exercises`. Alternatively, call the API directly — it returns `Access-Control-Allow-Origin: *` on all responses, so CORS is not a problem.

---

## API Overview

| Endpoint | Purpose | Primary Dashboard Use |
|----------|---------|----------------------|
| `GET /exercises` | List all exercises with frequency | Exercise picker/selector, exercise list table |
| `GET /exercises/personal-records` | All-time bests per exercise | Personal records leaderboard/table |
| `GET /exercises/{name}/history` | Set-level data over time | Exercise detail table (drill-down) |
| `GET /exercises/{name}/progression` | 1RM/weight trend per session | Exercise progression line chart |
| `GET /workouts` | List workout sessions | Workout log/calendar view |
| `GET /workouts/{date}` | Full workout detail for a day | Workout detail drill-down |
| `GET /workouts/splits` | Muscle groups per session | Training split timeline |
| `GET /muscle-groups/weekly` | Weekly volume per muscle group | Weekly volume stacked bar chart |
| `GET /muscle-groups/daily` | Daily volume per muscle group | Daily volume breakdown |
| `GET /volume/trends` | Total weekly sets over time | Overall training load line chart |

All endpoints are `GET` only. No authentication is required (handled at the gateway level in production).

---

## Data Domain Context

This is a personal fitness tracking dashboard. The data comes from a gym training app (Trainerize) and spans **January 2024 to present** (~2 years of training data).

### Key Concepts

| Term | Meaning |
|------|---------|
| **Set** | One instance of performing an exercise (e.g., 8 reps at 185 lbs). The atomic unit of training data. |
| **Exercise** | A specific movement (e.g., "Barbell Squat", "Cable Tricep Pushdown"). Has a name and muscle group. |
| **Workout** | A training session on a specific day (e.g., "28.5 Legs + Arms" on 2026-02-21). Contains multiple exercises. |
| **1RM (One-Rep Max)** | The estimated maximum weight for one repetition. Calculated from weight × reps using the Epley formula: `weight × (1 + reps/30)`. This is the primary strength metric. |
| **Effective 1RM** | Average of the top 2 set 1RMs for an exercise on a day. Smooths out single-set spikes. |
| **Volume** | Weight × reps for a set. Represents total load moved. |
| **Muscle Group** | One of 9 groups: Back, Biceps, Chest, Core, Forearms, Legs, Rear Delts, Shoulders, Triceps. |
| **Superset** | Two or more exercises performed back-to-back without rest. Identified by `set_is_superset: true` and decimal `exercise_sequence` (e.g., "5.1", "5.2"). |
| **Program Cycle** | Workouts follow a numbered pattern like "28.1 Push", "28.2 Pull", "28.3 Legs". The number prefix (28) is the program cycle — it increments every few weeks when the trainer updates the program. |
| **Workout Split** | The training schedule pattern. Typical splits include: Push, Pull, Legs, Upper Body, Legs + Arms, and Abs. |

### Units

All weights are in **lbs (pounds)**. There is no unit column — the entire dataset is imperial. Display as "lbs" in the UI.

### Data Scale

| Metric | Count |
|--------|-------|
| Total sets | ~11,700 |
| Total workouts | ~564 |
| Unique exercises | 169 (with muscle groups assigned) |
| Muscle groups | 9 |
| Date range | 2024-01-08 to present |
| Typical sets per workout | 20-30 |
| Typical exercises per workout | 8-10 |
| Typical sets per exercise | 2-3 |

### Muscle Group Colors (suggested palette)

Use consistent colors across all charts for each muscle group:

| Muscle Group | Suggested Color | Hex |
|-------------|----------------|-----|
| Legs | Blue | `#3B82F6` |
| Back | Green | `#22C55E` |
| Chest | Red | `#EF4444` |
| Shoulders | Purple | `#A855F7` |
| Biceps | Orange | `#F97316` |
| Triceps | Teal | `#14B8A6` |
| Core | Yellow | `#EAB308` |
| Rear Delts | Pink | `#EC4899` |
| Forearms | Gray | `#6B7280` |

---

## API Endpoints — Full Reference

### GET /exercises

List all exercises with their muscle group and training frequency. Use this to populate exercise picker dropdowns, exercise list tables, and determine which exercises are most frequently trained.

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `muscle_group` | string | No | Filter to a specific muscle group (e.g., `Legs`, `Chest`) |

**Request:**
```
GET /exercises
GET /exercises?muscle_group=Legs
```

**Response (200):**
```json
{
  "data": [
    {
      "exercise_name": "Cable External Rotation",
      "muscle_group": "Rear Delts",
      "sessions": 219,
      "workouts": 219
    },
    {
      "exercise_name": "Cable Internal Shoulder Rotation",
      "muscle_group": "Shoulders",
      "sessions": 196,
      "workouts": 196
    },
    {
      "exercise_name": "Dumbbell Lateral Raises",
      "muscle_group": "Shoulders",
      "sessions": 132,
      "workouts": 132
    },
    {
      "exercise_name": "Dumbbell Incline Bench Press",
      "muscle_group": "Chest",
      "sessions": 126,
      "workouts": 126
    },
    {
      "exercise_name": "Lat Pulldown",
      "muscle_group": "Back",
      "sessions": 107,
      "workouts": 107
    }
  ],
  "count": 169
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `exercise_name` | string | Normalized exercise name (proper-capitalized) |
| `muscle_group` | string | Primary muscle group |
| `sessions` | number | Number of distinct dates this exercise was performed |
| `workouts` | number | Number of distinct workout sessions containing this exercise |

**Sorted by:** `sessions` descending (most frequent first).

**Exercise counts by muscle group:**

| Muscle Group | Count |
|-------------|-------|
| Legs | 32 |
| Core | 28 |
| Back | 27 |
| Chest | 27 |
| Triceps | 17 |
| Shoulders | 15 |
| Biceps | 14 |
| Rear Delts | 6 |
| Forearms | 3 |

---

### GET /exercises/personal-records

All-time best performance for each exercise. Use for a personal records leaderboard table.

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `muscle_group` | string | No | Filter to a specific muscle group |

**Request:**
```
GET /exercises/personal-records
GET /exercises/personal-records?muscle_group=Chest
```

**Response (200):**
```json
{
  "data": [
    {
      "exercise_name": "Leg Press Machine",
      "muscle_group": "Legs",
      "all_time_peak_1rm": 504.0,
      "all_time_max_weight": 360.0,
      "all_time_max_volume": 4320.0
    },
    {
      "exercise_name": "Smith Machine Bent Over Row",
      "muscle_group": "Back",
      "all_time_peak_1rm": 379.83,
      "all_time_max_weight": 265.0,
      "all_time_max_volume": 3445.0
    },
    {
      "exercise_name": "Hip Thrust Machine",
      "muscle_group": "Legs",
      "all_time_peak_1rm": 329.67,
      "all_time_max_weight": 230.0,
      "all_time_max_volume": 2990.0
    },
    {
      "exercise_name": "Barbell Romanian Deadlift",
      "muscle_group": "Legs",
      "all_time_peak_1rm": 313.33,
      "all_time_max_weight": 235.0,
      "all_time_max_volume": 2350.0
    }
  ],
  "count": 105
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `exercise_name` | string | Exercise name |
| `muscle_group` | string | Muscle group |
| `all_time_peak_1rm` | number | Best estimated 1RM ever achieved (lbs). The primary strength metric. |
| `all_time_max_weight` | number | Heaviest weight ever used (lbs) |
| `all_time_max_volume` | number | Highest single-set volume (weight × reps) ever achieved |

**Sorted by:** `all_time_peak_1rm` descending.

**Note:** Only exercises with numeric reps+weight data appear here (105 of 169). Bodyweight-only, time-based, and unlogged exercises are excluded.

**Note:** Some exercises have anomalously high 1RM values (e.g., Cable Face Pull at 1553 lbs) because the cable machine weight stack numbers don't represent actual resistance. This is expected — the 1RM formula treats all weight values equally. The frontend may want to filter or flag these. Compound barbell exercises (Squat, Deadlift, Bench Press) have the most meaningful 1RM values.

---

### GET /exercises/{exercise_name}/progression

One data point per workout session for a specific exercise, ordered chronologically. This is the primary endpoint for **line charts showing strength progression over time**.

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `exercise_name` | string | URL-encoded exercise name (e.g., `Barbell%20Squat`) |

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `start_date` | string | No | Start date filter (yyyy-mm-dd) |
| `end_date` | string | No | End date filter (yyyy-mm-dd) |

**Request:**
```
GET /exercises/Barbell%20Squat/progression
GET /exercises/Barbell%20Squat/progression?start_date=2025-09-01
```

**Response (200) — Barbell Squat, full history:**
```json
{
  "data": [
    { "date": "2024-02-16", "exercise_peak_1rm": 180.0, "exercise_eff_1rm": 180.0, "exercise_max_weight": 135.0, "exercise_max_volume": 1350.0 },
    { "date": "2024-02-23", "exercise_peak_1rm": 189.0, "exercise_eff_1rm": 189.0, "exercise_max_weight": 135.0, "exercise_max_volume": 1620.0 },
    { "date": "2024-02-29", "exercise_peak_1rm": 196.33, "exercise_eff_1rm": 196.33, "exercise_max_weight": 155.0, "exercise_max_volume": 1240.0 },
    { "date": "2025-02-22", "exercise_peak_1rm": 189.0, "exercise_eff_1rm": 189.0, "exercise_max_weight": 135.0, "exercise_max_volume": 1620.0 },
    { "date": "2025-03-01", "exercise_peak_1rm": 217.0, "exercise_eff_1rm": 217.0, "exercise_max_weight": 155.0, "exercise_max_volume": 1860.0 },
    { "date": "2025-03-08", "exercise_peak_1rm": 217.0, "exercise_eff_1rm": 217.0, "exercise_max_weight": 155.0, "exercise_max_volume": 1860.0 },
    { "date": "2025-03-15", "exercise_peak_1rm": 210.0, "exercise_eff_1rm": 210.0, "exercise_max_weight": 175.0, "exercise_max_volume": 1240.0 },
    { "date": "2025-04-12", "exercise_peak_1rm": 206.67, "exercise_eff_1rm": 206.67, "exercise_max_weight": 155.0, "exercise_max_volume": 1620.0 },
    { "date": "2025-04-26", "exercise_peak_1rm": 217.0, "exercise_eff_1rm": 217.0, "exercise_max_weight": 155.0, "exercise_max_volume": 1860.0 },
    { "date": "2025-06-21", "exercise_peak_1rm": 217.0, "exercise_eff_1rm": 217.0, "exercise_max_weight": 155.0, "exercise_max_volume": 1860.0 },
    { "date": "2025-07-05", "exercise_peak_1rm": 217.0, "exercise_eff_1rm": 217.0, "exercise_max_weight": 155.0, "exercise_max_volume": 1860.0 },
    { "date": "2025-08-23", "exercise_peak_1rm": 196.33, "exercise_eff_1rm": 196.33, "exercise_max_weight": 155.0, "exercise_max_volume": 1240.0 },
    { "date": "2025-08-30", "exercise_peak_1rm": 217.0, "exercise_eff_1rm": 217.0, "exercise_max_weight": 155.0, "exercise_max_volume": 1860.0 },
    { "date": "2025-09-06", "exercise_peak_1rm": 220.0, "exercise_eff_1rm": 220.0, "exercise_max_weight": 165.0, "exercise_max_volume": 1650.0 },
    { "date": "2025-09-20", "exercise_peak_1rm": 220.0, "exercise_eff_1rm": 220.0, "exercise_max_weight": 165.0, "exercise_max_volume": 1650.0 },
    { "date": "2025-09-27", "exercise_peak_1rm": 221.67, "exercise_eff_1rm": 221.67, "exercise_max_weight": 175.0, "exercise_max_volume": 1400.0 },
    { "date": "2025-10-03", "exercise_peak_1rm": 221.67, "exercise_eff_1rm": 221.67, "exercise_max_weight": 175.0, "exercise_max_volume": 1400.0 },
    { "date": "2025-10-25", "exercise_peak_1rm": 215.33, "exercise_eff_1rm": 215.33, "exercise_max_weight": 170.0, "exercise_max_volume": 1360.0 },
    { "date": "2025-11-01", "exercise_peak_1rm": 228.0, "exercise_eff_1rm": 228.0, "exercise_max_weight": 180.0, "exercise_max_volume": 1440.0 },
    { "date": "2025-11-08", "exercise_peak_1rm": 234.33, "exercise_eff_1rm": 234.33, "exercise_max_weight": 185.0, "exercise_max_volume": 1480.0 },
    { "date": "2026-01-10", "exercise_peak_1rm": 220.0, "exercise_eff_1rm": 220.0, "exercise_max_weight": 165.0, "exercise_max_volume": 1650.0 },
    { "date": "2026-01-17", "exercise_peak_1rm": 234.33, "exercise_eff_1rm": 234.33, "exercise_max_weight": 185.0, "exercise_max_volume": 1480.0 },
    { "date": "2026-01-24", "exercise_peak_1rm": 247.0, "exercise_eff_1rm": 247.0, "exercise_max_weight": 195.0, "exercise_max_volume": 1560.0 },
    { "date": "2026-02-21", "exercise_peak_1rm": 247.0, "exercise_eff_1rm": 247.0, "exercise_max_weight": 205.0, "exercise_max_volume": 1560.0 }
  ],
  "count": 24
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Session date (yyyy-mm-dd) |
| `exercise_peak_1rm` | number | Best estimated 1RM for this exercise on this day (lbs). **Primary Y-axis for progression charts.** |
| `exercise_eff_1rm` | number | Average of top 2 set 1RMs. Smoother trend line. |
| `exercise_max_weight` | number | Heaviest weight used that day (lbs). Good for a secondary Y-axis or tooltip. |
| `exercise_max_volume` | number | Best single-set volume that day |

**Sorted by:** `date` ascending (chronological — ready for charting).

**Error (404) — exercise not found:**
```json
{ "error": "No progression data for exercise 'Nonexistent'" }
```

**Charting notes:**
- X-axis: `date` (parse as Date)
- Primary Y-axis: `exercise_peak_1rm` (lbs) — line chart
- Optional secondary line: `exercise_max_weight` (lbs)
- Gaps in dates are normal (exercise isn't performed every day). Connect points directly, don't interpolate.
- Typical exercise has 15-50 data points over 2 years.

---

### GET /exercises/{exercise_name}/history

Complete set-level detail for a specific exercise across all workout sessions. Sets are grouped by date/session. This is the endpoint for **exercise drill-down tables** showing exactly what was performed each session.

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `exercise_name` | string | URL-encoded exercise name |

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `start_date` | string | No | Start date filter (yyyy-mm-dd) |
| `end_date` | string | No | End date filter (yyyy-mm-dd) |

**Request:**
```
GET /exercises/Barbell%20Squat/history
GET /exercises/Barbell%20Squat/history?start_date=2026-01-01
```

**Response (200) — Barbell Squat, from 2026-01-01:**
```json
{
  "data": [
    {
      "date": "2026-02-21",
      "workout_name": "28.5 Legs + Arms",
      "daily_exercise_id": 7420837455,
      "exercise_peak_1rm": 247.0,
      "exercise_eff_1rm": 247.0,
      "exercise_max_weight": 205.0,
      "exercise_max_volume": 1560.0,
      "sets": [
        {
          "set_sequence": 1,
          "set_reps_target": "8",
          "set_reps": "6",
          "set_weight": 205.0,
          "set_1rm_epley": 246.0,
          "set_volume": 1230.0
        },
        {
          "set_sequence": 2,
          "set_reps_target": "8",
          "set_reps": "8",
          "set_weight": 195.0,
          "set_1rm_epley": 247.0,
          "set_volume": 1560.0
        },
        {
          "set_sequence": 3,
          "set_reps_target": "8",
          "set_reps": "8",
          "set_weight": 195.0,
          "set_1rm_epley": 247.0,
          "set_volume": 1560.0
        }
      ]
    },
    {
      "date": "2026-01-24",
      "workout_name": "27.5 Legs + Arms",
      "daily_exercise_id": 7265874846,
      "exercise_peak_1rm": 247.0,
      "exercise_eff_1rm": 247.0,
      "exercise_max_weight": 195.0,
      "exercise_max_volume": 1560.0,
      "sets": [
        {
          "set_sequence": 1,
          "set_reps_target": "8",
          "set_reps": "8",
          "set_weight": 195.0,
          "set_1rm_epley": 247.0,
          "set_volume": 1560.0
        },
        {
          "set_sequence": 2,
          "set_reps_target": "8",
          "set_reps": "8",
          "set_weight": 195.0,
          "set_1rm_epley": 247.0,
          "set_volume": 1560.0
        },
        {
          "set_sequence": 3,
          "set_reps_target": "8",
          "set_reps": "8",
          "set_weight": 195.0,
          "set_1rm_epley": 247.0,
          "set_volume": 1560.0
        }
      ]
    },
    {
      "date": "2026-01-17",
      "workout_name": "27.5 Legs + Arms",
      "daily_exercise_id": 7265874835,
      "exercise_peak_1rm": 234.33,
      "exercise_eff_1rm": 234.33,
      "exercise_max_weight": 185.0,
      "exercise_max_volume": 1480.0,
      "sets": [
        {
          "set_sequence": 1,
          "set_reps_target": "8",
          "set_reps": "8",
          "set_weight": 185.0,
          "set_1rm_epley": 234.33,
          "set_volume": 1480.0
        },
        {
          "set_sequence": 2,
          "set_reps_target": "8",
          "set_reps": "8",
          "set_weight": 185.0,
          "set_1rm_epley": 234.33,
          "set_volume": 1480.0
        },
        {
          "set_sequence": 3,
          "set_reps_target": "8",
          "set_reps": "8",
          "set_weight": 185.0,
          "set_1rm_epley": 234.33,
          "set_volume": 1480.0
        }
      ]
    },
    {
      "date": "2026-01-10",
      "workout_name": "26.5 Legs + Arms",
      "daily_exercise_id": 7176717047,
      "exercise_peak_1rm": 220.0,
      "exercise_eff_1rm": 220.0,
      "exercise_max_weight": 165.0,
      "exercise_max_volume": 1650.0,
      "sets": [
        {
          "set_sequence": 1,
          "set_reps_target": "8",
          "set_reps": "10",
          "set_weight": 165.0,
          "set_1rm_epley": 220.0,
          "set_volume": 1650.0
        },
        {
          "set_sequence": 2,
          "set_reps_target": "8",
          "set_reps": "10",
          "set_weight": 165.0,
          "set_1rm_epley": 220.0,
          "set_volume": 1650.0
        },
        {
          "set_sequence": 3,
          "set_reps_target": "8",
          "set_reps": "10",
          "set_weight": 165.0,
          "set_1rm_epley": 220.0,
          "set_volume": 1650.0
        }
      ]
    }
  ],
  "count": 4
}
```

**Response fields (session level):**

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Session date (yyyy-mm-dd) |
| `workout_name` | string | Name of the workout (e.g., "28.5 Legs + Arms") |
| `daily_exercise_id` | number | Unique ID for this exercise instance on this day |
| `exercise_peak_1rm` | number \| null | Best 1RM across all sets this session |
| `exercise_eff_1rm` | number \| null | Average of top 2 set 1RMs |
| `exercise_max_weight` | number \| null | Heaviest weight used |
| `exercise_max_volume` | number \| null | Best single-set volume |
| `sets` | array | Individual sets (see below) |

**Response fields (set level):**

| Field | Type | Description |
|-------|------|-------------|
| `set_sequence` | number | Set number within the exercise (1, 2, 3...) |
| `set_reps_target` | string \| null | Prescribed reps (can be: "8", "12 each", "max", "5:00") |
| `set_reps` | string \| null | Actual reps performed (usually numeric as string, e.g., "8") |
| `set_weight` | number \| null | Weight used (lbs). Null for bodyweight/unlogged exercises. |
| `set_1rm_epley` | number \| null | Estimated 1RM for this specific set |
| `set_volume` | number \| null | This set's volume (weight × reps) |

**Sorted by:** `date` descending (most recent first), then `set_sequence` ascending within each session.

**Display notes:**
- Display as a table with one section per date, showing all sets
- Highlight when `set_reps` < `set_reps_target` (missed target) or > `set_reps_target` (exceeded target)
- `set_reps` and `set_reps_target` are strings — compare numerically only when both are pure integers
- Null values for `set_reps`, `set_weight` etc. mean the set was not logged (common for warm-ups, stretching)

---

### GET /workouts

Paginated list of all workout sessions with summary statistics.

**Query Parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `start_date` | string | No | — | Start date filter (yyyy-mm-dd) |
| `end_date` | string | No | — | End date filter (yyyy-mm-dd) |
| `limit` | number | No | 50 | Max results to return |
| `offset` | number | No | 0 | Pagination offset |

**Request:**
```
GET /workouts?limit=3
GET /workouts?start_date=2026-02-01&end_date=2026-02-28
```

**Response (200):**
```json
{
  "data": [
    {
      "daily_workout_id": 1022176914,
      "date": "2026-02-21",
      "workout_name": "28.5 Legs + Arms",
      "exercise_count": 10,
      "total_sets": 25
    },
    {
      "daily_workout_id": 1022176911,
      "date": "2026-02-20",
      "workout_name": "28.4 Upper Body",
      "exercise_count": 10,
      "total_sets": 26
    },
    {
      "daily_workout_id": 1022176909,
      "date": "2026-02-18",
      "workout_name": "28.3 Legs",
      "exercise_count": 8,
      "total_sets": 22
    }
  ],
  "count": 3
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `daily_workout_id` | number | Unique workout session ID |
| `date` | string | Workout date (yyyy-mm-dd) |
| `workout_name` | string | Workout name (e.g., "28.5 Legs + Arms") |
| `exercise_count` | number | Number of distinct exercises in this workout |
| `total_sets` | number | Total number of sets in this workout |

**Sorted by:** `date` descending (most recent first).

**Notes:**
- Multiple workouts can occur on the same date (e.g., "28.2 Pull" and "Abs" on 2026-02-17)
- `exercise_count` includes warm-ups. `total_sets` includes all sets (including warm-up sets with no data logged)
- Use `daily_workout_id` as the unique key, not `date`

---

### GET /workouts/{date}

Complete workout detail for a specific date — every workout session, every exercise, every set. This is the endpoint for **workout detail drill-down views**.

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `date` | string | Date in yyyy-mm-dd format |

**Request:**
```
GET /workouts/2026-02-21
```

**Response (200):**
```json
{
  "data": [
    {
      "daily_workout_id": 1022176914,
      "date": "2026-02-21",
      "workout_name": "28.5 Legs + Arms",
      "exercises": [
        {
          "exercise_sequence": "1",
          "exercise_name": "Jog",
          "muscle_group": "",
          "exercise_rest": "90s",
          "set_is_superset": false,
          "exercise_peak_1rm": null,
          "sets": [
            {
              "set_sequence": 1,
              "set_reps_target": "5:00",
              "set_reps": null,
              "set_weight": null,
              "set_1rm_epley": null,
              "set_volume": null
            }
          ]
        },
        {
          "exercise_sequence": "3",
          "exercise_name": "Barbell Squat",
          "muscle_group": "Legs",
          "exercise_rest": "120s",
          "set_is_superset": false,
          "exercise_peak_1rm": 247.0,
          "sets": [
            { "set_sequence": 1, "set_reps_target": "8", "set_reps": "6", "set_weight": 205.0, "set_1rm_epley": 246.0, "set_volume": 1230.0 },
            { "set_sequence": 2, "set_reps_target": "8", "set_reps": "8", "set_weight": 195.0, "set_1rm_epley": 247.0, "set_volume": 1560.0 },
            { "set_sequence": 3, "set_reps_target": "8", "set_reps": "8", "set_weight": 195.0, "set_1rm_epley": 247.0, "set_volume": 1560.0 }
          ]
        },
        {
          "exercise_sequence": "5.1",
          "exercise_name": "Ez Bar Skull Crushers",
          "muscle_group": "Triceps",
          "exercise_rest": "0s",
          "set_is_superset": true,
          "exercise_peak_1rm": 93.17,
          "sets": [
            { "set_sequence": 1, "set_reps_target": "12", "set_reps": "10", "set_weight": 65.0, "set_1rm_epley": 86.67, "set_volume": 650.0 },
            { "set_sequence": 2, "set_reps_target": "12", "set_reps": "13", "set_weight": 65.0, "set_1rm_epley": 93.17, "set_volume": 845.0 },
            { "set_sequence": 3, "set_reps_target": "12", "set_reps": "12", "set_weight": 65.0, "set_1rm_epley": 91.0, "set_volume": 780.0 }
          ]
        },
        {
          "exercise_sequence": "5.2",
          "exercise_name": "Ez Bar Bicep Curls",
          "muscle_group": "Biceps",
          "exercise_rest": "60s",
          "set_is_superset": true,
          "exercise_peak_1rm": 91.0,
          "sets": [
            { "set_sequence": 1, "set_reps_target": "max", "set_reps": "12", "set_weight": 65.0, "set_1rm_epley": 91.0, "set_volume": 780.0 },
            { "set_sequence": 2, "set_reps_target": "max", "set_reps": "6", "set_weight": 65.0, "set_1rm_epley": 78.0, "set_volume": 390.0 },
            { "set_sequence": 3, "set_reps_target": "max", "set_reps": "6", "set_weight": 65.0, "set_1rm_epley": 78.0, "set_volume": 390.0 }
          ]
        },
        {
          "exercise_sequence": "7",
          "exercise_name": "Supinated Forearm Curl",
          "muscle_group": "Forearms",
          "exercise_rest": "60s",
          "set_is_superset": false,
          "exercise_peak_1rm": null,
          "sets": [
            { "set_sequence": 1, "set_reps_target": "12", "set_reps": null, "set_weight": null, "set_1rm_epley": null, "set_volume": null },
            { "set_sequence": 2, "set_reps_target": "12", "set_reps": null, "set_weight": null, "set_1rm_epley": null, "set_volume": null },
            { "set_sequence": 3, "set_reps_target": "12", "set_reps": null, "set_weight": null, "set_1rm_epley": null, "set_volume": null }
          ]
        }
      ]
    }
  ],
  "count": 1
}
```

**Response fields (workout level):**

| Field | Type | Description |
|-------|------|-------------|
| `daily_workout_id` | number | Unique session ID |
| `date` | string | Date (yyyy-mm-dd) |
| `workout_name` | string | Workout name |
| `exercises` | array | Exercises in sequence order (see below) |

**Response fields (exercise level):**

| Field | Type | Description |
|-------|------|-------------|
| `exercise_sequence` | string | Position in workout. Integer for normal (`"1"`, `"2"`), decimal for supersets (`"5.1"`, `"5.2"`). |
| `exercise_name` | string | Exercise name |
| `muscle_group` | string | Muscle group. Empty string `""` for warm-ups/cardio/stretching. |
| `exercise_rest` | string \| null | Rest period (e.g., `"120s"`, `"60s"`, `"0s"`). `"0s"` for superset exercises except the last in the group. |
| `set_is_superset` | boolean | `true` if this exercise is part of a superset |
| `exercise_peak_1rm` | number \| null | Best 1RM across all sets. Null for bodyweight/warm-up exercises. |
| `sets` | array | Individual sets (same schema as exercise history) |

**Error (404):**
```json
{ "error": "No workouts found for date '2099-01-01'" }
```

**Display notes:**
- Show exercises in `exercise_sequence` order (already sorted in response)
- Visually group superset exercises (those with decimal sequences like 5.1, 5.2) — use indentation, a bracket, or a colored left border
- Gray out or dim warm-up exercises (empty `muscle_group`)
- Show `exercise_rest` as a small badge (e.g., "Rest: 120s")
- Exercises with all-null set data (like Supinated Forearm Curl above) were performed but not logged — still show them, just indicate "not logged"
- Multiple workouts can appear on the same date (the `data` array may have >1 item)

---

### GET /workouts/splits

Which muscle groups were trained in each workout session. Use for a **training split timeline** or **weekly schedule view**.

**Query Parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `start_date` | string | No | — | Start date filter |
| `end_date` | string | No | — | End date filter |
| `limit` | number | No | 50 | Max results |

**Request:**
```
GET /workouts/splits?limit=5
```

**Response (200):**
```json
{
  "data": [
    {
      "date": "2026-02-21",
      "workout_name": "28.5 Legs + Arms",
      "daily_workout_id": 1022176914,
      "muscle_groups": ["Rear Delts", "Legs", "Triceps", "Biceps", "Forearms"]
    },
    {
      "date": "2026-02-20",
      "workout_name": "28.4 Upper Body",
      "daily_workout_id": 1022176911,
      "muscle_groups": ["Rear Delts", "Shoulders", "Back", "Chest"]
    },
    {
      "date": "2026-02-18",
      "workout_name": "28.3 Legs",
      "daily_workout_id": 1022176909,
      "muscle_groups": ["Legs"]
    },
    {
      "date": "2026-02-17",
      "workout_name": "Abs",
      "daily_workout_id": 1022176906,
      "muscle_groups": ["Core"]
    },
    {
      "date": "2026-02-17",
      "workout_name": "28.2 Pull",
      "daily_workout_id": 1022176907,
      "muscle_groups": ["Rear Delts", "Shoulders", "Back", "Biceps"]
    }
  ],
  "count": 5
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Workout date |
| `workout_name` | string | Workout name |
| `daily_workout_id` | number | Unique session ID |
| `muscle_groups` | string[] | List of distinct muscle groups trained in this session |

**Sorted by:** `date` descending.

---

### GET /muscle-groups/weekly

Weekly training volume per muscle group. Pre-computed aggregate data — fast and ready for charting. This is the primary endpoint for the **weekly volume chart**.

**Query Parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `start_date` | string | No | — | Filter weeks starting on or after this date |
| `end_date` | string | No | — | Filter weeks ending on or before this date |
| `weeks` | number | No | 0 (all) | Limit to N most recent weeks |

**Request:**
```
GET /muscle-groups/weekly?weeks=4
```

**Response (200):**
```json
{
  "data": [
    { "week_start": "2026-02-16", "week_end": "2026-02-22", "muscle_group": "Legs", "total_sets": 27 },
    { "week_start": "2026-02-16", "week_end": "2026-02-22", "muscle_group": "Shoulders", "total_sets": 26 },
    { "week_start": "2026-02-16", "week_end": "2026-02-22", "muscle_group": "Rear Delts", "total_sets": 22 },
    { "week_start": "2026-02-16", "week_end": "2026-02-22", "muscle_group": "Core", "total_sets": 12 },
    { "week_start": "2026-02-16", "week_end": "2026-02-22", "muscle_group": "Triceps", "total_sets": 11 },
    { "week_start": "2026-02-16", "week_end": "2026-02-22", "muscle_group": "Biceps", "total_sets": 11 },
    { "week_start": "2026-02-16", "week_end": "2026-02-22", "muscle_group": "Back", "total_sets": 11 },
    { "week_start": "2026-02-16", "week_end": "2026-02-22", "muscle_group": "Chest", "total_sets": 9 },
    { "week_start": "2026-02-16", "week_end": "2026-02-22", "muscle_group": "Forearms", "total_sets": 3 },
    { "week_start": "2026-02-09", "week_end": "2026-02-15", "muscle_group": "Shoulders", "total_sets": 26 },
    { "week_start": "2026-02-09", "week_end": "2026-02-15", "muscle_group": "Legs", "total_sets": 21 },
    { "week_start": "2026-02-09", "week_end": "2026-02-15", "muscle_group": "Rear Delts", "total_sets": 17 },
    { "week_start": "2026-02-09", "week_end": "2026-02-15", "muscle_group": "Core", "total_sets": 12 },
    { "week_start": "2026-02-09", "week_end": "2026-02-15", "muscle_group": "Back", "total_sets": 11 },
    { "week_start": "2026-02-09", "week_end": "2026-02-15", "muscle_group": "Chest", "total_sets": 9 },
    { "week_start": "2026-02-09", "week_end": "2026-02-15", "muscle_group": "Triceps", "total_sets": 6 },
    { "week_start": "2026-02-09", "week_end": "2026-02-15", "muscle_group": "Biceps", "total_sets": 6 },
    { "week_start": "2026-02-02", "week_end": "2026-02-08", "muscle_group": "Legs", "total_sets": 20 },
    { "week_start": "2026-02-02", "week_end": "2026-02-08", "muscle_group": "Shoulders", "total_sets": 15 },
    { "week_start": "2026-02-02", "week_end": "2026-02-08", "muscle_group": "Core", "total_sets": 12 },
    { "week_start": "2026-02-02", "week_end": "2026-02-08", "muscle_group": "Rear Delts", "total_sets": 9 },
    { "week_start": "2026-02-02", "week_end": "2026-02-08", "muscle_group": "Chest", "total_sets": 8 },
    { "week_start": "2026-02-02", "week_end": "2026-02-08", "muscle_group": "Back", "total_sets": 7 },
    { "week_start": "2026-02-02", "week_end": "2026-02-08", "muscle_group": "Triceps", "total_sets": 5 },
    { "week_start": "2026-02-02", "week_end": "2026-02-08", "muscle_group": "Biceps", "total_sets": 5 },
    { "week_start": "2026-01-26", "week_end": "2026-02-01", "muscle_group": "Shoulders", "total_sets": 29 },
    { "week_start": "2026-01-26", "week_end": "2026-02-01", "muscle_group": "Rear Delts", "total_sets": 12 },
    { "week_start": "2026-01-26", "week_end": "2026-02-01", "muscle_group": "Back", "total_sets": 12 },
    { "week_start": "2026-01-26", "week_end": "2026-02-01", "muscle_group": "Chest", "total_sets": 11 },
    { "week_start": "2026-01-26", "week_end": "2026-02-01", "muscle_group": "Core", "total_sets": 9 },
    { "week_start": "2026-01-26", "week_end": "2026-02-01", "muscle_group": "Triceps", "total_sets": 5 },
    { "week_start": "2026-01-26", "week_end": "2026-02-01", "muscle_group": "Biceps", "total_sets": 5 }
  ],
  "count": 32
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `week_start` | string | Monday of the week (yyyy-mm-dd) |
| `week_end` | string | Sunday of the week (yyyy-mm-dd) |
| `muscle_group` | string | Muscle group name |
| `total_sets` | number | Total sets for this muscle group in this week |

**Sorted by:** `week_start` descending, then `total_sets` descending within each week.

**Charting notes:**
- The data is flat (one row per muscle-group-per-week). Transform it client-side to build a stacked bar chart:
  ```typescript
  // Group by week_start, with each muscle group as a key
  const chartData = groupByWeek(data);
  // Result: [{ week_start: "2026-02-16", Legs: 27, Shoulders: 26, ... }, ...]
  ```
- Use a **stacked bar chart** with one bar per week, segments colored by muscle group
- Consider a reference line at 10-20 sets (the recommended hypertrophy range per muscle group per week)
- Not all muscle groups appear every week (e.g., Forearms only shows up some weeks). Treat missing as 0.

---

### GET /muscle-groups/daily

Daily training volume per muscle group. Similar to weekly but at day granularity.

**Query Parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `start_date` | string | No | — | Start date filter |
| `end_date` | string | No | — | End date filter |
| `days` | number | No | 0 (all) | Limit to N most recent days |

**Request:**
```
GET /muscle-groups/daily?days=3
```

**Response (200):**
```json
{
  "data": [
    { "date": "2026-02-21", "muscle_group": "Legs", "total_sets": 6 },
    { "date": "2026-02-21", "muscle_group": "Triceps", "total_sets": 5 },
    { "date": "2026-02-21", "muscle_group": "Rear Delts", "total_sets": 5 },
    { "date": "2026-02-21", "muscle_group": "Biceps", "total_sets": 5 },
    { "date": "2026-02-21", "muscle_group": "Forearms", "total_sets": 3 },
    { "date": "2026-02-20", "muscle_group": "Shoulders", "total_sets": 11 },
    { "date": "2026-02-20", "muscle_group": "Rear Delts", "total_sets": 6 },
    { "date": "2026-02-20", "muscle_group": "Back", "total_sets": 5 },
    { "date": "2026-02-20", "muscle_group": "Chest", "total_sets": 3 },
    { "date": "2026-02-18", "muscle_group": "Legs", "total_sets": 21 }
  ],
  "count": 10
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Workout date (yyyy-mm-dd) |
| `muscle_group` | string | Muscle group name |
| `total_sets` | number | Total sets for this muscle group on this day |

**Sorted by:** `date` descending, then `total_sets` descending.

---

### GET /volume/trends

Total weekly training volume (all muscle groups summed) over time. One data point per week. This is the endpoint for the **overall training load line chart**.

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `start_date` | string | No | Filter weeks starting on or after this date |
| `end_date` | string | No | Filter weeks ending on or before this date |

**Request:**
```
GET /volume/trends
GET /volume/trends?start_date=2025-12-01
```

**Response (200):**
```json
{
  "data": [
    { "week_start": "2025-12-01", "total_sets": 74 },
    { "week_start": "2025-12-08", "total_sets": 83 },
    { "week_start": "2025-12-15", "total_sets": 101 },
    { "week_start": "2025-12-22", "total_sets": 92 },
    { "week_start": "2025-12-29", "total_sets": 69 },
    { "week_start": "2026-01-05", "total_sets": 125 },
    { "week_start": "2026-01-12", "total_sets": 135 },
    { "week_start": "2026-01-19", "total_sets": 139 },
    { "week_start": "2026-01-26", "total_sets": 83 },
    { "week_start": "2026-02-02", "total_sets": 81 },
    { "week_start": "2026-02-09", "total_sets": 108 },
    { "week_start": "2026-02-16", "total_sets": 132 }
  ],
  "count": 12
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `week_start` | string | Monday of the week (yyyy-mm-dd) |
| `total_sets` | number | Total sets across all muscle groups in this week |

**Sorted by:** `week_start` ascending (chronological — ready for charting).

**Charting notes:**
- Simple line chart or area chart
- X-axis: `week_start` (formatted as "Jan 5", "Jan 12", etc.)
- Y-axis: `total_sets`
- ~110 data points over the full date range
- Typical range: 60-140 sets per week
- Dips represent deload weeks, holidays, or missed sessions

---

## Response Format & Error Handling

### Success Responses

All successful responses return status 200 with this shape:

```typescript
// List responses
{
  data: T[];      // Array of results
  count: number;  // Length of the data array
}

// The API always returns lists. There are no single-object endpoints.
```

### Error Responses

| Status | Meaning | Example |
|--------|---------|---------|
| 400 | Bad request (missing required param) | `{ "error": "exercise_name is required" }` |
| 404 | Resource not found | `{ "error": "No data found for exercise 'FakeExercise'" }` |
| 404 | No route match | `{ "error": "No route matches GET /unknown" }` |

```typescript
// Error shape
{
  error: string;
}
```

### CORS Headers

All responses include:
```
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

OPTIONS preflight requests return 204 No Content with the same CORS headers.

### TypeScript Types

```typescript
// Common response wrapper
interface ApiResponse<T> {
  data: T[];
  count: number;
}

interface ApiError {
  error: string;
}

// GET /exercises
interface Exercise {
  exercise_name: string;
  muscle_group: string;
  sessions: number;
  workouts: number;
}

// GET /exercises/personal-records
interface PersonalRecord {
  exercise_name: string;
  muscle_group: string;
  all_time_peak_1rm: number;
  all_time_max_weight: number;
  all_time_max_volume: number;
}

// GET /exercises/{name}/progression
interface ProgressionPoint {
  date: string;
  exercise_peak_1rm: number;
  exercise_eff_1rm: number;
  exercise_max_weight: number;
  exercise_max_volume: number;
}

// GET /exercises/{name}/history
interface ExerciseSession {
  date: string;
  workout_name: string;
  daily_exercise_id: number;
  exercise_peak_1rm: number | null;
  exercise_eff_1rm: number | null;
  exercise_max_weight: number | null;
  exercise_max_volume: number | null;
  sets: SetDetail[];
}

interface SetDetail {
  set_sequence: number;
  set_reps_target: string | null;
  set_reps: string | null;
  set_weight: number | null;
  set_1rm_epley: number | null;
  set_volume: number | null;
}

// GET /workouts
interface WorkoutSummary {
  daily_workout_id: number;
  date: string;
  workout_name: string;
  exercise_count: number;
  total_sets: number;
}

// GET /workouts/{date}
interface WorkoutDetail {
  daily_workout_id: number;
  date: string;
  workout_name: string;
  exercises: WorkoutExercise[];
}

interface WorkoutExercise {
  exercise_sequence: string;
  exercise_name: string;
  muscle_group: string;
  exercise_rest: string | null;
  set_is_superset: boolean;
  exercise_peak_1rm: number | null;
  sets: SetDetail[];
}

// GET /workouts/splits
interface WorkoutSplit {
  date: string;
  workout_name: string;
  daily_workout_id: number;
  muscle_groups: string[];
}

// GET /muscle-groups/weekly
interface WeeklyVolume {
  week_start: string;
  week_end: string;
  muscle_group: string;
  total_sets: number;
}

// GET /muscle-groups/daily
interface DailyVolume {
  date: string;
  muscle_group: string;
  total_sets: number;
}

// GET /volume/trends
interface VolumeTrend {
  week_start: string;
  total_sets: number;
}

// All muscle groups in the system
type MuscleGroup =
  | "Back"
  | "Biceps"
  | "Chest"
  | "Core"
  | "Forearms"
  | "Legs"
  | "Rear Delts"
  | "Shoulders"
  | "Triceps";
```

---

## Dashboard Views & Visualization Guide

### View 1: Dashboard Home / Overview

**Data sources:** `/volume/trends`, `/muscle-groups/weekly?weeks=1`, `/workouts?limit=5`

**Components:**
- **Volume trend line chart** (Recharts `<LineChart>` or `<AreaChart>`) showing total weekly sets over the last 3+ months
- **This week's volume summary** — horizontal bar chart or card grid showing sets per muscle group for the current week
- **Recent workouts list** — a compact table of the last 5 workouts with date, name, exercise count, total sets. Each row clickable to navigate to workout detail.

### View 2: Exercise Explorer & Progression

**Data sources:** `/exercises`, `/exercises/{name}/progression`, `/exercises/{name}/history`

**Components:**
- **Exercise picker** — searchable dropdown or sidebar list populated from `/exercises`. Group by muscle group. Show session count as a badge.
- **Progression chart** (Recharts `<LineChart>`) — once an exercise is selected, show `exercise_peak_1rm` over time as the primary line, with `exercise_max_weight` as an optional secondary line. Tooltips showing date, 1RM, weight, volume.
- **History table** — below the chart, a collapsible table showing each session's sets. One expandable row per date, expanding to show set-by-set detail (reps target vs actual, weight, 1RM, volume).

**Data transformation for chart:**
```typescript
// Progression data is already sorted chronologically — pass directly to Recharts
const chartData = progressionData.map(p => ({
  date: p.date,
  "Est. 1RM": p.exercise_peak_1rm,
  "Max Weight": p.exercise_max_weight,
}));
```

### View 3: Weekly Volume Analysis

**Data sources:** `/muscle-groups/weekly?weeks=12`

**Components:**
- **Stacked bar chart** (Recharts `<BarChart>`) — one bar per week, segments colored by muscle group
- **Reference lines** at 10 and 20 sets (the recommended hypertrophy range per muscle group per week)
- **Muscle group filter** — toggle individual muscle groups on/off

**Data transformation:**
```typescript
// Transform flat rows into week-based objects for Recharts
function transformWeeklyData(rows: WeeklyVolume[]) {
  const byWeek = new Map<string, Record<string, number>>();
  for (const row of rows) {
    if (!byWeek.has(row.week_start)) {
      byWeek.set(row.week_start, { week_start: row.week_start });
    }
    byWeek.get(row.week_start)![row.muscle_group] = row.total_sets;
  }
  return Array.from(byWeek.values()).sort((a, b) =>
    a.week_start.localeCompare(b.week_start)
  );
}
// Result: [{ week_start: "2026-02-16", Legs: 27, Shoulders: 26, ... }, ...]
```

### View 4: Workout Log

**Data sources:** `/workouts`, `/workouts/{date}`

**Components:**
- **Workout list table** — paginated table from `/workouts`. Columns: date, workout name, exercises, total sets. Clicking a row navigates to the detail view.
- **Workout detail view** — shows all exercises and sets for a specific date. Exercises rendered as cards or an accordion. Superset exercises visually grouped with a bracket or shared background. Empty muscle group exercises (warm-ups) dimmed.

### View 5: Personal Records

**Data sources:** `/exercises/personal-records`

**Components:**
- **Records table** — sortable table with columns: exercise name, muscle group, peak 1RM, max weight, max volume. Color-code the muscle group column.
- **Muscle group filter** tabs/pills at the top

---

## Data Characteristics & Edge Cases

### Null Values

Many fields can be null. Handle gracefully in the UI:

| Scenario | What's null | How to display |
|----------|------------|----------------|
| Warm-up exercise (Jog, Stretch) | `set_reps`, `set_weight`, all metrics, `muscle_group` is `""` | Show exercise name, dim/gray styling, display target (e.g., "5:00") |
| Unlogged exercise (performed but not recorded) | `set_reps`, `set_weight`, all metrics | Show "—" or "Not logged" |
| Bodyweight exercise | `set_weight` is 0 or null, metrics null | Show reps, display "BW" for weight |

### `set_reps_target` Formats

This field is a string with varied formats. Display as-is in the UI — do not parse:

| Value | Meaning |
|-------|---------|
| `"8"` | Target 8 reps |
| `"12 each"` | 12 reps per side (unilateral) |
| `"max"` | As many reps as possible |
| `"5:00"` | 5-minute duration |
| `"10 (half-speed)"` | 10 reps with a form modifier |

### `set_reps` is a String

Actual reps are stored as a string (e.g., `"8"`, `"12"`). Parse to integer only for numeric comparisons. Some values may be time-based for duration exercises.

### Exercise Names with Special Characters

Exercise names are proper-capitalized strings that may contain spaces, parentheses, and hyphens:
- `"Barbell Squat"` — simple
- `"Cable Single Arm Lateral Raises"` — multi-word
- `"Ez Bar Bicep Curls"` — abbreviation
- `"Barbell Row - Overhand"` — with hyphen

URL-encode exercise names in API requests: `Barbell%20Squat`, `Barbell%20Row%20-%20Overhand`.

### Supersets

Exercises with `set_is_superset: true` and decimal `exercise_sequence` values (e.g., "5.1", "5.2") are supersets — they are performed back-to-back without rest. The integer prefix groups them: 5.1 and 5.2 are one superset pair, 8.1 and 8.2 are another.

Display: visually group these exercises with a bracket, shared background color, or "Superset" label. The `exercise_rest` for non-final superset exercises is typically `"0s"` (rest comes after the last exercise in the group).

### Multiple Workouts Per Day

Some dates have two workout sessions (e.g., "28.2 Pull" and "Abs" on 2026-02-17). The `/workouts/{date}` endpoint returns all workouts for that date as separate items in the `data` array. Display them as separate sections.

### Date Gaps

Not every day has a workout. Not every week has the same exercises. Time-series charts should handle irregular spacing. Recharts handles this naturally when using date strings as the X-axis category.
