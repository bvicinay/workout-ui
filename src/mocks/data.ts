import type {
  Exercise,
  PersonalRecord,
  ProgressionPoint,
  ExerciseSession,
  WorkoutSummary,
  WorkoutDetail,
  WorkoutSplit,
  WeeklyVolume,
  DailyVolume,
  VolumeTrend,
} from "../types/api";

export const exercises: Exercise[] = [
  { exercise_name: "Cable External Rotation", muscle_group: "Rear Delts", sessions: 219, workouts: 219 },
  { exercise_name: "Cable Internal Shoulder Rotation", muscle_group: "Shoulders", sessions: 196, workouts: 196 },
  { exercise_name: "Dumbbell Lateral Raises", muscle_group: "Shoulders", sessions: 132, workouts: 132 },
  { exercise_name: "Dumbbell Incline Bench Press", muscle_group: "Chest", sessions: 126, workouts: 126 },
  { exercise_name: "Lat Pulldown", muscle_group: "Back", sessions: 107, workouts: 107 },
  { exercise_name: "Barbell Squat", muscle_group: "Legs", sessions: 24, workouts: 24 },
  { exercise_name: "Hip Thrust Machine", muscle_group: "Legs", sessions: 85, workouts: 85 },
  { exercise_name: "Barbell Romanian Deadlift", muscle_group: "Legs", sessions: 78, workouts: 78 },
  { exercise_name: "Cable Tricep Pushdown", muscle_group: "Triceps", sessions: 92, workouts: 92 },
  { exercise_name: "Ez Bar Bicep Curls", muscle_group: "Biceps", sessions: 75, workouts: 75 },
  { exercise_name: "Leg Press Machine", muscle_group: "Legs", sessions: 60, workouts: 60 },
  { exercise_name: "Smith Machine Bent Over Row", muscle_group: "Back", sessions: 55, workouts: 55 },
  { exercise_name: "Cable Face Pull", muscle_group: "Rear Delts", sessions: 100, workouts: 100 },
  { exercise_name: "Hanging Leg Raises", muscle_group: "Core", sessions: 88, workouts: 88 },
  { exercise_name: "Dumbbell Hammer Curls", muscle_group: "Biceps", sessions: 45, workouts: 45 },
  { exercise_name: "Supinated Forearm Curl", muscle_group: "Forearms", sessions: 30, workouts: 30 },
  { exercise_name: "Ez Bar Skull Crushers", muscle_group: "Triceps", sessions: 40, workouts: 40 },
  { exercise_name: "Machine Chest Press", muscle_group: "Chest", sessions: 50, workouts: 50 },
  { exercise_name: "Seated Calf Raise", muscle_group: "Legs", sessions: 70, workouts: 70 },
  { exercise_name: "Ab Wheel Rollout", muscle_group: "Core", sessions: 35, workouts: 35 },
];

export const personalRecords: PersonalRecord[] = [
  { exercise_name: "Leg Press Machine", muscle_group: "Legs", all_time_peak_1rm: 504.0, all_time_max_weight: 360.0, all_time_max_volume: 4320.0 },
  { exercise_name: "Smith Machine Bent Over Row", muscle_group: "Back", all_time_peak_1rm: 379.83, all_time_max_weight: 265.0, all_time_max_volume: 3445.0 },
  { exercise_name: "Hip Thrust Machine", muscle_group: "Legs", all_time_peak_1rm: 329.67, all_time_max_weight: 230.0, all_time_max_volume: 2990.0 },
  { exercise_name: "Barbell Romanian Deadlift", muscle_group: "Legs", all_time_peak_1rm: 313.33, all_time_max_weight: 235.0, all_time_max_volume: 2350.0 },
  { exercise_name: "Barbell Squat", muscle_group: "Legs", all_time_peak_1rm: 247.0, all_time_max_weight: 205.0, all_time_max_volume: 1560.0 },
  { exercise_name: "Dumbbell Incline Bench Press", muscle_group: "Chest", all_time_peak_1rm: 234.33, all_time_max_weight: 185.0, all_time_max_volume: 1480.0 },
  { exercise_name: "Lat Pulldown", muscle_group: "Back", all_time_peak_1rm: 220.0, all_time_max_weight: 165.0, all_time_max_volume: 1650.0 },
  { exercise_name: "Machine Chest Press", muscle_group: "Chest", all_time_peak_1rm: 210.0, all_time_max_weight: 175.0, all_time_max_volume: 1400.0 },
  { exercise_name: "Cable Tricep Pushdown", muscle_group: "Triceps", all_time_peak_1rm: 120.0, all_time_max_weight: 90.0, all_time_max_volume: 1080.0 },
  { exercise_name: "Ez Bar Bicep Curls", muscle_group: "Biceps", all_time_peak_1rm: 91.0, all_time_max_weight: 65.0, all_time_max_volume: 780.0 },
  { exercise_name: "Dumbbell Lateral Raises", muscle_group: "Shoulders", all_time_peak_1rm: 46.67, all_time_max_weight: 35.0, all_time_max_volume: 350.0 },
  { exercise_name: "Cable External Rotation", muscle_group: "Rear Delts", all_time_peak_1rm: 30.0, all_time_max_weight: 22.5, all_time_max_volume: 225.0 },
];

