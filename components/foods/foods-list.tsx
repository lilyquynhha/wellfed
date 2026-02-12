"use client";

import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import Pagination from "./pagination";
import { useState } from "react";
import { spFood } from "@/lib/supabase/database-types";

export default function FoodsList({
  foods,
  totalPages,
  currentPage,
  setPage,
  onSelect,
}: {
  foods: spFood[];
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  onSelect: (food: spFood) => void;
}) {
  const [chosenFood, setChosenFood] = useState<string | null>(null);
  
  return (
    <>
      <div className="w-full md:w-[50%] mb-3">
        <div className="h-96 mb-6">
          <ScrollArea className="h-full">
            {foods.map((f) => (
              <Card
                key={f.id}
                className={`mb-2 p-3 cursor-pointer hover:bg-muted ${chosenFood == f.id && "bg-muted"}`}
                onClick={() => {
                  onSelect(f);
                  setChosenFood(f.id);
                }}
              >
                <CardContent>
                  <p className="font-medium">{f.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {f.brand_name && f.brand_name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>

        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage}/>
      </div>
    </>
  );
}
