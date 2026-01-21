"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { NormalPreviewSkeleton, PopupPreviewSkeleton } from "../ui/skeleton";
import NormalPreview from "./normal-preview";
import PopupPreview from "./popup-preview";
import { spFood, spServing } from "@/lib/supabase/database-types";

export default function FoodPreview({ food }: { food: spFood | null }) {
  const supabase = createClient();
  const [servings, setServings] = useState<spServing[] | null>(null);

  // Fetch a specific food by food id
  useEffect(() => {
    if (!food) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setServings(null);

    async function getServings() {
      const { data, error } = await supabase
        .from("servings")
        .select()
        .eq("owner_food_id", food?.id);

      if (error || !data) {
        return null;
      }

      return data as spServing[];
    }

    getServings().then(setServings);
  }, [food]);

  if (!food) {
    return (
      <div className="hidden md:block md:w-[50%] h-96 p-4 overflow-hidden">
        Select a food to see details.
      </div>
    );
  }

  // Show skeleton while waiting for data fetch
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (!servings)
    return isMobile ? <PopupPreviewSkeleton /> : <NormalPreviewSkeleton />;

  if (servings.length == 0)
    return "This food does not have any servings information.";

  return (
    <>
      <NormalPreview food={food} servings={servings} />
      <PopupPreview food={food} servings={servings} />
    </>
  );
}
