import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Supabase rows (matches your current table)
type Poll = {
  id: string;
  question: string;
  allow_multi: boolean;
  show_results: "after_vote" | "after_close";
  starts_at: string | null;
  ends_at: string | null;
  is_closed: boolean;
  created_at: string | null;
  show_on_community?: boolean | null;
  show_on_reports?: boolean | null;
  // Fallback array you backfilled
  options?: string[] | null;
};

type Choice = { id: string; poll_id: string; label: string; position: number };
type ResultRow = { poll_id: string; choice_id: string; label: string; votes: number };

function isWithinWindow(p: Poll) {
  const now = new Date();
  const starts = p.starts_at ? new Date(p.starts_at) : null;
  const ends = p.ends_at ? new Date(p.ends_at) : null;
  if (p.is_closed) return false;
  if (starts && now < starts) return false;
  if (ends && now >= ends) return false;
  return true;
}

export default function PollList({
  limitHome = 0,
  communityOnly = false,
  reportsOnly = false,
}: {
  limitHome?: number;
  communityOnly?: boolean;
  reportsOnly?: boolean;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [active, setActive] = useState<Poll[]>([]);
  const [closed, setClosed] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedChoiceByPoll, setVotedChoiceByPoll] = useState<Record<string, string | null>>({});
  const [resultsByPoll, setResultsByPoll] = useState<Record<string, ResultRow[]>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [choicesByPoll, setChoicesByPoll] = useState<Record<string, Choice[]>>({});

  // load polls + session
  useEffect(() => {
    let off = false;
    (async () => {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      if (!off) setUserId(uid);

      // fetch polls
      let q = supabase
        .from("pulse_polls")
        .select("*")
        .order("created_at", { ascending: false });

      if (communityOnly) q = q.eq("show_on_community", true);
      if (reportsOnly) q = q.eq("show_on_reports", true);

      const { data: polls = [] } = await q;

      // split active vs closed using window + is_closed
      const a: Poll[] = [];
      const c: Poll[] = [];
      for (const p of (polls as Poll[])) {
        if (!p) continue;
        if (!p.is_closed && isWithinWindow(p)) a.push(p);
        else c.push(p);
      }

      // limit on Community
      const aTrim = limitHome ? a.slice(0, limitHome) : a;

      if (!off) {
        setActive(aTrim);
        setClosed(communityOnly ? [] : c);
      }

      const ids = [...aTrim, ...(communityOnly ? [] : c)].map(p => p.id);

      // preload results (safe even if RLS denies; we'll just see empty)
      if (ids.length) {
        const { data: rows = [] } = await supabase
          .from("pulse_results")
          .select("*")
          .in("poll_id", ids);

        const by: Record<string, ResultRow[]> = {};
        for (const r of rows as ResultRow[]) {
          if (!by[r.poll_id]) by[r.poll_id] = [];
          by[r.poll_id].push(r);
        }
        if (!off) setResultsByPoll(by);
      }

      // preload my vote
      if (uid && ids.length) {
        const { data: myVotes = [] } = await supabase
          .from("pulse_votes")
          .select("poll_id, choice_id")
          .in("poll_id", ids)
          .eq("user_id", uid);
        const map: Record<string, string | null> = {};
        for (const v of (myVotes as any[])) map[v.poll_id] = v.choice_id;
        if (!off) setVotedChoiceByPoll(map);
      }

      // preload choices for each poll; if none, fall back to poll.options[]
      const choicesMap: Record<string, Choice[]> = {};
      for (const p of (polls as Poll[])) {
        const { data: rows = [], error } = await supabase
          .from("pulse_choices")
          .select("*")
          .eq("poll_id", p.id)
          .order("position");

        if (!error && rows && rows.length) {
          choicesMap[p.id] = rows as Choice[];
        } else {
          // fallback from options[] array
          const arr = (p as any).options as string[] | null | undefined;
          if (arr && arr.length) {
            choicesMap[p.id] = arr.map((label, idx) => ({
              id: `${p.id}__opt_${idx}`,
              poll_id: p.id,
              label,
              position: idx,
            }));
          } else {
            choicesMap[p.id] = [];
          }
        }
      }
      if (!off) setChoicesByPoll(choicesMap);

      if (!off) setLoading(false);
    })();
    return () => { off = true; };
  }, [limitHome, communityOnly, reportsOnly]);

  async function vote(poll: Poll, choice: Choice) {
    if (!userId) {
      alert("Please log in to vote.");
      return;
    }
    if (votedChoiceByPoll[poll.id]) return;
    if (!isWithinWindow(poll)) return;

    try {
      setSubmitting(prev => ({ ...prev, [poll.id]: true }));
      // If this is a synthesized choice (fallback), we can’t vote (no real choice_id):
      if (choice.id.startsWith(`${poll.id}__opt_`)) {
        alert("This poll’s choices are in demo mode. Please refresh or try another poll.");
        return;
      }

      const { error } = await supabase.from("pulse_votes").insert({
        poll_id: poll.id,
        choice_id: choice.id,
        user_id: userId,
      });
      if (error && (error as any).code !== "23505") {
        alert(error.message);
        return;
      }
      setVotedChoiceByPoll(prev => ({ ...prev, [poll.id]: choice.id }));

      const { data: rows = [] } = await supabase
        .from("pulse_results")
        .select("*")
        .eq("poll_id", poll.id);
      setResultsByPoll(prev => ({ ...prev, [poll.id]: rows as ResultRow[] }));
    } finally {
      setSubmitting(prev => ({ ...prev, [poll.id]: false }));
    }
  }

  function PollCard({ poll }: { poll: Poll }) {
    const choices = choicesByPoll[poll.id] ?? [];
    const votedChoice = votedChoiceByPoll[poll.id] ?? null;
    const results = resultsByPoll[poll.id] ?? [];
    const totalVotes = useMemo(() => results.reduce((s, r) => s + (r.votes || 0), 0), [results]);

    // results policy:
    const canShowResults =
      poll.show_results === "after_vote"
        ? !!votedChoice || poll.is_closed
        : poll.is_closed;

    const disabled = !!votedChoice || !isWithinWindow(poll) || submitting[poll.id];

    return (
      <article className="vh-card">
        <h3 className="text-lg font-semibold mb-4">{poll.question}</h3>

        {!choices.length ? (
          <div className="rounded-md border border-border p-3 text-sm text-muted-foreground">
            No options configured for this poll yet.
          </div>
        ) : (
          <div className="space-y-2">
            {choices.map((c) => {
              const r = results.find((x) => x.choice_id === c.id);
              const pct = totalVotes ? Math.round(((r?.votes || 0) / totalVotes) * 100) : 0;
              const selected = votedChoice === c.id;
              return (
                <button
                  key={c.id}
                  className={`w-full rounded-md border px-3 py-2 text-left transition
                    ${selected ? "border-primary" : "border-border hover:bg-accent/20"}`}
                  disabled={disabled}
                  onClick={() => vote(poll, c)}
                >
                  <div className="flex items-center justify-between">
                    <span>{c.label}</span>
                    {canShowResults && (
                      <span className="text-sm text-muted-foreground">
                        {r?.votes || 0} {totalVotes ? `(${pct}%)` : ""}
                      </span>
                    )}
                  </div>
                  {canShowResults && (
                    <div className="mt-2 h-2 w-full overflow-hidden rounded bg-muted">
                      <div className="h-full bg-primary/70" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-3 text-sm text-muted-foreground">
          {votedChoice
            ? (poll.show_results === "after_vote"
                ? "You voted in this poll. Results unlocked."
                : poll.is_closed
                  ? "Poll closed. Results are visible."
                  : "Thanks for voting. Results will be visible when the poll closes.")
            : isWithinWindow(poll)
              ? (poll.show_results === "after_vote"
                  ? "Select an option to vote and reveal results."
                  : "Select an option to vote. Results are hidden until the poll closes.")
              : "Poll closed."}
        </div>
      </article>
    );
  }

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 text-center text-muted-foreground">
        Loading polls…
      </div>
    );
  }

  if (communityOnly) {
    return active.length ? (
      <div className="space-y-8">{active.map((p) => <PollCard key={p.id} poll={p} />)}</div>
    ) : (
      <div className="glass-card rounded-xl p-6 text-center text-muted-foreground">
        No active polls.
      </div>
    );
  }

  return (
    <div>
      {active.length ? (
        <div className="space-y-8 mb-10">
          {active.map((p) => <PollCard key={p.id} poll={p} />)}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 text-center text-muted-foreground mb-10">
          No active polls.
        </div>
      )}

      {closed.length ? (
        <div className="space-y-8">
          {closed.map((p) => <PollCard key={p.id} poll={p} />)}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 text-center text-muted-foreground">
          No closed polls yet.
        </div>
      )}
    </div>
  );
}
