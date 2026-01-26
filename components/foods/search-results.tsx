"use client";

import FoodsList from "./foods-list";
import FoodPreview from "./food-preview";
import { useState } from "react";
import { MAX_RESULTS } from "@/lib/actions/food/food-crud";
import { spFood } from "@/lib/supabase/database-types";

export default function SearchResults({
  foods,
  totalResults,
  page,
}: {
  foods: spFood[];
  totalResults: number;
  page: number;
}) {
  if (totalResults == 0) return <p>No food found.</p>;

  const [currentFoods, setCurrentFoods] = useState(foods);
  const [selectedFood, setSelectedFood] = useState<spFood | null>(null);

  const totalPages = Math.ceil(totalResults / MAX_RESULTS);

  // Reset selected food if it is a new food search
  if (foods != currentFoods) {
    setSelectedFood(null);
    setCurrentFoods(foods);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <FoodsList
          foods={foods}
          currentPage={page}
          totalPages={totalPages}
          onSelect={setSelectedFood}
        />
        <FoodPreview food={selectedFood} />
      </div>
    </>
  );
}
