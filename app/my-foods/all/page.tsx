import FetchPersonalFoods from "@/components/foods/fetch-personal-foods";
import { SearchResultsSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Page(props: {
  searchParams: Promise<{
    query?: string;
    page?: number;
  }>;
}) {
  const searchParams = await props.searchParams;
  const foodQuery = searchParams?.query;
  const page = Number(searchParams?.page ?? 1);

  return (
    <>
      <Suspense
        key={`${foodQuery}-${page}`}
        fallback={<SearchResultsSkeleton />}
      >
        <FetchPersonalFoods foodQuery={foodQuery ?? ""} page={page} />
      </Suspense>
    </>
  );
}
