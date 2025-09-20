import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PollCard from "@/components/polls/PollCard";

type PollRow = {
  id: string;
  question: string;
  options: string[] | null;
  status: "active" | "closed";
  show_on_community: boolean | null;
  show_on_reports: boolean | null;
  created_at?: string | null;
};

type Props = {
  /** Cap the number of polls (used for the small “VHub Pulse” slot on Community) */
  limitHome?: number;
  /** Only fetch polls that are active + featured on Community */
  communityOnly?: boolean;
  /** Only include polls that should appear on Pulse Reports */
  reportsOnly?: boolean;
  /** Optional: external refresh bump (admin actions, etc.) */
  refreshKeyExternal?: number;
};

export default function PollList({
  limitHome,
  communityOnly,
  reportsOnly,
  refreshKeyExternal = 0,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [polls, setPolls] = useState<PollRow[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const mounted = useRef(false);

  // Build the base query (kept readable + defensive)
  async function load() {
    setLoading(true);
    setErrorMsg(null);

    let q = supabase
      .from("pulse_polls")
      .select("id, question, options, status, show_on_community, show_on_reports, created_at")
      .order("created_at", { ascending: false });

    if (communityOnly) {
      q = q.eq("status", "active").eq("show_on_community", true);
    }
    if (reportsOnly) {
      q = q.eq("show_on_reports", true);
    }
    if (limitHome && limitHome > 0) {
      q = q.limit(limitHome);
    }

    const { data, error } = await q;

    if (error) {
      setErrorMsg(error.message || "Failed to load polls.");
      setPolls([]);
    } else {
      // Guard against malformed rows; ensure options is an array
      const safe = (data ?? []).map((p: any) => ({
        ...p,
        options: Array.isArray(p.options) ? p.options : [],
      })) as PollRow[];
      setPolls(safe);
    }

    setLoading(false);
  }

  // Initial + programmatic refresh
  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, refreshKeyExternal, communityOnly, reportsOnly, limitHome]);

  // Realtime: refresh when polls or votes change
  useEffect(() => {
    const channel = supabase
      .channel("polls-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "pulse_polls" }, () =>
        setRefreshKey((k) => k + 1)
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "pulse_votes" }, () =>
        setRefreshKey((k) => k + 1)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Friendly empty-state message
  const emptyText = useMemo(() => {
    if (communityOnly) return "No active polls.";
    if (reportsOnly) return "No polls to show on Pulse Reports yet.";
    return "No polls yet.";
  }, [communityOnly, reportsOnly]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }
  if (errorMsg) {
    return (
      <div className="text-sm text-red-400">
        {errorMsg}
      </div>
    );
  }
  if (!polls.length) {
    return <div className="text-sm text-muted-foreground">{emptyText}</div>;
  }

  return (
    <div className="grid gap-4">
      {polls.map((p) => (
        <PollCard
          key={p.id}
          poll={p}
          onChanged={() => setRefreshKey((k) => k + 1)}
        />
      ))}
    </div>
  );
}
