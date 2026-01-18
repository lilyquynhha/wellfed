"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useState } from "react";
import {
  ValidateState,
  insertFood,
  InsertState,
  validateFatsecretFood,
} from "./create-food";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const supabase = createClient();

  const validateFoodFunc = validateFatsecretFood.bind(null, supabase);
  const initialValidateState: ValidateState = {};

  const [validateState, validateFoodAction, isValidating] = useActionState(
    validateFoodFunc,
    initialValidateState,
  );

  const insertFoodFunc = insertFood.bind(null, supabase, validateState);
  const initialInsertState: InsertState = {
    success: false,
  };
  const [insertState, insertFoodAction, isInserting] = useActionState(
    insertFoodFunc,
    initialInsertState,
  );

  const [showValidateError, setShowValidateError] = useState(false);
  const [showInsertError, setShowInsertError] = useState(false);

  useEffect(() => {
    setShowValidateError(true);
  }, [validateState]);

  useEffect(() => {
    setShowInsertError(true);
  }, [insertState]);

  return (
    <div className="mx-auto md:w-[80%] lg:w-[70%] py-6 px-6 overflow-x-hidden">
      <h1 className="text-5xl mb-10">Add food from Fatsecret API response</h1>

      {/** Validate Fatsecret response */}
      <form action={validateFoodAction}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="fatsecretResponse">
              Fatsecret API Response
            </FieldLabel>
            <Textarea
              id="fatsecretResponse"
              name="fatsecretResponse"
              placeholder="Enter Fatsecret API response in JSON format"
              className="resize"
            />
          </Field>
          <Field orientation="horizontal">
            <Button
              type="submit"
              disabled={isValidating}
              onClick={() => {
                setShowValidateError(false);
                setShowInsertError(false);
              }}
            >
              Submit
            </Button>
            {isValidating && <p>Validating data...</p>}
          </Field>
        </FieldGroup>
      </form>
      <div className="mt-4">
        {showValidateError && validateState.error && (
          <p className=" text-red-500">{validateState.error}</p>
        )}
      </div>

      {/** Show food servings for modification & Confirm adding food*/}
      {validateState.data && (
        <div className="mt-6">
          <div>
            <p>
              <span className="font-semibold">Food name</span>:{" "}
              {validateState.data.food.foodName}
            </p>
            {validateState.data.food.brandName != "" && (
              <p>
                <span className="font-semibold">Brand name</span>:{" "}
                {validateState.data.food.brandName}
              </p>
            )}
            <p>
              <span className="font-semibold">Serving options</span>:
            </p>
          </div>

          <form action={insertFoodAction} className="mb-4">
            <ScrollArea className="w-full my-4">
              <div className="flex space-x-4">
                {validateState.data.food.servings.serving.map((s, i) => (
                  <div
                    className="w-80"
                    key={`${s.servingSize} ${s.servingUnit} - ${s.displayServingSize} ${s.displayServingUnit}`}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Serving {i + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FieldGroup className="gap-4">
                          <FieldLabel>Metric serving details:</FieldLabel>
                          <Field className="flex flex-row">
                            <Input
                              className="basis-2/5"
                              id={`serving-size-${i}`}
                              name={`serving-size-${i}`}
                              defaultValue={s.servingSize}
                              type="number"
                              step="any"
                              min="0"
                              required
                            />
                            <Select
                              name={`serving-unit-${i}`}
                              defaultValue={s.servingUnit}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ML">ml</SelectItem>
                                <SelectItem value="G">g</SelectItem>
                                <SelectItem value="OZ">oz</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>

                          <FieldLabel>Display serving details:</FieldLabel>
                          <Field className="flex flex-row">
                            <Input
                              className="basis-2/5"
                              id={`display-serving-size-${i}`}
                              name={`display-serving-size-${i}`}
                              defaultValue={s.displayServingSize}
                              type="number"
                              step="any"
                              min="0"
                              required
                            />
                            <Input
                              id={`display-serving-unit-${i}`}
                              name={`display-serving-unit-${i}`}
                              defaultValue={s.displayServingUnit}
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
                              Calories
                            </FieldLabel>
                            <Input
                              className="basis-[35%]"
                              id={`calories-${i}`}
                              name={`calories-${i}`}
                              defaultValue={s.calories}
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
                              Carbs
                            </FieldLabel>
                            <Input
                              className="basis-[35%]"
                              id={`carbs-${i}`}
                              name={`carbs-${i}`}
                              defaultValue={s.carbs}
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
                              Protein
                            </FieldLabel>
                            <Input
                              className="basis-[35%]"
                              id={`protein-${i}`}
                              name={`protein-${i}`}
                              defaultValue={s.protein}
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
                              Fat
                            </FieldLabel>
                            <Input
                              className="basis-[35%]"
                              id={`fat-${i}`}
                              name={`fat-${i}`}
                              defaultValue={s.fat}
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
                              defaultValue={
                                s.saturatedFat ? s.saturatedFat : ""
                              }
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
                              defaultValue={
                                s.polyunsaturatedFat ? s.polyunsaturatedFat : ""
                              }
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
                              defaultValue={
                                s.monounsaturatedFat ? s.monounsaturatedFat : ""
                              }
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
                              defaultValue={s.transFat ? s.transFat : ""}
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
                              defaultValue={s.fiber ? s.fiber : ""}
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
                              defaultValue={s.sugar ? s.sugar : ""}
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
                              defaultValue={s.sodium ? s.sodium : ""}
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
                              defaultValue={s.cholesterol ? s.cholesterol : ""}
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
                              defaultValue={s.potassium ? s.potassium : ""}
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
                              defaultValue={s.vitaminA ? s.vitaminA : ""}
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
                              defaultValue={s.vitaminC ? s.vitaminC : ""}
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
                              defaultValue={s.vitaminD ? s.vitaminD : ""}
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
                              defaultValue={s.calcium ? s.calcium : ""}
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
                              defaultValue={s.iron ? s.iron : ""}
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
                              defaultValue={s.addedSugars ? s.addedSugars : ""}
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

            <Field>
              <Button
                type="submit"
                disabled={isInserting}
                onClick={() => {
                  setShowInsertError(false);
                }}
              >
                Add food
              </Button>
              {isInserting && <p>Adding food...</p>}
            </Field>
          </form>

          {insertState && showInsertError && (
            <div className="mt-4">
              {insertState.success ? (
                <p className=" text-blue-500">
                  Food added successfully.
                </p>
              ) : (
                <p className=" text-red-500">
                  {insertState.errorMessage}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
