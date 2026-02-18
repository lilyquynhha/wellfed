"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { FullIngr, insertCreation } from "@/lib/actions/creation/creation-crud";
import CreationForm from "@/components/creations/creation-form";

export default function Page() {
  const supabase = createClient();

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

  return (
    <>
      <CreationForm
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
