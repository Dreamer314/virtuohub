import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useIntentContext, registerReplayHandlers } from "@/contexts/IntentContext";
import { useToast } from "@/hooks/use-toast";

type Poll = {
  id: string;
  question: string;
  options: string[] | null;          // array-of-labels schema (poll_options)
  subtypeData?: {                    // alternative schema
    options?: Array<{ label: string }>;
  };
  status: "active" | "closed";
};

type VoteRow = {
  poll_id: string;
  option_index?: number;             // schema A
  choice_id?: string;                // schema B
  user_id?: string;
};

type ChoiceRow = {
  id: string;
  poll_id: string;
  label: string;
  position: number;                  // 0..N-1
};

function lsKey(pollId: string) {
  return `vhub_voted_${pollId}`;
}

export default function PollCard({
  poll,
  onChanged,
  compact = false,
}: {
  poll: Poll;
  onChanged?: () => void;
  compact?: boolean;
}) {
  // Normalize poll options: prefer subtypeData.options, fallback to poll.options
  const baseLabels = useMemo(() => {
    if (poll.subtypeData?.options && poll.subtypeData.options.length > 0) {
      return poll.subtypeData.options.map(opt => opt.label).filter(Boolean);
    }
    return (poll.options ?? []).filter(Boolean);
  }, [poll.options, poll.subtypeData]);
  const isClosed = poll.status === "closed";
  const [labels, setLabels] = useState<string[]>(baseLabels);

  // For choice_id schema support
  const [choices, setChoices] = useState<ChoiceRow[] | null>(null);
  const [choiceByIndex, setChoiceByIndex] = useState<Record<number, ChoiceRow>>({});
  const [indexByChoiceId, setIndexByChoiceId] = useState<Record<string, number>>({});

  const [hasVoted, setHasVoted] = useState(false);
  const [myChoice, setMyChoice] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [total, setTotal] = useState(0);

  const canVote = !isClosed && labels.length >= 2;

  const { user } = useAuth();
  const { setIntent, requestAuth } = useIntentContext();
  const { toast } = useToast();

  // Load pulse_choices (if available) so we can fall back to choice_id schema
  useEffect(() => {
    let off = false;
    (async () => {
      const { data, error } = await supabase
        .from("pulse_choices")
        .select("id,poll_id,label,position")
        .eq("poll_id", poll.id)
        .order("position", { ascending: true });

      if (off) return;
      if (!error && data && data.length) {
        setChoices(data);
        setLabels(data.map((c) => c.label));
        const byIdx: Record<number, ChoiceRow> = {};
        const idxById: Record<string, number> = {};
        data.forEach((c) => {
          byIdx[c.position] = c;
          idxById[c.id] = c.position;
        });
        setChoiceByIndex(byIdx);
        setIndexByChoiceId(idxById);
      } else {
        // Keep using poll.options[] if pulse_choices is not present
        setChoices(null);
      }
    })();
    return () => {
      off = true;
    };
  }, [poll.id]);

  async function fetchCounts() {
    // Read all votes for this poll and derive counts for either schema.
    const { data, error } = await supabase
      .from("pulse_votes")
      .select("*")
      .eq("poll_id", poll.id);

    if (error) return;

    const c: Record<number, number> = {};

    (data ?? []).forEach((r) => {
      // Prefer option_index if present
      if (typeof r.option_index === "number") {
        const idx = r.option_index;
        c[idx] = (c[idx] ?? 0) + 1;
        return;
      }
      // Otherwise try choice_id mapping -> index
      if (r.choice_id && indexByChoiceId[r.choice_id] != null) {
        const idx = indexByChoiceId[r.choice_id];
        c[idx] = (c[idx] ?? 0) + 1;
      }
    });

    setCounts(c);
    setTotal(Object.values(c).reduce((a, b) => a + b, 0));
  }

  async function fetchMyVote() {
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes.user?.id;

    // Check a user-scoped vote first (either schema)
    if (uid) {
      const { data, error } = await supabase
        .from("pulse_votes")
        .select("*")
        .eq("poll_id", poll.id)
        .eq("user_id", uid)
        .limit(1);

      if (!error && data && data.length) {
        const row = data[0];
        if (typeof row.option_index === "number") {
          setHasVoted(true);
          setMyChoice(row.option_index);
          return;
        }
        if (row.choice_id && indexByChoiceId[row.choice_id] != null) {
          setHasVoted(true);
          setMyChoice(indexByChoiceId[row.choice_id]);
          return;
        }
      }
    }

    // Fallback: local marker for anonymous/self-enforced single vote
    const stored = localStorage.getItem(lsKey(poll.id));
    if (stored != null) {
      setHasVoted(true);
      const n = Number(stored);
      setMyChoice(Number.isFinite(n) ? n : null);
    }
  }

  // Register replay handler for poll voting
  useEffect(() => {
    const unregister = registerReplayHandlers({
      castVote: async (data: { pollId?: string; optionIndex?: number }) => {
        if (data.pollId === poll.id && typeof data.optionIndex === 'number') {
          await submitVote(data.optionIndex);
        }
      }
    });
    return unregister; // Cleanup on unmount or dependency change
  }, [poll.id, choiceByIndex, indexByChoiceId]);

  useEffect(() => {
    fetchMyVote();
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poll.id, indexByChoiceId]);

  async function submitVote(idx: number) {
    setSubmitting(true);

    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes.user?.id ?? null;

    // Try schema A: option_index
    let triedA = false;
    let ok = false;
    let lastErr: string | null = null;

    try {
      triedA = true;
      const insertA: Record<string, any> = { poll_id: poll.id, option_index: idx };
      if (uid) insertA.user_id = uid;
      const { error } = await supabase.from("pulse_votes").insert(insertA);
      if (!error) ok = true; else lastErr = error.message || String(error);
    } catch (e: any) {
      lastErr = e?.message || String(e);
    }

    // Fallback to schema B: choice_id
    if (!ok) {
      try {
        const choice = choiceByIndex[idx]; // must exist in choice-id schema
        if (!choice) throw new Error("Choice mapping not available.");
        const insertB: Record<string, any> = { poll_id: poll.id, choice_id: choice.id };
        if (uid) insertB.user_id = uid;
        const { error } = await supabase.from("pulse_votes").insert(insertB);
        if (!error) ok = true; else lastErr = error.message || String(error);
      } catch (e: any) {
        lastErr = e?.message || String(e);
      }
    }

    setSubmitting(false);

    if (!ok) {
      alert(`Could not record your vote.\n\n${lastErr || (triedA ? "Insert failed" : "Unknown schema")}`);
      await fetchCounts();
      return;
    }

    // Mark locally and refresh
    localStorage.setItem(lsKey(poll.id), String(idx));
    setHasVoted(true);
    setMyChoice(idx);
    await fetchCounts();
    onChanged?.();
  }

  function handleVote(idx: number) {
    if (!canVote || submitting) return;

    // Soft-gate: require auth
    if (!user) {
      setIntent({
        action: 'cast_vote',
        data: {
          pollId: poll.id,
          optionIndex: idx
        }
      });
      toast({ description: "You need to sign in to do that." });
      requestAuth('signin');
      return;
    }

    // Authenticated: proceed with vote
    submitVote(idx);
  }

  return (
    <div className={`vh-card ${compact ? "p-3" : "p-4"} overflow-hidden`}>
      <div className="font-medium mb-3">{poll.question}</div>

      {labels.length < 2 ? (
        <div className="text-sm text-muted-foreground">No options available for this poll.</div>
      ) : !hasVoted ? (
        <div className="grid gap-2">
          {labels.map((label, i) => (
            <Button
              key={i}
              className="h-9 justify-start"
              variant="secondary"
              disabled={!canVote || submitting}
              onClick={() => handleVote(i)}
            >
              {label}
            </Button>
          ))}
        </div>
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
          <div className="text-xs text-muted-foreground">
            {isClosed ? "Poll closed." : "You voted in this poll."}
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-muted-foreground">
        {isClosed
          ? "Closed"
          : hasVoted
          ? "Results unlocked"
          : "Select an option to vote and reveal results."}
      </div>
    </div>
  );
}
