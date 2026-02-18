import { Ingr } from "@/lib/actions/creation/creation-crud";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { spServing } from "@/lib/supabase/database-types";
import { displayNumber, resolveAmount } from "@/lib/actions/food/food-logic";

export function CreationView({ ingrs }: { ingrs: Ingr[] }) {
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
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "calories"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "carbs"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "protein"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "fat"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "saturated_fat"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "polyunsaturated_fat"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "monounsaturated_fat"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "trans_fat"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "fiber"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "sugar"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "sodium"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "cholesterol"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "potassium"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "vitamin_a"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "vitamin_c"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "vitamin_d"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "calcium"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "iron"))}</p>
              </div>
              <div className="w-24">
                <p>{displayNumber(calcAmount(i, "added_sugars"))}</p>
              </div>
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
                <p className="w-24">
                  {displayNumber(calcTotal("calories"), "kcal")}
                </p>
                <p className="w-24">{displayNumber(calcTotal("carbs"), "g")}</p>
                <p className="w-24">
                  {displayNumber(calcTotal("protein"), "g")}
                </p>
                <p className="w-24">{displayNumber(calcTotal("fat"), "g")}</p>
                <p className="w-24">
                  {displayNumber(calcTotal("saturated_fat"), "g")}
                </p>
                <p className="w-24">
                  {displayNumber(calcTotal("polyunsaturated_fat"), "g")}
                </p>
                <p className="w-24">
                  {displayNumber(calcTotal("monounsaturated_fat"), "g")}
                </p>
                <p className="w-24">
                  {displayNumber(calcTotal("trans_fat"), "g")}
                </p>
                <p className="w-24">{displayNumber(calcTotal("fiber"), "g")}</p>
                <p className="w-24">{displayNumber(calcTotal("sugar"), "g")}</p>
                <p className="w-24">
                  {displayNumber(calcTotal("sodium"), "mg")}
                </p>
                <p className="w-24">
                  {displayNumber(calcTotal("cholesterol"), "mg")}
                </p>
                <p className="w-24">
                  {displayNumber(calcTotal("potassium"), "mg")}
                </p>
                <p className="w-24">
                  {displayNumber(calcTotal("vitamin_a"), "mcg")}
                </p>
                <p className="w-24">
                  {displayNumber(calcTotal("vitamin_c"), "mg")}
                </p>
                <p className="w-24">
                  {displayNumber(calcTotal("vitamin_d"), "mcg")}
                </p>
                <p className="w-24">
                  {displayNumber(calcTotal("calcium"), "mg")}
                </p>
                <p className="w-24">{displayNumber(calcTotal("iron"), "mg")}</p>
                <p className="w-24">
                  {displayNumber(calcTotal("added_sugars"), "g")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
