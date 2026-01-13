import { SupabaseClient } from "@supabase/supabase-js";

export const ADMIN_EMAIL = "admin@test.com";
export const ADMIN_ID = "dae39842-2e20-4161-8d66-f1e060372314";
export const USER1_EMAIL = "user1@test.com";
export const USER1_ID = "d86c28aa-8ccf-46a0-bff5-859fca43ae65";
export const USER2_EMAIL = "user2@test.com";
export const USER2_ID = "b47952fd-4494-469a-8a47-1eb5e7bac76a";

export async function signIn(client: SupabaseClient, email: string) {
  const { error } = await client.auth.signInWithPassword({
    email,
    password: "abc123",
  });

  if (error) throw error;
  return client;
}
