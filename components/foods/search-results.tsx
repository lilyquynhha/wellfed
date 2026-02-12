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
  setPage,
  onSelectedFood,
}: {
  foods: spFood[];
  totalResults: number;
  page: number;
  setPage: (page: number) => void;
  onSelectedFood: (food: spFood) => void;
}) {
  const supabase = createClient();
  if (totalResults == 0) return <p>No food found.</p>;

  const [currentFoods, setCurrentFoods] = useState(foods);
  const [selectedFood, setSelectedFood] = useState<spFood>(foods[0]);
  const [selectedServings, setSelectedServings] = useState<spServing[]>([]);
  const [isPending, setIsPending] = useState(false);

  const totalPages = Math.ceil(totalResults / MAX_RESULTS);

  // Fetch selected food's servings
  useEffect(() => {
    onSelectedFood(selectedFood);

    setSelectedServings([]);

    async function getServings() {
      if (!selectedFood) return [];
      
      setIsPending(true);

      const { data, error } = await supabase
        .from("servings")
        .select()
        .eq("owner_food_id", selectedFood.id);

      setIsPending(false);

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
          setPage={setPage}
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
