import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useWorkouts, useWorkoutDetail } from "../api/hooks";
import { MuscleGroupBadge } from "../components/MuscleGroupBadge";
import { LoadingSpinner } from "../components/LoadingSpinner";

export function WorkoutLog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = searchParams.get("date");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;
  const workouts = useWorkouts({ limit: PAGE_SIZE, offset: page * PAGE_SIZE });
  const detail = useWorkoutDetail(selectedDate);

  function selectDate(date: string) {
    setSearchParams({ date });
  }

  function clearDate() {
    setSearchParams({});
  }

  // Workout detail view
  if (selectedDate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={clearDate}
            className="text-sm text-accent-interactive hover:text-accent transition-colors"
          >
            &larr; Back to list
          </button>
          <h1 className="text-xl font-semibold text-text-primary">
            {selectedDate}
          </h1>
        </div>

        {detail.loading ? (
          <LoadingSpinner />
        ) : detail.data.length === 0 ? (
          <div className="bg-surface rounded-xl border border-divider p-8 text-center">
            <p className="text-sm text-text-secondary">
              No workouts found for {selectedDate}
            </p>
          </div>
        ) : (
          detail.data.map((workout) => (
            <div
              key={workout.daily_workout_id}
              className="bg-surface rounded-xl border border-divider"
            >
              <div className="px-5 py-4 border-b border-divider">
                <h2 className="text-base font-semibold">
                  {workout.workout_name}
                </h2>
              </div>

              <div className="divide-y divide-divider">
                {workout.exercises.map((exercise, idx) => {
                  const isWarmup = !exercise.muscle_group;
                  const isSuperset = exercise.set_is_superset;
                  const supersetPrefix = exercise.exercise_sequence.split(".")[0];
                  const prevExercise = idx > 0 ? workout.exercises[idx - 1] : null;
                  const isFirstInSuperset =
                    isSuperset &&
                    (!prevExercise ||
                      !prevExercise.set_is_superset ||
                      prevExercise.exercise_sequence.split(".")[0] !== supersetPrefix);

                  return (
                    <div
                      key={exercise.exercise_sequence}
                      className={`px-5 py-3 ${
                        isWarmup ? "opacity-50" : ""
                      } ${isSuperset ? "border-l-2 border-l-accent-interactive ml-3" : ""}`}
                    >
                      {isFirstInSuperset && (
                        <p className="text-[10px] uppercase tracking-wider text-accent-interactive font-semibold mb-1">
                          Superset
                        </p>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-secondary w-5">
                            {exercise.exercise_sequence}
                          </span>
                          <span className="text-sm font-medium">
                            {exercise.exercise_name}
                          </span>
                          {exercise.muscle_group && (
                            <MuscleGroupBadge group={exercise.muscle_group} />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {exercise.exercise_rest && exercise.exercise_rest !== "0s" && (
                            <span className="text-[10px] text-text-secondary bg-bg px-1.5 py-0.5 rounded">
                              Rest {exercise.exercise_rest}
                            </span>
                          )}
                          {exercise.exercise_peak_1rm != null && (
                            <span className="text-xs tabular-nums font-medium text-accent">
                              {exercise.exercise_peak_1rm.toFixed(0)} 1RM
                            </span>
                          )}
                        </div>
                      </div>

                      <table className="w-full text-xs ml-7">
                        <thead>
                          <tr className="text-text-secondary">
                            <th className="text-left py-1 font-medium w-12">Set</th>
                            <th className="text-left py-1 font-medium">Target</th>
                            <th className="text-left py-1 font-medium">Reps</th>
                            <th className="text-right py-1 font-medium">Weight</th>
                            <th className="text-right py-1 font-medium">Volume</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.map((set) => {
                            const allNull =
                              set.set_reps == null && set.set_weight == null;
                            return (
                              <tr
                                key={set.set_sequence}
                                className={allNull ? "opacity-50" : ""}
                              >
                                <td className="py-1">{set.set_sequence}</td>
                                <td className="py-1">
                                  {set.set_reps_target ?? "—"}
                                </td>
                                <td className="py-1 font-medium">
                                  {set.set_reps ?? (allNull ? "Not logged" : "—")}
                                </td>
                                <td className="py-1 text-right tabular-nums">
                                  {set.set_weight != null
                                    ? `${set.set_weight} lbs`
                                    : "—"}
                                </td>
                                <td className="py-1 text-right tabular-nums">
                                  {set.set_volume != null
                                    ? set.set_volume.toLocaleString()
                                    : "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // Workout list view
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Workouts</h1>

      <div className="bg-surface rounded-xl border border-divider">
        {workouts.loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider text-text-secondary">
                  <th className="text-left py-3 px-5 font-medium">Date</th>
                  <th className="text-left py-3 px-5 font-medium">Workout</th>
                  <th className="text-right py-3 px-5 font-medium">Exercises</th>
                  <th className="text-right py-3 px-5 font-medium">Sets</th>
                </tr>
              </thead>
              <tbody>
                {workouts.data.map((w) => (
                  <tr
                    key={w.daily_workout_id}
                    onClick={() => selectDate(w.date)}
                    className="border-b border-divider/50 hover:bg-bg/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-5 tabular-nums text-text-secondary">
                      {w.date}
                    </td>
                    <td className="py-3 px-5 font-medium">{w.workout_name}</td>
                    <td className="py-3 px-5 text-right tabular-nums">
                      {w.exercise_count}
                    </td>
                    <td className="py-3 px-5 text-right tabular-nums">
                      {w.total_sets}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-divider">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-xs text-accent-interactive hover:text-accent disabled:text-text-secondary disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-text-secondary">
                Page {page + 1}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={workouts.data.length < PAGE_SIZE}
                className="text-xs text-accent-interactive hover:text-accent disabled:text-text-secondary disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
