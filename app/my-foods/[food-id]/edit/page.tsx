"use client";

import { use, useEffect, useState } from "react";

import { spFood, spNewServing, spServing } from "@/lib/supabase/database-types";
import FoodForm from "@/components/foods/food-form";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ActionState, updateFood } from "@/lib/actions/food/food-crud";
import { toast } from "sonner";

export default function Page({
  params,
}: {
  params: Promise<{ "food-id": string }>;
}) {
  const { "food-id": foodId } = use(params);
  const [foodIdError, setFoodIdError] = useState(false);

  const supabase = createClient();

  const [initialFood, setInitialFood] = useState<spFood | undefined>(undefined);
  const [initialServings, setInitialServings] = useState<
    spServing[] | undefined
  >(undefined);

  const [food, setFood] = useState<spFood | undefined>(undefined);
  const [servings, setServings] = useState<spNewServing[] | undefined>(
    undefined,
  );

  const initialUpdateState: ActionState = {
    success: false,
  };

  const [updateState, setUpdateState] = useState(initialUpdateState);
  const [showError, setShowError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch food
  useEffect(() => {
    setShowError(false);

    async function fetchFood() {
      const { data } = await supabase
        .from("foods")
        .select()
        .eq("id", foodId)
        .maybeSingle();

      return data as spFood;
    }

    fetchFood().then((res) => {
      if (!res) {
        setFoodIdError(true);
      } else {
        setInitialFood(res);
      }
    });

    async function fetchServings() {
      const { data } = await supabase
        .from("servings")
        .select()
        .eq("owner_food_id", foodId);

      return data as spServing[];
    }
    fetchServings().then(setInitialServings);
  }, []);

  useEffect(() => {
    if (updateState.success) {
      toast.success("Food updated successfully!", {
        position: "bottom-right",
      });

      setUpdateState(initialUpdateState);
    }
  }, [updateState]);

  if (foodIdError) return <p>Invalid Food ID.</p>;

  if (!foodIdError && initialFood && initialServings)
    return (
      <>
        <FoodForm
          initialFood={initialFood}
          setFood={(f) => {
            setFood({ ...initialFood, ...f });
          }}
          initialServings={initialServings}
          setServings={setServings}
        />
        {food && servings && (
          <Field>
            <Button
              onClick={async () => {
                setIsUpdating(true);
                setUpdateState(await updateFood(supabase, food, servings));
                setIsUpdating(false);
                setShowError(true);
              }}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating food..." : "Update food"}
            </Button>
          </Field>
        )}
        {showError && !updateState.success && (
          <div className="mt-4">
            <p className=" text-red-500">{updateState.errorMessage}</p>
          </div>
        )}
      </>
    );
}
