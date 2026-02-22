"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FullIngr, insertCreation } from "@/lib/actions/creation/creation-crud";
import CreationForm from "@/components/creations/creation-form";
import {
  fetchNutrients,
  fetchTrackedNutrients,
} from "@/lib/actions/nutrient/nutrient-crud";
import { spNutrient, spTrackedNutrient } from "@/lib/supabase/database-types";

export default function Page() {
  const supabase = createClient();

  const [nutrients, setNutrients] = useState<spNutrient[]>([]);
  const [trackedNutrients, setTrackedNutrients] = useState<spTrackedNutrient[]>(
    [],
  );

  // Creation states
  const [creationName, setCreationName] = useState("");
  const [creationType, setCreationType] = useState("");
  const [ingrs, setIngrs] = useState<FullIngr[]>([]);
  const [isInserting, setIsInserting] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    setIsInserting(true);
    setError("");
    const response = await insertCreation(
      supabase,
      creationName,
      creationType,
      ingrs.map((i) => i.ingr),
    );
    setError(response);
    if (!response) {
      toast.success("Creation added successfully!", {
        position: "top-center",
      });
    }
    setIsInserting(false);
  };

  // Fetch tracked nutrients
  useEffect(() => {
    const fetchData = async () => {
      const nutrientsData = await fetchNutrients(supabase);

      const trackedData = await fetchTrackedNutrients(supabase);
      setTrackedNutrients(trackedData);

      nutrientsData.sort((a, b) => {
        const aPoint = trackedData.find((t) => t.nutrient_id == a.id)
          ? a.display_order
          : nutrientsData.length + a.display_order;
        const bPoint = trackedData.find((t) => t.nutrient_id == b.id)
          ? b.display_order
          : nutrientsData.length + b.display_order;
        return aPoint - bPoint;
      });
      setNutrients(nutrientsData);
    };

    fetchData();
  }, []);

  return (
    <>
      <CreationForm
        nutrients={nutrients}
        trackedNutrients={trackedNutrients}
        onNameChange={setCreationName}
        onTypeChange={setCreationType}
        onIngrsChange={setIngrs}
        fetchedCreation={null}
      />

      <Button className="w-full" disabled={isInserting} onClick={create}>
        Create
      </Button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
}
