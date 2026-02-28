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
  spCostOverride,
  spTrackedNutrient,
} from "@/lib/supabase/database-types";
import { useActionState, useEffect, useState } from "react";
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
import {
  fetchNutrients,
  fetchTrackedNutrients,
} from "@/lib/actions/nutrient/nutrient-crud";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { insertServingCostOverride } from "@/lib/actions/serving_cost_override/serving-cost-override-crud";
import { Separator } from "@/components/ui/separator";
import { stopCoverageInsideWorker } from "vitest/internal/browser";

export default function Page() {
  const supabase = createClient();

  const [nutrients, setNutrients] = useState<spNutrient[]>([]);
  const [trackedNutrients, setTrackedNutrients] = useState<spTrackedNutrient[]>(
    [],
  );

  // Food search states
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [foundFoods, setFoundFoods] = useState<spFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<spFood>();
  const [selectedFoodServings, setSelectedFoodServings] = useState<spServing[]>(
    [],
  );
  const [triggerSearch, setTriggerSearch] = useState(false); // a toggle

  // Serving cost overrides
  const [costOverrides, setCostOverrides] = useState<spCostOverride[]>([]);
  const addCostFunc = insertServingCostOverride.bind(
    null,
    supabase,
    selectedFoodServings,
  );
  const [addCostRes, addCost, isAdding] = useActionState(addCostFunc, {
    success: false,
  });
  const [lastAdd, setLastAdd] = useState("");
  const [open, setOpen] = useState(false);

  // Food comparison
  const [compareFoods, setCompareFoods] = useState<spFood[]>([]);
  const [compareServings, setCompareServings] = useState<spServing[]>([]);

  const fetchCostOverrides = async () => {
    setIsFetchingCost(true);
    setCostOverrides([]);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const updatedCostOverrides = new Array<spCostOverride>();

    await Promise.all(
      selectedFoodServings.map(async (s) => {
        if (s.owner_food_id == selectedFood?.id) {
          const { data: fetchedOverride } = await supabase
            .from("serving_cost_overrides")
            .select()
            .eq("serving_id", s.id)
            .eq("user_id", user?.id)
            .maybeSingle();

          if (fetchedOverride) {
            updatedCostOverrides.push(fetchedOverride as spCostOverride);
          }
        }
      }),
    );

    setCostOverrides(updatedCostOverrides);
    setIsFetchingCost(false);
  };
  const [isFetchingCost, setIsFetchingCost] = useState(false);

  const handleUnfavouriteFood = async () => {
    await supabase
      .from("favourite_foods")
      .delete()
      .eq("food_id", selectedFood?.id);

    setTriggerSearch(!triggerSearch);
  };

  const handleDeleteFood = async () => {
    if (!selectedFood) return;
    await supabase.from("foods").delete().eq("id", selectedFood.id);

    removeFoodFromCompare(selectedFood);
    setTriggerSearch(!triggerSearch);

    toast.success("Food deleted successfully", {
      position: "bottom-center",
    });
  };

  const addFoodToCompare = async () => {
    if (!selectedFood) return;
    if (compareFoods.find((f) => f.id === selectedFood.id)) return;
    const updatedFoods = new Array(...compareFoods);
    updatedFoods.push(selectedFood);

    const updatedServings = new Array(...compareServings);
    updatedServings.push(...selectedFoodServings);

    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    const fetchData = async () => {
      const nutrientsData = await fetchNutrients(supabase);

      const trackedData = await fetchTrackedNutrients(supabase);
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

  useEffect(() => {
    if (addCostRes.success && lastAdd != addCostRes.message) {
      fetchCostOverrides();

      toast.success("Cost added successfully!", {
        position: "bottom-center",
      });
      setLastAdd(addCostRes.message as string);
      setOpen(false);
    }
  }, [addCostRes]);

  return (
    <>
      <SearchBar
        setSearchQuery={setSearchQuery}
        placeholder="Enter food name"
      />

      {/* Food actions */}
      {totalResults > 0 && selectedFood && (
        <>
          <div className="flex gap-2 justify-end my-2 overflow-x-auto">
            {selectedFood.is_public && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isLoading || !selectedFood.is_public}
                  onClick={() => {
                    handleUnfavouriteFood();
                  }}
                >
                  Unfavourite
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isLoading || !selectedFood.is_public}
                      onClick={async () => {
                        await fetchCostOverrides();
                      }}
                    >
                      Override cost
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Override cost</DialogTitle>
                      <DialogDescription>
                        Override cost of public foods
                      </DialogDescription>
                    </DialogHeader>
                    {!isFetchingCost ? (
                      <form action={addCost}>
                        <div className="max-h-[50vh] overflow-y-auto">
                          <FieldGroup className="gap-2">
                            {selectedFoodServings.map((s) => (
                              <Field key={s.id} className="flex flex-row">
                                <Input
                                  defaultValue={
                                    costOverrides.find(
                                      (o) => o.serving_id == s.id,
                                    )?.cost
                                  }
                                  id={s.id}
                                  name={s.id}
                                  className="max-w-36"
                                  type="number"
                                  step="any"
                                  min="0"
                                />
                                <FieldLabel>{`per ${s.display_serving_size} ${s.display_serving_unit}`}</FieldLabel>
                              </Field>
                            ))}

                            <div className="sticky bottom-0 bg-background">
                              <Button
                                type="submit"
                                disabled={isAdding}
                                className="w-full"
                              >
                                Update cost
                              </Button>
                            </div>
                          </FieldGroup>
                        </div>
                      </form>
                    ) : (
                      <p>Fetching existing cost overrides...</p>
                    )}
                  </DialogContent>
                </Dialog>

                <div>
                  <Separator orientation="vertical" />
                </div>
              </>
            )}

            {!selectedFood.is_public && (
              <>
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
                          handleDeleteFood();
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div>
                  <Separator orientation="vertical" />
                </div>
              </>
            )}

            <Button
              size="sm"
              variant="secondary"
              disabled={isLoading}
              onClick={() => {
                addFoodToCompare();
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
      ) : !searchQuery && totalResults == 0 ? (
        <p>
          <Link
            href="/my-foods/create"
            className="underline underline-offset-2 hover:text-highlight"
          >
            Create your own foods
          </Link>{" "}
          or favourite foods from the{" "}
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-highlight"
          >
            public database
          </Link>
          .
        </p>
      ) : (
        <FoodSearchResult
          foods={foundFoods}
          totalResults={totalResults}
          page={page}
          setPage={setPage}
          onSelectedFood={setSelectedFood}
          onSelectedFoodServings={setSelectedFoodServings}
          newCostOverrides={costOverrides}
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
