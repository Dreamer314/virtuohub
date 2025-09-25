/* FULL UPDATED FILE CONTENT — admin.tsx */
import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import {
  Repeat2, Pencil, PieChart, X, RotateCcw, Copy, Download, Trash2, Star, EyeOff,
  FilePlus2, Check, Archive, Eye, Key
} from "lucide-react";
import AdminNewPoll from "@/components/polls/AdminNewPoll";

/* ------------------------------- Types ----------------------------------- */

type PollRow = {
  id: string;
  question: string;
  options: string[] | null;
  status: "active" | "closed";
  show_on_community: boolean | null;
  show_on_reports: boolean | null;
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

/* ----------------------------- Helpers ----------------------------------- */

function fmt(dt: string | null | undefined) {
  if (!dt) return "-";
  const d = new Date(dt);
  return d.toLocaleString();
}
function dollars(cents: number | null | undefined) {
  const v = (cents ?? 0) / 100;
  return `$${v.toFixed(2)}`;
}

/* =============================== Page ==================================== */

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pollRefresh, setPollRefresh] = useState(0); // <-- define before use

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const uid = session?.user?.id || null;
        if (!uid) { 
          if (!off) setIsAdmin(false); 
          return; 
        }

        // Use the working API endpoint instead of Supabase RPC
        const response = await fetch('/api/users/check-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: uid })
        });
        
        if (response.ok) {
          const result = await response.json();
          if (!off) setIsAdmin(Boolean(result.isAdmin));
        } else {
          // Fallback: simple admin check for development
          const user = session?.user;
          const adminEmails = ['admin@virtuohub.com', 'admin@test.com'];
          const isDevAdmin = adminEmails.includes(user?.email || '') || uid === 'admin-user-id';
          if (!off) setIsAdmin(isDevAdmin);
          console.log('Admin check fallback:', { isDevAdmin, email: user?.email });
        }
      } catch (error) {
        console.error('Admin check failed:', error);
        if (!off) setIsAdmin(false);
      }
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
                <AdminNewPoll onCreated={() => setPollRefresh(k => k + 1)} />
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

