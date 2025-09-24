// client/src/pages/pulse.tsx
import React, { useEffect, useState } from "react";
import { Zap, Download, CreditCard, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Footer } from "@/components/layout/footer";

// Polls (keep exactly as in your app)
import PollList from "@/components/polls/PollList";
import AdminNewPoll from "@/components/polls/AdminNewPoll";
import { supabase } from "@/lib/supabaseClient";

// Reports API (the file above)
import {
  listVisibleReports,
  getSignedDownloadUrl,
  hasAccess,
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

  // Admin check (uses your is_admin RPC)
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

  // Load reports
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

  // Called after a new poll is created from AdminNewPoll
  function handleCreated() {
    setRefreshTick(t => t + 1);
  }

  // Download logic for free/authorized users
  async function handleDownload(r: ReportRow) {
    if (!r.storage_path) return alert("This report does not have a file yet.");
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

  // Placeholder purchase flow (kept intentionally so nothing breaks)
  function handlePurchase(r: ReportRow) {
    alert(`Purchase flow goes here for “${r.title}”. Current price: $${((r.price_cents ?? 0) / 100).toFixed(2)}.`);
  }

  // Placeholder request access (private)
  function handleRequest(_r: ReportRow) {
    alert("Request access flow coming soon.");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onCreatePost={() => {}} />

      <div className="community-grid">
        {/* Left rail */}
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar currentTab="all" onTabChange={() => {}} />
          </div>
        </div>

        {/* Right rail */}
        <div className="grid-right hidden lg:block bg-background/95 backdrop-blur-sm border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <RightSidebar />
          </div>
        </div>

        {/* Main */}
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
                          <Zap
                            className="w-8 h-8 text-transparent bg-gradient-cosmic bg-clip-text"
                            style={{ backgroundImage: "var(--gradient-cosmic)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                          />
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

                  {/* Polls */}
                  <section className="mb-12" key={refreshTick}>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Active Polls</h2>
                    <PollList reportsOnly />
                    <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Closed Polls</h2>
                    <div className="vh-card p-4 text-sm text-muted-foreground">No closed polls to show.</div>
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
                          const isPublished = r.status === "published";
                          const available = isPublished && diff >= 0;

                          return (
                            <article key={r.id} className="vh-card" data-testid={`report-card-${r.id}`}>
                              <div className="flex items-center justify-between mb-4">
                                {r.access_level === "free" && (
                                  <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full vh-pill vh-pill--success">
                                    FREE
                                  </span>
                                )}
                                {r.access_level === "paid" && (
                                  <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full vh-pill vh-pill--price">
                                    ${((r.price_cents ?? 0) / 100).toFixed(0)}
                                  </span>
                                )}
                                {r.access_level === "private" && (
                                  <span className="inline-block px-3 py-1 text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded-full vh-pill vh-pill--info">
                                    PRIVATE
                                  </span>
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
                                    <span key={idx} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full vh-pill vh-pill--info">
                                      {badge}
                                    </span>
                                  ))}
                                </div>
                              ) : null}

                              {/* CTA logic */}
                              {!available && r.status === "scheduled" && (
                                <Button
                                  disabled
                                  className="w-full bg-muted text-muted-foreground cursor-not-allowed"
                                >
                                  Available in {Math.abs(diff)} days
                                </Button>
                              )}

                              {available && r.access_level === "free" && (
                                <Button
                                  onClick={() => handleDownload(r)}
                                  className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 hover:border-green-500 text-green-300 transition-colors"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download PDF
                                </Button>
                              )}

                              {available && r.access_level === "paid" && (
                                <Button
                                  onClick={() => handlePurchase(r)}
                                  className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 hover:border-yellow-500 text-yellow-300 transition-colors"
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Purchase
                                </Button>
                              )}

                              {available && r.access_level === "private" && (
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
