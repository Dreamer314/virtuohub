import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type Provider = "google" | "discord" | "facebook";

// Use the configured site URL. Fall back to the current origin if missing.
const redirectBase = import.meta.env.VITE_SITE_URL || window.location.origin;

async function signInWith(provider: Provider) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${redirectBase}/` },
  });
  if (error) alert(error.message);
}

export default function OAuthButtons() {
  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" className="w-full" onClick={() => signInWith("google")}>
        Continue with Google
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => signInWith("discord")}>
        Continue with Discord
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => signInWith("facebook")}>
        Continue with Facebook
      </Button>
    </div>
  );
}
