import { http, HttpResponse } from "msw";
import {
  exercises,
  personalRecords,
  squatProgression,
  squatHistory,
  workouts,
  workoutDetail,
  workoutSplits,
  weeklyVolume,
  dailyVolume,
  volumeTrends,
} from "./data";

const BASE = "/api";

export const handlers = [
  http.get(`${BASE}/exercises`, ({ request }) => {
    const url = new URL(request.url);
    const mg = url.searchParams.get("muscle_group");
    const filtered = mg
      ? exercises.filter((e) => e.muscle_group === mg)
      : exercises;
    return HttpResponse.json({ data: filtered, count: filtered.length });
  }),

  http.get(`${BASE}/exercises/personal-records`, ({ request }) => {
    const url = new URL(request.url);
    const mg = url.searchParams.get("muscle_group");
    const filtered = mg
      ? personalRecords.filter((r) => r.muscle_group === mg)
      : personalRecords;
    return HttpResponse.json({ data: filtered, count: filtered.length });
  }),

  http.get(`${BASE}/exercises/:exerciseName/progression`, () => {
    // Return squat data as default mock for any exercise
    return HttpResponse.json({
      data: squatProgression,
      count: squatProgression.length,
    });
  }),

  http.get(`${BASE}/exercises/:exerciseName/history`, () => {
    return HttpResponse.json({
      data: squatHistory,
      count: squatHistory.length,
    });
  }),

  http.get(`${BASE}/workouts/splits`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const sliced = workoutSplits.slice(0, limit);
    return HttpResponse.json({ data: sliced, count: sliced.length });
  }),

  http.get(`${BASE}/workouts/:date`, ({ params }) => {
    const date = params.date as string;
    // Check if it matches a date pattern
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return HttpResponse.json({
        data: workoutDetail,
        count: workoutDetail.length,
      });
    }
    return HttpResponse.json({ error: `No workouts found for date '${date}'` }, { status: 404 });
  }),

  http.get(`${BASE}/workouts`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const sliced = workouts.slice(offset, offset + limit);
    return HttpResponse.json({ data: sliced, count: sliced.length });
  }),

  http.get(`${BASE}/muscle-groups/weekly`, ({ request }) => {
    const url = new URL(request.url);
    const weeks = parseInt(url.searchParams.get("weeks") || "0");
    if (weeks > 0) {
      // Get unique week_starts and take the first N
      const uniqueWeeks = [...new Set(weeklyVolume.map((w) => w.week_start))].slice(0, weeks);
      const filtered = weeklyVolume.filter((w) => uniqueWeeks.includes(w.week_start));
      return HttpResponse.json({ data: filtered, count: filtered.length });
    }
    return HttpResponse.json({ data: weeklyVolume, count: weeklyVolume.length });
  }),

  http.get(`${BASE}/muscle-groups/daily`, ({ request }) => {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days") || "0");
    if (days > 0) {
      const uniqueDates = [...new Set(dailyVolume.map((d) => d.date))].slice(0, days);
      const filtered = dailyVolume.filter((d) => uniqueDates.includes(d.date));
      return HttpResponse.json({ data: filtered, count: filtered.length });
    }
    return HttpResponse.json({ data: dailyVolume, count: dailyVolume.length });
  }),

  http.get(`${BASE}/volume/trends`, () => {
    return HttpResponse.json({
      data: volumeTrends,
      count: volumeTrends.length,
    });
  }),
];
