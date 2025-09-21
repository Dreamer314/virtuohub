import React, { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import AdminEditPoll from "@/components/polls/AdminEditPoll";
import {
  Repeat2, Pencil, PieChart, X, RotateCcw, Copy, Download, Trash2, Star, EyeOff,
  FilePlus2, Check, Archive, Eye, Key, Plus, Minus
} from "lucide-react";

/* ───────────────────────── Scoped styles (INPUT OUTLINES + READABLE DROPDOWNS) ───────────────────────── */
function AdminScopedStyles() {
  return (
    <style>{`
      .admin-scope .vh-input,
      .admin-scope input.vh-input,
      .admin-scope textarea.vh-input,
      .admin-scope select.vh-input {
        background-color: hsl(var(--background)) !important;
        color: hsl(var(--foreground)) !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 10px;
        padding: 10px 12px;
        caret-color: hsl(var(--foreground)) !important;
      }
      .admin-scope .vh-input::placeholder { color: hsl(var(--muted-foreground)) !important; opacity: 1; }
      .admin-scope .vh-input:focus {
        outline: none !important;
        border-color: hsl(var(--primary));
        box-shadow: 0 0 0 2px hsl(var(--primary) / 0.25);
      }
      .admin-scope input[type="file"].vh-input,
      .admin-scope input[type="datetime-local"].vh-input { color: hsl(var(--foreground)) !important; }

      /* Visibility boost so inputs don't look like "floating text" */
      .admin-scope .vh-input,
      .admin-scope input.vh-input,
      .admin-scope textarea.vh-input,
      .admin-scope select.vh-input {
        border-width: 1px !important;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.22);
      }

      /* Force readable text in dropdown menus (dark/charcoal themes had white-on-white) */
      .admin-scope select.vh-input option { color: #111 !important; background: #fff !important; }

      /* Autofill fix */
      .admin-scope input.vh-input:-webkit-autofill,
      .admin-scope input.vh-input:-webkit-autofill:hover,
      .admin-scope input.vh-input:-webkit-autofill:focus {
        -webkit-text-fill-color: hsl(var(--foreground)) !important;
        -webkit-box-shadow: 0 0 0px 1000px hsl(var(--background)) inset !important;
        transition: background-color 9999s ease-in-out 0s;
      }

      /* Simple card shell */
      .vh-card { background: hsl(var(--card)); border: 1px solid hsl(var(--border)); border-radius: 14px; }
    `}</style>
  );
}

/* ───────────────────────── Utilities ───────────────────────── */
type PollRow = {
  id: string;
  question: string;
  options: string[] | null;
  status: "active" | "closed";
  show_on_community: boolean | null;
  show_on_reports: boolean | null;
  allow_multi?: boolean | null;
  show_results?: "after_vote" | "after_close" | null;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at?: string | null;
};

type ReportRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  tags: string[] | null;
  access_level: "free" | "paid" | "private";
  price_cents: number | null;
  status: "draft" | "scheduled" | "published" | "archived";
  release_at: string | null;
  storage_path: string | null;
  cover_image_url: string | null;
  show_on_reports: boolean | null;
  created_at?: string | null;
};

function fmt(dt?: string | null) {
  if (!dt) return "-";
  const d = new Date(dt);
  return d.toLocaleString();
}
function dollars(cents: number | null | undefined) {
  const v = (cents ?? 0) / 100;
  return `$${v.toFixed(2)}`;
}

