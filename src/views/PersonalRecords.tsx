import { useState, useMemo } from "react";
import { usePersonalRecords } from "../api/hooks";
import { MuscleGroupBadge } from "../components/MuscleGroupBadge";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ALL_MUSCLE_GROUPS } from "../config";

type SortKey = "all_time_peak_1rm" | "all_time_max_weight" | "all_time_max_volume" | "exercise_name";
type SortDir = "asc" | "desc";

export function PersonalRecords() {
  const [muscleFilter, setMuscleFilter] = useState("");
  const records = usePersonalRecords(muscleFilter || undefined);
  const [sortKey, setSortKey] = useState<SortKey>("all_time_peak_1rm");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = useMemo(() => {
    return [...records.data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [records.data, sortKey, sortDir]);

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column)
      return <span className="text-text-secondary/30 ml-1">&#8597;</span>;
    return (
      <span className="text-accent ml-1">
        {sortDir === "asc" ? "&#9650;" : "&#9660;"}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">
        Personal Records
      </h1>

      {/* Muscle group filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMuscleFilter("")}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            !muscleFilter
              ? "bg-accent text-white border-transparent"
              : "border-divider text-text-secondary bg-surface hover:bg-bg"
          }`}
        >
          All
        </button>
        {ALL_MUSCLE_GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setMuscleFilter(g)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              muscleFilter === g
                ? "bg-accent text-white border-transparent"
                : "border-divider text-text-secondary bg-surface hover:bg-bg"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Records table */}
      <div className="bg-surface rounded-xl border border-divider overflow-x-auto">
        {records.loading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-divider text-text-secondary">
                <th
                  onClick={() => handleSort("exercise_name")}
                  className="text-left py-3 px-5 font-medium cursor-pointer hover:text-text-primary"
                >
                  Exercise
                  <SortIcon column="exercise_name" />
                </th>
                <th className="text-left py-3 px-5 font-medium">
                  Muscle Group
                </th>
                <th
                  onClick={() => handleSort("all_time_peak_1rm")}
                  className="text-right py-3 px-5 font-medium cursor-pointer hover:text-text-primary"
                >
                  Peak 1RM
                  <SortIcon column="all_time_peak_1rm" />
                </th>
                <th
                  onClick={() => handleSort("all_time_max_weight")}
                  className="text-right py-3 px-5 font-medium cursor-pointer hover:text-text-primary"
                >
                  Max Weight
                  <SortIcon column="all_time_max_weight" />
                </th>
                <th
                  onClick={() => handleSort("all_time_max_volume")}
                  className="text-right py-3 px-5 font-medium cursor-pointer hover:text-text-primary"
                >
                  Max Volume
                  <SortIcon column="all_time_max_volume" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr
                  key={r.exercise_name}
                  className="border-b border-divider/50 hover:bg-bg/50 transition-colors"
                >
                  <td className="py-3 px-5 font-medium">{r.exercise_name}</td>
                  <td className="py-3 px-5">
                    <MuscleGroupBadge group={r.muscle_group} />
                  </td>
                  <td className="py-3 px-5 text-right tabular-nums font-semibold text-accent">
                    {r.all_time_peak_1rm.toFixed(1)} lbs
                  </td>
                  <td className="py-3 px-5 text-right tabular-nums">
                    {r.all_time_max_weight.toFixed(1)} lbs
                  </td>
                  <td className="py-3 px-5 text-right tabular-nums">
                    {r.all_time_max_volume.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!records.loading && sorted.length === 0 && (
          <div className="p-8 text-center text-sm text-text-secondary">
            No records found
          </div>
        )}
      </div>
    </div>
  );
}
