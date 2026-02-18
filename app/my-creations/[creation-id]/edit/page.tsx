"use client";

import { use, useEffect, useState } from "react";
import {
  spCreation,
  spFood,
  spIngr,
  spServing,
} from "@/lib/supabase/database-types";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { FullIngr, updateCreation } from "@/lib/actions/creation/creation-crud";
import CreationForm from "@/components/creations/creation-form";

export default function Page({
  params,
}: {
  params: Promise<{ "creation-id": string }>;
}) {
  const { "creation-id": creationId } = use(params);
  const [creationIdError, setCreationIdError] = useState(false);
  const [fetchedCreation, setFetchedCreation] = useState<{
    initialName: string;
    initialType: string;
    initialIngrs: FullIngr[];
  }>();

  const supabase = createClient();

  // Creation states
  const [creationName, setCreationName] = useState("");
  const [creationType, setCreationType] = useState("");
  const [ingrs, setIngrs] = useState<FullIngr[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const update = async () => {
    setIsUpdating(true);
    setError("");
    const response = await updateCreation(
      supabase,
      creationId,
      creationName,
      creationType,
      ingrs.map((i) => i.ingr),
    );
    setError(response);
    if (!response) {
      toast.success("Creation updated successfully!", {
        position: "top-center",
      });
    }
    setIsUpdating(false);
  };

  // Fetch creation
  useEffect(() => {
    async function fetchCreation() {
      const { data } = await supabase
        .from("creations")
        .select()
        .eq("id", creationId)
        .maybeSingle();

      return data as spCreation;
    }

    let name: string = "";
    let type: string = "";
    fetchCreation().then((res) => {
      if (!res) {
        setCreationIdError(true);
      } else {
        name = res.name;
        type = res.type;
      }
    });

    async function fetchIngrs() {
      const { data } = await supabase
        .from("ingredients")
        .select()
        .eq("creation_id", creationId);

      return data as spIngr[];
    }

    fetchIngrs().then(async (res) => {
      const updatedIngrs = await Promise.all(
        res.map(async (i) => {
          const { data } = await supabase
            .from("servings")
            .select("owner_food_id")
            .eq("id", i.serving_id)
            .limit(1)
            .single();
          const { owner_food_id: foodId } = data as { owner_food_id: string };
          const { data: food } = await supabase
            .from("foods")
            .select()
            .eq("id", foodId)
            .limit(1)
            .single();
          const fetchedFood = food as spFood;

          const { data: servings } = await supabase
            .from("servings")
            .select()
            .eq("owner_food_id", foodId);
          const fetchedServings = servings as spServing[];

          return {
            food: fetchedFood,
            servings: fetchedServings,
            ingr: {
              amount: i.amount,
              serving_id: i.serving_id,
            },
          };
        }),
      );

      setFetchedCreation({
        initialName: name,
        initialType: type,
        initialIngrs: updatedIngrs,
      });
    });
  }, []);

  if (creationIdError) return <p>Invalid creation ID.</p>;

  return (
    <>
      {fetchedCreation ? (
        <>
          <CreationForm
            onNameChange={setCreationName}
            onTypeChange={setCreationType}
            onIngrsChange={setIngrs}
            fetchedCreation={fetchedCreation}
          />

          <Button className="w-full" disabled={isUpdating} onClick={update}>
            Update
          </Button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      ) : (
        <p>Loading creation...</p>
      )}
    </>
  );
}
