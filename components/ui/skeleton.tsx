import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };

function GeneralFoodCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border p-4 mb-3 shadow-sm flex flex-col gap-2 h-14">
      <Skeleton className="h-3 w-1/2" />

      <Skeleton className="h-1.5 w-1/5" />
    </div>
  );
}

export function FoodCardSkeleton() {
  return (
    <>
      <div className="min-h-svh">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-1/2 mt-6 mx-6" />

          <Separator className="my-4" />

          <Skeleton className="h-2 w-4/5 mx-6" />
          <Skeleton className="h-2 w-4/5 mx-6" />
          <Skeleton className="h-2 w-4/5 mx-6" />
          <Skeleton className="h-2 w-4/5 mx-6" />
          <Skeleton className="h-2 w-4/5 mx-6" />
          <Skeleton className="h-2 w-4/5 mx-6" />
        </div>
      </div>
    </>
  );
}

export function FoodPreviewSkeleton() {
  return (
    <div className="h-full flex flex-col w-full border-2 rounded-2xl gap-2">
      <FoodCardSkeleton />
    </div>
  );
}

export function SearchListSkeleton({ height }: { height: number }) {
  return (
    <>
      <div className={`h-${height} mb-6`}>
        <ScrollArea className="h-full">
          <GeneralFoodCardSkeleton />
          <GeneralFoodCardSkeleton />
          <GeneralFoodCardSkeleton />
          <GeneralFoodCardSkeleton />
          <GeneralFoodCardSkeleton />
          <GeneralFoodCardSkeleton />
          <GeneralFoodCardSkeleton />
        </ScrollArea>
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="flex justify-center items-center h-9 w-16 border border-muted rounded-lg">
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-3 w-20" />
        <div className="flex justify-center items-center h-9 w-16 border border-muted rounded-lg">
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </>
  );
}

export function FoodSearchResultSkeleton() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Foods List skeleton */}
        <div className="w-full md:w-[50%] mb-3">
          <div>
            <SearchListSkeleton height={96} />
          </div>
        </div>

        {/* Food Preview skeleton */}
        <div className="hidden md:block md:w-[50%] h-[28rem] p-1 overflow-hidden">
          <FoodPreviewSkeleton />
        </div>
      </div>
    </>
  );
}

export function CreationSearchResultSkeletion() {
  return (
    <>
      <div className="w-full mb-3">
        <SearchListSkeleton height={44} />
      </div>
    </>
  );
}
