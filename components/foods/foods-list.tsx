"use client";

import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import Pagination from "../search-utilities/pagination";
import { useState } from "react";
import { spFood, spServing } from "@/lib/supabase/database-types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { FoodCard } from "./food-card";
import { FoodCardSkeleton } from "../ui/skeleton";
import { Star } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FoodsList({
  foods,
  selectedFoodServings,
  totalPages,
  currentPage,
  setPage,
  onSelect,
}: {
  foods: spFood[];
  selectedFoodServings: spServing[];
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  onSelect: (food: spFood) => void;
}) {
  const pathname = usePathname();
  const [chosenFood, setChosenFood] = useState<string | null>(null);

  return (
    <>
      <div className="w-full md:w-[50%] mb-3">
        <div className="h-96 mb-6">
          <ScrollArea className="h-full">
            {foods.map((f) => (
              <Card
                key={f.id}
                className={`mb-2 p-3 cursor-pointer hover:bg-accent ${chosenFood == f.id && "bg-accent"}`}
                onClick={() => {
                  onSelect(f);
                  setChosenFood(f.id);
                }}
              >
                <CardContent className="flex justify-between">
                  <div>
                    <div className="flex gap-2 items-center">
                      <p className="font-medium">{f.name}</p>
                      {pathname != "/" && f.is_public && (
                        <Star
                          size={15}
                          fill="hsl(var(--primary))"
                          strokeWidth={0}
                        />
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {f.brand_name}
                    </p>
                  </div>
                  <div className="visible md:hidden">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="italic text-muted-foreground"
                        >
                          Click to view details
                        </Button>
                      </DialogTrigger>
                      <DialogContent aria-describedby={undefined}>
                        <DialogHeader>
                          <DialogTitle>View Details</DialogTitle>
                        </DialogHeader>

                        <div className="-mx-4 max-h-[50vh] overflow-y-hidden">
                          {selectedFoodServings.length > 0 ? (
                            <>
                              <div className="h-[28rem] p-1 overflow-hidden">
                                <div className="h-full flex flex-col">
                                  <FoodCard
                                    food={f}
                                    servings={selectedFoodServings}
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            <FoodCardSkeleton />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