export const squatProgression: ProgressionPoint[] = [
  { date: "2024-02-16", exercise_peak_1rm: 180.0, exercise_eff_1rm: 180.0, exercise_max_weight: 135.0, exercise_max_volume: 1350.0 },
  { date: "2024-02-23", exercise_peak_1rm: 189.0, exercise_eff_1rm: 189.0, exercise_max_weight: 135.0, exercise_max_volume: 1620.0 },
  { date: "2024-02-29", exercise_peak_1rm: 196.33, exercise_eff_1rm: 196.33, exercise_max_weight: 155.0, exercise_max_volume: 1240.0 },
  { date: "2025-02-22", exercise_peak_1rm: 189.0, exercise_eff_1rm: 189.0, exercise_max_weight: 135.0, exercise_max_volume: 1620.0 },
  { date: "2025-03-01", exercise_peak_1rm: 217.0, exercise_eff_1rm: 217.0, exercise_max_weight: 155.0, exercise_max_volume: 1860.0 },
  { date: "2025-03-08", exercise_peak_1rm: 217.0, exercise_eff_1rm: 217.0, exercise_max_weight: 155.0, exercise_max_volume: 1860.0 },
  { date: "2025-03-15", exercise_peak_1rm: 210.0, exercise_eff_1rm: 210.0, exercise_max_weight: 175.0, exercise_max_volume: 1240.0 },
  { date: "2025-04-12", exercise_peak_1rm: 206.67, exercise_eff_1rm: 206.67, exercise_max_weight: 155.0, exercise_max_volume: 1620.0 },
  { date: "2025-04-26", exercise_peak_1rm: 217.0, exercise_eff_1rm: 217.0, exercise_max_weight: 155.0, exercise_max_volume: 1860.0 },
  { date: "2025-06-21", exercise_peak_1rm: 217.0, exercise_eff_1rm: 217.0, exercise_max_weight: 155.0, exercise_max_volume: 1860.0 },
  { date: "2025-07-05", exercise_peak_1rm: 217.0, exercise_eff_1rm: 217.0, exercise_max_weight: 155.0, exercise_max_volume: 1860.0 },
  { date: "2025-08-23", exercise_peak_1rm: 196.33, exercise_eff_1rm: 196.33, exercise_max_weight: 155.0, exercise_max_volume: 1240.0 },
  { date: "2025-08-30", exercise_peak_1rm: 217.0, exercise_eff_1rm: 217.0, exercise_max_weight: 155.0, exercise_max_volume: 1860.0 },
  { date: "2025-09-06", exercise_peak_1rm: 220.0, exercise_eff_1rm: 220.0, exercise_max_weight: 165.0, exercise_max_volume: 1650.0 },
  { date: "2025-09-20", exercise_peak_1rm: 220.0, exercise_eff_1rm: 220.0, exercise_max_weight: 165.0, exercise_max_volume: 1650.0 },
  { date: "2025-09-27", exercise_peak_1rm: 221.67, exercise_eff_1rm: 221.67, exercise_max_weight: 175.0, exercise_max_volume: 1400.0 },
  { date: "2025-10-03", exercise_peak_1rm: 221.67, exercise_eff_1rm: 221.67, exercise_max_weight: 175.0, exercise_max_volume: 1400.0 },
  { date: "2025-10-25", exercise_peak_1rm: 215.33, exercise_eff_1rm: 215.33, exercise_max_weight: 170.0, exercise_max_volume: 1360.0 },
  { date: "2025-11-01", exercise_peak_1rm: 228.0, exercise_eff_1rm: 228.0, exercise_max_weight: 180.0, exercise_max_volume: 1440.0 },
  { date: "2025-11-08", exercise_peak_1rm: 234.33, exercise_eff_1rm: 234.33, exercise_max_weight: 185.0, exercise_max_volume: 1480.0 },
  { date: "2026-01-10", exercise_peak_1rm: 220.0, exercise_eff_1rm: 220.0, exercise_max_weight: 165.0, exercise_max_volume: 1650.0 },
  { date: "2026-01-17", exercise_peak_1rm: 234.33, exercise_eff_1rm: 234.33, exercise_max_weight: 185.0, exercise_max_volume: 1480.0 },
  { date: "2026-01-24", exercise_peak_1rm: 247.0, exercise_eff_1rm: 247.0, exercise_max_weight: 195.0, exercise_max_volume: 1560.0 },
  { date: "2026-02-21", exercise_peak_1rm: 247.0, exercise_eff_1rm: 247.0, exercise_max_weight: 205.0, exercise_max_volume: 1560.0 },
];

