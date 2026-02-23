"use client";

import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { FoodSearchResultSkeleton } from "@/components/ui/skeleton";
import { MAX_RESULTS } from "@/lib/actions/food/food-crud";
import { createClient } from "@/lib/supabase/client";
import {
  NewIngr,
  spFood,
  spNutrient,
  spServing,
  spTrackedNutrient,
} from "@/lib/supabase/database-types";
import { useEffect, useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FoodSearchResult } from "@/components/search-utilities/search-results";
import { displayNumber, resolveAmount } from "@/lib/actions/food/food-logic";
import { ChevronRightIcon, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FoodCard } from "@/components/foods/food-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FullIngr } from "@/lib/actions/creation/creation-crud";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export default function CreationForm({
  nutrients,
  trackedNutrients,
  onNameChange,
  onTypeChange,
  onIngrsChange,
  fetchedCreation,
}: {
  nutrients: spNutrient[];
  trackedNutrients: spTrackedNutrient[];
  onNameChange: (n: string) => void;
  onTypeChange: (t: string) => void;
  onIngrsChange: (ingrs: FullIngr[]) => void;
  fetchedCreation: {
    initialName: string;
    initialType: string;
    initialIngrs: FullIngr[];
  } | null;
}) {
  const supabase = createClient();

  // Food search states
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [foundFoods, setFoundFoods] = useState<spFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<spFood>();

  // Creation states
  const [creationName, setCreationName] = useState(
    fetchedCreation?.initialName ?? "",
  );
  const [creationType, setCreationType] = useState(
    fetchedCreation?.initialType ?? "",
  );
  const [ingrs, setIngrs] = useState<FullIngr[]>(
    fetchedCreation?.initialIngrs ?? [],
  );

  const findServingById = (i: FullIngr) => {
    return i.servings.find((s) => s.id == i.ingr.serving_id);
  };

  const addIngr = async (i: NewIngr) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("servings")
      .select()
      .eq("owner_food_id", selectedFood?.id);

    const updated = [...ingrs];
    updated.push({
      food: selectedFood as spFood,
      servings: data as spServing[],
      ingr: i,
    });
    setIngrs(updated);
  };

  const deleteIngr = (i: FullIngr) => {
    const updated = [...ingrs];
    setIngrs(updated.filter((ig) => ig != i));
  };

  const editIngr = (prevIngr: FullIngr, newIngr: NewIngr) => {
    if (newIngr.amount <= 0) {
      return;
    }
    const updated = [...ingrs];
    setIngrs(
      updated.map((i) =>
        i == prevIngr
          ? {
              ...i,
              ingr: {
                amount: newIngr.amount,
                serving_id: newIngr.serving_id,
              },
            }
          : i,
      ),
    );
  };

  const calcAmount = (i: FullIngr, figure: keyof spServing) => {
    const s = findServingById(i);
    if (s) {
      return resolveAmount(
        s[figure] as number,
        s.display_serving_size,
        i.ingr.amount,
      );
    }
  };

  const calcTotal = (figure: keyof spServing) => {
    let total = 0;
    ingrs.forEach((i) => {
      const s = findServingById(i);
      if (s) {
        total += calcAmount(i, figure) ?? 0;
      }
    });
    return total;
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Fetch foods
  useEffect(() => {
    async function fetchFoods() {
      if (searchQuery == "") return;

      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: count } = await supabase.rpc("count_foods_general", {
        user_id: user?.id,
        query: searchQuery,
      });

      if (count > 0) {
        const totalPages = Math.ceil(count / MAX_RESULTS);
        if (page > totalPages) setPage(totalPages);

        const { data } = await supabase.rpc("search_foods_general", {
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
  }, [searchQuery, page]);

  useEffect(() => {
    onNameChange(creationName);
  }, [creationName]);
  useEffect(() => {
    onTypeChange(creationType);
  }, [creationType]);

  useEffect(() => {
    onIngrsChange(ingrs);
  }, [ingrs]);

  return (
    <>
      <div className="md:flex gap-4">
        <Field className="flex flex-row space-x-2 mb-2">
          <FieldLabel className="text-base whitespace-nowrap max-w-fit">
            Creation name:
          </FieldLabel>
          <Input
            value={creationName}
            onChange={(e) => setCreationName(e.target.value)}
          />
        </Field>
        <Field className="flex flex-row space-x-2 mb-2">
          <FieldLabel className="text-base whitespace-nowrap max-w-fit">
            Creation type:
          </FieldLabel>
          <Select value={creationType} onValueChange={setCreationType}>
            <SelectTrigger className="max-w-fit">
              <SelectValue placeholder="Select creation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MEAL">Meal</SelectItem>
              <SelectItem value="RECIPE">Recipe</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* Food search */}
      <Collapsible className="my-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="group text-base">
            <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
            Search foods
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SearchBar
            setSearchQuery={setSearchQuery}
            placeholder="Enter food name"
          />

          {/* Food search results */}
          {searchQuery &&
            (isLoading ? (
              <FoodSearchResultSkeleton />
            ) : (
              <FoodSearchResult
                foods={foundFoods}
                totalResults={totalResults}
                page={page}
                setPage={setPage}
                onSelectedFood={setSelectedFood}
                addIngr={addIngr}
              />
            ))}
        </CollapsibleContent>
      </Collapsible>

      <div className="mt-4">
        <h2 className="text-xl font-medium mb-2">Added ingredients:</h2>
        {ingrs.length > 0 ? (
          <div className="flex">
            <ScrollArea className="w-full max-h-96 border-2 border-muted rounded-xl">
              <div className="sticky top-0 z-40 border-foreground bg-secondary mb-2">
                <div className="flex flex-col">
                  <div className="sticky top-0 border-b-2 border-foreground">
                    <div className="flex gap-2 p-2 font-semibold">
                      <p className="w-48 break-words">Ingredient</p>
                      <p className="w-36 break-words">Amount</p>
                      <p className="w-24 break-words">Cost</p>
                      {nutrients.map((n) => (
                        <p
                          key={`${n.id}-name`}
                          className={`w-24 break-words ${trackedNutrients.find((tn) => tn.nutrient_id == n.id) ? "text-highlight" : ""}`}
                        >
                          {" "}
                          {n.name}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {ingrs.map((i) => (
                <div key={`${i.ingr.serving_id}-${i.ingr.amount}`}>
                  <div className="flex mb-2 gap-2 pl-2 pb-2 border-b-2">
                    <div className="sticky left-0 w-48 bg-background">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-6 float-right mr-2"
                        onClick={() => {
                          deleteIngr(i);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 float-right mr-2"
                          >
                            <Pencil size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent aria-describedby={undefined}>
                          <DialogHeader>
                            <DialogTitle>Edit Ingredient</DialogTitle>
                          </DialogHeader>

                          <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto">
                            <FoodCard
                              food={i.food}
                              servings={i.servings}
                              addIngr={(newIngr) => {
                                editIngr(i, newIngr);
                              }}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <p className="font-medium">{i.food.name}</p>
                    </div>
                    <div className="w-36">
                      <p>
                        {`${i.ingr.amount} ${i.servings.find((s) => s.id == i.ingr.serving_id)?.display_serving_unit}`}
                      </p>
                    </div>
                    <div className="w-24">
                      <p>{displayNumber(calcAmount(i, "cost"))}</p>
                    </div>
                    {nutrients.map((n) => (
                      <div key={`${n.id}-each`} className="w-24">
                        <p
                          className={`${trackedNutrients.find((tn) => tn.nutrient_id == n.id) ? "text-highlight" : ""}`}
                        >
                          {displayNumber(
                            calcAmount(i, n.serving_name as keyof spServing),
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="sticky bottom-0 z-40 border-foreground bg-secondary mb-2">
                <div className="flex flex-col whitespace-nowrap">
                  <div className="sticky bottom-0">
                    <div className="flex gap-2 p-2 font-semibold">
                      <p className="w-80 text-right pr-6">Total</p>
                      <p className="w-24">
                        {displayNumber(calcTotal("cost"), " AUD")}
                      </p>
                      {nutrients.map((n) => (
                        <p
                          key={`${n.id}-total`}
                          className={`w-24 ${trackedNutrients.find((tn) => tn.nutrient_id == n.id) ? "text-highlight" : ""}`}
                        >
                          {displayNumber(
                            calcTotal(n.serving_name as keyof spServing),
                            n.unit,
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ) : (
          <p>Search foods above to add ingredients.</p>
        )}
      </div>

      <Button
        variant="secondary"
        className="w-full mt-6 mb-2"
        onClick={() => {
          setCreationName("");
          setCreationType("");
          setIngrs([]);
        }}
      >
        Reset
      </Button>
    </>
  );
}