/* ============================ Polls section =============================== */

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

  useEffect(() => {
    let off = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pulse_polls")
        .select("id, question, options, status, show_on_reports, show_on_community, created_at")
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
      return [i, label.replace(/,/g, " "), v, `${pct}%`];
    });

    const csv = [header, ...body].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.question.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-results.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setBusy(null);
  }

  return (
    <div className="vh-card p-0 overflow-hidden mb-10">
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
              <th className="text-left px-6 py-3">Question</th>
              <th className="text-left px-6 py-3">Window</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Flags</th>
              <th className="text-left px-6 py-3">Votes</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-6 py-6 text-muted-foreground" colSpan={6}>Loading…</td></tr>
            )}
            {!loading && polls.length === 0 && (
              <tr><td className="px-6 py-6 text-muted-foreground" colSpan={6}>No polls yet.</td></tr>
            )}
            {polls.map((p) => {
              const votes = voteCounts[p.id] ?? 0;
              const onReports = Boolean(p.show_on_reports);
              const onCommunity = Boolean(p.show_on_community);
              return (
                <tr key={p.id} className="border-b border-border align-top">
                  <td className="px-6 py-4"><div className="font-medium">{p.question}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">-</td>
                  <td className="px-6 py-4">
                    {p.status === "closed" ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-muted text-muted-foreground">Closed</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-green-500/15 text-green-300 border border-green-500/20">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                        {onReports ? "On Reports" : "Hidden on Reports"}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                        {onCommunity ? "On Community" : "Hidden on Community"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{votes}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="secondary" disabled className="h-8">
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
    </div>
  );
}

/* =========================== Reports section ============================== */

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

  /* --------- NEW: edit modal state --------- */
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    slug: "",
    subtitle: "",
    tags: "",
    access_level: "free" as "free"|"paid"|"private",
    price_cents: 0,
    status: "draft" as "draft"|"scheduled"|"published"|"archived",
    release_at: "",
    show_on_reports: true,
    file: null as File | null,
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

  /* --------- NEW: edit helpers --------- */
  function openEdit(r: ReportRow) {
    setEditId(r.id);
    setEditForm({
      title: r.title || "",
      slug: r.slug || "",
      subtitle: r.subtitle || "",
      tags: (r.tags || []).join(", "),
      access_level: r.access_level || "free",
      price_cents: r.price_cents || 0,
      status: r.status || "draft",
      release_at: r.release_at ? new Date(r.release_at).toISOString().slice(0,16) : "",
      show_on_reports: !!r.show_on_reports,
      file: null,
    });
    setEditOpen(true);
  }

  async function uploadEditFileIfAny(): Promise<string | null> {
    if (!editForm.file) return null;
    const safe = editForm.file.name.replace(/[^a-z0-9.\-_]+/gi, "_").toLowerCase();
    const storagePath = `${Date.now()}_${safe}`;
    const { error } = await supabase.storage.from("reports").upload(storagePath, editForm.file, {
      upsert: true,
      contentType: "application/pdf",
    });
    if (error) { alert("Upload failed."); return null; }
    return storagePath;
  }

  async function saveEdit() {
    if (!editId) { setEditOpen(false); return; }
    let storage_path: string | undefined = undefined;
    if (editForm.file) {
      const uploaded = await uploadEditFileIfAny();
      if (!uploaded) return;
      storage_path = uploaded;
    }
    const payload: any = {
      title: editForm.title,
      slug: editForm.slug,
      subtitle: editForm.subtitle || null,
      tags: editForm.tags ? editForm.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      access_level: editForm.access_level,
      price_cents: Number.isFinite(editForm.price_cents) ? editForm.price_cents : 0,
      status: editForm.status,
      release_at: editForm.release_at ? new Date(editForm.release_at).toISOString() : null,
      show_on_reports: editForm.show_on_reports,
    };
    if (typeof storage_path === 'string') payload.storage_path = storage_path;
    const { error } = await supabase.from("pulse_reports").update(payload).eq("id", editId);
    if (error) { alert(`Could not update report.\n\n${error.message||error}`); return; }
    setEditOpen(false);
    setEditId(null);
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
    const { error } = await supabase
      .from("pulse_report_access")
      .upsert({ report_id: id, user_id: uid, price_cents: 0 }, { onConflict: 'report_id,user_id' });
    setBusyId(null);
    if (error) alert(`Could not grant access.\n\n${error.message||error}`); else alert("Access granted to your account.");
  }

  /* NEW: full delete */
  async function deleteReport(row: ReportRow) {
    if (!confirm("Delete this report and its uploaded file (if any)? This cannot be undone.")) return;
    setBusyId(row.id + "delete");
    try {
      if (row.storage_path) {
        await supabase.storage.from("reports").remove([row.storage_path]);
      }
      await supabase.from("pulse_reports").delete().eq("id", row.id);
      setBusyId(null);
      refresh();
    } catch (e:any) {
      setBusyId(null);
      alert("Could not delete report.");
    }
  }

  return (
    <div className="vh-card p-0 overflow-hidden">
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
                    {/* NEW: Edit + Delete */}
                    <Button type="button" variant="secondary" onClick={() => openEdit(r)} className="h-8"><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
                    <Button type="button" variant="destructive" onClick={() => deleteReport(r)} disabled={busyId === r.id + "delete"} className="h-8"><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>

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

      {/* NEW: Edit modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card text-card-foreground rounded-xl shadow-xl w-full max-w-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Edit report</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm opacity-80">Title</label>
                <input className="vh-input" value={editForm.title} onChange={(e)=>setEditForm(f=>({...f,title:e.target.value}))} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm opacity-80">Slug</label>
                <input className="vh-input" value={editForm.slug} onChange={(e)=>setEditForm(f=>({...f,slug:e.target.value}))} />
              </div>
              <div className="md:col-span-2 grid gap-2">
                <label className="text-sm opacity-80">Subtitle</label>
                <input className="vh-input" value={editForm.subtitle} onChange={(e)=>setEditForm(f=>({...f,subtitle:e.target.value}))} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm opacity-80">Tags (comma separated)</label>
                <input className="vh-input" value={editForm.tags} onChange={(e)=>setEditForm(f=>({...f,tags:e.target.value}))} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm opacity-80">Access</label>
                <select className="vh-input" value={editForm.access_level} onChange={(e)=>setEditForm(f=>({...f,access_level:e.target.value as any}))}>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm opacity-80">Price (cents)</label>
                <input className="vh-input" type="number" value={editForm.price_cents} onChange={(e)=>setEditForm(f=>({...f,price_cents:Number(e.target.value||0)}))} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm opacity-80">Status</label>
                <select className="vh-input" value={editForm.status} onChange={(e)=>setEditForm(f=>({...f,status:e.target.value as any}))}>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm opacity-80">Release at</label>
                <input className="vh-input" type="datetime-local" value={editForm.release_at} onChange={(e)=>setEditForm(f=>({...f,release_at:e.target.value}))} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm opacity-80">Show on Reports</label>
                <select className="vh-input" value={String(editForm.show_on_reports)} onChange={(e)=>setEditForm(f=>({...f,show_on_reports:e.target.value==="true"}))}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="md:col-span-2 grid gap-2">
                <label className="text-sm opacity-80">Replace PDF (optional)</label>
                <input className="vh-input" type="file" accept="application/pdf" onChange={(e)=>setEditForm(f=>({...f,file:e.target.files?.[0]??null}))} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={()=>{setEditOpen(false); setEditId(null);}}>Cancel</Button>
              <Button onClick={saveEdit}><Check className="w-4 h-4 mr-2"/> Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
