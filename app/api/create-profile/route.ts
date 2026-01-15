import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  await supabaseAdmin.from("profiles").upsert({
    id: user.id,
    username: user.email,
    is_admin: false,
    updated_at: new Date().toISOString(),
  });

  return NextResponse.redirect(new URL("/my-foods", request.url));
}
