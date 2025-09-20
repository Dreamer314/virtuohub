// client/src/pages/pulse.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Zap, Download, CreditCard, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Footer } from "@/components/layout/footer";

// Polls (unchanged)
import PollList from "@/components/polls/PollList";
import AdminNewPoll from "@/components/polls/AdminNewPoll";
import { supabase } from "@/lib/supabaseClient";

// Reports (Supabase)
import {
  listVisibleReports,
  getSignedDownloadUrl,
  hasAccess,
  requestAccess,
  type ReportRow,
} from "@/data/pulseReportsApi";

function daysDiffFromNow(iso: string | null) {
  if (!iso) return 0;
  const ts = new Date(iso).getTime();
  const delta = Math.floor((Date.now() - ts) / 86400000);
  return delta;
}

const PulsePage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); }, []);

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

  useEffect(() => {
    let off = false;
    (async () => {
      setLoadingReports(true);
      const rows = await listVisibleReports();
      if (!off) {
        setReports(rows);
        setLoadingReports(false);
      }
    })();
    return () => { off = true; };
  }, [refreshTick]);

  function handleCreated() {
    setRefreshTick(t => t + 1);
  }

  async function handleDownload(r: ReportRow) {
    if (!r.storage_path) return alert("This report does not have a file yet.");
    // For paid/private, confirm access. For free we allow direct.
    if (r.access_level !== "free") {
      const allowed = await hasAccess(r.id);
      if (!allowed) {
        alert("You do not have access to this report yet.");
        return;
      }
    }
    const url = await getSignedDownloadUrl(r.storage_path);
    if (!url) return alert("Could not create a download link.");
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handlePurchase(r: ReportRow) {
    // MVP: manual. Later you can wire Stripe and grant access on webhook.
    alert(`Purchase flow goes here for “${r.title}”. Current price: $${((r.price_cents ?? 0) / 100).toFixed(2)}.`);
  }

  async function handleRequest(r: ReportRow) {
    const email = prompt("Enter your email for access:");
    if (!email) return;
    const message = prompt("Optional message to the team:") || "";
    const res = await requestAccess(r.id, email, message);
    if (res.ok) alert("Request submitted. You will be notified if approved.");
    else alert("Could not submit your request right now.");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onCreatePost={() => {}} />

      <div className="community-grid">
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar currentTab="all" onTabChange={() => {}} />
          </div>
        </div>

        <div className="grid-right hidden lg:block bg-background/95 backdrop-blur-sm border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <RightSidebar />
          </div>
        </div>

        <div className="grid-main relative z-0">
          <div className="py-8 relative z-10 px-4 lg:px-8">
            <div className="w-full">
              <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
                <div className="xl:hidden">
                  <LeftSidebar currentTab="all" onTabChange={() => {}} />
                </div>

                <main>
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                        <div className="flex items-center space-x-4">
                          <Zap className="w-8 h-8 text-transparent bg-gradient-cosmic bg-clip-text" style={{ backgroundImage: "var(--gradient-cosmic)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} />
                          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Pulse Reports</h1>
                        </div>
                        <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                      </div>
                    </div>
                    <p className="text-center text-lg text-muted-foreground mb-8">
                      Industry data collection center and poll results
                    </p>

                    <div className="flex justify-end">
                      {isAdmin && <AdminNewPoll onCreated={handleCreated} />}
                    </div>
                  </div>

                  {/* Always visible headings */}
                  <section className="mb-12" key={refreshTick}>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Active Polls</h2>
                    <PollList reportsOnly />
                    <h2 className="text-2xl font-bold text-foreground mt-12">Closed Polls</h2>
                  </section>

                  {/* Published Reports */}
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
                      Published Reports
                    </h2>

                    {loadingReports ? (
                      <div className="vh-card p-6 text-muted-foreground">Loading reports…</div>
                    ) : reports.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No reports published yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {reports.map((r) => {
                          const diff = daysDiffFromNow(r.release_at);
                          const available = r.status === "published" && diff >= 0;

                          return (
                            <article key={r.id} className="vh-card" data-testid={`report-card-${r.id}`}>
                              <div className="flex items-center justify-between mb-4">
                                {r.access_level === "free" && (
                                  <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">FREE</span>
                                )}
                                {r.access_level === "paid" && (
                                  <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full">
                                    ${((r.price_cents ?? 0) / 100).toFixed(0)}
                                  </span>
                                )}
                                {r.access_level === "private" && (
                                  <span className="inline-block px-3 py-1 text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded-full">PRIVATE</span>
                                )}
                                <span className="text-sm text-muted-foreground">
                                  {r.release_at
                                    ? diff >= 0
                                      ? `${diff} days ago`
                                      : `Available in ${Math.abs(diff)} days`
                                    : "No date"}
                                </span>
                              </div>

                              <h3 className="text-lg font-semibold text-foreground mb-3">{r.title}</h3>
                              {r.subtitle && <p className="text-sm text-muted-foreground mb-4">{r.subtitle}</p>}

                              {r.tags?.length ? (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {r.tags.map((badge, idx) => (
                                    <span key={idx} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                                      {badge}
                                    </span>
                                  ))}
                                </div>
                              ) : null}

                              {/* CTA logic */}
                              {r.status === "scheduled" && diff < 0 && (
                                <Button
                                  disabled
                                  className="w-full bg-muted text-muted-foreground cursor-not-allowed"
                                >
                                  Available in {Math.abs(diff)} days
                                </Button>
                              )}

                              {r.status === "published" && r.access_level === "free" && (
                                <Button
                                  onClick={() => handleDownload(r)}
                                  className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 hover:border-green-500 text-green-300 transition-colors"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download PDF
                                </Button>
                              )}

                              {r.status === "published" && r.access_level === "paid" && (
                                <Button
                                  onClick={() => handlePurchase(r)}
                                  className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 hover:border-yellow-500 text-yellow-300 transition-colors"
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Purchase
                                </Button>
                              )}

                              {r.status === "published" && r.access_level === "private" && (
                                <Button
                                  onClick={() => handleRequest(r)}
                                  className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 text-red-300 transition-colors"
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Request Access
                                </Button>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PulsePage;
