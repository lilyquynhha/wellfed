import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import SearchBar from "../search-bar";

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
    <div className="bg-card rounded-xl border p-4 mb-3 shadow-sm flex flex-col gap-2 h-20">
      <Skeleton className="h-3 w-3/4" />

      <Skeleton className="h-1.5 w-full" />
      <Skeleton className="h-1.5 w-5/6" />
    </div>
  );
}

export function NormalPreviewSkeleton() {
  return (
    <div className="hidden md:block md:w-[50%] h-96 p-1 overflow-hidden">
      <div className="h-full flex flex-col w-full gap-2">
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
  );
}

export function PopupPreviewSkeleton() {
  return (
    <div className="md:hidden fixed w-80 h-96 right-4 my-auto">
      <div className="relative w-full h-full bg-background rounded-lg border-2 border-solid flex flex-col">
        <div className="flex flex-col gap-3 pt-4">
          <Skeleton className="h-5 w-1/2 mt-6 mx-6" />

          <Separator className="my-4" />

          <Skeleton className="h-2 w-4/5 ml-6" />
          <Skeleton className="h-2 w-4/5 ml-6" />
          <Skeleton className="h-2 w-4/5 ml-6" />
          <Skeleton className="h-2 w-4/5 ml-6" />
          <Skeleton className="h-2 w-4/5 ml-6" />
          <Skeleton className="h-2 w-4/5 ml-6" />
        </div>
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-2">
        {/* Foods List skeleton */}
        <div className="w-full md:w-[50%] mb-3">
          <div className="h-96 mb-14">
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
        </div>

        {/* Food Preview skeleton */}
        <NormalPreviewSkeleton />
      </div>
    </>
  );
}
