import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  useExercises,
  useExerciseProgression,
  useExerciseHistory,
} from "../api/hooks";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ALL_MUSCLE_GROUPS } from "../config";

export function ExerciseExplorer() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("");
  const exercises = useExercises(muscleFilter || undefined);
  const progression = useExerciseProgression(selectedExercise);
  const history = useExerciseHistory(selectedExercise);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  const filteredExercises = useMemo(() => {
    if (!search) return exercises.data;
    const q = search.toLowerCase();
    return exercises.data.filter((e) =>
      e.exercise_name.toLowerCase().includes(q)
    );
  }, [exercises.data, search]);

  // Group by muscle group
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filteredExercises>();
    for (const ex of filteredExercises) {
      const g = ex.muscle_group || "Other";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(ex);
    }
    return map;
  }, [filteredExercises]);

  const chartData = progression.data.map((p) => ({
    date: p.date,
    "Peak 1RM": p.exercise_peak_1rm,
    "Eff. 1RM": p.exercise_eff_1rm,
    "Max Weight": p.exercise_max_weight,
  }));

  function toggleDate(date: string) {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Exercises</h1>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Exercise Picker */}
        <div className="bg-surface rounded-xl border border-divider p-4 h-fit lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto">
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-divider rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent-interactive mb-3"
          />
          <select
            value={muscleFilter}
            onChange={(e) => setMuscleFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-divider rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent-interactive mb-3"
          >
            <option value="">All Muscle Groups</option>
            {ALL_MUSCLE_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {exercises.loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-3">
              {[...grouped.entries()].map(([group, exs]) => (
                <div key={group}>
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                    {group}
                  </p>
                  {exs.map((ex) => (
                    <button
                      key={ex.exercise_name}
                      onClick={() => setSelectedExercise(ex.exercise_name)}
                      className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                        selectedExercise === ex.exercise_name
                          ? "bg-accent-highlight text-accent font-medium"
                          : "text-text-primary hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{ex.exercise_name}</span>
                      <span className="text-xs text-text-secondary ml-2 shrink-0">
                        {ex.sessions}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="space-y-6">
          {!selectedExercise ? (
            <div className="bg-surface rounded-xl border border-divider p-12 text-center">
              <p className="text-sm text-text-secondary">
                Select an exercise to view progression
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold">{selectedExercise}</h2>

              {/* Progression Chart */}
              <div className="bg-surface rounded-xl border border-divider p-5">
                <h3 className="text-sm font-medium text-text-secondary mb-4">
                  Strength Progression
                </h3>
                {progression.loading ? (
                  <LoadingSpinner />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#475569" }}
                        tickFormatter={(d) => {
                          const dt = new Date(d + "T00:00:00");
                          return dt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: "1px solid #E6EAF0",
                        }}
                        labelFormatter={(d) => d}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line
                        type="monotone"
                        dataKey="Peak 1RM"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Eff. 1RM"
                        stroke="#1E3A8A"
                        strokeWidth={1.5}
                        strokeDasharray="6 3"
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Max Weight"
                        stroke="#94A3B8"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* History Table */}
              <div className="bg-surface rounded-xl border border-divider p-5">
                <h3 className="text-sm font-medium text-text-secondary mb-4">
                  Session History
                </h3>
                {history.loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-1">
                    {history.data.map((session) => (
                      <div key={session.daily_exercise_id}>
                        <button
                          onClick={() => toggleDate(session.date)}
                          className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-bg/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              className={`text-text-secondary transition-transform ${
                                expandedDates.has(session.date) ? "rotate-90" : ""
                              }`}
                            >
                              <path
                                d="M6 4l4 4-4 4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                            <div>
                              <p className="text-sm font-medium">
                                {session.date}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {session.workout_name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {session.exercise_peak_1rm != null && (
                              <p className="text-sm tabular-nums font-medium">
                                {session.exercise_peak_1rm.toFixed(1)} lbs
                                <span className="text-xs text-text-secondary font-normal ml-1">
                                  1RM
                                </span>
                              </p>
                            )}
                            <p className="text-xs text-text-secondary">
                              {session.sets.length} sets
                            </p>
                          </div>
                        </button>

                        {expandedDates.has(session.date) && (
                          <div className="ml-8 mb-2">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-text-secondary border-b border-divider">
                                  <th className="text-left py-1.5 font-medium">Set</th>
                                  <th className="text-left py-1.5 font-medium">Target</th>
                                  <th className="text-left py-1.5 font-medium">Reps</th>
                                  <th className="text-right py-1.5 font-medium">Weight</th>
                                  <th className="text-right py-1.5 font-medium">1RM</th>
                                  <th className="text-right py-1.5 font-medium">Volume</th>
                                </tr>
                              </thead>
                              <tbody>
                                {session.sets.map((set) => {
                                  const missedTarget =
                                    set.set_reps != null &&
                                    set.set_reps_target != null &&
                                    /^\d+$/.test(set.set_reps) &&
                                    /^\d+$/.test(set.set_reps_target) &&
                                    parseInt(set.set_reps) < parseInt(set.set_reps_target);
                                  const exceededTarget =
                                    set.set_reps != null &&
                                    set.set_reps_target != null &&
                                    /^\d+$/.test(set.set_reps) &&
                                    /^\d+$/.test(set.set_reps_target) &&
                                    parseInt(set.set_reps) > parseInt(set.set_reps_target);

                                  return (
                                    <tr
                                      key={set.set_sequence}
                                      className="border-b border-divider/50"
                                    >
                                      <td className="py-1.5">{set.set_sequence}</td>
                                      <td className="py-1.5">{set.set_reps_target ?? "—"}</td>
                                      <td
                                        className={`py-1.5 font-medium ${
                                          missedTarget
                                            ? "text-red-500"
                                            : exceededTarget
                                            ? "text-green-600"
                                            : ""
                                        }`}
                                      >
                                        {set.set_reps ?? "—"}
                                      </td>
                                      <td className="py-1.5 text-right tabular-nums">
                                        {set.set_weight != null
                                          ? `${set.set_weight} lbs`
                                          : "—"}
                                      </td>
                                      <td className="py-1.5 text-right tabular-nums">
                                        {set.set_1rm_epley != null
                                          ? set.set_1rm_epley.toFixed(1)
                                          : "—"}
                                      </td>
                                      <td className="py-1.5 text-right tabular-nums">
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
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
