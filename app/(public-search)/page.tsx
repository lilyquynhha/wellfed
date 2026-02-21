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
      router.push("/auth/sign-up");
      return;
    }

    await supabase.from("favourite_foods").upsert({
      user_id: user.id,
      food_id: f.id,
    });

    toast.success("Food added to Favourite!", {
      position: "top-center",
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
      <SearchBar
        setSearchQuery={setSearchQuery}
        placeholder="Enter food name"
      />
      {!searchQuery && <p>Enter a food name to search.</p>}

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
