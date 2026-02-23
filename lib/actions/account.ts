import { SupabaseClient } from "@supabase/supabase-js";
import { spNutrient, spTrackedNutrient } from "../supabase/database-types";
import { insertTrackedNutrients } from "./nutrient/nutrient-crud";

export type State = {
  insertedData: spTrackedNutrient[];
  message: string;
};

export async function updateAccount(
  nutrients: spNutrient[],
  supabase: SupabaseClient,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const username = formData.get("username") as string;

  await supabase
    .from("profiles")
    .update({ username: username })
    .eq("id", user?.id);

  const insertedData = await insertTrackedNutrients(
    supabase,
    nutrients,
    formData,
  );

  return {
    insertedData: insertedData,
    message: new Date().toISOString(),
  };
}
