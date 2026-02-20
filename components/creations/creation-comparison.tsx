import { Ingr } from "@/lib/actions/creation/creation-crud";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  spCreation,
  spNutrient,
  spServing,
  spTrackedNutrient,
} from "@/lib/supabase/database-types";
import { displayNumber, resolveAmount } from "@/lib/actions/food/food-logic";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

export function CreationComparison({
  nutrients,
  trackedNutrients,
  creations,
  ingrs,
  removeCreation,
}: {
  nutrients: spNutrient[];
  trackedNutrients: spTrackedNutrient[];
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
                {nutrients.map((n) => (
                  <p
                    key={`${n.id}-name`}
                    className={`w-24 break-words ${trackedNutrients.find((tn) => tn.nutrient_id == n.id) ? "text-teal-500" : ""}`}
                  >
                    {n.name}
                  </p>
                ))}
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
              {nutrients.map((n) => (
                <div key={`${n.id}-total`} className="w-24">
                  <p
                    className={`${trackedNutrients.find((tn) => tn.nutrient_id == n.id) ? "text-teal-500" : ""}`}
                  >
                    {displayNumber(
                      calcTotal(c, n.serving_name as keyof spServing),
                      n.unit,
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
