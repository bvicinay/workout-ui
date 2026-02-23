import { API_BASE_URL, AUTH_ENABLED } from "../config";
import { getCurrentToken } from "../auth/cognito";
import type { ApiResponse, ApiError } from "../types/api";

async function request<T>(
  path: string,
  params?: Record<string, string | number>
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
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(requestUrl, { headers });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(body?.error || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getExercises(params?: { muscle_group?: string }) {
    return request<any>("/exercises", params as Record<string, string>);
  },

  getPersonalRecords(params?: { muscle_group?: string }) {
    return request<any>("/exercises/personal-records", params as Record<string, string>);
  },

  getExerciseProgression(
    exerciseName: string,
    params?: { start_date?: string; end_date?: string }
  ) {
    return request<any>(
      `/exercises/${encodeURIComponent(exerciseName)}/progression`,
      params as Record<string, string>
    );
  },

  getExerciseHistory(
    exerciseName: string,
    params?: { start_date?: string; end_date?: string }
  ) {
    return request<any>(
      `/exercises/${encodeURIComponent(exerciseName)}/history`,
      params as Record<string, string>
    );
  },

  getWorkouts(params?: {
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }) {
    return request<any>("/workouts", params as Record<string, string | number>);
  },

  getWorkoutDetail(date: string) {
    return request<any>(`/workouts/${date}`);
  },

  getWorkoutSplits(params?: {
    start_date?: string;
    end_date?: string;
    limit?: number;
  }) {
    return request<any>("/workouts/splits", params as Record<string, string | number>);
  },

  getWeeklyVolume(params?: {
    start_date?: string;
    end_date?: string;
    weeks?: number;
  }) {
    return request<any>("/muscle-groups/weekly", params as Record<string, string | number>);
  },

  getDailyVolume(params?: {
    start_date?: string;
    end_date?: string;
    days?: number;
  }) {
    return request<any>("/muscle-groups/daily", params as Record<string, string | number>);
  },

  getVolumeTrends(params?: { start_date?: string; end_date?: string }) {
    return request<any>("/volume/trends", params as Record<string, string>);
  },
};
