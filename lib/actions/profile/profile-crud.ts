"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { spProfile } from "@/lib/supabase/database-types";
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
  const { data: existingProfile } = await supabaseAdmin
    .from("profiles")
    .select()
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) return existingProfile as spProfile;

  const { data: newProfile } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: user.id,
      username: user.email,
      is_admin: false,
      updated_at: new Date().toISOString(),
    })
    .select()
    .limit(1)
    .single();

  return newProfile as spProfile;
}
