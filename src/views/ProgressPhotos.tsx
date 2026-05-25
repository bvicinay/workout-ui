import { useState, useEffect, useMemo } from "react";
import { useProgressPhotoDates, useProgressPhotos } from "../api/hooks";
import { LoadingSpinner } from "../components/LoadingSpinner";

// ---------- helpers ----------

function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ---------- sub-components ----------

interface PhotoCardProps {
  label: string;
  base64?: string;
}

function PhotoCard({ label, base64 }: PhotoCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
      <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        {label}
      </p>
      <div className="w-full aspect-[3/4] bg-bg rounded-xl border border-divider overflow-hidden flex items-center justify-center">
        {base64 ? (
          <img
            src={`data:image/jpeg;base64,${base64}`}
            alt={`${label} progress photo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-secondary/40 px-4 text-center">
            <svg
              width="40"
              height="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 21h18M12 3v18"
              />
            </svg>
            <span className="text-xs">No photo</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- main component ----------

const POSES: Array<{ key: "front" | "side" | "back"; label: string }> = [
  { key: "front", label: "Front" },
  { key: "side", label: "Side" },
  { key: "back", label: "Back" },
];

export function ProgressPhotos() {
  const {
    dates,
    loading: datesLoading,
    error: datesError,
  } = useProgressPhotoDates();

  // Default to the most recent date once dates are loaded.
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (dates.length > 0 && selectedDate === null) {
      setSelectedDate(dates[dates.length - 1]);
    }
  }, [dates, selectedDate]);

  const {
    photos,
    loading: photosLoading,
    error: photosError,
  } = useProgressPhotos(selectedDate);

  // Build a Set for O(1) lookup so the <select> can show only valid dates.
  const dateSet = useMemo(() => new Set(dates), [dates]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">
        Progress Photos
      </h1>

      {/* Date picker */}
      <div className="flex flex-wrap items-center gap-3">
        {datesLoading ? (
          <div className="h-8 w-48 bg-bg rounded-lg border border-divider animate-pulse" />
        ) : datesError ? (
          <p className="text-sm text-red-500">{datesError}</p>
        ) : dates.length === 0 ? (
          <p className="text-sm text-text-secondary">No photos available.</p>
        ) : (
          <>
            <label
              htmlFor="photo-date-select"
              className="text-xs font-medium text-text-secondary"
            >
              Date
            </label>
            <select
              id="photo-date-select"
              value={selectedDate ?? ""}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs border border-divider rounded-lg px-2 py-1.5 bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {dates
                .slice()
                .reverse()
                .map((d) => (
                  <option key={d} value={d} disabled={!dateSet.has(d)}>
                    {formatDateDisplay(d)}
                  </option>
                ))}
            </select>
          </>
        )}
      </div>

      {/* Photos panel */}
      <div className="bg-surface rounded-xl border border-divider p-5">
        {photosLoading ? (
          <LoadingSpinner />
        ) : photosError ? (
          <div className="py-12 text-center text-sm text-red-500">
            {photosError}
          </div>
        ) : !photos && !datesLoading && dates.length === 0 ? null : !photos ? (
          <div className="py-12 text-center text-sm text-text-secondary">
            Select a date to view photos.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-text-secondary">
              {formatDateDisplay(photos.date)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {POSES.map(({ key, label }) => (
                <PhotoCard
                  key={key}
                  label={label}
                  base64={photos.photos[key]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
