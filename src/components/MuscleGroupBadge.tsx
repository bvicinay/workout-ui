import { MUSCLE_GROUP_COLORS } from "../config";

export function MuscleGroupBadge({ group }: { group: string }) {
  const color = MUSCLE_GROUP_COLORS[group] || "#6B7280";

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {group}
    </span>
  );
}
