import { useState, useMemo, useRef } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { useNutrition } from "../api/hooks";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { NutritionEntry } from "../types/api";

// ---------- constants ----------

const MACRO_COLORS = {
  protein_g: "#6B8CBF",
  carbs_g: "#6BA38A",
  fat_g: "#BF9B6B",
};

const PRESETS = [
  { label: "2W", days: 14 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "All", days: 0 },
] as const;

// ---------- helpers ----------

function toDateInputValue(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function subtractDays(from: Date, days: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  return d;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Expand a sparse list of NutritionEntry records so that every calendar day
 * from `startDate` to `endDate` (inclusive) has an entry. Days missing from
 * `entries` get null for all numeric fields, which causes Recharts to render
 * visible gaps instead of silently skipping those dates.
 */
function fillDateRange(
  entries: NutritionEntry[],
  startDate: string,
  endDate: string
): NutritionEntry[] {
  const map = new Map<string, NutritionEntry>();
  for (const e of entries) map.set(e.date, e);

  const result = [];
  const cursor = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");

  while (cursor <= end) {
    const dateStr = toDateInputValue(cursor);
    const entry = map.get(dateStr);
    result.push(
      entry
        ? {
            ...entry,
            calories: entry.calories ?? null,
            protein_g: entry.protein_g ?? null,
            carbs_g: entry.carbs_g ?? null,
            fat_g: entry.fat_g ?? null,
            calorie_goal: entry.calorie_goal ?? null,
          }
        : {
            date: dateStr,
            calories: null,
            protein_g: null,
            carbs_g: null,
            fat_g: null,
            calorie_goal: null,
          }
    );
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

// ---------- custom tooltips ----------

function CaloriesTooltip({ active, payload, label }: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const calories = payload.find((p) => p.dataKey === "calories");
  const goal = payload.find((p) => p.dataKey === "calorie_goal");
  return (
    <div
      className="bg-surface border border-divider rounded-lg px-3 py-2 text-sm shadow-md"
      style={{ fontSize: 12 }}
    >
      <p className="text-text-secondary mb-1">{formatDateLabel(String(label))}</p>
      {calories && calories.value != null && (
        <p className="font-semibold text-text-primary">
          Calories: {Math.round(calories.value)} kcal
        </p>
      )}
      {goal && goal.value != null && (
        <p className="text-text-secondary">
          Goal: {Math.round(goal.value)} kcal
        </p>
      )}
    </div>
  );
}

function MacrosTooltip({ active, payload, label }: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-surface border border-divider rounded-lg px-3 py-2 text-sm shadow-md"
      style={{ fontSize: 12 }}
    >
      <p className="text-text-secondary mb-1">{formatDateLabel(String(label))}</p>
      {payload.map((p) => {
        if (p.value == null) return null;
        const labels: Record<string, string> = {
          protein_g: "Protein",
          carbs_g: "Carbs",
          fat_g: "Fat",
        };
        return (
          <p key={String(p.dataKey)} style={{ color: p.fill }}>
            {labels[String(p.dataKey)] ?? p.dataKey}: {Math.round(p.value)}g
          </p>
        );
      })}
    </div>
  );
}

// ---------- stat card ----------

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-xl border border-divider p-4">
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      <p className="text-lg font-semibold text-text-primary">{value}</p>
    </div>
  );
}

// ---------- main component ----------

export function Nutrition() {
  // Stable "today" string — computed once on mount, used as a consistent
  // reference for all range calculations and memo dependency arrays.
  const todayStr = useMemo(() => toDateInputValue(new Date()), []);

  const [preset, setPreset] = useState<string>("1M");
  // customStart/customEnd hold whatever the user has typed in the pickers.
  // committedRange is only updated (and triggers API calls) once BOTH dates
  // are fully valid and end_date >= start_date.
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [committedRange, setCommittedRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  // Derive whether the current custom inputs are valid and ready to submit.
  const customRangeValid =
    customStart.length === 10 &&
    customEnd.length === 10 &&
    customEnd >= customStart;

  const apiParams = useMemo(() => {
    if (preset === "custom") {
      // Only fire an API call when a fully valid range has been committed.
      if (!committedRange) return null;
      return {
        start_date: committedRange.start,
        end_date: committedRange.end,
      };
    }
    const days = PRESETS.find((p) => p.label === preset)?.days ?? 30;
    // "All" — no date filters; the API returns the full history.
    if (days === 0) return {};
    return { start_date: toDateInputValue(subtractDays(new Date(todayStr), days)) };
  }, [preset, committedRange, todayStr]);

  // When apiParams is null (custom preset selected but no committed range yet)
  // we hold the last non-null params so the hook keeps its existing data and
  // doesn't fire a new "no-filter" fetch while the user is mid-edit.
  const lastNonNullParamsRef = useRef<{ start_date?: string; end_date?: string }>({});
  if (apiParams !== null) {
    lastNonNullParamsRef.current = apiParams;
  }
  const { data, loading, error } = useNutrition(lastNonNullParamsRef.current);

  // Sort ascending by date for charts, then expand to a full continuous date
  // range so missing days appear as visible gaps rather than silent skips.
  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
    if (sorted.length === 0) return sorted;

    // Determine the range boundaries:
    //   start — the earlier of: what the user requested vs. first data point
    //   end   — the later  of: what the user requested vs. last  data point
    const firstData = sorted[0].date;
    const lastData = sorted[sorted.length - 1].date;

    let rangeStart: string;
    let rangeEnd: string;

    if (preset === "custom" && committedRange) {
      rangeStart = committedRange.start;
      rangeEnd = committedRange.end;
    } else if (preset === "All") {
      // Show from the earliest logged entry to today.
      rangeStart = firstData < todayStr ? firstData : todayStr;
      rangeEnd = lastData > todayStr ? lastData : todayStr;
    } else {
      const days = PRESETS.find((p) => p.label === preset)?.days ?? 30;
      rangeStart = toDateInputValue(subtractDays(new Date(todayStr), days));
      rangeEnd = todayStr;
    }

    return fillDateRange(sorted, rangeStart, rangeEnd);
  }, [data, preset, committedRange, todayStr]);

  // Only show goal line when at least one entry has a non-null calorie_goal
  const hasGoal = useMemo(
    () => chartData.some((d) => d.calorie_goal != null),
    [chartData]
  );

  // Representative goal value (use the most common/latest non-null value)
  const goalValue = useMemo(() => {
    const withGoal = chartData.filter((d) => d.calorie_goal != null);
    if (!withGoal.length) return null;
    return withGoal[withGoal.length - 1].calorie_goal;
  }, [chartData]);

  // Summary stats
  const stats = useMemo(() => {
    const withCalories = chartData.filter((d) => d.calories != null);
    if (!withCalories.length) return null;
    const cals = withCalories.map((d) => d.calories as number);
    const avg = cals.reduce((a, b) => a + b, 0) / cals.length;
    const withProtein = chartData.filter((d) => d.protein_g != null);
    const avgProtein = withProtein.length
      ? withProtein.reduce((a, b) => a + (b.protein_g as number), 0) / withProtein.length
      : null;
    return {
      avg: Math.round(avg),
      logged: withCalories.length,
      avgProtein: avgProtein != null ? Math.round(avgProtein) : null,
    };
  }, [chartData]);

  // For the line chart: entries where calories is non-null get the value,
  // entries with null calories get undefined so Recharts shows a gap.
  // We pass all dates but mark nulls as undefined.
  const caloriesLineData = useMemo(
    () =>
      chartData.map((d) => ({
        date: d.date,
        calories: d.calories ?? undefined,
        // include goal on each row so the reference line tooltip works
        calorie_goal: d.calorie_goal ?? undefined,
      })),
    [chartData]
  );

  const macrosBarData = useMemo(
    () =>
      chartData.map((d) => ({
        date: d.date,
        protein_g: d.protein_g ?? undefined,
        carbs_g: d.carbs_g ?? undefined,
        fat_g: d.fat_g ?? undefined,
      })),
    [chartData]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Nutrition</h1>

      {/* Date range controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setPreset(p.label);
                // Clear committed custom range when switching to a preset so
                // apiParams doesn't stay stuck on the previous custom window.
                setCommittedRange(null);
                // Reset the picker inputs so stale custom dates don't linger.
                setCustomStart("");
                setCustomEnd("");
              }}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                preset === p.label
                  ? "bg-accent text-white border-transparent"
                  : "border-divider text-text-secondary bg-surface hover:bg-bg"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom date pickers — API call only fires when both dates are valid
            and the user explicitly submits the range (Apply button or Enter).
            Partial/invalid input is held locally without triggering a fetch. */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customStart}
            onFocus={() => setPreset("custom")}
            onChange={(e) => {
              setCustomStart(e.target.value);
              // Switch label to "custom" immediately so the preset pills
              // deselect, but do NOT commit (no API call yet).
              setPreset("custom");
            }}
            className={`text-xs border rounded-lg px-2 py-1.5 bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-accent ${
              preset === "custom" && customStart && customEnd && customEnd < customStart
                ? "border-red-400"
                : "border-divider"
            }`}
          />
          <span className="text-text-secondary text-xs">to</span>
          <input
            type="date"
            value={customEnd}
            onFocus={() => setPreset("custom")}
            onChange={(e) => {
              setCustomEnd(e.target.value);
              setPreset("custom");
            }}
            className={`text-xs border rounded-lg px-2 py-1.5 bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-accent ${
              preset === "custom" && customStart && customEnd && customEnd < customStart
                ? "border-red-400"
                : "border-divider"
            }`}
          />
          {/* Apply button: enabled only when the range is valid */}
          <button
            onClick={() => {
              if (customRangeValid) {
                setCommittedRange({ start: customStart, end: customEnd });
              }
            }}
            disabled={!customRangeValid || preset !== "custom"}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              customRangeValid && preset === "custom"
                ? "bg-accent text-white border-transparent hover:opacity-90"
                : "border-divider text-text-secondary bg-surface opacity-40 cursor-not-allowed"
            }`}
          >
            Apply
          </button>
        </div>

        {data.length > 0 && (
          <span className="text-xs text-text-secondary ml-auto">
            {data.length} day{data.length !== 1 ? "s" : ""} logged
          </span>
        )}
      </div>

      {/* Stat cards */}
      {stats && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Avg Calories" value={`${stats.avg} kcal`} />
          {goalValue != null && (
            <StatCard
              label="Calorie Goal"
              value={`${goalValue} kcal`}
            />
          )}
          {stats.avgProtein != null && (
            <StatCard label="Avg Protein" value={`${stats.avgProtein}g`} />
          )}
        </div>
      )}

      {/* Calories line chart */}
      <div className="bg-surface rounded-xl border border-divider p-5">
        <h2 className="text-sm font-medium text-text-secondary mb-4">
          Calories per Day
        </h2>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-500">{error}</div>
        ) : caloriesLineData.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-secondary">
            No data for selected range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={caloriesLineData}
              margin={{ top: 4, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#475569" }}
                tickFormatter={formatDateLabel}
                minTickGap={40}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#475569" }}
                width={50}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip content={CaloriesTooltip} />
              {hasGoal && goalValue != null && (
                <ReferenceLine
                  y={goalValue}
                  stroke="#94A3B8"
                  strokeDasharray="6 3"
                  label={{
                    value: `Goal ${goalValue}`,
                    position: "right",
                    fontSize: 10,
                    fill: "#94A3B8",
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#6B8CBF"
                strokeWidth={2}
                dot={{ r: 3, fill: "#6B8CBF", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#6B8CBF", strokeWidth: 0 }}
                connectNulls={false}
                name="Calories"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Macros stacked bar chart */}
      <div className="bg-surface rounded-xl border border-divider p-5">
        <h2 className="text-sm font-medium text-text-secondary mb-4">
          Macros per Day (g)
        </h2>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-500">{error}</div>
        ) : macrosBarData.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-secondary">
            No data for selected range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={macrosBarData}
              margin={{ top: 4, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#475569" }}
                tickFormatter={formatDateLabel}
                minTickGap={40}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#475569" }}
                width={50}
                tickFormatter={(v) => `${v}g`}
              />
              <Tooltip content={MacrosTooltip} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    protein_g: "Protein",
                    carbs_g: "Carbs",
                    fat_g: "Fat",
                  };
                  return labels[value] ?? value;
                }}
              />
              <Bar
                dataKey="protein_g"
                stackId="macros"
                fill={MACRO_COLORS.protein_g}
                name="protein_g"
              />
              <Bar
                dataKey="carbs_g"
                stackId="macros"
                fill={MACRO_COLORS.carbs_g}
                name="carbs_g"
              />
              <Bar
                dataKey="fat_g"
                stackId="macros"
                fill={MACRO_COLORS.fat_g}
                name="fat_g"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
