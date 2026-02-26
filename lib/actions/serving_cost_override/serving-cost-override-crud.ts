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

  // perform each db operation and wait for all to complete before returning
  const ops = servings.map(async (s) => {
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
      if (error) throw new Error(error.message);
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
      if (error) throw new Error(error.message);
    }
    // Add cost override if doesn't exist and new value is a number
    else if (!data && formValue) {
      const { error } = await supabase.from("serving_cost_overrides").insert({
        user_id: user?.id,
        serving_id: s.id,
        cost: formData.get(s.id),
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
    }
  });

  try {
    await Promise.all(ops);
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
    };
  }

  return {
    success: true,
    message: new Date().toISOString(),
  };
}
