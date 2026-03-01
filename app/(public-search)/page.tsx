"use client";

import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { FoodSearchResultSkeleton } from "@/components/ui/skeleton";
import { MAX_RESULTS } from "@/lib/actions/food/food-crud";
import { createClient } from "@/lib/supabase/client";
import { spFood } from "@/lib/supabase/database-types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { FoodSearchResult } from "@/components/search-utilities/search-results";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Heading } from "@/components/typography";

export default function Page() {
  const router = useRouter();

  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [foundFoods, setFoundFoods] = useState<spFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<spFood>();

  const handleFavouriteFood = async (f: spFood) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data } = await supabase
      .from("favourite_foods")
      .select()
      .eq("user_id", user.id)
      .eq("food_id", f.id)
      .maybeSingle();

    if (!data) {
      await supabase.from("favourite_foods").upsert({
        user_id: user.id,
        food_id: f.id,
      });
    }
    toast.success("Food added to Favourite!", {
      position: "bottom-center",
    });
  };

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      return user;
    }
    getUser().then(setUser);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Fetch foods
  useEffect(() => {
    async function fetchFoods() {
      if (searchQuery == "") return;

      setIsLoading(true);

      const { data: count } = await supabase.rpc("count_foods_public", {
        query: searchQuery,
      });

      if (count > 0) {
        const totalPages = Math.ceil(count / MAX_RESULTS);
        if (page > totalPages) setPage(totalPages);

        const { data } = await supabase.rpc("search_foods_public", {
          query: searchQuery,
          limit_count: MAX_RESULTS,
          offset_count: (page - 1) * MAX_RESULTS,
        });

        const foundFoods = (data as spFood[]).map((f) => {
          return {
            ...f,
            is_public: true,
          };
        });
        setFoundFoods(foundFoods);
      } else {
        setFoundFoods([]);
      }

      setTotalResults(count);
      setIsLoading(false);
    }

    fetchFoods();
  }, [searchQuery, page]);

  return (
    <>
      <Collapsible className="mb-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="group">
            <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
            Food catalog
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="max-h-40 overflow-y-auto">
              <div className="min-[350px]:grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="sticky top-0 bg-card font-semibold border-b-2 mb-2 pb-1">
                    Proteins (Meat, Seafood, Plant-based)
                  </h4>
                  <ul className="list-disc ml-4 text-sm">
                    <div className="md:grid grid-cols-2">
                      <li>Beef</li>
                      <li>Chicken Breast</li>
                      <li>Chicken Thigh</li>
                      <li>Chickpeas</li>
                      <li>Duck Meat</li>
                      <li>Egg</li>
                      <li>Firm Tofu</li>
                      <li>Kidney Beans</li>
                      <li>Lamb</li>
                      <li>Lean Ground Beef</li>
                      <li>Lentils</li>
                      <li>Pork</li>
                      <li>Salmon</li>
                      <li>Sardines</li>
                      <li>Scallops</li>
                      <li>Shrimp</li>
                      <li>Tuna</li>
                      <li>Turkey Breast</li>
                    </div>
                  </ul>
                </div>

                <div>
                  <h4 className="sticky top-0 bg-card font-semibold border-b-2 mb-2 pb-1">Vegetables</h4>
                  <ul className="list-disc ml-4 text-sm">
                    <div className="md:grid grid-cols-2">
                      <li>Asparagus</li>
                      <li>Avocados</li>
                      <li>Broccoli</li>
                      <li>Brussels Sprouts</li>
                      <li>Carrots</li>
                      <li>Cauliflower</li>
                      <li>Celery</li>
                      <li>Chinese Cabbage</li>
                      <li>Cucumber</li>
                      <li>Eggplant</li>
                      <li>Garlic</li>
                      <li>Green Peppers</li>
                      <li>Kale</li>
                      <li>Lettuce</li>
                      <li>Mushrooms</li>
                      <li>Onions</li>
                      <li>Potato</li>
                      <li>Pumpkin</li>
                      <li>Shallots</li>
                      <li>Spinach</li>
                      <li>String Beans</li>
                      <li>Sweet Potato</li>
                      <li>Zucchini</li>
                    </div>
                  </ul>
                </div>

                <div>
                  <h4 className="sticky top-0 bg-card font-semibold border-b-2 mb-2 pb-1">Fruits</h4>
                  <ul className="list-disc ml-4 text-sm">
                    <div className="md:grid grid-cols-2">
                      <li>Apples</li>
                      <li>Apricots</li>
                      <li>Banana</li>
                      <li>Blueberries</li>
                      <li>Cantaloupe</li>
                      <li>Cherries</li>
                      <li>Cranberries</li>
                      <li>Grapes</li>
                      <li>Kiwi</li>
                      <li>Lemon</li>
                      <li>Lime</li>
                      <li>Mangos</li>
                      <li>Oranges</li>
                      <li>Peach</li>
                      <li>Pears</li>
                      <li>Pineapple</li>
                      <li>Plums</li>
                      <li>Raspberries</li>
                      <li>Strawberries</li>
                      <li>Tangerine</li>
                      <li>Tomatoes</li>
                      <li>Watermelon</li>
                    </div>
                  </ul>
                </div>

                <div>
                  <h4 className="sticky top-0 bg-card font-semibold border-b-2 mb-2 pb-1">Dairy & Alternatives</h4>
                  <ul className="list-disc ml-4 text-sm">
                    <div className="md:grid grid-cols-2">
                      <li>Almond Milk</li>
                      <li>Butter</li>
                      <li>Cheddar Cheese</li>
                      <li>Feta Cheese</li>
                      <li>Greek Yogurt</li>
                      <li>Heavy Cream</li>
                      <li>Mozzarella Cheese</li>
                      <li>Oat Milk</li>
                      <li>Parmesan Cheese</li>
                      <li>Plain Yogurt</li>
                      <li>Sour Cream</li>
                      <li>Soy Milk</li>
                      <li>Whole Milk</li>
                      <li>Yogurt</li>
                    </div>
                  </ul>
                </div>

                <div>
                  <h4 className="sticky top-0 bg-card font-semibold border-b-2 mb-2 pb-1">Grains, Breads, & Pasta</h4>
                  <ul className="list-disc ml-4 text-sm">
                    <div className="md:grid grid-cols-2">
                      <li>All-Purpose Flour</li>
                      <li>Bagel</li>
                      <li>Bread</li>
                      <li>Brown Rice</li>
                      <li>Corn</li>
                      <li>Couscous</li>
                      <li>Oats</li>
                      <li>Quinoa</li>
                      <li>Spaghetti</li>
                      <li>Tortilla</li>
                      <li>White Rice</li>
                      <li>Whole Grain Bread</li>
                      <li>Whole Wheat Bread</li>
                    </div>
                  </ul>
                </div>

                <div>
                  <h4 className="sticky top-0 bg-card font-semibold border-b-2 mb-2 pb-1">Nuts, Seeds, & Legumes</h4>
                  <ul className="list-disc ml-4 text-sm">
                    <div className="md:grid grid-cols-2">
                      <li>Almonds</li>
                      <li>Black Beans</li>
                      <li>Peanut Butter</li>
                      <li>Walnuts</li>
                    </div>
                  </ul>
                </div>

                <div>
                  <h4 className="sticky top-0 bg-card font-semibold border-b-2 mb-2 pb-1">Fats & Oils</h4>
                  <ul className="list-disc ml-4 text-sm">
                    <div className="md:grid grid-cols-2">
                      <li>Coconut Oil</li>
                      <li>Olive Oil</li>
                      <li>Sesame Oil</li>
                    </div>
                  </ul>
                </div>

                <div>
                  <h4 className="sticky top-0 bg-card font-semibold border-b-2 mb-2 pb-1">
                    Seasonings, Sauces, & Pantry
                  </h4>
                  <ul className="list-disc ml-4 text-sm">
                    <div className="md:grid grid-cols-2">
                      <li>Black Pepper</li>
                      <li>Fish Sauce</li>
                      <li>Honey</li>
                      <li>Oyster Sauce</li>
                      <li>Salt</li>
                      <li>Soy Sauce</li>
                      <li>Sugar</li>
                      <li>Vinegar</li>
                    </div>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <SearchBar
        setSearchQuery={setSearchQuery}
        placeholder="Enter food name"
      />
      {!searchQuery && <p>Search result will appear here.</p>}

      {/* Food actions */}
      {searchQuery && totalResults > 0 && selectedFood && (
        <>
          <div className="flex gap-2 justify-end my-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={isLoading}
              onClick={() => {
                handleFavouriteFood(selectedFood);
              }}
            >
              Favourite
            </Button>
          </div>
        </>
      )}

      {searchQuery &&
        (isLoading ? (
          <FoodSearchResultSkeleton />
        ) : (
          <FoodSearchResult
            foods={foundFoods}
            totalResults={totalResults}
            page={page}
            setPage={setPage}
            onSelectedFood={setSelectedFood}
          />
        ))}
    </>
  );
}
