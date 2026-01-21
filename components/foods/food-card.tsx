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
import { spFood, spServing } from "@/lib/supabase/database-types";

export default function FoodCard({
  food,
  servings,
}: {
  food: spFood;
  servings: spServing[];
}) {
  const [selectedServingId, setSelectedServingId] = useState(servings[0].id);

  const [serving, setServing] = useState<spServing | undefined>(servings[0]);

  useEffect(() => {
    setServing(servings.find((s) => s.id == selectedServingId));
  }, [selectedServingId]);

  return (
    <>
      {/* Header: Food name & Serving options */}
      <div className="px-5 pt-4 mb-4">
        <h2 className="text-2xl font-semibold">{food.name}</h2>
        {food.brand_name && (
          <p className="text-muted-foreground">{food.brand_name}</p>
        )}

        <div className="flex items-center space-x-4 mt-3">
          <p className="font-semibold">Serving size</p>
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
                    {`${s.display_serving_size} ${s.display_serving_unit}`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Nutrition list */}
      <ScrollArea className="min-h-0 pb-6 px-5 ">
        <div>
          {serving && (
            <>
              <div className="flex justify-between items-end mt-2">
                <p className="text-2xl font-extrabold">Calories</p>
                <p className="text-5xl font-extrabold">{serving.calories}</p>
              </div>

              <div className="h-2 bg-primary mt-2 mb-3"></div>

              <div className="flex space-x-4">
                <p className="font-extrabold">Total Fat</p>
                <p>{`${serving.fat} g`}</p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Saturated Fat</p>
                <p>
                  {serving.saturated_fat ? `${serving.saturated_fat}g` : "-"}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Trans Fat</p>
                <p>{serving.trans_fat ? `${serving.trans_fat}g` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Polyunsaturated Fat</p>
                <p>
                  {serving.polyunsaturated_fat
                    ? `${serving.polyunsaturated_fat}g`
                    : "-"}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Monosaturated Fat</p>
                <p>
                  {serving.monounsaturated_fat
                    ? `${serving.monounsaturated_fat}g`
                    : "-"}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Cholesterol</p>
                <p>{serving.cholesterol ? `${serving.cholesterol}mg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Sodium</p>
                <p>{serving.sodium ? `${serving.sodium}mg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Total Carbohydrates</p>
                <p>{`${serving.carbs}g`}</p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Dietary Fiber</p>
                <p>{serving.fiber ? `${serving.fiber}g` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Sugars</p>
                <p>{serving.sugar ? `${serving.sugar}g` : "-"}</p>
              </div>
              {serving.added_sugars && (
                <div className="pl-10">
                  <Separator />
                  <p>Includes {serving.added_sugars}g Added Sugars</p>
                </div>
              )}

              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Protein</p>
                <p>{`${serving.protein}g`}</p>
              </div>

              <div className="h-2 bg-primary mt-2 mb-3"></div>

              <div className="flex space-x-4">
                <p>Vitamin D</p>
                <p>{serving.vitamin_d ? `${serving.vitamin_d}mcg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Calcium</p>
                <p>{serving.calcium ? `${serving.calcium}mg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Iron</p>
                <p>{serving.iron ? `${serving.iron}mg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Potassium</p>
                <p>{serving.potassium ? `${serving.potassium}mg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Vitamin A</p>
                <p>{serving.vitamin_a ? `${serving.vitamin_a}mcg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Vitamin C</p>
                <p>{serving.vitamin_c ? `${serving.vitamin_c}mg` : "-"}</p>
              </div>
              <Separator />
            </>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
