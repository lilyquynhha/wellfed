"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useState } from "react";
import {
  ValidateState,
  ActionState,
  validateFatsecretFood,
  insertFood,
} from "@/lib/actions/food/food-crud";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import FoodForm from "@/components/foods/food-form";
import { spNewFood, spNewServing } from "@/lib/supabase/database-types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRightIcon } from "lucide-react";

export default function Page() {
  const supabase = createClient();

  const [initialFood, setInitialFood] = useState<spNewFood | undefined>(
    undefined,
  );
  const [initialServings, setInitialServings] = useState<
    spNewServing[] | undefined
  >(undefined);

  const [food, setFood] = useState<spNewFood | undefined>(undefined);
  const [servings, setServings] = useState<spNewServing[] | undefined>(
    undefined,
  );

  const initialValidateState: ValidateState = {};
  const [validateState, validateFoodAction, isValidating] = useActionState(
    validateFatsecretFood,
    initialValidateState,
  );
  const [showValidateError, setShowValidateError] = useState(false);

  const initialInsertState: ActionState = {
    success: false,
  };
  const [insertState, setInsertState] = useState(initialInsertState);
  const [isInserting, setIsInserting] = useState(false);
  const [showFInsertError, setShowFInsertError] = useState(false);

  useEffect(() => {
    if (validateState.foodAndServings) {
      setInitialFood(validateState.foodAndServings.food);
      setInitialServings(validateState.foodAndServings.servings);
    }
    setShowValidateError(true);
  }, [validateState]);

  useEffect(() => {
    if (insertState.success) {
      toast.success("Food created successfully!", {
        position: "bottom-center",
      });

      setInsertState(initialInsertState);
      return;
    }

    setShowFInsertError(true);
  }, [insertState]);

  return (
    <>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="group text-base">
            <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
            Use Fatsecret API response
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          {/** Validate Fatsecret response */}
          <form action={validateFoodAction}>
            <FieldGroup>
              <Field>
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
                    setShowFInsertError(false);
                  }}
                >
                  {isValidating ? "Validating data..." : "Submit"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          {showValidateError && validateState.errorMessage && (
            <>
              <div className="mt-4">
                <p className=" text-red-500">{validateState.errorMessage}</p>
              </div>
            </>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/** Inputs for food details*/}
      <div className="mt-6">
        <FoodForm
          initialFood={initialFood}
          initialServings={initialServings}
          setFood={setFood}
          setServings={setServings}
        />

        {food && servings && (
          <Button
            className="w-full"
            onClick={async () => {
              setShowFInsertError(false);
              setIsInserting(true);
              setInsertState(await insertFood(supabase, food, servings));
              setIsInserting(false);
            }}
            disabled={isInserting}
          >
            {isInserting ? "Adding food..." : "Add food"}
          </Button>
        )}

        {showFInsertError && !insertState.success && (
          <div className="mt-4">
            <p className=" text-red-500">{insertState.errorMessage}</p>
          </div>
        )}
      </div>
    </>
  );
}
