"use client";

import { FoodSearchResult } from "@/components/search-utilities/search-results";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { FoodSearchResultSkeleton } from "@/components/ui/skeleton";
import { MAX_RESULTS } from "@/lib/actions/food/food-crud";
import { createClient } from "@/lib/supabase/client";
import {
  spFood,
  spNutrient,
  spServing,
  spTrackedNutrient,
} from "@/lib/supabase/database-types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FoodComparison from "@/components/foods/food-comparison";

export default function Page() {
  const supabase = createClient();

  const [nutrients, setNutrients] = useState<spNutrient[]>([]);
  const [trackedNutrients, setTrackedNutrients] = useState<spTrackedNutrient[]>(
    [],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [foundFoods, setFoundFoods] = useState<spFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<spFood>();
  const [triggerSearch, setTriggerSearch] = useState(false); // a toggle

  const [compareFoods, setCompareFoods] = useState<spFood[]>([]);
  const [compareServings, setCompareServings] = useState<spServing[]>([]);

  const handleUnfavouriteFood = async (f: spFood) => {
    await supabase.from("favourite_foods").delete().eq("food_id", f.id);

    setTriggerSearch(!triggerSearch);
  };

  const handleDeleteFood = async (f: spFood) => {
    await supabase.from("foods").delete().eq("id", f.id);

    setTriggerSearch(!triggerSearch);

    toast.success("Food deleted successfully", {
      position: "top-center",
    });
  };

  const addFoodToCompare = async (food: spFood) => {
    if (compareFoods.find((f) => f.id === food.id)) return;
    const updatedFoods = new Array(...compareFoods);
    updatedFoods.push(food);

    const { data } = await supabase
      .from("servings")
      .select()
      .eq("owner_food_id", food.id);

    const addedServings = data as spServing[];
    const updatedServings = new Array(...compareServings);
    updatedServings.push(...addedServings);

    setCompareFoods(updatedFoods);
    setCompareServings(updatedServings);
  };

  const removeFoodFromCompare = (food: spFood) => {
    const updatedFoods = compareFoods.filter((f) => f.id != food.id);

    const updatedServings = compareServings.filter(
      (s) => s.owner_food_id != food.id,
    );

    setCompareFoods(updatedFoods);
    setCompareServings(updatedServings);
  };

  // Fetch tracked nutrients
  useEffect(() => {
    async function fetchNutrients() {
      const { data } = await supabase.from("nutrients").select();
      return data as spNutrient[];
    }

    async function fetchTrackedNutrients() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("tracked_nutrients")
        .select()
        .eq("user_id", user?.id);

      return data as spTrackedNutrient[];
    }

    const fetchData = async () => {
      const nutrientsData = await fetchNutrients();

      const trackedData = await fetchTrackedNutrients();
      setTrackedNutrients(trackedData);

      nutrientsData.sort((a, b) => {
        const aPoint = trackedData.find((t) => t.nutrient_id == a.id)
          ? a.display_order
          : nutrientsData.length + a.display_order;
        const bPoint = trackedData.find((t) => t.nutrient_id == b.id)
          ? b.display_order
          : nutrientsData.length + b.display_order;
        return aPoint - bPoint;
      });
      setNutrients(nutrientsData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Fetch foods
  useEffect(() => {
    async function fetchFoods() {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: count } = await supabase.rpc("count_foods_personal", {
        user_id: user?.id,
        query: searchQuery,
      });

      if (count > 0) {
        const totalPages = Math.ceil(count / MAX_RESULTS);
        if (page > totalPages) setPage(totalPages);

        const { data } = await supabase.rpc("search_foods_personal", {
          user_id: user?.id,
          query: searchQuery,
          limit_count: MAX_RESULTS,
          offset_count: (page - 1) * MAX_RESULTS,
        });

        const foundFoods = data as spFood[];
        setFoundFoods(foundFoods);
      } else {
        setFoundFoods([]);
      }

      setTotalResults(count);
      setIsLoading(false);
    }

    fetchFoods();
  }, [triggerSearch, searchQuery, page]);

  return (
    <>
      <SearchBar
        setSearchQuery={setSearchQuery}
        placeholder="Enter food name"
      />

      {/* Food actions */}
      {totalResults > 0 && selectedFood && (
        <>
          <div className="flex gap-2 justify-end my-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={isLoading || !selectedFood.is_public}
              onClick={() => {
                handleUnfavouriteFood(selectedFood);
              }}
            >
              Unfavourite
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={isLoading || selectedFood.is_public}
            >
              <Link href={`/my-foods/${selectedFood.id}/edit`}>Edit</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isLoading || selectedFood.is_public}
                  size="sm"
                  variant="secondary"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete food?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the food.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      handleDeleteFood(selectedFood);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              size="sm"
              variant="secondary"
              disabled={isLoading}
              onClick={() => {
                addFoodToCompare(selectedFood);
              }}
            >
              Compare
            </Button>
          </div>
        </>
      )}

      {/* Food search results */}
      {isLoading ? (
        <FoodSearchResultSkeleton />
      ) : (
        <FoodSearchResult
          foods={foundFoods}
          totalResults={totalResults}
          page={page}
          setPage={setPage}
          onSelectedFood={setSelectedFood}
        />
      )}

      {/* Compare foods */}
      <FoodComparison
        nutrients={nutrients}
        trackedNutrients={trackedNutrients}
        foods={compareFoods}
        servings={compareServings}
        removeFood={removeFoodFromCompare}
      />
    </>
  );
}
