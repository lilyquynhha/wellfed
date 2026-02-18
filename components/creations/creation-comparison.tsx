import { Ingr } from "@/lib/actions/creation/creation-crud";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { spCreation, spServing } from "@/lib/supabase/database-types";
import { displayNumber, resolveAmount } from "@/lib/actions/food/food-logic";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

export function CreationComparison({
  creations,
  ingrs,
  removeCreation,
}: {
  creations: spCreation[];
  ingrs: Ingr[];
  removeCreation: (c: spCreation) => void;
}) {
  const calcAmount = (i: Ingr, figure: keyof spServing) => {
    return resolveAmount(
      i.serving[figure] as number,
      i.serving.display_serving_size,
      i.amount,
    );
  };

  const calcTotal = (creation: spCreation, figure: keyof spServing) => {
    let total = 0;
    const creationIngrs = ingrs.filter((i) => i.creationId == creation.id);
    creationIngrs.forEach((i) => {
      total += calcAmount(i, figure) ?? 0;
    });
    return total;
  };
  return (
    <div className="flex">
      <ScrollArea className="w-full max-h-96 border-2 border-muted rounded-xl">
        <div className="sticky top-0 z-40 border-foreground bg-primary-foreground mb-2">
          <div className="flex flex-col">
            <div className="sticky top-0 border-b-2 border-foreground">
              <div className="flex gap-2 p-2 font-semibold">
                <p className="w-48 break-words">Creation</p>
                <p className="w-24 break-words">Cost</p>
                <p className="w-24 break-words">Calories</p>
                <p className="w-24 break-words">Carbs</p>
                <p className="w-24 break-words">Protein</p>
                <p className="w-24 break-words">Fat</p>
                <p className="w-24 break-words">Saturated Fat</p>
                <p className="w-24 break-words">Polyunsaturated Fat</p>
                <p className="w-24 break-words">Monounsaturated Fat</p>
                <p className="w-24 break-words">Trans Fat</p>
                <p className="w-24 break-words">Fiber</p>
                <p className="w-24 break-words">Sugar</p>
                <p className="w-24 break-words">Sodium</p>
                <p className="w-24 break-words">Cholesterol</p>
                <p className="w-24 break-words">Potassium</p>
                <p className="w-24 break-words">Vitamin A</p>
                <p className="w-24 break-words">Vitamin C</p>
                <p className="w-24 break-words">Vitamin D</p>
                <p className="w-24 break-words">Calcium</p>
                <p className="w-24 break-words">Iron</p>
                <p className="w-24 break-words">Added Sugars</p>
              </div>
            </div>
          </div>
        </div>
        {creations.map((c) => (
          <div key={`${c.id}`}>
            <div className="flex mb-4 gap-2 pl-2">
              <div className="sticky left-0 w-48 bg-background">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-6 float-right mr-2"
                  onClick={() => {
                    removeCreation(c);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
                <p className="font-medium">{c.name}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "cost"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "calories"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "carbs"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "protein"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "fat"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "saturated_fat"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "polyunsaturated_fat"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "monounsaturated_fat"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "trans_fat"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "fiber"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "sugar"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "sodium"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "cholesterol"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "potassium"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "vitamin_a"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "vitamin_c"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "vitamin_d"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "calcium"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "iron"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcTotal(c, "added_sugars"))}</p>
              </div>
            </div>
          </div>
        ))}

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