export const squatHistory: ExerciseSession[] = [
  {
    date: "2026-02-21", workout_name: "28.5 Legs + Arms", daily_exercise_id: 7420837455,
    exercise_peak_1rm: 247.0, exercise_eff_1rm: 247.0, exercise_max_weight: 205.0, exercise_max_volume: 1560.0,
    sets: [
      { set_sequence: 1, set_reps_target: "8", set_reps: "6", set_weight: 205.0, set_1rm_epley: 246.0, set_volume: 1230.0 },
      { set_sequence: 2, set_reps_target: "8", set_reps: "8", set_weight: 195.0, set_1rm_epley: 247.0, set_volume: 1560.0 },
      { set_sequence: 3, set_reps_target: "8", set_reps: "8", set_weight: 195.0, set_1rm_epley: 247.0, set_volume: 1560.0 },
    ],
  },
  {
    date: "2026-01-24", workout_name: "27.5 Legs + Arms", daily_exercise_id: 7265874846,
    exercise_peak_1rm: 247.0, exercise_eff_1rm: 247.0, exercise_max_weight: 195.0, exercise_max_volume: 1560.0,
    sets: [
      { set_sequence: 1, set_reps_target: "8", set_reps: "8", set_weight: 195.0, set_1rm_epley: 247.0, set_volume: 1560.0 },
      { set_sequence: 2, set_reps_target: "8", set_reps: "8", set_weight: 195.0, set_1rm_epley: 247.0, set_volume: 1560.0 },
      { set_sequence: 3, set_reps_target: "8", set_reps: "8", set_weight: 195.0, set_1rm_epley: 247.0, set_volume: 1560.0 },
    ],
  },
  {
    date: "2026-01-17", workout_name: "27.5 Legs + Arms", daily_exercise_id: 7265874835,
    exercise_peak_1rm: 234.33, exercise_eff_1rm: 234.33, exercise_max_weight: 185.0, exercise_max_volume: 1480.0,
    sets: [
      { set_sequence: 1, set_reps_target: "8", set_reps: "8", set_weight: 185.0, set_1rm_epley: 234.33, set_volume: 1480.0 },
      { set_sequence: 2, set_reps_target: "8", set_reps: "8", set_weight: 185.0, set_1rm_epley: 234.33, set_volume: 1480.0 },
      { set_sequence: 3, set_reps_target: "8", set_reps: "8", set_weight: 185.0, set_1rm_epley: 234.33, set_volume: 1480.0 },
    ],
  },
];

