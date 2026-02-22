import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingForm from "@/components/nutrients/onboarding-form";
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

  return (
    <OnboardingForm
      profile={profile}
      nutrients={nutrients}
      trackedNutrients={trackedNutrients}
    />
  );
}
