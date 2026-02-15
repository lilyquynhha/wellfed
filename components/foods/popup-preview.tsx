import { spFood, spServing } from "@/lib/supabase/database-types";
import { useState } from "react";
import { Button } from "../ui/button";
import FoodCard from "./food-card";
import { SquareX } from "lucide-react";

export default function PopupPreview({
  food,
  servings,
}: {
  food: spFood | null;
  servings: spServing[];
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [currentFood, setCurrentFood] = useState(food);

  if (currentFood != food) {
    setCurrentFood(food);
    setIsPreviewOpen(true);
  }
  return (
    <>
      {isPreviewOpen && food && (
        <div className="md:hidden fixed w-80 h-96 right-4 z-50">
          <div className="relative w-full h-full bg-background rounded-lg border-2 border-solid flex flex-col">
            <Button
              className="place-self-end px-2"
              variant="ghost"
              onClick={() => {
                setIsPreviewOpen(!isPreviewOpen);
              }}
            >
              <SquareX />
            </Button>

            <FoodCard food={food} servings={servings} />
          </div>
        </div>
      )}
    </>
  );
}
