import { MAX_RESULTS } from "@/lib/actions/food/food-crud";
import { createClient } from "@/lib/supabase/server";
import SearchResults from "./search-results";

export default async function FetchPersonalFoods({
  foodQuery,
  page,
}: {
  foodQuery: string;
  page: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Count total number of matched foods
  const { data: count, error: countError } = await supabase.rpc(
    "count_foods_personal",
    { user_id: user?.id, query: foodQuery },
  );

  if (countError) return `Error fetching foods: ${countError.message}`;

  // Search for matched foods with pagination
  const { data: foundFoods, error: selectError } = await supabase.rpc(
    "search_foods_personal",
    {
      user_id: user?.id,
      query: foodQuery,
      limit_count: MAX_RESULTS,
      offset_count: (page - 1) * MAX_RESULTS,
    },
  );
  if (selectError) return `Error fetching foods: ${selectError.message}`;

  return (
    <>
      <SearchResults foods={foundFoods} totalResults={count ?? 0} page={page} />
    </>
  );
}
