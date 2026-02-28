"use client";

import { Ingr } from "@/lib/actions/creation/creation-crud";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  spCreation,
  spNutrient,
  spServing,
  spTrackedNutrient,
} from "@/lib/supabase/database-types";
import { displayNumber, resolveAmount } from "@/lib/actions/food/food-logic";
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
} from "../ui/alert-dialog";
import Link from "next/link";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
import { MacroChart } from "../visuals/macro-chart";
import { Separator } from "../ui/separator";

export function CreationView({
  selectedCreation,
  nutrients,
  trackedNutrients,
  ingrs,
  handleDelete,
  addToCompare,
}: {
  selectedCreation: spCreation;
  nutrients: spNutrient[];
  trackedNutrients: spTrackedNutrient[];
  ingrs: Ingr[];
  handleDelete: () => void;
  addToCompare: () => void;
}) {
  const [amount, setAmount] = useState(1);

  const calcAmount = (i: Ingr, figure: keyof spServing) => {
    return resolveAmount(
      i.serving[figure] as number,
      i.serving.display_serving_size,
      i.amount * amount,
    );
  };

  const calcTotal = (figure: keyof spServing) => {
    let total = 0;
    ingrs.forEach((i) => {
      total += calcAmount(i, figure) ?? 0;
    });
    return total;
  };
  return (
    <>
      <div>
        <p>
          {selectedCreation.type.charAt(0).toUpperCase() +
            selectedCreation.type.slice(1).toLowerCase()}{" "}
          name: <span className="font-semibold">{selectedCreation.name}</span>
        </p>
        <Field className="flex flex-row items-center mt-2">
          <p className="max-w-fit">Serving size:</p>
          <Input
            className="basis-24"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            type="number"
            step="any"
            min="0"
          />
          <p className="max-w-fit">serving</p>
        </Field>
      </div>

      <div>
        {calcTotal("calories") != 0 && (
          <MacroChart
            macros={{
              calories: calcTotal("calories"),
              carbs: calcTotal("carbs"),
              protein: calcTotal("protein"),
              fat: calcTotal("fat"),
            }}
            size="md"
          />
        )}
      </div>

      {/* Creation actions */}
      <div className="flex justify-end gap-2 mb-2">
        <Button variant="secondary" size="sm">
          <Link href={`/my-creations/${selectedCreation.id}/edit`}>Edit</Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="secondary">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete creation?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the creation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div>
          <Separator orientation="vertical"/>
        </div>
        <Button variant="secondary" size="sm" onClick={addToCompare}>
          Compare
        </Button>
      </div>
      <div className="flex">
        <ScrollArea className="w-full max-h-96 border-2 border-muted rounded-xl">
          <div className="sticky top-0 z-40 border-foreground bg-secondary mb-2">
            <div className="flex flex-col">
              <div className="sticky top-0">
                <div className="flex gap-2 p-2 font-semibold">
                  <p className="w-48 break-words">Ingredient</p>
                  <p className="w-36 break-words">Amount</p>
                  <p className="w-24 break-words">Cost</p>
                  {nutrients.map((n) => (
                    <p
                      key={`${n.id}-name`}
                      className={`w-24 break-words ${trackedNutrients.find((tn) => tn.nutrient_id == n.id) ? "text-highlight" : ""}`}
                    >
                      {n.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {ingrs.map((i) => {
            return (
              <div key={`${i.serving.id}-${i.amount}`}>
                <div className="md:hidden">
                  <div className="sticky left-0 max-w-fit pl-2">
                    <p className="font-medium">{i.food.name}</p>
                    <p className="text-sm text-muted-foreground">{i.food.brand_name}</p>
                  </div>
                </div>

                <div className="flex mb-2 md:mb-4 gap-2">
                  <div className="sticky left-0 w-48">
                    <p className="hidden md:block font-medium bg-background pl-2">{i.food.name}</p>
                  </div>
                  <div className="w-36">
                    <p>
                      {`${displayNumber(i.amount * amount, " " + i.serving.display_serving_unit)}`}
                    </p>
                  </div>
                  <div className="w-24">
                    <p>{displayNumber(calcAmount(i, "cost"), " AUD")}</p>
                  </div>
                  {nutrients.map((n) => (
                    <div key={`${n.id}-value`} className="w-24">
                      <p
                        className={`${trackedNutrients.find((tn) => tn.nutrient_id == n.id) ? "text-highlight" : ""}`}
                      >
                        {displayNumber(
                          calcAmount(i, n.serving_name as keyof spServing),
                          n.unit,
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="sticky bottom-0 z-40 border-foreground bg-secondary mb-2">
            <div className="flex flex-col whitespace-nowrap">
              <div className="sticky bottom-0">
                <div className="flex gap-2 p-2 font-semibold">
                  <p className="w-[21.5rem] text-right pr-6">Total</p>
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
    </>
  );
}
