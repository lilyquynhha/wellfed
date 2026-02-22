"use client";

import FoodsList from "../foods/foods-list";
import { useEffect, useState } from "react";
import { MAX_RESULTS } from "@/lib/actions/food/food-crud";
import {
  NewIngr,
  spCreation,
  spFood,
  spServing,
} from "@/lib/supabase/database-types";
import { createClient } from "@/lib/supabase/client";
import { FoodCard } from "../foods/food-card";
import { FoodPreviewSkeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { MAX_SEARCH_RESULTS } from "@/lib/actions/creation/creation-crud";
import { Card, CardContent } from "../ui/card";
import Pagination from "./pagination";

export function FoodSearchResult({
  foods,
  totalResults,
  page,
  setPage,
  onSelectedFood,
  onSelectedFoodServings,
  addIngr,
}: {
  foods: spFood[];
  totalResults: number;
  page: number;
  setPage: (page: number) => void;
  onSelectedFood: (food: spFood) => void;
  onSelectedFoodServings?: (servings: spServing[]) => void;
  addIngr?: (i: NewIngr) => void;
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

    getServings().then((res) => {
      setSelectedServings(res);
      if (onSelectedFoodServings) onSelectedFoodServings(res);
    });
  }, [selectedFood]);

  // Reset selected food if it is a new food search
  if (foods != currentFoods) {
    setCurrentFoods(foods);
    setSelectedFood(foods[0]);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <FoodsList
          foods={foods}
          selectedFoodServings={selectedServings}
          currentPage={page}
          setPage={setPage}
          totalPages={totalPages}
          onSelect={setSelectedFood}
        />

        <div className="hidden md:block md:w-[50%] h-[28rem] p-1 overflow-hidden">
          {!isPending && selectedServings.length > 0 ? (
            <div className="h-full flex flex-col border-2 rounded-2xl">
              <FoodCard
                food={selectedFood}
                servings={selectedServings}
                addIngr={addIngr}
              />
            </div>
          ) : (
            <FoodPreviewSkeleton />
          )}
        </div>
      </div>
    </>
  );
}

export function CreationSearchResult({
  creations,
  totalResults,
  currentPage,
  setPage,
  onSelectCreation,
}: {
  creations: spCreation[];
  totalResults: number;
  currentPage: number;
  setPage: (page: number) => void;
  onSelectCreation: (creation: spCreation) => void;
}) {
  const [selectedCreation, setSelectedCreation] = useState("");
  if (totalResults == 0) return <p>No creation found.</p>;
  return (
    <>
      <div className="w-full mb-3">
        <div className="h-44 mb-6">
          <ScrollArea className="h-full">
            {creations.map((c) => (
              <Card
                key={c.id}
                className={`mb-2 p-3 cursor-pointer hover:bg-muted ${selectedCreation == c.id && "bg-muted"}`}
                onClick={() => {
                  onSelectCreation(c);
                  setSelectedCreation(c.id);
                }}
              >
                <CardContent className="flex justify-between">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.type.charAt(0).toUpperCase() +
                        c.type.slice(1).toLowerCase()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>

        <Pagination
          page={currentPage}
          totalPages={Math.ceil(totalResults / MAX_SEARCH_RESULTS)}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
