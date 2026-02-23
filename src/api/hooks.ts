import { useState, useEffect, useCallback } from "react";
import { api } from "./client";
import type {
  Exercise,
  PersonalRecord,
  ProgressionPoint,
  ExerciseSession,
  WorkoutSummary,
  WorkoutDetail,
  WeeklyVolume,
  VolumeTrend,
} from "../types/api";

interface UseApiState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

function useApi<T>(
  fetcher: () => Promise<{ data: T[]; count: number }>,
  deps: unknown[] = []
): UseApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseApiState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((res) => setState({ data: res.data, loading: false, error: null }))
      .catch((err) =>
        setState({ data: [], loading: false, error: err.message })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

export function useExercises(muscleGroup?: string) {
  return useApi<Exercise>(
    () => api.getExercises(muscleGroup ? { muscle_group: muscleGroup } : undefined),
    [muscleGroup]
  );
}

export function usePersonalRecords(muscleGroup?: string) {
  return useApi<PersonalRecord>(
    () => api.getPersonalRecords(muscleGroup ? { muscle_group: muscleGroup } : undefined),
    [muscleGroup]
  );
}

export function useExerciseProgression(exerciseName: string | null) {
  return useApi<ProgressionPoint>(
    () =>
      exerciseName
        ? api.getExerciseProgression(exerciseName)
        : Promise.resolve({ data: [], count: 0 }),
    [exerciseName]
  );
}

export function useExerciseHistory(exerciseName: string | null) {
  return useApi<ExerciseSession>(
    () =>
      exerciseName
        ? api.getExerciseHistory(exerciseName)
        : Promise.resolve({ data: [], count: 0 }),
    [exerciseName]
  );
}

export function useWorkouts(params?: {
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}) {
  return useApi<WorkoutSummary>(
    () => api.getWorkouts(params),
    [params?.limit, params?.offset, params?.start_date, params?.end_date]
  );
}

export function useWorkoutDetail(date: string | null) {
  return useApi<WorkoutDetail>(
    () =>
      date
        ? api.getWorkoutDetail(date)
        : Promise.resolve({ data: [], count: 0 }),
    [date]
  );
}

export function useWeeklyVolume(weeks?: number) {
  return useApi<WeeklyVolume>(
    () => api.getWeeklyVolume(weeks ? { weeks } : undefined),
    [weeks]
  );
}

export function useVolumeTrends(startDate?: string) {
  return useApi<VolumeTrend>(
    () => api.getVolumeTrends(startDate ? { start_date: startDate } : undefined),
    [startDate]
  );
}
