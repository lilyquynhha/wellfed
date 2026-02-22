import { spServing } from "@/lib/supabase/database-types";
import { SupabaseClient } from "@supabase/supabase-js";

export type State = {
  success: boolean;
  message?: string;
};

export async function insertServingCostOverride(
  supabase: SupabaseClient,
  servings: spServing[],
  prevState: State,
  formData: FormData,
): Promise<State> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  servings.map(async (s) => {
    const formValue = formData.get(s.id);

    const { data } = await supabase
      .from("serving_cost_overrides")
      .select()
      .eq("serving_id", s.id)
      .maybeSingle();

    // Delete cost override if exists and new value is null
    if (data && !formValue) {
      const { error } = await supabase
        .from("serving_cost_overrides")
        .delete()
        .eq("serving_id", s.id);
      if (error)
        return {
          success: false,
          message: error.message,
        };
    }
    // Update cost override if exists and new value is a number
    else if (data && formValue) {
      const { error } = await supabase
        .from("serving_cost_overrides")
        .update({
          cost: formData.get(s.id),
          updated_at: new Date().toISOString(),
        })
        .eq("serving_id", s.id);
      if (error)
        return {
          success: false,
          message: error.message,
        };
    }
    // Add cost override if doesn't exist and new value is a number
    else if (!data && formValue) {
      const { error } = await supabase.from("serving_cost_overrides").insert({
        user_id: user?.id,
        serving_id: s.id,
        cost: formData.get(s.id),
        updated_at: new Date().toISOString(),
      });
      if (error)
        return {
          success: false,
          message: error.message,
        };
    }
  });

  return {
    success: true,
  };
}
