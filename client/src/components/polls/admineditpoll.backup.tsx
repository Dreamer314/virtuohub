import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, ArrowUp, ArrowDown } from "lucide-react";

type Poll = {
  id: string;
  question: string;
  allow_multi: boolean;
  show_results: "after_vote" | "after_close";
  starts_at: string | null;
  ends_at: string | null;
  is_closed: boolean;
};

type Choice = { id?: string; label: string; position: number; _new?: boolean };

export default function AdminEditPoll({
  poll,
  onClose,
  onSaved,
}: {
  poll: Poll;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [question, setQuestion] = useState(poll.question);
  const [showResults, setShowResults] =
    useState<"after_vote" | "after_close">(poll.show_results);
  const [startsAt, setStartsAt] = useState<string | null>(poll.starts_at);
  const [endsAt, setEndsAt] = useState<string | null>(poll.ends_at);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let off = false;
    (async () => {
      const { data = [], error } = await supabase
        .from("pulse_choices")
        .select("id,label,position")
        .eq("poll_id", poll.id)
        .order("position");
      if (!off) {
        if (error) alert(error.message);
        setChoices(
          (data as any[]).map((c) => ({
            id: c.id,
            label: c.label,
            position: c.position,
          }))
        );
      }
    })();
    return () => {
      off = true;
    };
  }, [poll.id]);

  function addChoice() {
    setChoices((arr) => [
      ...arr,
      { label: "", position: arr.length + 1, _new: true },
    ]);
  }

  function removeChoice(idx: number) {
    setChoices((arr) => {
      const copy = [...arr];
      const [rm] = copy.splice(idx, 1);
      if (rm?.id) setRemoved((r) => [...r, rm.id!]);
      return copy.map((c, i) => ({ ...c, position: i + 1 }));
    });
  }

  function move(idx: number, dir: -1 | 1) {
    setChoices((arr) => {
      const copy = [...arr];
      const j = idx + dir;
      if (j < 0 || j >= copy.length) return arr;
      const t = copy[idx];
      copy[idx] = copy[j];
      copy[j] = t;
      return copy.map((c, i) => ({ ...c, position: i + 1 }));
    });
  }

  async function save() {
    setSaving(true);
    try {
      const { error: e1 } = await supabase
        .from("pulse_polls")
        .update({
          question,
          show_results: showResults,
          starts_at: startsAt,
          ends_at: endsAt,
        })
        .eq("id", poll.id);
      if (e1) throw e1;

      if (removed.length) {
        const { error: e2 } = await supabase
          .from("pulse_choices")
          .delete()
          .in("id", removed);
        if (e2) throw e2;
      }

      const payload = choices.map((c, i) => ({
        id: c.id, // undefined for new rows
        poll_id: poll.id,
        label: c.label.trim(),
        position: i + 1,
      }));

      const { error: e3 } = await supabase
        .from("pulse_choices")
        .upsert(payload, { onConflict: "id" });
      if (e3) throw e3;

      onSaved();
    } catch (e: any) {
      alert(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <Card className="relative w-full max-w-2xl mx-4">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit poll</h3>
            <button
              className="p-1 text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <Label>Question</Label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Results visibility</Label>
                <select
                  className="w-full h-10 rounded-md border border-border bg-background px-3"
                  value={showResults}
                  onChange={(e) =>
                    setShowResults(e.target.value as "after_vote" | "after_close")
                  }
                >
                  <option value="after_vote">After user votes</option>
                  <option value="after_close">After poll closes</option>
                </select>
              </div>
              <div className="hidden" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Starts at</Label>
                <Input
                  type="datetime-local"
                  value={
                    startsAt ? new Date(startsAt).toISOString().slice(0, 16) : ""
                  }
                  onChange={(e) =>
                    setStartsAt(
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null
                    )
                  }
                />
              </div>
              <div>
                <Label>Ends at</Label>
                <Input
                  type="datetime-local"
                  value={
                    endsAt ? new Date(endsAt).toISOString().slice(0, 16) : ""
                  }
                  onChange={(e) =>
                    setEndsAt(
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Choices</h4>
              <Button size="sm" onClick={addChoice}>
                <Plus className="w-4 h-4 mr-1" />
                Add choice
              </Button>
            </div>

            <div className="space-y-2">
              {choices.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-2 py-2 rounded border border-border text-muted-foreground"
                    onClick={() => move(idx, -1)}
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="px-2 py-2 rounded border border-border text-muted-foreground"
                    onClick={() => move(idx, 1)}
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <Input
                    value={c.label}
                    onChange={(e) => {
                      const v = e.target.value;
                      setChoices((arr) => {
                        const copy = [...arr];
                        copy[idx] = { ...copy[idx], label: v };
                        return copy;
                      });
                    }}
                    placeholder={`Choice ${idx + 1}`}
                  />
                  <button
                    className="p-2 rounded border border-border text-red-400"
                    onClick={() => removeChoice(idx)}
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {choices.length === 0 && (
                <div className="text-sm text-muted-foreground">No choices yet.</div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={saving} onClick={save}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