export const workouts: WorkoutSummary[] = [
  { daily_workout_id: 1022176914, date: "2026-02-21", workout_name: "28.5 Legs + Arms", exercise_count: 10, total_sets: 25 },
  { daily_workout_id: 1022176911, date: "2026-02-20", workout_name: "28.4 Upper Body", exercise_count: 10, total_sets: 26 },
  { daily_workout_id: 1022176909, date: "2026-02-18", workout_name: "28.3 Legs", exercise_count: 8, total_sets: 22 },
  { daily_workout_id: 1022176906, date: "2026-02-17", workout_name: "Abs", exercise_count: 4, total_sets: 12 },
  { daily_workout_id: 1022176907, date: "2026-02-17", workout_name: "28.2 Pull", exercise_count: 9, total_sets: 24 },
  { daily_workout_id: 1022176904, date: "2026-02-15", workout_name: "28.1 Push", exercise_count: 9, total_sets: 24 },
  { daily_workout_id: 1022176901, date: "2026-02-14", workout_name: "27.5 Legs + Arms", exercise_count: 10, total_sets: 25 },
  { daily_workout_id: 1022176898, date: "2026-02-12", workout_name: "27.4 Upper Body", exercise_count: 10, total_sets: 26 },
];

export const workoutDetail: WorkoutDetail[] = [
  {
    daily_workout_id: 1022176914, date: "2026-02-21", workout_name: "28.5 Legs + Arms",
    exercises: [
      {
        exercise_sequence: "1", exercise_name: "Jog", muscle_group: "", exercise_rest: "90s", set_is_superset: false, exercise_peak_1rm: null,
        sets: [{ set_sequence: 1, set_reps_target: "5:00", set_reps: null, set_weight: null, set_1rm_epley: null, set_volume: null }],
      },
      {
        exercise_sequence: "2", exercise_name: "Cable External Rotation", muscle_group: "Rear Delts", exercise_rest: "60s", set_is_superset: false, exercise_peak_1rm: 30.0,
        sets: [
          { set_sequence: 1, set_reps_target: "12", set_reps: "12", set_weight: 22.5, set_1rm_epley: 31.5, set_volume: 270.0 },
          { set_sequence: 2, set_reps_target: "12", set_reps: "12", set_weight: 22.5, set_1rm_epley: 31.5, set_volume: 270.0 },
        ],
      },
      {
        exercise_sequence: "3", exercise_name: "Barbell Squat", muscle_group: "Legs", exercise_rest: "120s", set_is_superset: false, exercise_peak_1rm: 247.0,
        sets: [
          { set_sequence: 1, set_reps_target: "8", set_reps: "6", set_weight: 205.0, set_1rm_epley: 246.0, set_volume: 1230.0 },
          { set_sequence: 2, set_reps_target: "8", set_reps: "8", set_weight: 195.0, set_1rm_epley: 247.0, set_volume: 1560.0 },
          { set_sequence: 3, set_reps_target: "8", set_reps: "8", set_weight: 195.0, set_1rm_epley: 247.0, set_volume: 1560.0 },
        ],
      },
      {
        exercise_sequence: "4", exercise_name: "Hip Thrust Machine", muscle_group: "Legs", exercise_rest: "90s", set_is_superset: false, exercise_peak_1rm: 329.67,
        sets: [
          { set_sequence: 1, set_reps_target: "10", set_reps: "10", set_weight: 230.0, set_1rm_epley: 306.67, set_volume: 2300.0 },
          { set_sequence: 2, set_reps_target: "10", set_reps: "10", set_weight: 230.0, set_1rm_epley: 306.67, set_volume: 2300.0 },
        ],
      },
      {
        exercise_sequence: "5.1", exercise_name: "Ez Bar Skull Crushers", muscle_group: "Triceps", exercise_rest: "0s", set_is_superset: true, exercise_peak_1rm: 93.17,
        sets: [
          { set_sequence: 1, set_reps_target: "12", set_reps: "10", set_weight: 65.0, set_1rm_epley: 86.67, set_volume: 650.0 },
          { set_sequence: 2, set_reps_target: "12", set_reps: "13", set_weight: 65.0, set_1rm_epley: 93.17, set_volume: 845.0 },
          { set_sequence: 3, set_reps_target: "12", set_reps: "12", set_weight: 65.0, set_1rm_epley: 91.0, set_volume: 780.0 },
        ],
      },
      {
        exercise_sequence: "5.2", exercise_name: "Ez Bar Bicep Curls", muscle_group: "Biceps", exercise_rest: "60s", set_is_superset: true, exercise_peak_1rm: 91.0,
        sets: [
          { set_sequence: 1, set_reps_target: "max", set_reps: "12", set_weight: 65.0, set_1rm_epley: 91.0, set_volume: 780.0 },
          { set_sequence: 2, set_reps_target: "max", set_reps: "6", set_weight: 65.0, set_1rm_epley: 78.0, set_volume: 390.0 },
          { set_sequence: 3, set_reps_target: "max", set_reps: "6", set_weight: 65.0, set_1rm_epley: 78.0, set_volume: 390.0 },
        ],
      },
      {
        exercise_sequence: "7", exercise_name: "Supinated Forearm Curl", muscle_group: "Forearms", exercise_rest: "60s", set_is_superset: false, exercise_peak_1rm: null,
        sets: [
          { set_sequence: 1, set_reps_target: "12", set_reps: null, set_weight: null, set_1rm_epley: null, set_volume: null },
          { set_sequence: 2, set_reps_target: "12", set_reps: null, set_weight: null, set_1rm_epley: null, set_volume: null },
          { set_sequence: 3, set_reps_target: "12", set_reps: null, set_weight: null, set_1rm_epley: null, set_volume: null },
        ],
      },
    ],
  },
];

