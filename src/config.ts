export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "/api";

export const COGNITO_USER_POOL_ID =
  import.meta.env.VITE_COGNITO_USER_POOL_ID || "";

export const COGNITO_CLIENT_ID =
  import.meta.env.VITE_COGNITO_CLIENT_ID || "";

export const AUTH_ENABLED =
  !!COGNITO_USER_POOL_ID && !!COGNITO_CLIENT_ID;

export const MOCKS_ENABLED =
  import.meta.env.VITE_ENABLE_MOCKS === "true" ||
  (!import.meta.env.VITE_API_URL && import.meta.env.DEV);

export const MUSCLE_GROUP_COLORS: Record<string, string> = {
  Legs: "#3B82F6",
  Back: "#22C55E",
  Chest: "#EF4444",
  Shoulders: "#A855F7",
  Biceps: "#F97316",
  Triceps: "#14B8A6",
  Core: "#EAB308",
  "Rear Delts": "#EC4899",
  Forearms: "#6B7280",
};

export const ALL_MUSCLE_GROUPS = Object.keys(MUSCLE_GROUP_COLORS);
