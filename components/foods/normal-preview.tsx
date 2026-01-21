import FoodCard from "./food-card";
import { spFood, spServing } from "@/lib/supabase/database-types";

export default function NormalPreview({
  food,
  servings,
}: {
  food: spFood | null;
  servings: spServing[];
}) {
  return (
    <>
      {food && (
        <div
          id="result-preview"
          className="hidden md:block md:w-[50%] h-[28rem] p-1 overflow-hidden"
        >
          <div className="h-full flex flex-col border-2 rounded-2xl">
            <FoodCard food={food} servings={servings} />
          </div>
        </div>
      )}
    </>
  );
}
