import { Database } from "./generated/types";

export type spFood = Database["public"]["Tables"]["foods"]["Row"];
export type spServing = Database["public"]["Tables"]["servings"]["Row"];
export type spCreation = Database["public"]["Tables"]["creations"]["Row"];
export type spIngr = Database["public"]["Tables"]["ingredients"]["Row"];
export type spNutrient = Database["public"]["Tables"]["nutrients"]["Row"];
export type spTrackedNutrient =
  Database["public"]["Tables"]["tracked_nutrients"]["Row"];
export type spCostOverride =
  Database["public"]["Tables"]["serving_cost_overrides"]["Row"];
export type spProfile = Database["public"]["Tables"]["profiles"]["Row"];

export type spNewFood = Omit<
  spFood,
  | "id"
  | "is_public"
  | "owner_user_id"
  | "type"
  | "created_at"
  | "updated_at"
  | "deleted_at"
  | "search_vector"
>;

export type spNewServing = Omit<
  spServing,
  "owner_food_id" | "created_at" | "updated_at"
>;

export type ServingFigures = Omit<
  spNewServing,
  | "id"
  | "serving_size"
  | "serving_unit"
  | "display_serving_size"
  | "display_serving_unit"
>;

export type NewIngr = Omit<
  spIngr,
  "id" | "creation_id" | "created_at" | "updated_at"
>;
