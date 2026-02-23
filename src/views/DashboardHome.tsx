import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useVolumeTrends, useWeeklyVolume, useWorkouts } from "../api/hooks";
import { MUSCLE_GROUP_COLORS } from "../config";
import { LoadingSpinner } from "../components/LoadingSpinner";

function formatWeek(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function DashboardHome() {
  const trends = useVolumeTrends();
  const weekly = useWeeklyVolume(1);
  const recent = useWorkouts({ limit: 5 });
  const navigate = useNavigate();

  // Build this-week data for horizontal bar
  const thisWeekData = weekly.data
    .sort((a, b) => b.total_sets - a.total_sets)
    .map((d) => ({
      muscle_group: d.muscle_group,
      sets: d.total_sets,
      fill: MUSCLE_GROUP_COLORS[d.muscle_group] || "#6B7280",
    }));

  const trendData = trends.data.map((d) => ({
    week: formatWeek(d.week_start),
    sets: d.total_sets,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Overview</h1>

      {/* KPI Row */}
      {!trends.loading && trends.data.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="This Week"
            value={`${trends.data[trends.data.length - 1]?.total_sets ?? 0}`}
            unit="sets"
          />
          <KpiCard
            label="Last Week"
            value={`${trends.data[trends.data.length - 2]?.total_sets ?? 0}`}
            unit="sets"
          />
          <KpiCard
            label="12-Week Avg"
            value={`${Math.round(trends.data.reduce((s, d) => s + d.total_sets, 0) / trends.data.length)}`}
            unit="sets/wk"
          />
          <KpiCard
            label="Peak Week"
            value={`${Math.max(...trends.data.map((d) => d.total_sets))}`}
            unit="sets"
          />
        </div>
      )}

      {/* Volume Trend Chart */}
      <div className="bg-surface rounded-xl border border-divider p-5">
        <h2 className="text-sm font-medium text-text-secondary mb-4">
          Weekly Training Volume
        </h2>
        {trends.loading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#475569" }} />
              <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #E6EAF0",
                }}
              />
              <Area
                type="monotone"
                dataKey="sets"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#volGrad)"
                name="Total Sets"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* This Week's Volume */}
        <div className="bg-surface rounded-xl border border-divider p-5">
          <h2 className="text-sm font-medium text-text-secondary mb-4">
            This Week by Muscle Group
          </h2>
          {weekly.loading ? (
            <LoadingSpinner />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={thisWeekData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis
                  type="category"
                  dataKey="muscle_group"
                  tick={{ fontSize: 11, fill: "#475569" }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #E6EAF0",
                  }}
                />
                <Bar dataKey="sets" name="Sets" radius={[0, 4, 4, 0]}>
                  {thisWeekData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Workouts */}
        <div className="bg-surface rounded-xl border border-divider p-5">
          <h2 className="text-sm font-medium text-text-secondary mb-4">
            Recent Workouts
          </h2>
          {recent.loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-0">
              {recent.data.map((w) => (
                <button
                  key={w.daily_workout_id}
                  onClick={() => navigate(`/workouts?date=${w.date}`)}
                  className="w-full flex items-center justify-between py-3 border-b border-divider last:border-0 hover:bg-bg/50 transition-colors text-left px-2 -mx-2 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {w.workout_name}
                    </p>
                    <p className="text-xs text-text-secondary">{w.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm tabular-nums text-text-primary">
                      {w.total_sets} sets
                    </p>
                    <p className="text-xs text-text-secondary">
                      {w.exercise_count} exercises
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="bg-surface rounded-xl border border-divider p-4">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p className="text-2xl font-semibold text-text-primary mt-1 tabular-nums">
        {value}
        <span className="text-sm font-normal text-text-secondary ml-1">
          {unit}
        </span>
      </p>
    </div>
  );
}
