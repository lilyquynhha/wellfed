"use client";

import { CreationSearchResult } from "@/components/search-utilities/search-results";
import SearchBar from "@/components/search-bar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Ingr, MAX_SEARCH_RESULTS } from "@/lib/actions/creation/creation-crud";
import { createClient } from "@/lib/supabase/client";
import {
  spCostOverride,
  spCreation,
  spFood,
  spIngr,
  spNutrient,
  spServing,
  spTrackedNutrient,
} from "@/lib/supabase/database-types";
import { useEffect, useState } from "react";
import { CreationSearchResultSkeletion } from "@/components/ui/skeleton";
import { CreationView } from "@/components/creations/creation-view";
import { toast } from "sonner";
import { CreationComparison } from "@/components/creations/creation-comparison";
import {
  fetchNutrients,
  fetchTrackedNutrients,
} from "@/lib/actions/nutrient/nutrient-crud";
import { Heading } from "@/components/typography";

export default function Page() {
  const supabase = createClient();

  const [nutrients, setNutrients] = useState<spNutrient[]>([]);
  const [trackedNutrients, setTrackedNutrients] = useState<spTrackedNutrient[]>(
    [],
  );

  // Creation search states
  const [creationName, setCreationName] = useState("");
  const [creationType, setCreationType] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [foundCreations, setFoundCreations] = useState<spCreation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(false);

  const [selectedCreation, setSelectedCreation] = useState<spCreation>();
  const [selectedIngrs, setSelectedIngrs] = useState<Ingr[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [compareCreations, setCompareCreations] = useState<spCreation[]>([]);
  const [compareIngrs, setCompareIngrs] = useState<Ingr[]>([]);

  const handleDelete = async () => {
    await supabase.from("creations").delete().eq("id", selectedCreation?.id);
    setSelectedCreation(undefined);
    setTriggerSearch(!triggerSearch);

    toast.success("Creation deleted successfully", {
      position: "top-center",
    });
  };

  const addToCompare = () => {
    if (!selectedCreation) return;
    if (compareCreations.find((c) => c.id == selectedCreation.id)) return;
    const updatedCreations = new Array(...compareCreations);
    updatedCreations.push(selectedCreation);

    const updatedIngrs = new Array(...compareIngrs);
    updatedIngrs.push(...selectedIngrs);

    setCompareCreations(updatedCreations);
    setCompareIngrs(updatedIngrs);
  };

  const removeFromCompare = (creation: spCreation) => {
    const updatedCreations = compareCreations.filter(
      (c) => c.id != creation.id,
    );
    const updatedIngrs = compareIngrs.filter(
      (i) => i.creationId != creation.id,
    );

    setCompareCreations(updatedCreations);
    setCompareIngrs(updatedIngrs);
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

  useEffect(() => {
    setPage(1);
  }, [creationName]);

  // Fetch creations
  useEffect(() => {
    async function fetchCreation() {
      setIsSearching(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: count } = await supabase.rpc("count_creations", {
        user_id: user?.id,
        creation_name: creationName,
        creation_type: creationType,
      });

      if (count > 0) {
        const totalPages = Math.ceil(count / MAX_SEARCH_RESULTS);
        if (page > totalPages) setPage(totalPages);

        const { data } = await supabase.rpc("search_creations", {
          user_id: user?.id,
          creation_name: creationName,
          creation_type: creationType,
          limit_count: MAX_SEARCH_RESULTS,
          offset_count: (page - 1) * MAX_SEARCH_RESULTS,
        });

        const foundCreations = data as spCreation[];
        setFoundCreations(foundCreations);
      } else {
        setFoundCreations([]);
      }

      setTotalResults(count);

      setIsSearching(false);
    }

    fetchCreation();
  }, [creationName, page, triggerSearch]);

  // Fetch selected creation's ingredients
  useEffect(() => {
    if (!selectedCreation) return;
    setIsLoading(true);

    async function fetchIngrs() {
      const { data } = await supabase
        .from("ingredients")
        .select()
        .eq("creation_id", selectedCreation?.id);

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

          const { data: serving } = await supabase
            .from("servings")
            .select()
            .eq("id", i.serving_id)
            .limit(1)
            .single();
          const fetchedServing = serving as spServing;

          const {
            data: { user },
          } = await supabase.auth.getUser();

          const { data: fetchedOverride } = await supabase
            .from("serving_cost_overrides")
            .select()
            .eq("serving_id", fetchedServing.id)
            .eq("user_id", user?.id)
            .maybeSingle();

          if (fetchedOverride) {
            fetchedServing.cost = (fetchedOverride as spCostOverride).cost;
          }

          return {
            creationId: selectedCreation.id,
            food: fetchedFood,
            serving: fetchedServing,
            amount: i.amount,
          };
        }),
      );

      setSelectedIngrs(updatedIngrs);
      setIsLoading(false);
    });
  }, [selectedCreation]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="basis-1/2">
          <SearchBar
            setSearchQuery={setCreationName}
            placeholder="Enter creation name"
          />
          <RadioGroup value={creationType} onValueChange={setCreationType}>
            <div className="flex flex-row gap-6">
              <p>Search for: </p>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="" />
                <Label>All</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="MEAL" />
                <Label>Meal</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="RECIPE" />
                <Label>Recipe</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="basis-1/2">
          {isSearching ? (
            <CreationSearchResultSkeletion />
          ) : (
            <CreationSearchResult
              creations={foundCreations}
              totalResults={totalResults}
              currentPage={page}
              setPage={setPage}
              onSelectCreation={setSelectedCreation}
            />
          )}
        </div>
      </div>

      <div className="mt-6">
        <Heading size={2} text="View Creation" className="mb-3"/>
        {!selectedCreation ? (
          <p>Select a creation to view details.</p>
        ) : !isLoading ? (
          <CreationView
            selectedCreation={selectedCreation}
            nutrients={nutrients}
            trackedNutrients={trackedNutrients}
            ingrs={selectedIngrs}
            handleDelete={handleDelete}
            addToCompare={addToCompare}
          />
        ) : (
          <p>Loading creation details...</p>
        )}
      </div>

      <div className="mt-6">
        <Heading size={2} text="Compare Creations" className="mb-3"/>
        {compareCreations.length > 0 ? (
          <CreationComparison
            nutrients={nutrients}
            trackedNutrients={trackedNutrients}
            creations={compareCreations}
            ingrs={compareIngrs}
            removeCreation={removeFromCompare}
          />
        ) : (
          <p>Add creations to compare.</p>
        )}
      </div>
    </>
  );
}
