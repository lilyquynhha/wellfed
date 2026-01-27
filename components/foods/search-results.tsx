"use client";

import FoodsList from "./foods-list";
import FoodPreview from "./food-preview";
import { useEffect, useState } from "react";
import { MAX_RESULTS } from "@/lib/actions/food/food-crud";
import { spFood, spServing } from "@/lib/supabase/database-types";
import { createClient } from "@/lib/supabase/client";
import { PopupPreviewSkeleton, NormalPreviewSkeleton } from "../ui/skeleton";

export default function SearchResults({
  foods,
  totalResults,
  page,
}: {
  foods: spFood[];
  totalResults: number;
  page: number;
}) {
  const supabase = createClient();
  if (totalResults == 0) return <p>No food found.</p>;

  const [currentFoods, setCurrentFoods] = useState(foods);
  const [selectedFood, setSelectedFood] = useState<spFood>(foods[0]);
  const [selectedServings, setSelectedServings] = useState<spServing[]>([]);
  const [isPending, setIsPending] = useState(false);

  const totalPages = Math.ceil(totalResults / MAX_RESULTS);

  // Fetch selected food
  useEffect(() => {
    setSelectedServings([]);

    async function getServings() {
      setIsPending(true);
      const { data, error } = await supabase
        .from("servings")
        .select()
        .eq("owner_food_id", selectedFood.id);

      setIsPending(false);
      console.log("done!");

      if (error || !data) {
        return [];
      }

      return data as spServing[];
    }

    getServings().then(setSelectedServings);
  }, [selectedFood]);

  // Reset selected food if it is a new food search
  if (foods != currentFoods) {
    setCurrentFoods(foods);
    setSelectedFood(foods[0]);
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <FoodsList
          foods={foods}
          currentPage={page}
          totalPages={totalPages}
          onSelect={setSelectedFood}
        />

        {isPending || selectedServings.length == 0 ? (
          isMobile ? (
            <PopupPreviewSkeleton />
          ) : (
            <NormalPreviewSkeleton />
          )
        ) : (
          <FoodPreview food={selectedFood} servings={selectedServings} />
        )}
      </div>
    </>
  );
}
