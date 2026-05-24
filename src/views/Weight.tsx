import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { useBodyStats } from "../api/hooks";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { BodyStat } from "../types/api";

// ---------- helpers ----------

function toDateInputValue(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function subtractMonths(from: Date, months: number): Date {
  const d = new Date(from);
  d.setMonth(d.getMonth() - months);
  return d;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

// ---------- types ----------

type SortKey = "date" | "weight_lbs";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 25;

const PRESETS = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "All", months: 0 },
] as const;

// ---------- custom tooltip ----------

function WeightTooltip({ active, payload, label }: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-surface border border-divider rounded-lg px-3 py-2 text-sm shadow-md"
      style={{ fontSize: 12 }}
    >
      <p className="text-text-secondary mb-0.5">{formatDateLabel(String(label))}</p>
      <p className="font-semibold text-text-primary">
        {(payload[0].value as number).toFixed(1)} lbs
      </p>
    </div>
  );
}

// ---------- sort icon ----------

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== column) return <span className="text-text-secondary/30 ml-1">&#8597;</span>;
  return (
    <span className="text-accent ml-1">
      {sortDir === "asc" ? "▲" : "▼"}
    </span>
  );
}

// ---------- main component ----------

export function Weight() {
  const today = new Date();

  // preset = "3M" | "6M" | "1Y" | "All" | "custom"
  const [preset, setPreset] = useState<string>("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Derived API params from preset / custom
  const apiParams = useMemo(() => {
    if (preset === "custom") {
      return {
        start: customStart || undefined,
        end: customEnd || undefined,
      };
    }
    const months = PRESETS.find((p) => p.label === preset)?.months ?? 0;
    if (months === 0) return {}; // All
    return { start: toDateInputValue(subtractMonths(today, months)) };
  }, [preset, customStart, customEnd]);

  const { data, loading, error } = useBodyStats(apiParams);

  // Table state
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "desc");
    }
    setPage(0);
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortKey === "date") {
        const cmp = a.date.localeCompare(b.date);
        return sortDir === "asc" ? cmp : -cmp;
      }
      const cmp = a.weight_lbs - b.weight_lbs;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData: BodyStat[] = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Chart data is always ascending by date regardless of table sort
  const chartData = useMemo(
    () => [...data].sort((a, b) => a.date.localeCompare(b.date)),
    [data]
  );

  // Stats
  const stats = useMemo(() => {
    if (!data.length) return null;
    const weights = data.map((d) => d.weight_lbs);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const first = [...data].sort((a, b) => a.date.localeCompare(b.date))[0];
    const last = [...data].sort((a, b) => b.date.localeCompare(a.date))[0];
    const change = last.weight_lbs - first.weight_lbs;
    return { min, max, first: first.weight_lbs, last: last.weight_lbs, change };
  }, [data]);

  // Y-axis domain with a little padding
  const yDomain = useMemo(() => {
    if (!chartData.length) return ["auto", "auto"] as const;
    const weights = chartData.map((d) => d.weight_lbs);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const pad = Math.max((max - min) * 0.15, 2);
    return [Math.floor(min - pad), Math.ceil(max + pad)];
  }, [chartData]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Weight</h1>

      {/* Date range controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Preset buttons */}
        <div className="flex gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setPreset(p.label); setPage(0); }}
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

        {/* Custom date pickers */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customStart}
            onChange={(e) => { setCustomStart(e.target.value); setPreset("custom"); setPage(0); }}
            className="text-xs border border-divider rounded-lg px-2 py-1.5 bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <span className="text-text-secondary text-xs">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => { setCustomEnd(e.target.value); setPreset("custom"); setPage(0); }}
            className="text-xs border border-divider rounded-lg px-2 py-1.5 bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {data.length > 0 && (
          <span className="text-xs text-text-secondary ml-auto">
            {data.length} reading{data.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Stat cards */}
      {stats && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Current", value: `${stats.last.toFixed(1)} lbs` },
            { label: "Change", value: `${stats.change >= 0 ? "+" : ""}${stats.change.toFixed(1)} lbs`, accent: stats.change < 0 },
            { label: "Low", value: `${stats.min.toFixed(1)} lbs` },
            { label: "High", value: `${stats.max.toFixed(1)} lbs` },
          ].map((s) => (
            <div key={s.label} className="bg-surface rounded-xl border border-divider p-4">
              <p className="text-xs text-text-secondary mb-1">{s.label}</p>
              <p className={`text-lg font-semibold ${s.accent ? "text-accent" : "text-text-primary"}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="bg-surface rounded-xl border border-divider p-5">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-500">{error}</div>
        ) : chartData.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-secondary">No data for selected range</div>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#475569" }}
                tickFormatter={formatDateLabel}
                minTickGap={50}
              />
              <YAxis
                domain={yDomain}
                tick={{ fontSize: 11, fill: "#475569" }}
                tickFormatter={(v) => `${v}`}
                width={48}
              />
              <Tooltip content={WeightTooltip} />
              {stats && (
                <ReferenceLine
                  y={stats.last}
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  label={{ value: `${stats.last.toFixed(1)}`, position: "right", fontSize: 10, fill: "#94A3B8" }}
                />
              )}
              <Line
                type="monotone"
                dataKey="weight_lbs"
                stroke="#6B8CBF"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "#6B8CBF", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#6B8CBF", strokeWidth: 0 }}
                name="Weight (lbs)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-divider overflow-x-auto">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider text-text-secondary">
                  <th
                    onClick={() => handleSort("date")}
                    className="text-left py-3 px-5 font-medium cursor-pointer hover:text-text-primary"
                  >
                    Date
                    <SortIcon column="date" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th
                    onClick={() => handleSort("weight_lbs")}
                    className="text-right py-3 px-5 font-medium cursor-pointer hover:text-text-primary"
                  >
                    Weight (lbs)
                    <SortIcon column="weight_lbs" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row) => (
                  <tr
                    key={row.date}
                    className="border-b border-divider/50 hover:bg-bg/50 transition-colors"
                  >
                    <td className="py-3 px-5 text-text-primary">
                      {new Date(row.date + "T00:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-5 text-right tabular-nums font-semibold text-accent">
                      {row.weight_lbs.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sorted.length === 0 && !error && (
              <div className="p-8 text-center text-sm text-text-secondary">
                No data for selected range
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-divider">
                <span className="text-xs text-text-secondary">
                  {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 0}
                    className="text-xs px-3 py-1.5 rounded-lg border border-divider text-text-secondary disabled:opacity-40 hover:bg-bg transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages - 1}
                    className="text-xs px-3 py-1.5 rounded-lg border border-divider text-text-secondary disabled:opacity-40 hover:bg-bg transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
