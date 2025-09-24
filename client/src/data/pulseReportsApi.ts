// client/src/data/pulseReportsApi.ts
import { supabase } from "@/lib/supabaseClient";

/** Database row shape for reports (matches your pulse_reports table) */
export type ReportRow = {
  id: string;
  slug: string | null;
  title: string;
  subtitle: string | null;
  tags: string[] | null;
  access_level: "free" | "paid" | "private";
  price_cents: number | null;
  status: "draft" | "scheduled" | "published" | "archived";
  release_at: string | null;       // ISO
  storage_path: string | null;
  show_on_reports: boolean | null;
  created_at: string | null;
};

/**
 * List reports that should appear on the Pulse page.
 * - show_on_reports = true
 * - status in ('published','scheduled') so you can tease scheduled ones
 * - Most recent first
 */
export async function listVisibleReports(): Promise<ReportRow[]> {
  const { data, error } = await supabase
    .from("pulse_reports")
    .select(
      "id, slug, title, subtitle, tags, access_level, price_cents, status, release_at, storage_path, show_on_reports, created_at"
    )
    .in("status", ["published", "scheduled"])
    .eq("show_on_reports", true)
    .order("release_at", { ascending: false });

  if (error) {
    console.error("listVisibleReports:", error.message);
    return [];
  }
  return (data ?? []) as ReportRow[];
}

/**
 * Return a short-lived signed URL for a file in the `reports` bucket.
 * Caller is responsible for access checks *before* calling this.
 */
export async function getSignedDownloadUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("reports")
    .createSignedUrl(storagePath, 60 * 60); // 1 hour

  if (error) {
    console.error("getSignedDownloadUrl:", error.message);
    return null;
  }
  return data?.signedUrl ?? null;
}

/**
 * True if:
 *  - user is admin, OR
 *  - report.access_level = 'free', OR
 *  - pulse_report_access has a row for (report_id, user_id), OR
 *  - pulse_report_purchases has a completed purchase for (report_id, user_id)
 */
export async function hasAccess(reportId: string): Promise<boolean> {
  // Get session
  const { data: sessionRes } = await supabase.auth.getSession();
  const uid = sessionRes?.session?.user?.id ?? null;

  // If no user, only allow access when report is free
  // (We still need to read the report access level.)
  const { data: r, error: rErr } = await supabase
    .from("pulse_reports")
    .select("access_level")
    .eq("id", reportId)
    .maybeSingle();

  if (rErr || !r) {
    console.error("hasAccess: report lookup failed", rErr?.message);
    return false;
  }

  // Free reports are downloadable by anyone
  if (r.access_level === "free") return true;

  // If not logged in, not allowed for paid/private
  if (!uid) return false;

  // Admins always allowed
  try {
    const { data: isAdmin, error: adminErr } = await supabase.rpc("is_admin", { uid });
    if (!adminErr && Boolean(isAdmin)) return true;
  } catch (e) {
    // non-fatal
  }

  // Check explicit access grant
  const { data: acc, error: accErr } = await supabase
    .from("pulse_report_access")
    .select("id")
    .eq("report_id", reportId)
    .eq("user_id", uid)
    .maybeSingle();

  if (accErr) {
    console.error("hasAccess: access check failed", accErr.message);
    return false;
  }

  if (acc) return true;

  // Check if user has purchased this report
  const { data: purchase, error: purchaseErr } = await supabase
    .from("pulse_report_purchases")
    .select("id")
    .eq("report_id", reportId)
    .eq("user_id", uid)
    .eq("status", "completed")
    .maybeSingle();

  if (purchaseErr) {
    console.error("hasAccess: purchase check failed", purchaseErr.message);
    return false;
  }

  return Boolean(purchase);
}

/**
 * Check if user has purchased a specific report
 */
export async function hasPurchased(reportId: string): Promise<boolean> {
  const { data: sessionRes } = await supabase.auth.getSession();
  const uid = sessionRes?.session?.user?.id ?? null;

  if (!uid) return false;

  const { data: purchase, error } = await supabase
    .from("pulse_report_purchases")
    .select("id")
    .eq("report_id", reportId)
    .eq("user_id", uid)
    .eq("status", "completed")
    .maybeSingle();

  if (error) {
    console.error("hasPurchased: check failed", error.message);
    return false;
  }

  return Boolean(purchase);
}
