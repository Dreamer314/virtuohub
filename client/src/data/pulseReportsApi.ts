// client/src/data/pulseReportsApi.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AccessLevel = "free" | "paid" | "private";
export type ReportStatus = "draft" | "scheduled" | "published" | "archived";

export type ReportRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  tags: string[] | null;
  access_level: AccessLevel;
  price_cents: number | null;
  status: ReportStatus;
  release_at: string | null;
  storage_path: string | null;
  cover_image_url: string | null;
  show_on_reports: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// Published + Scheduled, visible
export async function listVisibleReports(): Promise<ReportRow[]> {
  const { data, error } = await supabase
    .from("pulse_reports")
    .select("*")
    .in("status", ["published", "scheduled"])
    .eq("show_on_reports", true)
    .order("release_at", { ascending: false });

  if (error || !data) return [];
  return data as ReportRow[];
}

// True if current user has access to a paid/private report
export async function hasAccess(reportId: string): Promise<boolean> {
  const uid = await currentUserId();
  if (!uid) return false;
  const { data, error } = await supabase
    .from("pulse_report_access")
    .select("report_id")
    .eq("report_id", reportId)
    .eq("user_id", uid)
    .limit(1);
  if (error) return false;
  return !!(data && data.length);
}

// For private reports: create a request row
export async function requestAccess(reportId: string, email: string, message: string) {
  const uid = await currentUserId();
  const { error } = await supabase.from("pulse_report_requests").insert({
    report_id: reportId,
    user_id: uid,
    email,
    message,
  });
  return { ok: !error, error };
}

// Get a short-lived link to download the PDF
export async function getSignedDownloadUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase
    .storage
    .from("reports")
    .createSignedUrl(storagePath, 60); // 60 seconds
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/* ------------------ Admin helpers (optional) ------------------ */

export async function adminUploadPdf(file: File): Promise<string | null> {
  const safeName = file.name.replace(/[^a-z0-9.\-_]+/gi, "_").toLowerCase();
  const storagePath = `${Date.now()}_${safeName}`;
  const { error } = await supabase.storage.from("reports").upload(storagePath, file, {
    upsert: false,
    contentType: "application/pdf",
  });
  if (error) return null;
  return storagePath;
}
