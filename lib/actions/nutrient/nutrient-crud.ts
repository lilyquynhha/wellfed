import { spNutrient, spTrackedNutrient } from "@/lib/supabase/database-types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchNutrients(supabase: SupabaseClient) {
  const { data } = await supabase.from("nutrients").select();

  return (data as spNutrient[]).sort(
    (a, b) => a.display_order - b.display_order,
  );
}

export async function fetchTrackedNutrients(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("tracked_nutrients")
    .select()
    .eq("user_id", user?.id);

  return data as spTrackedNutrient[];
}

export async function insertTrackedNutrients(
  supabase: SupabaseClient,
  nutrients: spNutrient[],
  formData: FormData,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("tracked_nutrients").delete().eq("user_id", user?.id);

  const minNutrients = ["calories", "carbs", "protein", "fat"];

  const { data } = await supabase
    .from("tracked_nutrients")
    .insert(
      nutrients
        .filter(
          (n) =>
            minNutrients.includes(n.serving_name) ||
            formData.get(`${n.id}`) == "on",
        )
        .map((n) => ({
          user_id: user?.id,
          nutrient_id: n.id,
        })),
    )
    .select();

  return data as spTrackedNutrient[];
}
