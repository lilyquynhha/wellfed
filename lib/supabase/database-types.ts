import { Database } from "./generated/types";

export type spFood = Database["public"]["Tables"]["foods"]["Row"];
export type spServing = Database["public"]["Tables"]["servings"]["Row"];

export type spNewFood = Omit<
  spFood,
  "id" | "is_public" | "owner_user_id" | "type" | "created_at" | "updated_at" | "deleted_at"
>;

export type spNewServing = Omit<spServing, | "owner_food_id" | "created_at" | "updated_at">;

