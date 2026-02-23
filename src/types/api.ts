export interface ApiResponse<T> {
  data: T[];
  count: number;
}

export interface ApiError {
  error: string;
}

export interface Exercise {
  exercise_name: string;
  muscle_group: string;
  sessions: number;
  workouts: number;
}

export interface PersonalRecord {
  exercise_name: string;
  muscle_group: string;
  all_time_peak_1rm: number;
  all_time_max_weight: number;
  all_time_max_volume: number;
}

export interface ProgressionPoint {
  date: string;
  exercise_peak_1rm: number;
  exercise_eff_1rm: number;
  exercise_max_weight: number;
  exercise_max_volume: number;
}

export interface ExerciseSession {
  date: string;
  workout_name: string;
  daily_exercise_id: number;
  exercise_peak_1rm: number | null;
  exercise_eff_1rm: number | null;
  exercise_max_weight: number | null;
  exercise_max_volume: number | null;
  sets: SetDetail[];
}

export interface SetDetail {
  set_sequence: number;
  set_reps_target: string | null;
  set_reps: string | null;
  set_weight: number | null;
  set_1rm_epley: number | null;
  set_volume: number | null;
}

export interface WorkoutSummary {
  daily_workout_id: number;
  date: string;
  workout_name: string;
  exercise_count: number;
  total_sets: number;
}

export interface WorkoutDetail {
  daily_workout_id: number;
  date: string;
  workout_name: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  exercise_sequence: string;
  exercise_name: string;
  muscle_group: string;
  exercise_rest: string | null;
  set_is_superset: boolean;
  exercise_peak_1rm: number | null;
  sets: SetDetail[];
}

export interface WorkoutSplit {
  date: string;
  workout_name: string;
  daily_workout_id: number;
  muscle_groups: string[];
}

export interface WeeklyVolume {
  week_start: string;
  week_end: string;
  muscle_group: string;
  total_sets: number;
}

export interface DailyVolume {
  date: string;
  muscle_group: string;
  total_sets: number;
}

export interface VolumeTrend {
  week_start: string;
  total_sets: number;
}

export type MuscleGroup =
  | "Back"
  | "Biceps"
  | "Chest"
  | "Core"
  | "Forearms"
  | "Legs"
  | "Rear Delts"
  | "Shoulders"
  | "Triceps";
