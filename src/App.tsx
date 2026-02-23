import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Layout } from "./components/Layout";
import { LoginPage } from "./views/LoginPage";
import { DashboardHome } from "./views/DashboardHome";
import { ExerciseExplorer } from "./views/ExerciseExplorer";
import { WeeklyVolume } from "./views/WeeklyVolume";
import { WorkoutLog } from "./views/WorkoutLog";
import { PersonalRecords } from "./views/PersonalRecords";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="exercises" element={<ExerciseExplorer />} />
            <Route path="volume" element={<WeeklyVolume />} />
            <Route path="workouts" element={<WorkoutLog />} />
            <Route path="records" element={<PersonalRecords />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
