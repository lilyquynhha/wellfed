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
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";

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
  const [servingSizes, setServingSizes] = useState<
    {
      creationId: string;
      servingSize: number;
    }[]
  >([]);

  useEffect(() => {
    const updated = [...servingSizes];
    creations.map((c) => {
      if (!updated.find((s) => s.creationId == c.id)) {
        updated.push({
          creationId: c.id,
          servingSize: 1,
        });
      }
      setServingSizes(updated);
    });
  }, [creations]);

  const calc = (creation: spCreation, figure: keyof spServing) => {
    let total = 0;
    const creationIngrs = ingrs.filter((i) => i.creationId == creation.id);
    creationIngrs.forEach((i) => {
      total +=
        resolveAmount(
          i.serving[figure] as number,
          i.serving.display_serving_size,
          i.amount *
            (servingSizes.find((s) => s.creationId == creation.id)
              ?.servingSize as number),
        ) ?? 0;
    });
    return total;
  };
  return (
    <div className="flex">
      <ScrollArea className="w-full max-h-96 border-2 border-muted rounded-xl">
        <div className="sticky top-0 z-40 border-foreground bg-secondary mb-2">
          <div className="flex flex-col">
            <div className="sticky top-0">
              <div className="flex gap-2 p-2 font-semibold">
                <p className="w-48 break-words">Creation</p>
                <p className="w-28 break-words">Serving size</p>
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
        {creations.map((c, i) => (
          <div key={`${c.id}`} className={i % 2 == 0 ? "bg-muted" : ""}>
            <div className="md:hidden">
              <div className="sticky left-0 flex w-[80vw] pl-2">
                <p className="font-medium">{c.name}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-6"
                  onClick={() => {
                    removeCreation(c);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <div className="flex items-center mb-2 gap-2">
              <div
                className={`sticky left-0 w-48 ${i % 2 == 0 ? "bg-muted" : "bg-background"}`}
              >
                <div className="hidden md:block pl-2">
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
              </div>

              <div className="w-28 pl-2">
                <Field>
                  <Input
                    value={
                      servingSizes.find((s) => s.creationId == c.id)
                        ?.servingSize ?? 1
                    }
                    onChange={(e) =>
                      setServingSizes((prev) =>
                        prev.map((s) =>
                          s.creationId == c.id
                            ? {
                                ...s,
                                servingSize: Number(e.target.value),
                              }
                            : s,
                        ),
                      )
                    }
                    type="number"
                    step="any"
                  />
                </Field>
              </div>
              <div className="w-24 pl-2">
                <p>{displayNumber(calc(c, "cost"))}</p>
              </div>
              {nutrients.map((n) => (
                <div key={`${n.id}-total`} className="w-24 pl-2">
                  <p
                    className={`${trackedNutrients.find((tn) => tn.nutrient_id == n.id) ? "text-highlight" : ""}`}
                  >
                    {displayNumber(
                      calc(c, n.serving_name as keyof spServing),
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
