import { API_BASE_URL, AUTH_ENABLED } from "../config";
import { getCurrentToken } from "../auth/cognito";
import type {
  ApiResponse,
  ApiError,
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
  BodyStat,
  NutritionEntry,
  ProgressPhotoDatesResponse,
  ProgressPhotosResponse,
} from "../types/api";

type OnAuthError = () => void;

let _onAuthError: OnAuthError | null = null;

/** Register a global 401 callback (called once from AuthProvider). */
export function registerAuthErrorHandler(fn: OnAuthError) {
  _onAuthError = fn;
}

async function request<T>(
  path: string,
  params?: Record<string, string | number>,
  signal?: AbortSignal
): Promise<ApiResponse<T>> {
  const fullUrl = `${API_BASE_URL}${path}`;

  const searchParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    }
  }

  const queryString = searchParams.toString();
  const requestUrl = queryString ? `${fullUrl}?${queryString}` : fullUrl;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (AUTH_ENABLED) {
    const token = await getCurrentToken();
    // If the request was aborted while we were waiting for the token
    // (e.g. the component unmounted or the browser navigated away), bail
    // out now rather than proceeding to fetch.  Without this guard the
    // request would still hit the network — or, if the signal is already
    // aborted, fetch() would reject with AbortError which could then be
    // mis-attributed as an auth failure before the catch in useApi fires.
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(requestUrl, { headers, signal });

  if (!response.ok) {
    if (response.status === 401) {
      _onAuthError?.();
    }
    const body = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(body?.error || `API error: ${response.status}`);
  }

  return response.json();
}

/** Like `request` but returns the raw JSON body (for endpoints that don't use ApiResponse<T[]> shape). */
async function requestRaw<T>(
  path: string,
  signal?: AbortSignal
): Promise<T> {
  const fullUrl = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (AUTH_ENABLED) {
    const token = await getCurrentToken();
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(fullUrl, { headers, signal });

  if (!response.ok) {
    if (response.status === 401) {
      _onAuthError?.();
    }
    const body = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(body?.error || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getExercises(params?: { muscle_group?: string }, signal?: AbortSignal): Promise<ApiResponse<Exercise>> {
    return request<Exercise>("/exercises", params as Record<string, string>, signal);
  },

  getPersonalRecords(params?: { muscle_group?: string }, signal?: AbortSignal): Promise<ApiResponse<PersonalRecord>> {
    return request<PersonalRecord>("/exercises/personal-records", params as Record<string, string>, signal);
  },

  getExerciseProgression(
    exerciseName: string,
    params?: { start_date?: string; end_date?: string },
    signal?: AbortSignal
  ): Promise<ApiResponse<ProgressionPoint>> {
    return request<ProgressionPoint>(
      `/exercises/${encodeURIComponent(exerciseName)}/progression`,
      params as Record<string, string>,
      signal
    );
  },

  getExerciseHistory(
    exerciseName: string,
    params?: { start_date?: string; end_date?: string },
    signal?: AbortSignal
  ): Promise<ApiResponse<ExerciseSession>> {
    return request<ExerciseSession>(
      `/exercises/${encodeURIComponent(exerciseName)}/history`,
      params as Record<string, string>,
      signal
    );
  },

  getWorkouts(
    params?: {
      start_date?: string;
      end_date?: string;
      limit?: number;
      offset?: number;
    },
    signal?: AbortSignal
  ): Promise<ApiResponse<WorkoutSummary>> {
    return request<WorkoutSummary>("/workouts", params as Record<string, string | number>, signal);
  },

  getWorkoutDetail(date: string, signal?: AbortSignal): Promise<ApiResponse<WorkoutDetail>> {
    return request<WorkoutDetail>(`/workouts/${date}`, undefined, signal);
  },

  getWorkoutSplits(
    params?: {
      start_date?: string;
      end_date?: string;
      limit?: number;
    },
    signal?: AbortSignal
  ): Promise<ApiResponse<WorkoutSplit>> {
    return request<WorkoutSplit>("/workouts/splits", params as Record<string, string | number>, signal);
  },

  getWeeklyVolume(
    params?: {
      start_date?: string;
      end_date?: string;
      weeks?: number;
    },
    signal?: AbortSignal
  ): Promise<ApiResponse<WeeklyVolume>> {
    return request<WeeklyVolume>("/muscle-groups/weekly", params as Record<string, string | number>, signal);
  },

  getDailyVolume(
    params?: {
      start_date?: string;
      end_date?: string;
      days?: number;
    },
    signal?: AbortSignal
  ): Promise<ApiResponse<DailyVolume>> {
    return request<DailyVolume>("/muscle-groups/daily", params as Record<string, string | number>, signal);
  },

  getVolumeTrends(params?: { start_date?: string; end_date?: string }, signal?: AbortSignal): Promise<ApiResponse<VolumeTrend>> {
    return request<VolumeTrend>("/volume/trends", params as Record<string, string>, signal);
  },

  getBodyStats(params?: { start?: string; end?: string }, signal?: AbortSignal): Promise<ApiResponse<BodyStat>> {
    return request<BodyStat>("/body-stats", params as Record<string, string>, signal);
  },

  getNutrition(
    params?: { start_date?: string; end_date?: string },
    signal?: AbortSignal
  ): Promise<ApiResponse<NutritionEntry>> {
    return request<NutritionEntry>("/nutrition", params as Record<string, string>, signal);
  },

  getProgressPhotoDates(signal?: AbortSignal): Promise<ProgressPhotoDatesResponse> {
    return requestRaw<ProgressPhotoDatesResponse>("/progress-photos/dates", signal);
  },

  getProgressPhotos(date: string, signal?: AbortSignal): Promise<ProgressPhotosResponse> {
    return requestRaw<ProgressPhotosResponse>(`/progress-photos/${encodeURIComponent(date)}`, signal);
  },
};
