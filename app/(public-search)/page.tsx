import FetchPublicFoods from "@/components/foods/fetch-public-foods";
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

  if (!foodQuery) {
    return <p>Enter a food name to show search results.</p>;
  }

  return (
    <>
      <Suspense
        key={`${foodQuery}-${page}`}
        fallback={<SearchResultsSkeleton />}
      >
        <FetchPublicFoods foodQuery={foodQuery.trim()} page={page} />
      </Suspense>
    </>
  );
}
