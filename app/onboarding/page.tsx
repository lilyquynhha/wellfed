import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountInfoForm from "@/components/nutrients/account-info-form";
import {
  fetchNutrients,
  fetchTrackedNutrients,
} from "@/lib/actions/nutrient/nutrient-crud";
import { insertProfile } from "@/lib/actions/profile/profile-crud";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await insertProfile(user);

  const nutrients = await fetchNutrients(supabase);
  const trackedNutrients = await fetchTrackedNutrients(supabase);

  if (trackedNutrients.length == 0) {
    const minNutrients = ["calories", "carbs", "protein", "fat"];

    await supabase.from("tracked_nutrients").insert(
      nutrients
        .filter((n) => minNutrients.includes(n.serving_name))
        .map((n) => ({
          user_id: user?.id,
          nutrient_id: n.id,
        })),
    );
  }

  return (
    <AccountInfoForm
      user={user}
      profile={profile}
      nutrients={nutrients}
      trackedNutrients={trackedNutrients}
      redirect="/my-foods/all"
    />
  );
}
