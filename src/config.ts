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
  Legs: "#6B8CBF",
  Back: "#6BA38A",
  Chest: "#BF7B7B",
  Shoulders: "#9B8BBF",
  Biceps: "#BF9B6B",
  Triceps: "#6BA3A3",
  Core: "#B5A86B",
  "Rear Delts": "#BF8BA3",
  Forearms: "#8B9298",
};

export const ALL_MUSCLE_GROUPS = Object.keys(MUSCLE_GROUP_COLORS);