export const workoutSplits: WorkoutSplit[] = [
  { date: "2026-02-21", workout_name: "28.5 Legs + Arms", daily_workout_id: 1022176914, muscle_groups: ["Rear Delts", "Legs", "Triceps", "Biceps", "Forearms"] },
  { date: "2026-02-20", workout_name: "28.4 Upper Body", daily_workout_id: 1022176911, muscle_groups: ["Rear Delts", "Shoulders", "Back", "Chest"] },
  { date: "2026-02-18", workout_name: "28.3 Legs", daily_workout_id: 1022176909, muscle_groups: ["Legs"] },
  { date: "2026-02-17", workout_name: "Abs", daily_workout_id: 1022176906, muscle_groups: ["Core"] },
  { date: "2026-02-17", workout_name: "28.2 Pull", daily_workout_id: 1022176907, muscle_groups: ["Rear Delts", "Shoulders", "Back", "Biceps"] },
];

export const weeklyVolume: WeeklyVolume[] = [
  { week_start: "2026-02-16", week_end: "2026-02-22", muscle_group: "Legs", total_sets: 27 },
  { week_start: "2026-02-16", week_end: "2026-02-22", muscle_group: "Shoulders", total_sets: 26 },
  { week_start: "2026-02-16", week_end: "2026-02-22", muscle_group: "Rear Delts", total_sets: 22 },
  { week_start: "2026-02-16", week_end: "2026-02-22", muscle_group: "Core", total_sets: 12 },
  { week_start: "2026-02-16", week_end: "2026-02-22", muscle_group: "Triceps", total_sets: 11 },
  { week_start: "2026-02-16", week_end: "2026-02-22", muscle_group: "Biceps", total_sets: 11 },
  { week_start: "2026-02-16", week_end: "2026-02-22", muscle_group: "Back", total_sets: 11 },
  { week_start: "2026-02-16", week_end: "2026-02-22", muscle_group: "Chest", total_sets: 9 },
  { week_start: "2026-02-16", week_end: "2026-02-22", muscle_group: "Forearms", total_sets: 3 },
  { week_start: "2026-02-09", week_end: "2026-02-15", muscle_group: "Shoulders", total_sets: 26 },
  { week_start: "2026-02-09", week_end: "2026-02-15", muscle_group: "Legs", total_sets: 21 },
  { week_start: "2026-02-09", week_end: "2026-02-15", muscle_group: "Rear Delts", total_sets: 17 },
  { week_start: "2026-02-09", week_end: "2026-02-15", muscle_group: "Core", total_sets: 12 },
  { week_start: "2026-02-09", week_end: "2026-02-15", muscle_group: "Back", total_sets: 11 },
  { week_start: "2026-02-09", week_end: "2026-02-15", muscle_group: "Chest", total_sets: 9 },
  { week_start: "2026-02-09", week_end: "2026-02-15", muscle_group: "Triceps", total_sets: 6 },
  { week_start: "2026-02-09", week_end: "2026-02-15", muscle_group: "Biceps", total_sets: 6 },
  { week_start: "2026-02-02", week_end: "2026-02-08", muscle_group: "Legs", total_sets: 20 },
  { week_start: "2026-02-02", week_end: "2026-02-08", muscle_group: "Shoulders", total_sets: 15 },
  { week_start: "2026-02-02", week_end: "2026-02-08", muscle_group: "Core", total_sets: 12 },
  { week_start: "2026-02-02", week_end: "2026-02-08", muscle_group: "Rear Delts", total_sets: 9 },
  { week_start: "2026-02-02", week_end: "2026-02-08", muscle_group: "Chest", total_sets: 8 },
  { week_start: "2026-02-02", week_end: "2026-02-08", muscle_group: "Back", total_sets: 7 },
  { week_start: "2026-02-02", week_end: "2026-02-08", muscle_group: "Triceps", total_sets: 5 },
  { week_start: "2026-02-02", week_end: "2026-02-08", muscle_group: "Biceps", total_sets: 5 },
  { week_start: "2026-01-26", week_end: "2026-02-01", muscle_group: "Shoulders", total_sets: 29 },
  { week_start: "2026-01-26", week_end: "2026-02-01", muscle_group: "Rear Delts", total_sets: 12 },
  { week_start: "2026-01-26", week_end: "2026-02-01", muscle_group: "Back", total_sets: 12 },
  { week_start: "2026-01-26", week_end: "2026-02-01", muscle_group: "Chest", total_sets: 11 },
  { week_start: "2026-01-26", week_end: "2026-02-01", muscle_group: "Core", total_sets: 9 },
  { week_start: "2026-01-26", week_end: "2026-02-01", muscle_group: "Triceps", total_sets: 5 },
  { week_start: "2026-01-26", week_end: "2026-02-01", muscle_group: "Biceps", total_sets: 5 },
];

