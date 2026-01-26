"use client";

import { spNewFood, spNewServing } from "@/lib/supabase/database-types";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toNumber } from "@/lib/utils";

export default function FoodForm({
  initialFood,
  initialServings,
  setFood,
  setServings,
}: {
  initialFood: spNewFood | undefined;
  initialServings: spNewServing[] | undefined;
  setFood: (food: spNewFood) => void;
  setServings: (servings: spNewServing[]) => void;
}) {
  const emptyFood = {
    name: "",
    brand_name: "",
  };

  const emptyServing = (i: number): spNewServing => ({
    id: (numberOfServings + i - 1).toString(),
    added_sugars: null,
    calcium: null,
    calories: 0,
    carbs: 0,
    cholesterol: null,
    cost: null,
    display_serving_size: 0,
    display_serving_unit: "",
    fat: 0,
    fiber: null,
    iron: null,
    monounsaturated_fat: null,
    polyunsaturated_fat: null,
    potassium: null,
    protein: 0,
    saturated_fat: null,
    serving_size: 0,
    serving_unit: "ML",
    sodium: null,
    sugar: null,
    trans_fat: null,
    vitamin_a: null,
    vitamin_c: null,
    vitamin_d: null,
  });

  const [formFood, setFormFood] = useState(initialFood ?? emptyFood);
  const [numberOfServings, setNumberOfServings] = useState(
    initialServings?.length ?? 1,
  );
  const [formServings, setFormServings] = useState(
    initialServings
      ? new Array(...initialServings)
      : new Array(emptyServing(0)),
  );

  useEffect(() => {
    setFormFood(initialFood ?? emptyFood);
    setNumberOfServings(initialServings?.length ?? 1);
    setFormServings(
      initialServings
        ? new Array(...initialServings)
        : new Array(emptyServing(0)),
    );
  }, [initialFood, initialServings]);

  // Add or delete servings if number of servings changes
  useEffect(() => {
    let updatedServings = new Array(...formServings);
    if (numberOfServings > formServings.length) {
      for (let i = 0; i < numberOfServings - formServings.length; i++) {
        updatedServings.push(emptyServing(i));

        setFormServings(updatedServings);
      }
    } else if (numberOfServings < formServings.length) {
      for (let i = 0; i < formServings.length - numberOfServings; i++) {
        updatedServings.pop();
        setFormServings(updatedServings);
      }
    }
  }, [numberOfServings]);

  useEffect(() => {
    setFood(formFood);
  }, [formFood]);

  useEffect(() => {
    setServings(formServings);
    setNumberOfServings(formServings.length);
  }, [formServings]);

  return (
    <>
      <div>
        <FieldGroup className="gap-3">
          <Field className="flex flex-row space-x-2">
            <FieldLabel className="max-w-fit" htmlFor="food-name">
              Food name
            </FieldLabel>
            <Input
              id={`food-name`}
              name={`food-name`}
              value={formFood.name}
              onChange={(e) => {
                setFormFood({ ...formFood, name: e.target.value });
              }}
              required
            />
          </Field>
          <Field className="flex flex-row space-x-2">
            <FieldLabel className="max-w-fit" htmlFor="brand-name">
              Brand name
            </FieldLabel>
            <Input
              id={`brand-name`}
              name={`brand-name`}
              value={formFood.brand_name}
              onChange={(e) => {
                setFormFood({ ...formFood, brand_name: e.target.value });
              }}
            />
          </Field>
          <Field className="flex flex-row">
            <FieldLabel className="max-w-fit" htmlFor="number-of-servings">
              Number of servings:{" "}
            </FieldLabel>
            <div className="max-w-fit">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => {
                  setNumberOfServings(numberOfServings - 1);
                }}
                disabled={numberOfServings == 1}
              >
                <Minus size={16} />
              </Button>
            </div>
            <div className="basis-8 place-self-center text-center">
              {numberOfServings}
            </div>
            <div className="max-w-fit">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => {
                  setNumberOfServings(numberOfServings + 1);
                }}
              >
                <Plus size={16} />
              </Button>
            </div>
          </Field>
        </FieldGroup>

        <ScrollArea className="w-full my-4">
          <div className="flex space-x-4">
            {formServings.map((s, i) => (
              <div key={i} className="w-80">
                <Card>
                  <CardHeader>
                    <CardTitle>Serving {i + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FieldGroup className="gap-4">
                      <FieldLabel>Metric serving details *</FieldLabel>
                      <Field className="flex flex-row">
                        <Input
                          className="basis-1/2"
                          id={`serving-size-${i}`}
                          name={`serving-size-${i}`}
                          value={formServings[i].serving_size}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx == i
                                  ? {
                                      ...us,
                                      serving_size: Number(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                          required
                        />
                        <div className="basis-1/2">
                          <Select
                            name={`serving-unit-${i}`}
                            defaultValue={s.serving_unit}
                            value={formServings[i].serving_unit}
                            onValueChange={(v: "ML" | "G" | "OZ") => {
                              setFormServings(
                                formServings.map((us, idx) =>
                                  idx === i
                                    ? {
                                        ...us,
                                        serving_unit: v,
                                      }
                                    : us,
                                ),
                              );
                            }}
                            required
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ML">ml</SelectItem>
                              <SelectItem value="G">g</SelectItem>
                              <SelectItem value="OZ">oz</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </Field>

                      <FieldLabel>Display serving details *</FieldLabel>
                      <Field className="flex flex-row">
                        <Input
                          className="basis-1/2"
                          id={`display-serving-size-${i}`}
                          name={`display-serving-size-${i}`}
                          value={formServings[i].display_serving_size}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx == i
                                  ? {
                                      ...us,
                                      display_serving_size: Number(
                                        e.target.value,
                                      ),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                          required
                        />
                        <Input
                          className="basis-1/2"
                          id={`display-serving-unit-${i}`}
                          name={`display-serving-unit-${i}`}
                          value={formServings[i].display_serving_unit}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx == i
                                  ? {
                                      ...us,
                                      display_serving_unit: e.target.value,
                                    }
                                  : us,
                              ),
                            );
                          }}
                          placeholder="cup, etc."
                          required
                        />
                      </Field>

                      <Separator />

                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`cost-${i}`}
                        >
                          Cost
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`cost-${i}`}
                          name={`cost-${i}`}
                          value={formServings[i].cost ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? { ...us, cost: toNumber(e.target.value) }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">AUD</p>
                      </Field>

                      <Separator />

                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`calories-${i}`}
                        >
                          Calories *
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`calories-${i}`}
                          name={`calories-${i}`}
                          value={formServings[i].calories}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx == i
                                  ? {
                                      ...us,
                                      calories: Number(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                          required
                        />
                        <p className="basis-[15%] self-center">kcal</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`carbs-${i}`}
                        >
                          Carbs *
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`carbs-${i}`}
                          name={`carbs-${i}`}
                          value={formServings[i].carbs}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx == i
                                  ? {
                                      ...us,
                                      carbs: Number(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                          required
                        />
                        <p className="basis-[15%] self-center">g</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`protein-${i}`}
                        >
                          Protein *
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`protein-${i}`}
                          name={`protein-${i}`}
                          value={formServings[i].protein}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx == i
                                  ? {
                                      ...us,
                                      protein: Number(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                          required
                        />
                        <p className="basis-[15%] self-center">g</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`fat-${i}`}
                        >
                          Fat *
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`fat-${i}`}
                          name={`fat-${i}`}
                          value={formServings[i].fat}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx == i
                                  ? {
                                      ...us,
                                      fat: Number(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                          required
                        />
                        <p className="basis-[15%] self-center">g</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`saturated-fat-${i}`}
                        >
                          Saturated Fat
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`saturated-fat-${i}`}
                          name={`saturated-fat-${i}`}
                          value={formServings[i].saturated_fat ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us) => {
                                if (us.id === i.toString()) {
                                  return {
                                    ...us,
                                    saturated_fat: toNumber(e.target.value),
                                  };
                                }
                                return us;
                              }),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">g</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`polyunsaturated-fat-${i}`}
                        >
                          Polyunsaturated Fat
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`polyunsaturated-fat-${i}`}
                          name={`polyunsaturated-fat-${i}`}
                          value={formServings[i].polyunsaturated_fat ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? {
                                      ...us,
                                      polyunsaturated_fat: toNumber(
                                        e.target.value,
                                      ),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">g</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`monounsaturated-fat-${i}`}
                        >
                          Monounsaturated Fat
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`monounsaturated-fat-${i}`}
                          name={`monounsaturated-fat-${i}`}
                          value={formServings[i].monounsaturated_fat ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? {
                                      ...us,
                                      monounsaturated_fat: toNumber(
                                        e.target.value,
                                      ),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">g</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`trans-fat-${i}`}
                        >
                          Trans Fat
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`trans-fat-${i}`}
                          name={`trans-fat-${i}`}
                          value={formServings[i].trans_fat ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? {
                                      ...us,
                                      trans_fat: toNumber(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">g</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`fiber-${i}`}
                        >
                          Fiber
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`fiber-${i}`}
                          name={`fiber-${i}`}
                          value={formServings[i].fiber ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? { ...us, fiber: toNumber(e.target.value) }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">g</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`sugar-${i}`}
                        >
                          Sugar
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`sugar-${i}`}
                          name={`sugar-${i}`}
                          value={formServings[i].sugar ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? { ...us, sugar: toNumber(e.target.value) }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">g</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`sodium-${i}`}
                        >
                          Sodium
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`sodium-${i}`}
                          name={`sodium-${i}`}
                          value={formServings[i].sodium ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? { ...us, sodium: toNumber(e.target.value) }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">mg</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`cholesterol-${i}`}
                        >
                          Cholesterol
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`cholesterol-${i}`}
                          name={`cholesterol-${i}`}
                          value={formServings[i].cholesterol ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? {
                                      ...us,
                                      cholesterol: toNumber(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">mg</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`potassium-${i}`}
                        >
                          Potassium
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`potassium-${i}`}
                          name={`potassium-${i}`}
                          value={formServings[i].potassium ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? {
                                      ...us,
                                      potassium: toNumber(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">mg</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`vitamin-a-${i}`}
                        >
                          Vitamin A
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`vitamin-a-${i}`}
                          name={`vitamin-a-${i}`}
                          value={formServings[i].vitamin_a ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? {
                                      ...us,
                                      vitamin_a: toNumber(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">mcg</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`vitamin-c-${i}`}
                        >
                          Vitamin C
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`vitamin-c-${i}`}
                          name={`vitamin-c-${i}`}
                          value={formServings[i].vitamin_c ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? {
                                      ...us,
                                      vitamin_c: toNumber(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">mg</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`vitamin-d-${i}`}
                        >
                          Vitamin D
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`vitamin-d-${i}`}
                          name={`vitamin-d-${i}`}
                          value={formServings[i].vitamin_d ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? {
                                      ...us,
                                      vitamin_d: toNumber(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">mcg</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`calcium-${i}`}
                        >
                          Calcium
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`calcium-${i}`}
                          name={`calcium-${i}`}
                          value={formServings[i].calcium ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? { ...us, calcium: toNumber(e.target.value) }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">mg</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`iron-${i}`}
                        >
                          Iron
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`iron-${i}`}
                          name={`iron-${i}`}
                          value={formServings[i].iron ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? { ...us, iron: toNumber(e.target.value) }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">mg</p>
                      </Field>
                      <Field className="flex flex-row">
                        <FieldLabel
                          className="basis-[50%]"
                          htmlFor={`added-sugars-${i}`}
                        >
                          Added Sugars
                        </FieldLabel>
                        <Input
                          className="basis-[35%]"
                          id={`added-sugars-${i}`}
                          name={`added-sugars-${i}`}
                          value={formServings[i].added_sugars ?? ""}
                          onChange={(e) => {
                            setFormServings(
                              formServings.map((us, idx) =>
                                idx === i
                                  ? {
                                      ...us,
                                      added_sugars: toNumber(e.target.value),
                                    }
                                  : us,
                              ),
                            );
                          }}
                          type="number"
                          step="any"
                          min="0"
                        />
                        <p className="basis-[15%] self-center">g</p>
                      </Field>
                    </FieldGroup>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Button
          className="w-full mb-2"
          variant="secondary"
          onClick={() => {
            setFormFood(emptyFood);
            setFormServings(new Array(emptyServing(0)));
          }}
        >
          Reset
        </Button>
      </div>
    </>
  );
}
