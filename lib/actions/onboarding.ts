import { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { spNutrient } from "../supabase/database-types";
import { insertTrackedNutrients } from "./nutrient/nutrient-crud";

export type State = {
  success: boolean;
  message: string;
};

export async function insertOnboardingInfo(
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

  await insertTrackedNutrients(supabase, user as User, nutrients, formData);

  redirect("/my-foods/all");
}
