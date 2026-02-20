import { Ingr } from "@/lib/actions/creation/creation-crud";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  spNutrient,
  spServing,
  spTrackedNutrient,
} from "@/lib/supabase/database-types";
import { displayNumber, resolveAmount } from "@/lib/actions/food/food-logic";

export function CreationView({
  nutrients,
  trackedNutrients,
  ingrs,
}: {
  nutrients: spNutrient[];
  trackedNutrients: spTrackedNutrient[];
  ingrs: Ingr[];
}) {
  const calcAmount = (i: Ingr, figure: keyof spServing) => {
    return resolveAmount(
      i.serving[figure] as number,
      i.serving.display_serving_size,
      i.amount,
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
    <div className="flex">
      <ScrollArea className="w-full max-h-96 border-2 border-muted rounded-xl">
        <div className="sticky top-0 z-40 border-foreground bg-primary-foreground mb-2">
          <div className="flex flex-col">
            <div className="sticky top-0 border-b-2 border-foreground">
              <div className="flex gap-2 p-2 font-semibold">
                <p className="w-48 break-words">Ingredient</p>
                <p className="w-36 break-words">Amount</p>
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
        {ingrs.map((i) => (
          <div key={`${i.serving.id}-${i.amount}`}>
            <div className="flex mb-4 gap-2 pl-2">
              <div className="sticky left-0 w-48 bg-background">
                <p className="font-medium">{i.food.name}</p>
              </div>
              <div className="w-36">
                <p>
                  {i.amount} {i.serving.display_serving_unit}
                </p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "cost"))}</p>
              </div>
              {nutrients.map((n) => (
                <div key={`${n.id}-value`} className="w-24">
                  <p
                    className={`${trackedNutrients.find((tn) => tn.nutrient_id == n.id) ? "text-teal-500" : ""}`}
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
        <div className="sticky bottom-0 z-40 border-foreground bg-primary-foreground mb-2">
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
                    className={`w-24 ${trackedNutrients.find((tn) => tn.nutrient_id == n.id) ? "text-teal-500" : ""}`}
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
  );
}
