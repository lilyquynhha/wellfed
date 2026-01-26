"use client";

import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { spFood, spServing } from "@/lib/supabase/database-types";
import { Button } from "../ui/button";
import { Star, StarOff } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
} from "../ui/alert-dialog";
import Link from "next/link";

export default function FoodCard({
  food,
  servings,
}: {
  food: spFood;
  servings: spServing[];
}) {
  const [selectedServingId, setSelectedServingId] = useState(servings[0].id);
  const [serving, setServing] = useState<spServing | undefined>(servings[0]);

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    setServing(servings.find((s) => s.id == selectedServingId));
  }, [selectedServingId]);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      return user;
    }
    getUser().then(setUser);
  }, []);

  const isPublicFoodsPage = pathname == "/";
  const isMyFoodsPage = pathname == "/my-foods/all";

  const handleFavouriteFood = async (f: spFood) => {
    if (!user) {
      router.push("/auth/sign-up");
      return;
    }

    await supabase.from("favourite_foods").upsert({
      user_id: user.id,
      food_id: f.id,
    });

    toast.success("Food added to Favourite!", {
      position: "top-center",
    });
  };

  const handleUnfavouriteFood = async (f: spFood) => {
    const { data, error } = await supabase
      .from("favourite_foods")
      .delete()
      .eq("food_id", f.id)
      .select();

    router.refresh();
  };

  const handleDelete = async (f: spFood) => {
    await supabase.from("foods").delete().eq("id", f.id);

    router.refresh();

    toast.success("Food deleted successfully", {
      position: "top-center",
    });
  };

  return (
    <>
      <div className="px-5 pt-4 mb-4">
        {/* Favourite button if displaying in public food page */}
        {isPublicFoodsPage && food.is_public == true && (
          <Button
            variant="ghost"
            size="icon"
            className="float-right rounded-full hover:text-yellow-500"
            onClick={() => {
              handleFavouriteFood(food);
            }}
          >
            <Star size={20} />
          </Button>
        )}
        {/* Unfavourite button if displaying in My Foods page */}
        {isMyFoodsPage && food.is_public == true && (
          <Button
            variant="ghost"
            size="icon"
            className="float-right rounded-full hover:text-yellow-500"
            onClick={() => {
              handleUnfavouriteFood(food);
            }}
          >
            <StarOff size={20} />
          </Button>
        )}

        <div>
          {/* Edit and Delete buttons for owned private foods */}
          {food.is_public == false && (
            <div className="float-right">
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="secondary">
                  <Link href={`/my-foods/${food.id}/edit`}>Edit</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete food?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the food.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                          handleDelete(food);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {/* Header: Food name & Serving options */}
          <div>
            <h2 className="text-2xl font-semibold">{food.name}</h2>
            {food.brand_name && (
              <p className="text-muted-foreground">{food.brand_name}</p>
            )}

            <div className="flex items-center flex-wrap mt-3">
              <p className="font-semibold mr-2">Serving size</p>
              <Select
                onValueChange={setSelectedServingId}
                defaultValue={servings[0].id}
              >
                <SelectTrigger className="text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Serving size</SelectLabel>
                    {servings.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {`${s.display_serving_size} ${s.display_serving_unit}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Nutrition list */}
      <ScrollArea className="min-h-0 pb-6 px-5 ">
        <div>
          {serving && (
            <>
              <div className="flex justify-between items-end mt-2">
                <p className="text-2xl font-extrabold">Calories</p>
                <p className="text-5xl font-extrabold">{serving.calories}</p>
              </div>

              <div className="h-2 bg-primary mt-2 mb-3"></div>

              <div className="flex space-x-4">
                <p className="font-extrabold">Total Fat</p>
                <p>{`${serving.fat} g`}</p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Saturated Fat</p>
                <p>
                  {serving.saturated_fat ? `${serving.saturated_fat}g` : "-"}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Trans Fat</p>
                <p>{serving.trans_fat ? `${serving.trans_fat}g` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Polyunsaturated Fat</p>
                <p>
                  {serving.polyunsaturated_fat
                    ? `${serving.polyunsaturated_fat}g`
                    : "-"}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Monosaturated Fat</p>
                <p>
                  {serving.monounsaturated_fat
                    ? `${serving.monounsaturated_fat}g`
                    : "-"}
                </p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Cholesterol</p>
                <p>{serving.cholesterol ? `${serving.cholesterol}mg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Sodium</p>
                <p>{serving.sodium ? `${serving.sodium}mg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Total Carbohydrates</p>
                <p>{`${serving.carbs}g`}</p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Dietary Fiber</p>
                <p>{serving.fiber ? `${serving.fiber}g` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4 pl-4">
                <p>Sugars</p>
                <p>{serving.sugar ? `${serving.sugar}g` : "-"}</p>
              </div>
              {serving.added_sugars && (
                <div className="pl-10">
                  <Separator />
                  <p>Includes {serving.added_sugars}g Added Sugars</p>
                </div>
              )}

              <Separator />
              <div className="flex space-x-4">
                <p className="font-extrabold">Protein</p>
                <p>{`${serving.protein}g`}</p>
              </div>

              <div className="h-2 bg-primary mt-2 mb-3"></div>

              <div className="flex space-x-4">
                <p>Vitamin D</p>
                <p>{serving.vitamin_d ? `${serving.vitamin_d}mcg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Calcium</p>
                <p>{serving.calcium ? `${serving.calcium}mg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Iron</p>
                <p>{serving.iron ? `${serving.iron}mg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Potassium</p>
                <p>{serving.potassium ? `${serving.potassium}mg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Vitamin A</p>
                <p>{serving.vitamin_a ? `${serving.vitamin_a}mcg` : "-"}</p>
              </div>
              <Separator />
              <div className="flex space-x-4">
                <p>Vitamin C</p>
                <p>{serving.vitamin_c ? `${serving.vitamin_c}mg` : "-"}</p>
              </div>
              <Separator />
            </>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
