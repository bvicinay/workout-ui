export function Reference() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-semibold text-text-primary">Reference</h1>
      <p className="text-sm text-text-secondary">
        How the key metrics in this dashboard are calculated and what they mean.
      </p>

      <Section title="1RM (One-Rep Max)">
        <p>
          The <strong>estimated one-rep max</strong> is the theoretical maximum
          weight you could lift for a single repetition. It is calculated from
          the weight and reps of a working set using the{" "}
          <strong>Epley formula</strong>:
        </p>
        <Formula>1RM = weight × (1 + reps ÷ 30)</Formula>
        <p>
          For example, lifting 195 lbs for 8 reps yields an estimated 1RM of{" "}
          <code className="text-accent font-medium">195 × (1 + 8/30) = 247 lbs</code>.
        </p>
        <p>
          The Epley formula is one of several 1RM estimation formulas (others
          include Brzycki, Lander, and Lombardi). It is widely used because it
          is simple and reasonably accurate across moderate rep ranges (3–15
          reps). It tends to overestimate at very high rep counts (&gt;15).
        </p>
      </Section>

      <Section title="Peak 1RM">
        <p>
          The <strong>highest estimated 1RM</strong> across all sets of a given
          exercise on a specific day. This represents the single best effort for
          that session.
        </p>
        <p>
          In charts and tables labeled "Peak 1RM" or "Est. 1RM", this is the
          value shown. It is the primary strength metric used for tracking
          progression over time.
        </p>
      </Section>

      <Section title="Effective 1RM (Eff. 1RM)">
        <p>
          The <strong>average of the top 2 set 1RMs</strong> for an exercise on
          a given day. This smooths out single-set spikes and gives a more
          representative picture of your working strength.
        </p>
        <Formula>
          Eff. 1RM = (best set 1RM + second-best set 1RM) ÷ 2
        </Formula>
        <p>
          If an exercise only has one set with a valid 1RM, the effective 1RM
          equals the peak 1RM. When the peak and effective 1RM diverge
          significantly, it means one set was much stronger than the rest — the
          effective value is more conservative and reliable.
        </p>
      </Section>

      <Section title="Volume">
        <p>
          <strong>Set volume</strong> is weight multiplied by reps for a single
          set:
        </p>
        <Formula>Volume = weight × reps</Formula>
        <p>
          For example, 195 lbs × 8 reps = 1,560 lbs of volume. This represents
          the total load moved in that set.
        </p>
        <p>
          "Max volume" for a session refers to the single set with the highest
          volume value, not the sum of all sets. Total session volume (sum of
          all sets) is not currently tracked.
        </p>
      </Section>

      <Section title="Sets (Weekly / Daily)">
        <p>
          The <strong>total number of working sets</strong> performed for a
          muscle group within a time period. This is the primary measure of
          training volume used in the weekly volume charts.
        </p>
        <p>
          Evidence-based recommendations for hypertrophy typically suggest{" "}
          <strong>10–20 sets per muscle group per week</strong>. The reference
          lines on the weekly volume chart mark this range.
        </p>
      </Section>

      <Section title="Muscle Groups">
        <p>
          Each exercise is assigned to one of 9 muscle groups: Back, Biceps,
          Chest, Core, Forearms, Legs, Rear Delts, Shoulders, and Triceps. This
          assignment is based on the primary muscle targeted by each movement.
        </p>
        <p>
          Warm-up exercises (Jog, Stretch, etc.) have no muscle group assigned
          and are displayed dimmed in workout details.
        </p>
      </Section>

      <Section title="Supersets">
        <p>
          A <strong>superset</strong> is two or more exercises performed
          back-to-back without rest. In the data, they are identified by decimal
          exercise sequence numbers (e.g., 5.1 and 5.2) and the{" "}
          <code>set_is_superset</code> flag. Rest is taken only after the last
          exercise in the group.
        </p>
      </Section>

      <Section title="Program Cycles">
        <p>
          Workouts follow a numbered naming pattern like "28.1 Push", "28.2
          Pull", "28.3 Legs". The number prefix (28) indicates the{" "}
          <strong>program cycle</strong> — it increments every few weeks when
          the training program is updated by the coach. The decimal indicates
          the workout number within that cycle.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface rounded-xl border border-divider p-5 space-y-3">
      <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
      <div className="text-sm text-text-secondary leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg border border-divider rounded-lg px-4 py-2.5 font-mono text-sm text-accent">
      {children}
    </div>
  );
}