/* ───────────────────────── Create Poll Modal (in-file, no extra imports) ───────────────────────── */
function AdminNewPollModal({
  onCreated,
  triggerClassName,
}: { onCreated?: () => void; triggerClassName?: string }) {
  const [open, setOpen] = useState(false);

  const [question, setQuestion] = useState("");
  const [opts, setOpts] = useState<string[]>(["", ""]);
  const [allowMulti, setAllowMulti] = useState(false);
  const [showResults, setShowResults] = useState<"after_vote" | "after_close">("after_vote");
  const [startsAt, setStartsAt] = useState<string>("");
  const [endsAt, setEndsAt] = useState<string>("");
  const [showOnCommunity, setShowOnCommunity] = useState(true);
  const [showOnReports, setShowOnReports] = useState(true);
  const [creating, setCreating] = useState(false);

  const canSubmit = useMemo(() => {
    const clean = opts.map(o => (o ?? "").trim()).filter(Boolean);
    return question.trim().length > 0 && clean.length >= 2;
  }, [question, opts]);

  function setOpt(i: number, v: string) {
    setOpts(prev => prev.map((x, idx) => (idx === i ? v : x)));
  }
  function addOpt() {
    if (opts.length >= 10) return;
    setOpts(prev => [...prev, ""]);
  }
  function removeOpt(i: number) {
    if (opts.length <= 2) return;
    setOpts(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleCreate() {
    if (!canSubmit) {
      alert("Please enter a question and at least two options.");
      return;
    }

    setCreating(true);
    try {
      const cleanOptions = opts.map(o => o.trim()).filter(Boolean);
      const payload: any = {
        question: question.trim(),
        options: cleanOptions,
        status: "active",
        allow_multi: allowMulti,
        show_results: showResults,
        show_on_community: showOnCommunity,
        show_on_reports: showOnReports,
        starts_at: startsAt ? new Date(startsAt).toISOString() : null,
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      };

      const { error } = await supabase.from("pulse_polls").insert(payload);
      if (error) throw error;

      // reset
      setQuestion("");
      setOpts(["", ""]);
      setAllowMulti(false);
      setShowResults("after_vote");
      setStartsAt("");
      setEndsAt("");
      setShowOnCommunity(true);
      setShowOnReports(true);
      setOpen(false);
      onCreated?.();
    } catch (e: any) {
      console.error(e);
      alert(`Could not create poll.\n\n${e?.message ?? e}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <Button className={triggerClassName ?? "h-8"} type="button" onClick={() => setOpen(true)}>
        New Poll
      </Button>

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
          <div className="w-[760px] max-w-[95vw] rounded-xl bg-background text-foreground shadow-xl border border-border admin-scope">
            <AdminScopedStyles />
            <div className="px-5 py-4 border-b border-border text-lg font-semibold">Create a Poll</div>

            <div className="p-5 grid gap-5">
              {/* Question */}
              <div className="grid gap-2">
                <label className="text-sm opacity-80">Question</label>
                <input
                  className="vh-input"
                  placeholder="What should we ask?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              {/* Options */}
              <div className="grid gap-2">
                <label className="text-sm opacity-80">Options (2 to 10)</label>
                <div className="grid gap-2">
                  {opts.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        className="vh-input"
                        placeholder={`Option ${idx + 1}`}
                        value={v}
                        onChange={(e) => setOpt(idx, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-9 px-3"
                        onClick={() => removeOpt(idx)}
                        disabled={opts.length <= 2}
                        title="Remove option"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div>
                    <Button type="button" variant="secondary" className="h-9" onClick={addOpt} disabled={opts.length >= 10}>
                      <Plus className="w-4 h-4 mr-1" /> Add option
                    </Button>
                  </div>
                </div>
              </div>

              {/* Advanced / flags */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm opacity-80">Allow multiple selections</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="allow-multi"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={allowMulti}
                      onChange={(e) => setAllowMulti(e.target.checked)}
                    />
                    <label htmlFor="allow-multi" className="text-sm">Enable</label>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm opacity-80">Show results</label>
                  <select
                    className="vh-input"
                    value={showResults}
                    onChange={(e) => setShowResults(e.target.value as any)}
                  >
                    <option value="after_vote">After vote</option>
                    <option value="after_close">After poll closes</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm opacity-80">Starts at</label>
                  <input
                    type="datetime-local"
                    className="vh-input"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm opacity-80">Ends at</label>
                  <input
                    type="datetime-local"
                    className="vh-input"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm opacity-80">Feature on Community</label>
                  <select
                    className="vh-input"
                    value={String(showOnCommunity)}
                    onChange={(e) => setShowOnCommunity(e.target.value === "true")}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm opacity-80">Show on Reports</label>
                  <select
                    className="vh-input"
                    value={String(showOnReports)}
                    onChange={(e) => setShowOnReports(e.target.value === "true")}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-border flex items-center justify-end gap-2">
              <Button type="button" variant="secondary" className="h-9" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" className="h-9" onClick={handleCreate} disabled={!canSubmit || creating}>
                {creating ? "Creating..." : "Create poll"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ───────────────────────── Polls card ───────────────────────── */
function PollsCard({
  onRefresh,
  refreshKeyExternal,
}: {
  onRefresh: () => void;
  refreshKeyExternal: number;
}) {
  const [loading, setLoading] = useState(true);
  const [polls, setPolls] = useState<PollRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [editingPoll, setEditingPoll] = useState<PollRow | null>(null);

  useEffect(() => {
    let off = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pulse_polls")
        .select("id, question, options, status, show_on_reports, show_on_community, allow_multi, show_results, starts_at, ends_at, created_at")
        .order("created_at", { ascending: false });
      if (!off) {
        if (!error && data) setPolls(data as PollRow[]);
        setLoading(false);
      }
    })();
    return () => { off = true; };
  }, [refreshKeyExternal]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const counts: Record<string, number> = {};
      for (const p of polls) {
        const { count } = await supabase
          .from("pulse_votes")
          .select("*", { count: "exact", head: true })
          .eq("poll_id", p.id);
        counts[p.id] = count ?? 0;
      }
      if (!cancelled) setVoteCounts(counts);
    })();
    return () => { cancelled = true; };
  }, [polls]);

  async function toggleFlag(id: string, field: "show_on_reports" | "show_on_community") {
    setBusy(id + field);
    const p = polls.find(pp => pp.id === id);
    if (!p) return;
    const next = !(p as any)[field];
    const { error } = await supabase.from("pulse_polls").update({ [field]: next }).eq("id", id);
    setBusy(null);
    if (!error) onRefresh();
  }

  async function setStatus(id: string, next: "active" | "closed") {
    setBusy(id + next);
    const { error } = await supabase.from("pulse_polls").update({ status: next }).eq("id", id);
    setBusy(null);
    if (!error) onRefresh();
  }

  async function resetVotes(id: string) {
    if (!confirm("Reset ALL votes for this poll? This cannot be undone.")) return;
    setBusy(id + "reset");
    await supabase.from("pulse_votes").delete().eq("poll_id", id);
    setBusy(null);
    onRefresh();
  }

  async function del(id: string) {
    if (!confirm("Delete this poll? Votes will also be removed.")) return;
    setBusy(id + "delete");
    await supabase.from("pulse_votes").delete().eq("poll_id", id);
    await supabase.from("pulse_polls").delete().eq("id", id);
    setBusy(null);
    onRefresh();
  }

  async function duplicate(p: PollRow) {
    setBusy(p.id + "dup");
    const { error } = await supabase.from("pulse_polls").insert({
      question: p.question + " (copy)",
      options: p.options ?? [],
      status: "active",
      allow_multi: p.allow_multi ?? false,
      show_results: p.show_results ?? "after_vote",
      starts_at: p.starts_at ?? null,
      ends_at: p.ends_at ?? null,
      show_on_reports: p.show_on_reports ?? true,
      show_on_community: p.show_on_community ?? false,
    });
    setBusy(null);
    if (!error) onRefresh();
  }

  async function exportCsv(p: PollRow) {
    setBusy(p.id + "csv");
    const { data } = await supabase
      .from("pulse_votes")
      .select("option_index")
      .eq("poll_id", p.id);

    const counts: Record<number, number> = {};
    (data ?? []).forEach((row: any) => {
      const idx = Number(row.option_index);
      counts[idx] = (counts[idx] ?? 0) + 1;
    });

    const opts = p.options ?? [];
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const header = ["option_index", "label", "votes", "percent"];
    const body = opts.map((label, i) => {
      const v = counts[i] ?? 0;
      const pct = total ? Math.round((v / total) * 100) : 0;
      return [i, (label || "").replace(/,/g, " "), v, `${pct}%`];
    });

    const csv = [header, ...body].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(p.question || "poll").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-results.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setBusy(null);
  }

  return (
    <div className="vh-card p-0 overflow-hidden mb-10 admin-scope">
      <AdminScopedStyles />
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Polls</h2>
        <Button type="button" onClick={onRefresh} variant="secondary" className="h-8">
          <Repeat2 className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left px-6 py-3">Question / Window</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Flags</th>
              <th className="text-left px-6 py-3">Votes</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-6 py-6 text-muted-foreground" colSpan={5}>Loading…</td></tr>
            )}
            {!loading && polls.length === 0 && (
              <tr><td className="px-6 py-6 text-muted-foreground" colSpan={5}>No polls yet.</td></tr>
            )}
            {polls.map((p) => {
              const votes = voteCounts[p.id] ?? 0;
              const onReports = Boolean(p.show_on_reports);
              const onCommunity = Boolean(p.show_on_community);
              return (
                <tr key={p.id} className="border-b border-border align-top">
                  <td className="px-6 py-4">
                    <div className="font-medium">{p.question}</div>
                    <div className="text-xs opacity-70">
                      {p.starts_at ? fmt(p.starts_at) : "—"} → {p.ends_at ? fmt(p.ends_at) : "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {p.status === "closed" ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-muted text-muted-foreground">Closed</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-green-500/15 text-green-300 border border-green-500/20">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                        {onReports ? "On Reports" : "Hidden on Reports"}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                        {onCommunity ? "On Community" : "Hidden on Community"}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                        {p.allow_multi ? "Multi" : "Single"} • {p.show_results === "after_close" ? "Results: after close" : "Results: after vote"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{votes}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setEditingPoll(p)}
                        className="h-8"
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => window.open("/pulse", "_blank")} className="h-8">
                        <PieChart className="w-4 h-4 mr-1" /> Results
                      </Button>
                      {p.status === "active" ? (
                        <Button type="button" variant="secondary" onClick={() => setStatus(p.id, "closed")} disabled={busy === p.id + "closed"} className="h-8">
                          <X className="w-4 h-4 mr-1" /> Close
                        </Button>
                      ) : (
                        <Button type="button" variant="secondary" onClick={() => setStatus(p.id, "active")} disabled={busy === p.id + "active"} className="h-8">
                          <Repeat2 className="w-4 h-4 mr-1" /> Reopen
                        </Button>
                      )}
                      <Button type="button" variant="secondary" onClick={() => resetVotes(p.id)} disabled={busy === p.id + "reset"} className="h-8">
                        <RotateCcw className="w-4 h-4 mr-1" /> Reset
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => duplicate(p)} disabled={busy === p.id + "dup"} className="h-8">
                        <Copy className="w-4 h-4 mr-1" /> Duplicate
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => exportCsv(p)} disabled={busy === p.id + "csv"} className="h-8">
                        <Download className="w-4 h-4 mr-1" /> Export
                      </Button>
                      <Button
                        type="button"
                        variant={p.show_on_community ? "secondary" : "default"}
                        onClick={() => toggleFlag(p.id, "show_on_community")}
                        disabled={busy === p.id + "show_on_community"}
                        className="h-8"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        {p.show_on_community ? "Unfeature on Community" : "Feature on Community"}
                      </Button>
                      <Button
                        type="button"
                        variant={p.show_on_reports ? "secondary" : "default"}
                        onClick={() => toggleFlag(p.id, "show_on_reports")}
                        disabled={busy === p.id + "show_on_reports"}
                        className="h-8"
                      >
                        <EyeOff className="w-4 h-4 mr-1" />
                        {p.show_on_reports ? "Hide on Reports" : "Show on Reports"}
                      </Button>
                      <Button type="button" variant="destructive" onClick={() => del(p.id)} disabled={busy === p.id + "delete"} className="h-8">
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 text-xs text-muted-foreground border-t border-border">
        Poll results update live for everyone. To change structure in a big way, duplicate, then close the old one.
      </div>

      {editingPoll && (
        <AdminEditPoll
          poll={editingPoll}
          open={true}
          onClose={() => setEditingPoll(null)}
          onSaved={() => {
            setEditingPoll(null);
            onRefresh(); // already defined prop in PollsCard
          }}
        />
      )}
    </div>
  );
}

/* ───────────────────────── Reports card ───────────────────────── */
function ReportsCard() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    title: string;
    slug: string;
    subtitle: string;
    tags: string;
    access_level: "free" | "paid" | "private";
    price_cents: number;
    status: "draft" | "scheduled" | "published" | "archived";
    release_at: string;
    show_on_reports: boolean;
    file: File | null;
  }>({
    title: "",
    slug: "",
    subtitle: "",
    tags: "",
    access_level: "free",
    price_cents: 0,
    status: "draft",
    release_at: "",
    show_on_reports: true,
    file: null,
  });

  function refresh() {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pulse_reports")
        .select("*")
        .order("release_at", { ascending: false });
      if (!error && data) setRows(data as ReportRow[]);
      setLoading(false);
    })();
  }

  useEffect(() => { refresh(); }, []);

  async function uploadFileIfAny(): Promise<string | null> {
    if (!form.file) return null;
    const safe = form.file.name.replace(/[^a-z0-9.\-_]+/gi, "_").toLowerCase();
    const storagePath = `${Date.now()}_${safe}`;
    const { error } = await supabase.storage.from("reports").upload(storagePath, form.file, {
      upsert: false,
      contentType: "application/pdf",
    });
    if (error) { alert("Upload failed."); return null; }
    return storagePath;
  }

  async function createReport() {
    if (!form.title || !form.slug) { alert("Title and slug are required."); return; }
    let storage_path: string | null = null;
    if (form.file) {
      storage_path = await uploadFileIfAny();
      if (!storage_path) return;
    }
    const payload = {
      title: form.title,
      slug: form.slug,
      subtitle: form.subtitle || null,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      access_level: form.access_level,
      price_cents: Number.isFinite(form.price_cents) ? form.price_cents : 0,
      status: form.status,
      release_at: form.release_at ? new Date(form.release_at).toISOString() : null,
      storage_path,
      show_on_reports: form.show_on_reports,
    };
    const { error } = await supabase.from("pulse_reports").insert(payload);
    if (error) { alert("Could not create report."); return; }
    setForm({ title:"", slug:"", subtitle:"", tags:"", access_level:"free", price_cents:0, status:"draft", release_at:"", show_on_reports:true, file:null });
    refresh();
  }

  async function setStatus(id: string, status: ReportRow["status"]) {
    setBusyId(id + status);
    const { error } = await supabase.from("pulse_reports").update({ status }).eq("id", id);
    setBusyId(null);
    if (!error) refresh();
  }

  async function toggleVisibility(id: string, next: boolean) {
    setBusyId(id + "vis");
    const { error } = await supabase.from("pulse_reports").update({ show_on_reports: next }).eq("id", id);
    setBusyId(null);
    if (!error) refresh();
  }

  async function grantAccessToSelf(id: string) {
    setBusyId(id + "grant");
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) { alert("No user."); setBusyId(null); return; }
    const { error } = await supabase.from("pulse_report_access").insert({ report_id: id, user_id: uid, price_cents: 0 });
    setBusyId(null);
    if (error) alert("Could not grant access."); else alert("Access granted to your account.");
  }

  return (
    <div className="vh-card p-0 overflow-hidden admin-scope">
      <AdminScopedStyles />
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reports</h2>
      </div>

      {/* Create form */}
      <div className="px-6 py-4 border-b border-border grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm opacity-80">Title</label>
          <input className="vh-input" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm opacity-80">Slug</label>
          <input className="vh-input" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} />
        </div>
        <div className="md:col-span-2 grid gap-2">
          <label className="text-sm opacity-80">Subtitle</label>
          <input className="vh-input" value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm opacity-80">Tags (comma separated)</label>
          <input className="vh-input" value={form.tags} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm opacity-80">Access</label>
          <select className="vh-input" value={form.access_level} onChange={(e) => setForm(f => ({ ...f, access_level: e.target.value as any }))}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm opacity-80">Price (cents)</label>
          <input className="vh-input" type="number" value={form.price_cents} onChange={(e) => setForm(f => ({ ...f, price_cents: Number(e.target.value || 0) }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm opacity-80">Status</label>
          <select className="vh-input" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as any }))}>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm opacity-80">Release at</label>
          <input className="vh-input" type="datetime-local" value={form.release_at} onChange={(e) => setForm(f => ({ ...f, release_at: e.target.value }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm opacity-80">Show on Reports</label>
          <select className="vh-input" value={String(form.show_on_reports)} onChange={(e) => setForm(f => ({ ...f, show_on_reports: e.target.value === "true" }))}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="grid gap-2 md:col-span-2">
          <label className="text-sm opacity-80">PDF file</label>
          <input className="vh-input" type="file" accept="application/pdf" onChange={(e) => setForm(f => ({ ...f, file: e.target.files?.[0] ?? null }))} />
        </div>
        <div className="md:col-span-2">
          <Button onClick={createReport} className="h-9">
            <FilePlus2 className="w-4 h-4 mr-2" /> Create Report
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left px-6 py-3">Title</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Access</th>
              <th className="text-left px-6 py-3">Release</th>
              <th className="text-left px-6 py-3">Flags</th>
              <th className="text-left px-6 py-3">File</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="px-6 py-6" colSpan={7}>Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td className="px-6 py-6 text-muted-foreground" colSpan={7}>No reports yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border align-top">
                <td className="px-6 py-4">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs opacity-70">{r.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-muted text-muted-foreground">{r.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{r.access_level}</div>
                  {r.access_level === "paid" && <div className="text-xs opacity-70">{dollars(r.price_cents)}</div>}
                </td>
                <td className="px-6 py-4">{fmt(r.release_at)}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                    {r.show_on_reports ? "Shown on Reports" : "Hidden on Reports"}
                  </span>
                </td>
                <td className="px-6 py-4">{r.storage_path ? <span className="text-xs opacity-80">Uploaded</span> : <span className="text-xs opacity-60">No file</span>}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {r.status !== "published" && (
                      <Button type="button" variant="secondary" onClick={() => setStatus(r.id, "published")} disabled={busyId === r.id + "published"} className="h-8">
                        <Check className="w-4 h-4 mr-1" /> Publish
                      </Button>
                    )}
                    {r.status === "published" && (
                      <Button type="button" variant="secondary" onClick={() => setStatus(r.id, "archived")} disabled={busyId === r.id + "archived"} className="h-8">
                        <Archive className="w-4 h-4 mr-1" /> Archive
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant={r.show_on_reports ? "secondary" : "default"}
                      onClick={() => toggleVisibility(r.id, !(r.show_on_reports ?? false))}
                      disabled={busyId === r.id + "vis"}
                      className="h-8"
                    >
                      <Eye className="w-4 h-4 mr-1" /> {r.show_on_reports ? "Hide on Reports" : "Show on Reports"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => grantAccessToSelf(r.id)}
                      disabled={busyId === r.id + "grant"}
                      className="h-8"
                    >
                      <Key className="w-4 h-4 mr-1" /> Grant access to me
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────────── Page ───────────────────────── */
export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pollRefresh, setPollRefresh] = useState(0);

  useEffect(() => {
    let off = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id || null;
      if (!uid) { if (!off) setIsAdmin(false); return; }
      const { data, error } = await supabase.rpc("is_admin", { uid });
      if (!off) setIsAdmin(Boolean(data) && !error);
    })();
    return () => { off = true; };
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header onCreatePost={() => {}} />
        <div className="community-grid">
          <div className="grid-left hidden xl:block border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] overflow-y-auto">
            <div className="p-4"><LeftSidebar currentTab="all" onTabChange={() => {}} /></div>
          </div>
          <div className="grid-main">
            <div className="px-4 lg:px-8 py-16 max-w-3xl mx-auto text-center text-muted-foreground">
              <h1 className="text-3xl font-bold mb-2">Admin only</h1>
              <p>You must be an administrator to view this page.</p>
            </div>
          </div>
          <div className="grid-right hidden lg:block border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] overflow-y-auto">
            <div className="p-4"><RightSidebar /></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onCreatePost={() => {}} />
      <div className="community-grid">
        <div className="grid-left hidden xl:block border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] overflow-y-auto">
          <div className="p-4"><LeftSidebar currentTab="all" onTabChange={() => {}} /></div>
        </div>

        <div className="grid-main">
          <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <div className="flex items-center gap-2">
                <AdminNewPollModal onCreated={() => setPollRefresh(k => k + 1)} />
              </div>
            </div>

            <PollsCard
              onRefresh={() => setPollRefresh(k => k + 1)}
              refreshKeyExternal={pollRefresh}
            />

            <ReportsCard />
          </div>
        </div>

        <div className="grid-right hidden lg:block border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] overflow-y-auto">
          <div className="p-4"><RightSidebar /></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
