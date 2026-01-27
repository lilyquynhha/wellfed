"use client";

import NormalPreview from "./normal-preview";
import PopupPreview from "./popup-preview";
import { spFood, spServing } from "@/lib/supabase/database-types";

export default function FoodPreview({
  food,
  servings,
}: {
  food: spFood;
  servings: spServing[];
}) {
  return (
    <>
      <NormalPreview food={food} servings={servings} />
      <PopupPreview food={food} servings={servings} />
    </>
  );
}
