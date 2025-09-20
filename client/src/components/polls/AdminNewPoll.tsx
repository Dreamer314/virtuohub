import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = { onCreated?: () => void; buttonClassName?: string };

export default function AdminNewPoll({ onCreated, buttonClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState<string[]>(["", ""]);
  const [startsAt, setStartsAt] = useState<string>("");
  const [endsAt, setEndsAt] = useState<string>("");

  useEffect(() => {
    let off = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      if (!uid) return;
      const { data, error } = await supabase.rpc("is_admin", { uid });
      if (!off) setIsAdmin(!!data && !error);
    })();
    return () => { off = true; };
  }, []);

  if (!isAdmin) return null;

  function addChoice() {
    setChoices(prev => (prev.length < 5 ? [...prev, ""] : prev));
  }
  function removeChoice(i: number) {
    setChoices(prev => (prev.length > 2 ? prev.filter((_, idx) => idx !== i) : prev));
  }
  function reset() {
    setQuestion(""); setChoices(["", ""]); setStartsAt(""); setEndsAt("");
  }

  async function handleCreate() {
    const labels = choices.map(c => c.trim()).filter(Boolean);
    if (!question.trim()) { alert("Enter a question."); return; }
    if (labels.length < 2) { alert("Provide at least 2 choices."); return; }

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      if (!uid) throw new Error("Not signed in");
      const { data: isA } = await supabase.rpc("is_admin", { uid });
      if (!isA) throw new Error("Admin only");

      const startsIso = startsAt ? new Date(startsAt).toISOString() : null;
      const endsIso = endsAt ? new Date(endsAt).toISOString() : null;

      // Single choice only: allow_multi false
      const { data: poll, error: pollErr } = await supabase
        .from("pulse_polls")
        .insert({
          question: question.trim(),
          allow_multi: false,
          show_results: "after_vote",
          starts_at: startsIso,
          ends_at: endsIso,
          is_closed: false,
          created_by: uid
        })
        .select("id")
        .single();
      if (pollErr) throw pollErr;

      const rows = labels.map((label, idx) => ({ poll_id: poll.id, label, position: idx + 1 }));
      const { error: chErr } = await supabase.from("pulse_choices").insert(rows);
      if (chErr) throw chErr;

      setOpen(false);
      reset();
      onCreated?.();
    } catch (e: any) {
      alert(e.message || "Failed to create poll");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); setOpen(v); }}>
      <DialogTrigger asChild>
        <Button size="sm" className={buttonClassName}>New Poll</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Poll</DialogTitle>
          <DialogDescription>Enter a question and 2 to 5 choices.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Question</Label>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What should we ask?" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Choices</Label>
              <Button variant="outline" size="sm" onClick={addChoice} disabled={choices.length >= 5}>
                Add choice
              </Button>
            </div>
            {choices.map((c, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  className="flex-1"
                  value={c}
                  onChange={(e) => setChoices(prev => prev.map((x, idx) => idx === i ? e.target.value : x))}
                  placeholder={`Choice ${i + 1}`}
                />
                <Button variant="outline" size="sm" onClick={() => removeChoice(i)} disabled={choices.length <= 2}>
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Starts at</Label>
              <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
            </div>
            <div>
              <Label>Ends at</Label>
              <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
            <Button type="button" onClick={handleCreate} disabled={submitting}>
              {submitting ? "Creating…" : "Create poll"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
