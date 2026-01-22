import { createClient } from "@/lib/supabase/server";
import SearchResults from "./search-results";
import { MAX_RESULTS } from "@/lib/data/fetch-foods";
import { spFood } from "@/lib/supabase/database-types";

export default async function FetchPublicFoods({
  foodQuery,
  page,
}: {
  foodQuery: string;
  page: number;
}) {
  const supabase = await createClient();

  // Count total number of matched foods
  const { data: count, error: countError } = await supabase.rpc(
    "count_foods_public",
    {
      query: foodQuery,
    },
  );

  if (countError) return `Error fetching foods: ${countError.message}`;

  // Search for matched foods with pagination
  const { data: foundFoods, error: selectError } = await supabase.rpc(
    "search_foods_public",
    {
      query: foodQuery,
      limit_count: MAX_RESULTS,
      offset_count: (page - 1) * MAX_RESULTS,
    },
  );
  if (selectError) return `Error fetching foods: ${selectError.message}`;

  const foundPublicFoods = (foundFoods as spFood[]).map((f) => {
    return {
      ...f,
      is_public: true,
    };
  });
  return (
    <>
      <SearchResults
        foods={foundPublicFoods}
        totalResults={count ?? 0}
        page={page}
      />
    </>
  );
}