export const dailyVolume: DailyVolume[] = [
  { date: "2026-02-21", muscle_group: "Legs", total_sets: 6 },
  { date: "2026-02-21", muscle_group: "Triceps", total_sets: 5 },
  { date: "2026-02-21", muscle_group: "Rear Delts", total_sets: 5 },
  { date: "2026-02-21", muscle_group: "Biceps", total_sets: 5 },
  { date: "2026-02-21", muscle_group: "Forearms", total_sets: 3 },
  { date: "2026-02-20", muscle_group: "Shoulders", total_sets: 11 },
  { date: "2026-02-20", muscle_group: "Rear Delts", total_sets: 6 },
  { date: "2026-02-20", muscle_group: "Back", total_sets: 5 },
  { date: "2026-02-20", muscle_group: "Chest", total_sets: 3 },
  { date: "2026-02-18", muscle_group: "Legs", total_sets: 21 },
];

export const volumeTrends: VolumeTrend[] = [
  { week_start: "2025-12-01", total_sets: 74 },
  { week_start: "2025-12-08", total_sets: 83 },
  { week_start: "2025-12-15", total_sets: 101 },
  { week_start: "2025-12-22", total_sets: 92 },
  { week_start: "2025-12-29", total_sets: 69 },
  { week_start: "2026-01-05", total_sets: 125 },
  { week_start: "2026-01-12", total_sets: 135 },
  { week_start: "2026-01-19", total_sets: 139 },
  { week_start: "2026-01-26", total_sets: 83 },
  { week_start: "2026-02-02", total_sets: 81 },
  { week_start: "2026-02-09", total_sets: 108 },
  { week_start: "2026-02-16", total_sets: 132 },
];
