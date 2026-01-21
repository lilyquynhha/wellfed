import { Database } from "./generated/types";

export type spFood = Database["public"]["Tables"]["foods"]["Row"];
export type spServing = Database["public"]["Tables"]["servings"]["Row"];
