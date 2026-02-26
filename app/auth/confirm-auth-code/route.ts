import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/my-foods/all";

  if (!code) {
    redirect("/auth/error?error=Missing code");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirect(`/auth/error?error=${error.message}`);
  }

  redirect(next);
}
