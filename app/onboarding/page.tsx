import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  await supabaseAdmin.from("profiles").upsert({
    id: user.id,
    username: user.email,
    is_admin: false,
    updated_at: new Date().toISOString(),
  });

  redirect("/my-foods");
}
