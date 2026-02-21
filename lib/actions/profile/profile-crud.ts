"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { User } from "@supabase/supabase-js";

export async function isUsernameUnique(user: User, username: string) {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select()
    .eq("username", username)
    .neq("id", user.id)
    .maybeSingle();

  if (data) return false;
  return true;
}

export async function insertProfile(user: User) {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select()
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    await supabaseAdmin.from("profiles").insert({
      id: user.id,
      username: user.email,
      is_admin: false,
      updated_at: new Date().toISOString(),
    });
  }
}
