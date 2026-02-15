import {
  ServingFigures,
  spFood,
  spServing,
} from "@/lib/supabase/database-types";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectItem,
} from "../ui/select";
import { useEffect, useState } from "react";
import { displayNumber, resolveAmount } from "@/lib/actions/food/food-logic";

export default function FoodComparison({
  foods,
  servings,
  removeFood,
}: {
  foods: spFood[];
  servings: spServing[];
  removeFood: (food: spFood) => void;
}) {
  type ComputedFigures = {
    foodId: string;
    computedFigures: ServingFigures;
  };

  type SelectedServing = {
    foodId: string;
    servingId: string;
  };

  const [computedFoods, setComputedFoods] = useState<ComputedFigures[]>([]);
  const [selectedServings, setSelectedServings] = useState<SelectedServing[]>(
    [],
  );
  const [commonServings, setCommonServings] = useState<string[]>([]);

  // Compute the serving figures based on amount and serving option inputs
  const updateComputedFigures = (
    foodId: string | undefined,
    servingId?: string,
    amountInput?: string,
  ) => {
    if (!foodId) return;
    console.log("current food: ", foods.find((f) => f.id == foodId)?.name);

    // Get the amount
    const amountEl = document.getElementById(
      `${foodId}-amount`,
    ) as HTMLInputElement;
    const amount = amountInput ? Number(amountInput) : Number(amountEl.value);

    // Get the selected serving option
    const selectedServing = servings.find(
      (s) =>
        s.id ==
        (servingId ??
          selectedServings.find((ss) => ss.foodId == foodId)?.servingId),
    ) as spServing;

    setComputedFoods((prev) => {
      return prev.map((f) =>
        f.foodId == foodId
          ? {
              ...f,
              computedFigures: {
                added_sugars: resolveAmount(
                  selectedServing.added_sugars,
                  selectedServing.display_serving_size,
                  amount,
                ),
                calcium: resolveAmount(
                  selectedServing.calcium,
                  selectedServing.display_serving_size,
                  amount,
                ),
                calories:
                  resolveAmount(
                    selectedServing.calories,
                    selectedServing.display_serving_size,
                    amount,
                  ) ?? 0,
                carbs:
                  resolveAmount(
                    selectedServing.carbs,
                    selectedServing.display_serving_size,
                    amount,
                  ) ?? 0,
                cholesterol: resolveAmount(
                  selectedServing.cholesterol,
                  selectedServing.display_serving_size,
                  amount,
                ),
                cost: resolveAmount(
                  selectedServing.cost,
                  selectedServing.display_serving_size,
                  amount,
                ),
                fat:
                  resolveAmount(
                    selectedServing.fat,
                    selectedServing.display_serving_size,
                    amount,
                  ) ?? 0,
                fiber: resolveAmount(
                  selectedServing.fiber,
                  selectedServing.display_serving_size,
                  amount,
                ),
                iron: resolveAmount(
                  selectedServing.iron,
                  selectedServing.display_serving_size,
                  amount,
                ),
                monounsaturated_fat: resolveAmount(
                  selectedServing.monounsaturated_fat,
                  selectedServing.display_serving_size,
                  amount,
                ),
                polyunsaturated_fat: resolveAmount(
                  selectedServing.polyunsaturated_fat,
                  selectedServing.display_serving_size,
                  amount,
                ),
                potassium: resolveAmount(
                  selectedServing.potassium,
                  selectedServing.display_serving_size,
                  amount,
                ),
                protein:
                  resolveAmount(
                    selectedServing.protein,
                    selectedServing.display_serving_size,
                    amount,
                  ) ?? 0,
                saturated_fat: resolveAmount(
                  selectedServing.saturated_fat,
                  selectedServing.display_serving_size,
                  amount,
                ),
                sodium: resolveAmount(
                  selectedServing.sodium,
                  selectedServing.display_serving_size,
                  amount,
                ),
                sugar: resolveAmount(
                  selectedServing.sugar,
                  selectedServing.display_serving_size,
                  amount,
                ),
                trans_fat: resolveAmount(
                  selectedServing.trans_fat,
                  selectedServing.display_serving_size,
                  amount,
                ),
                vitamin_a: resolveAmount(
                  selectedServing.vitamin_a,
                  selectedServing.display_serving_size,
                  amount,
                ),
                vitamin_c: resolveAmount(
                  selectedServing.vitamin_c,
                  selectedServing.display_serving_size,
                  amount,
                ),
                vitamin_d: resolveAmount(
                  selectedServing.vitamin_d,
                  selectedServing.display_serving_size,
                  amount,
                ),
              },
            }
          : f,
      );
    });
  };

  // Set the same amount for the common serving
  const setSame = () => {
    // Set the same amount for each food
    const sameAmountInput = document.getElementById(
      "same-amount",
    ) as HTMLInputElement;
    const sameAmount = sameAmountInput.value;

    const amountInputs = document.querySelectorAll(
      "input.amount",
    ) as NodeListOf<HTMLInputElement>;

    amountInputs.forEach((input) => {
      input.value = sameAmount;
    });

    // Set the corresponding serving for each food
    const commonServingEl = document.getElementById(
      "common-serving",
    ) as HTMLElement;
    const commonServingString = commonServingEl.innerText;

    setSelectedServings((prev) => {
      return prev.map((f) => {
        const add = {
          ...f,
          servingId: servings.find(
            (s) =>
              s.owner_food_id == f.foodId &&
              s.display_serving_unit == commonServingString,
          )?.id as string,
        };
        updateComputedFigures(f.foodId, add.servingId);
        return add;
      });
    });
  };

  // Update foods and get similar serving units
  useEffect(() => {
    // Add new foods
    const updatedFoods = [...computedFoods];
    const updatedServings = [...selectedServings];
    foods.forEach((f) => {
      if (!computedFoods.find((j) => j.foodId == f.id)) {
        updatedFoods.push({
          foodId: f.id,
          computedFigures: servings.filter((s) => s.owner_food_id == f.id)[0],
        });

        updatedServings.push({
          foodId: f.id,
          servingId: servings.filter((s) => s.owner_food_id == f.id)[0].id,
        });
      }
    });
    setComputedFoods(updatedFoods);
    setSelectedServings(updatedServings);

    // Get common serving units
    const groupServings = foods.map((f) => {
      const foodServings = servings.filter((s) => s.owner_food_id == f.id);
      return foodServings.map((fs) => fs.display_serving_unit);
    });
    setCommonServings(
      groupServings.length == 0
        ? []
        : groupServings.reduce((acc, group) => {
            return acc.filter((s) => group.includes(s));
          }),
    );
  }, [foods]);

  return (
    <div className="mt-6">
      <h2 className="text-4xl mb-4">Compare foods</h2>

      {computedFoods.length == 0 ? (
        <p>Add foods to compare.</p>
      ) : (
        <>
          {foods.length > 1 && commonServings.length > 0 && (
            <div className="flex space-x-2 mb-3">
              <Field className="w-28">
                <Input id="same-amount" />
              </Field>
              <Select
                key={commonServings.length}
                defaultValue={commonServings[0]}
              >
                <SelectTrigger className="text-base">
                  <SelectValue id="common-serving" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Serving unit</SelectLabel>
                    {commonServings.map((s) => (
                      <SelectItem key={s} value={s}>
                        {`${s}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button onClick={setSame}>Set for all foods</Button>
            </div>
          )}

          <div className="flex">
            <ScrollArea className="w-full h-96 border-2 border-muted rounded-xl">
              <div className="flex">
                <div className="sticky left-0 z-40 border-r-2 border-foreground">
                  <div className="flex flex-col w-44 whitespace-nowrap">
                    <div className="h-20 sticky top-0 border-b-2 border-foreground bg-primary-foreground">
                      <p className="px-2 font-semibold">Details</p>
                    </div>
                    <div className="h-10 border-b-2 bg-background">
                      <p className="px-2 font-semibold">Serving size</p>
                    </div>
                    <div className="h-10 border-b-2 bg-background">
                      <p className="px-2 font-semibold">Serving unit</p>
                    </div>
                    <div className="border-b-2 bg-background">
                      <p className="px-2 font-semibold">Cost</p>
                    </div>
                    <div className="border-b-2 bg-muted">
                      <p className="px-2 font-semibold">Calories</p>
                    </div>
                    <div className="border-b-2 bg-background">
                      <p className="px-2 font-semibold">Carbs</p>
                    </div>
                    <div className="border-b-2 bg-muted">
                      <p className="px-2 font-semibold">Protein</p>
                    </div>
                    <div className="border-b-2 bg-background">
                      <p className="px-2 font-semibold">Fat</p>
                    </div>
                    <div className="border-b-2 bg-muted">
                      <p className="px-2 font-semibold">Saturated Fat</p>
                    </div>
                    <div className="border-b-2 bg-background">
                      <p className="px-2 font-semibold">Polyunsaturated Fat</p>
                    </div>
                    <div className="border-b-2 bg-muted">
                      <p className="px-2 font-semibold">Monounsaturated Fat</p>
                    </div>
                    <div className="border-b-2 bg-background">
                      <p className="px-2 font-semibold">Trans Fat</p>
                    </div>
                    <div className="border-b-2 bg-muted">
                      <p className="px-2 font-semibold">Fiber</p>
                    </div>
                    <div className="border-b-2 bg-background">
                      <p className="px-2 font-semibold">Sugar</p>
                    </div>
                    <div className="border-b-2 bg-muted">
                      <p className="px-2 font-semibold">Sodium</p>
                    </div>
                    <div className="border-b-2 bg-background">
                      <p className="px-2 font-semibold">Cholesterol</p>
                    </div>
                    <div className="border-b-2 bg-muted">
                      <p className="px-2 font-semibold">Potassium</p>
                    </div>
                    <div className="border-b-2 bg-background">
                      <p className="px-2 font-semibold">Vitamin A</p>
                    </div>
                    <div className="border-b-2 bg-muted">
                      <p className="px-2 font-semibold">Vitamin C</p>
                    </div>
                    <div className="border-b-2 bg-background">
                      <p className="px-2 font-semibold">Vitamin D</p>
                    </div>
                    <div className="border-b-2 bg-muted">
                      <p className="px-2 font-semibold">Calcium</p>
                    </div>
                    <div className="border-b-2 bg-background">
                      <p className="px-2 font-semibold">Iron</p>
                    </div>
                    <div className="border-b-2 bg-muted">
                      <p className="px-2 font-semibold">Added Sugars</p>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  {foods.map((f) => {
                    return (
                      <div key={f.id} className="w-36">
                        <div className="h-20 overflow-auto sticky top-0 bg-primary-foreground border-b-2 border-foreground">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-6 float-right mr-2"
                            onClick={() => {
                              removeFood(f);
                              setComputedFoods(
                                computedFoods.filter((cf) => cf.foodId != f.id),
                              );
                              setSelectedServings(
                                selectedServings.filter(
                                  (s) => s.foodId != f.id,
                                ),
                              );
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                          <p className="px-2 font-semibold">{f.name}</p>
                        </div>

                        <div className="h-10 border-b-2 border-muted">
                          <Field>
                            <Input
                              className="amount"
                              id={`${f.id}-amount`}
                              name={`${f.id}-amount`}
                              defaultValue={
                                servings.filter(
                                  (s) => s.owner_food_id == f.id,
                                )[0].display_serving_size
                              }
                              onChange={(e) => {
                                updateComputedFigures(
                                  f.id,
                                  undefined,
                                  e.target.value,
                                );
                              }}
                              type="number"
                              step="any"
                            />
                          </Field>
                        </div>
                        <div className="h-10 overflow-hidden border-b-2 border-muted">
                          <Select
                            defaultValue={
                              servings.filter((s) => s.owner_food_id == f.id)[0]
                                .id
                            }
                            value={
                              selectedServings.find((s) => s.foodId == f.id)
                                ?.servingId ?? ""
                            }
                            onValueChange={(v) => {
                              setSelectedServings((prev) => {
                                const updated = prev.map((s) =>
                                  s.foodId == f.id ? { ...s, servingId: v } : s,
                                );
                                updateComputedFigures(f.id, v);
                                return updated;
                              });
                            }}
                          >
                            <SelectTrigger className="text-base">
                              <SelectValue id={`${f.id}-select`} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Serving unit</SelectLabel>
                                {servings
                                  .filter((s) => s.owner_food_id == f.id)
                                  .map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                      {`${s.display_serving_unit}`}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="border-b-2 border-muted">
                          <p className="px-2">{`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.cost)}`}</p>
                        </div>
                        <div className="border-b-2 border-muted bg-muted">
                          <p className="px-2">{`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.calories)}`}</p>
                        </div>
                        <div className="border-b-2 border-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.carbs)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted bg-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.protein)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.fat)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted bg-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.saturated_fat)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.polyunsaturated_fat)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted bg-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.monounsaturated_fat)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.trans_fat)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted bg-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.fiber)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.sugar)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted bg-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.sodium)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.cholesterol)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted bg-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.potassium)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.vitamin_a)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted bg-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.vitamin_c)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.vitamin_d)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted bg-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.calcium)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.iron)}`}
                          </p>
                        </div>
                        <div className="border-b-2 border-muted bg-muted">
                          <p className="px-2">
                            {`${displayNumber(computedFoods.find((a) => a.foodId == f.id)?.computedFigures.added_sugars)}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}
