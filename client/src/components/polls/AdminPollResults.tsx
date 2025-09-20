import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Poll = {
  id: string;
  question: string;
  starts_at: string | null;
  ends_at: string | null;
  is_closed: boolean;
};

type ResultRow = { choice_id: string; label: string; votes: number };

export default function AdminPollResults({
  poll,
  onClose,
}: {
  poll: Poll;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<ResultRow[]>([]);
  const total = useMemo(
    () => rows.reduce((s, r) => s + (r.votes || 0), 0),
    [rows]
  );

  async function load() {
    const { data = [], error } = await supabase
      .from("pulse_results")
      .select("choice_id,label,votes")
      .eq("poll_id", poll.id)
      .order("choice_id");
    if (!error) setRows(data as ResultRow[]);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      await load();
      // live update: listen to votes table, refetch on change
      const channel = supabase
        .channel(`admin-results-${poll.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "pulse_votes", filter: `poll_id=eq.${poll.id}` },
          () => load()
        )
        .subscribe();

    })();

    return () => {
      mounted = false;
      supabase.removeChannel(
        supabase
          .getChannels()
          .find((c) => c.topic === `realtime:admin-results-${poll.id}`) ?? ({} as any)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poll.id]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <Card className="relative w-full max-w-xl mx-4">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Results</h3>
            <button className="p-1 text-muted-foreground hover:text-foreground" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Poll</div>
            <div className="font-medium">{poll.question}</div>
          </div>

          <div className="space-y-3">
            {rows.map((r) => {
              const pct = total ? Math.round((r.votes / total) * 100) : 0;
              return (
                <div key={r.choice_id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div>{r.label}</div>
                    <div className="text-muted-foreground">{r.votes} {total ? `(${pct}%)` : ""}</div>
                  </div>
                  <div className="h-2 w-full rounded bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary/70"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {rows.length === 0 && (
              <div className="text-sm text-muted-foreground">No choices/results yet.</div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
