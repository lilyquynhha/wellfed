import { adminClient } from "./supabase-clients";

export async function resetTables() {
  const { data, error } = await adminClient.rpc("truncate_test_tables");
  if (error) {
    throw error;
  }
  return data;
}
