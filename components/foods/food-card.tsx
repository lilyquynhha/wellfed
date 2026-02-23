"use client";

import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { NewIngr, spFood, spServing } from "@/lib/supabase/database-types";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { displayNumber, resolveAmount } from "@/lib/actions/food/food-logic";
import { MacroChart } from "../visuals/macro-chart";
import { Heading } from "../typography";

export function FoodCard({
  food,
  servings,
  addIngr,
}: {
  food: spFood;
  servings: spServing[];
  addIngr?: (i: NewIngr) => void;
}) {
  const [selectedServingId, setSelectedServingId] = useState(servings[0].id);
  const [serving, setServing] = useState<spServing | undefined>(servings[0]);
  const [amount, setAmount] = useState(servings[0].display_serving_size);

  type Message = {
    success: boolean;
    message: string;
  };
  const [message, setMessage] = useState<Message>({
    success: false,
    message: "",
  });

  const add = () => {
    if (!addIngr) return;

    if (amount > 0) {
      addIngr({
        amount: amount,
        serving_id: selectedServingId,
      });
      setMessage({
        success: true,
        message: "Ingredient added successfully!",
      });
    } else {
      setMessage({
        success: false,
        message: "Error: Amount must be positive.",
      });
    }
  };

  useEffect(() => {
    setServing(servings.find((s) => s.id == selectedServingId));
  }, [selectedServingId]);

  useEffect(() => {
    setMessage({
      success: false,
      message: "",
    });
  }, [amount, selectedServingId]);

  return (
    <>
      {/* Header: Food name & Serving options */}
      <div className="px-5 pt-4 mb-4">
        <Heading size={3} text={food.name} className="mb-3" />
        {food.brand_name && (
          <p className="text-muted-foreground">{food.brand_name}</p>
        )}
        <div className="flex gap-2 items-center flex-wrap mt-3">
          <Field className="basis-1/2 max-w-28">
            <Input
              placeholder="Enter amount"
              type="number"
              step="any"
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
            />
          </Field>
          <div className="max-w-fit">
            {" "}
            <Select
              onValueChange={setSelectedServingId}
              defaultValue={servings[0].id}
            >
              <SelectTrigger className="text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Serving size</SelectLabel>
                  {servings.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {`${s.display_serving_unit}`}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {addIngr && (
            <div>
              <Button variant="secondary" onClick={add}>
                Submit
              </Button>
            </div>
          )}
        </div>
        {message.message && (
          <p
            className={`${message.success ? "text-green-500" : "text-red-500"} text-sm mt-1`}
          >
            {message.message}
          </p>
        )}
      </div>

      <Separator />

      {/* Nutrition list */}
      <ScrollArea className="min-h-0 pb-6 px-5 ">
        <div>
          {serving && (
            <>
              {resolveAmount(
                serving.calories,
                serving.display_serving_size,
                amount,
              ) != 0 ? (
                <MacroChart
                  macros={{
                    calories: resolveAmount(
                      serving.calories,
                      serving.display_serving_size,
                      amount,
                    ) as number,
                    carbs: resolveAmount(
                      serving.carbs,
                      serving.display_serving_size,
                      amount,
                    ) as number,
                    protein: resolveAmount(
                      serving.protein,
                      serving.display_serving_size,
                      amount,
                    ) as number,
                    fat: resolveAmount(
                      serving.fat,
                      serving.display_serving_size,
                      amount,
                    ) as number,
                  }}
                  size={36}
                />
              ) : (
                <>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-2xl font-extrabold">Calories</p>
                    <p className="text-5xl font-extrabold">0</p>
                  </div>

                  <div className="h-2 bg-primary mt-2 mb-3"></div>
                </>
              )}

              <div className="flex space-x-4">
                <p className="font-extrabold">Total Fat</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.fat,
                      serving.display_serving_size,
                      amount,
                    ),
                    "g",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Saturated Fat</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.saturated_fat,
                      serving.display_serving_size,
                      amount,
                    ),
                    "g",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Trans Fat</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.trans_fat,
                      serving.display_serving_size,
                      amount,
                    ),
                    "g",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Polyunsaturated Fat</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.polyunsaturated_fat,
                      serving.display_serving_size,
                      amount,
                    ),
                    "g",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Monosaturated Fat</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.monounsaturated_fat,
                      serving.display_serving_size,
                      amount,
                    ),
                    "g",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Cholesterol</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.cholesterol,
                      serving.display_serving_size,
                      amount,
                    ),
                    "mg",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Sodium</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.sodium,
                      serving.display_serving_size,
                      amount,
                    ),
                    "mg",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Total Carbohydrates</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.carbs,
                      serving.display_serving_size,
                      amount,
                    ),
                    "g",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Dietary Fiber</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.fiber,
                      serving.display_serving_size,
                      amount,
                    ),
                    "g",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Sugars</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.sugar,
                      serving.display_serving_size,
                      amount,
                    ),
                    "g",
                  )}
                </p>
              </div>
              {serving.added_sugars && (
                <div className="pl-10">
                  <Separator />
                  <p>
                    Includes
                    {displayNumber(
                      resolveAmount(
                        serving.added_sugars,
                        serving.display_serving_size,
                        amount,
                      ),
                      "g",
                    )}
                    Added Sugars
                  </p>
                </div>
              )}

              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Protein</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.protein,
                      serving.display_serving_size,
                      amount,
                    ),
                    "g",
                  )}
                </p>
              </div>

              <div className="h-2 bg-foreground mt-2 mb-3"></div>

              <div className="flex space-x-4">
                <p>Vitamin D</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.vitamin_d,
                      serving.display_serving_size,
                      amount,
                    ),
                    "mcg",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Calcium</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.calcium,
                      serving.display_serving_size,
                      amount,
                    ),
                    "mg",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Iron</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.iron,
                      serving.display_serving_size,
                      amount,
                    ),
                    "mg",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Potassium</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.potassium,
                      serving.display_serving_size,
                      amount,
                    ),
                    "mg",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Vitamin A</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.vitamin_a,
                      serving.display_serving_size,
                      amount,
                    ),
                    "mcg",
                  )}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Vitamin C</p>
                <p>
                  {displayNumber(
                    resolveAmount(
                      serving.vitamin_c,
                      serving.display_serving_size,
                      amount,
                    ),
                    "mg",
                  )}
                </p>
              </div>
              <Separator />
            </>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
