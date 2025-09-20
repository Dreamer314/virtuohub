import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Poll = {
  id: string;
  question: string;
  options: string[] | null;        // labels live here
  status: "active" | "closed";
};

type VoteRow = { poll_id: string; option_index: number };

export default function PollCard({
  poll,
  onChanged,
  compact = false,
}: {
  poll: Poll;
  onChanged?: () => void;
  compact?: boolean;
}) {
  const [hasVoted, setHasVoted] = useState(false);
  const [myChoice, setMyChoice] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [total, setTotal] = useState(0);

  const labels = useMemo(() => (poll.options ?? []).filter(Boolean), [poll.options]);
  const isClosed = poll.status === "closed";
  const canVote = !isClosed && labels.length >= 2;

  async function fetchMyVote() {
    const { data, error } = await supabase
      .from<VoteRow>("pulse_votes")
      .select("option_index")
      .eq("poll_id", poll.id)
      .limit(1);
    if (!error && data && data.length) {
      setHasVoted(true);
      setMyChoice(data[0].option_index);
    }
  }

  async function fetchCounts() {
    const { data, error } = await supabase
      .from<VoteRow>("pulse_votes")
      .select("option_index")
      .eq("poll_id", poll.id);
    if (error) return;
    const c: Record<number, number> = {};
    (data ?? []).forEach((r: any) => {
      const idx = Number(r.option_index);
      c[idx] = (c[idx] ?? 0) + 1;
    });
    setCounts(c);
    setTotal(Object.values(c).reduce((a, b) => a + b, 0));
  }

  useEffect(() => {
    fetchMyVote();
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poll.id]);

  async function handleVote(idx: number) {
    if (!canVote) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("pulse_votes")
      .insert({ poll_id: poll.id, option_index: idx });
    setSubmitting(false);
    if (!error) {
      setHasVoted(true);
      setMyChoice(idx);
      await fetchCounts();
      onChanged?.();
      return;
    }
    await fetchMyVote();
    await fetchCounts();
  }

  return (
    <div className={`vh-card ${compact ? "p-3" : "p-4"} overflow-hidden`}>
      <div className="font-medium mb-3">{poll.question}</div>

      {labels.length < 2 ? (
        <div className="text-sm text-muted-foreground">No options available for this poll.</div>
      ) : (
        <div className="grid gap-2">
          {!hasVoted ? (
            labels.map((label, i) => (
              <Button
                key={i}
                className="h-9 justify-start"
                variant="secondary"
                disabled={!canVote || submitting}
                onClick={() => handleVote(i)}
              >
                {label}
              </Button>
            ))
          ) : (
            <div className="grid gap-2">
              {labels.map((label, i) => {
                const v = counts[i] ?? 0;
                const pct = total ? Math.round((v / total) * 100) : 0;
                const mine = i === myChoice;
                return (
                  <div key={i} className="grid gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={mine ? "font-semibold" : ""}>{label}</span>
                      <span className="text-muted-foreground">{pct}% ({v})</span>
                    </div>
                    <div className="h-2 rounded bg-muted overflow-hidden">
                      <div
                        className={`h-2 ${mine ? "bg-primary" : "bg-primary/60"}`}
                        style={{ width: `${pct}%`, transition: "width 300ms ease" }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="text-xs text-muted-foreground">You voted in this poll.</div>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 text-xs text-muted-foreground">
        {isClosed ? "Closed" : hasVoted ? "Results unlocked" : "Select an option to vote and reveal results."}
      </div>
    </div>
  );
}
