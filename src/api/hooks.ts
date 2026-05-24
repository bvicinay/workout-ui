import { useState, useEffect, useCallback, useRef } from "react";
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
  BodyStat,
  NutritionEntry,
} from "../types/api";

interface UseApiState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

function useApi<T>(
  fetcher: (signal: AbortSignal) => Promise<{ data: T[]; count: number }>,
  deps: unknown[] = []
): UseApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseApiState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  // Stable ref to the latest fetcher so the effect doesn't need it as a dep.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetch = useCallback(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcherRef.current(controller.signal)
      .then((res) => setState({ data: res.data, loading: false, error: null }))
      .catch((err: Error) => {
        // Ignore aborts — they are intentional (unmount or dep change).
        if (err.name === "AbortError") return;
        setState({ data: [], loading: false, error: err.message });
      });
    return controller;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const controller = fetch();
    // Abort in-flight request when the component unmounts or deps change.
    return () => controller.abort();
  }, [fetch]);

  // Expose a manual refetch (no cleanup needed — caller decides lifecycle).
  const refetch = useCallback(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch]);

  return { ...state, refetch };
}

export function useExercises(muscleGroup?: string) {
  return useApi<Exercise>(
    (signal) => api.getExercises(muscleGroup ? { muscle_group: muscleGroup } : undefined, signal),
    [muscleGroup]
  );
}

export function usePersonalRecords(muscleGroup?: string) {
  return useApi<PersonalRecord>(
    (signal) => api.getPersonalRecords(muscleGroup ? { muscle_group: muscleGroup } : undefined, signal),
    [muscleGroup]
  );
}

export function useExerciseProgression(exerciseName: string | null) {
  return useApi<ProgressionPoint>(
    (signal) =>
      exerciseName
        ? api.getExerciseProgression(exerciseName, undefined, signal)
        : Promise.resolve({ data: [], count: 0 }),
    [exerciseName]
  );
}

export function useExerciseHistory(exerciseName: string | null) {
  return useApi<ExerciseSession>(
    (signal) =>
      exerciseName
        ? api.getExerciseHistory(exerciseName, undefined, signal)
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
    (signal) => api.getWorkouts(params, signal),
    [params?.limit, params?.offset, params?.start_date, params?.end_date]
  );
}

export function useWorkoutDetail(date: string | null) {
  return useApi<WorkoutDetail>(
    (signal) =>
      date
        ? api.getWorkoutDetail(date, signal)
        : Promise.resolve({ data: [], count: 0 }),
    [date]
  );
}

export function useWeeklyVolume(weeks?: number) {
  return useApi<WeeklyVolume>(
    (signal) => api.getWeeklyVolume(weeks ? { weeks } : undefined, signal),
    [weeks]
  );
}

export function useVolumeTrends(startDate?: string) {
  return useApi<VolumeTrend>(
    (signal) => api.getVolumeTrends(startDate ? { start_date: startDate } : undefined, signal),
    [startDate]
  );
}

export function useBodyStats(params?: { start?: string; end?: string }) {
  return useApi<BodyStat>(
    (signal) => api.getBodyStats(params, signal),
    [params?.start, params?.end]
  );
}

export function useNutrition(params?: { start_date?: string; end_date?: string }) {
  return useApi<NutritionEntry>(
    (signal) => api.getNutrition(params, signal),
    [params?.start_date, params?.end_date]
  );
}
