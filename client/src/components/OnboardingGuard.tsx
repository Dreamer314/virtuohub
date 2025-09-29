import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = { children: React.ReactNode };

/**
 * Minimal, safe guard.
 * - Anonymous visitors can browse and are kept off /onboarding.
 * - Logged-in users without onboarding_complete go to /onboarding.
 * - Logged-in users who completed onboarding can browse anywhere.
 */
export default function OnboardingGuard({ children }: Props) {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      // 1) Check auth
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthed = !!session?.user?.id;
      const path = window.location.pathname;

      // 2) Anonymous users: never force onboarding
      if (!isAuthed) {
        if (path === "/onboarding") {
          // If they typed /onboarding directly, move them to home
          window.history.replaceState(null, "", "/");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
        return; // done
      }

      // 3) Logged-in: fetch profile to see onboarding status
      const res = await fetch("/api/profile", {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${session!.access_token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (res.status === 404) {
        // no profile row yet -> treat as not onboarded
        if (path !== "/onboarding") {
          window.history.replaceState(null, "", "/onboarding");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
        return;
      }

      if (!res.ok) {
        // Only logged-in users can be sent to onboarding on error
        if (path !== "/onboarding") {
          window.history.replaceState(null, "", "/onboarding");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
        return;
      }

      const profile = await res.json();
      const completed =
        profile?.onboarding_complete ?? profile?.onboardingComplete ?? false;

      // If they finished onboarding, keep them off the onboarding page
      if (path === "/onboarding" && completed) {
        window.history.replaceState(null, "", "/community");
        window.dispatchEvent(new PopStateEvent("popstate"));
        return;
      }

      // If they have not finished onboarding, send them there
      if (path !== "/onboarding" && !completed) {
        window.history.replaceState(null, "", "/onboarding");
        window.dispatchEvent(new PopStateEvent("popstate"));
        return;
      }
    };

    run().catch(() => {
      // Fail safe: only logged-in users could ever be redirected here
      // Anonymous users are never redirected
    });
  }, []);

  return <>{children}</>;
}
