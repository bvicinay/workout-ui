import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { useWeeklyVolume } from "../api/hooks";
import { MUSCLE_GROUP_COLORS, ALL_MUSCLE_GROUPS } from "../config";
import { LoadingSpinner } from "../components/LoadingSpinner";

export function WeeklyVolume() {
  const weekly = useWeeklyVolume(12);
  const [hiddenGroups, setHiddenGroups] = useState<Set<string>>(new Set());

  function toggleGroup(group: string) {
    setHiddenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }

  const chartData = useMemo(() => {
    const byWeek = new Map<string, Record<string, any>>();
    for (const row of weekly.data) {
      if (!byWeek.has(row.week_start)) {
        byWeek.set(row.week_start, { week_start: row.week_start });
      }
      byWeek.get(row.week_start)![row.muscle_group] = row.total_sets;
    }
    return Array.from(byWeek.values()).sort((a, b) =>
      a.week_start.localeCompare(b.week_start)
    );
  }, [weekly.data]);

  const visibleGroups = ALL_MUSCLE_GROUPS.filter(
    (g) => !hiddenGroups.has(g)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">
        Weekly Volume
      </h1>

      {/* Muscle group toggle pills */}
      <div className="flex flex-wrap gap-2">
        {ALL_MUSCLE_GROUPS.map((group) => {
          const active = !hiddenGroups.has(group);
          const color = MUSCLE_GROUP_COLORS[group];
          return (
            <button
              key={group}
              onClick={() => toggleGroup(group)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? "border-transparent text-white"
                  : "border-divider text-text-secondary bg-surface"
              }`}
              style={
                active
                  ? { backgroundColor: color }
                  : undefined
              }
            >
              {group}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-surface rounded-xl border border-divider p-5">
        {weekly.loading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" />
              <XAxis
                dataKey="week_start"
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
                labelFormatter={(d) => `Week of ${d}`}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine
                y={10}
                stroke="#94A3B8"
                strokeDasharray="4 4"
                label={{ value: "10", position: "left", fontSize: 10, fill: "#94A3B8" }}
              />
              <ReferenceLine
                y={20}
                stroke="#94A3B8"
                strokeDasharray="4 4"
                label={{ value: "20", position: "left", fontSize: 10, fill: "#94A3B8" }}
              />
              {visibleGroups.map((group) => (
                <Bar
                  key={group}
                  dataKey={group}
                  stackId="volume"
                  fill={MUSCLE_GROUP_COLORS[group]}
                  name={group}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
