import { NewIngr, spFood, spServing } from "@/lib/supabase/database-types";
import { SupabaseClient } from "@supabase/supabase-js";

export const MAX_SEARCH_RESULTS = 7;

export type FullIngr = {
  food: spFood;
  servings: spServing[];
  ingr: NewIngr;
};

export type Ingr = {
  creationId: string;
  food: spFood;
  serving: spServing;
  amount: number;
};

export async function insertCreation(
  supabase: SupabaseClient,
  name: string,
  type: string,
  ingrs: NewIngr[],
) {
  if (!name) return "Error: Missing creation name.";
  if (!type) return "Error: Missing creation type.";

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return "Error: No user.";
  }

  const { data, error: profileSelectError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .limit(1)
    .single();

  if (profileSelectError) {
    return "Error: No profile.";
  }

  const { is_admin: isAdmin } = data as { is_admin: boolean };

  // Check if creation already exists
  if (isAdmin) {
    const { data, error } = await supabase
      .from("creations")
      .select()
      .eq("is_public", true)
      .is("deleted_at", null)
      .ilike("name", name.trim())
      .eq("type", type);

    if (error)
      return "Supabase error: Failed to check for duplicate creations.";
    if (data.length > 0)
      return "Error: Another public creation with the same name and type already exists.";
  } else {
    const { data, error } = await supabase
      .from("creations")
      .select()
      .eq("owner_user_id", user.id)
      .eq("is_public", false)
      .is("deleted_at", null)
      .ilike("name", name.trim())
      .eq("type", type);

    if (error)
      return "Supabase error: Failed to check for duplicate creations.";
    if (data.length > 0)
      return "Error: Another private creation with the same name and type already exists.";
  }

  // Insert creation
  const { data: insertedCreation, error: creationInsertError } = await supabase
    .from("creations")
    .insert({
      owner_user_id: user.id,
      name: name,
      type: type,
      is_public: isAdmin,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (creationInsertError) return "Supabase error: Failed to insert creation.";

  // Insert ingredients
  const { error: ingredientInsertError } = await supabase
    .from("ingredients")
    .insert(
      ingrs.map((i) => ({
        creation_id: insertedCreation.id,
        serving_id: i.serving_id,
        amount: i.amount,
        updated_at: new Date().toISOString(),
      })),
    );

  if (ingredientInsertError)
    return "Supabase error: Failed to insert ingredients.";

  return "";
}

export async function updateCreation(
  supabase: SupabaseClient,
  creationId: string,
  name: string,
  type: string,
  ingrs: NewIngr[],
) {
  if (!name) return "Error: Missing creation name.";
  if (!type) return "Error: Missing creation type.";

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return "Error: No user.";
  }

  const { data, error: profileSelectError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .limit(1)
    .single();

  if (profileSelectError) {
    return "Error: No profile.";
  }

  const { is_admin: isAdmin } = data as { is_admin: boolean };

  // Check if creation is duplicate
  if (isAdmin) {
    const { data, error } = await supabase
      .from("creations")
      .select()
      .eq("is_public", true)
      .is("deleted_at", null)
      .eq("name", name)
      .eq("type", type.toUpperCase())
      .neq("id", creationId);

    if (error)
      return "Supabase error: Failed to check for duplicate creations.";
    if (data.length > 0)
      return "Error: Another public creation with the same name and type already exists.";
  } else {
    const { data, error } = await supabase
      .from("creations")
      .select()
      .eq("owner_user_id", user.id)
      .eq("is_public", false)
      .is("deleted_at", null)
      .eq("name", name)
      .eq("type", type.toUpperCase())
      .neq("id", creationId);

    if (error)
      return "Supabase error: Failed to check for duplicate creations.";
    if (data.length > 0)
      return "Error: Another private creation with the same name and type already exists.";
  }

  // Update creation
  const { error: creationUpdateError } = await supabase
    .from("creations")
    .update({
      name: name,
      type: type,
    })
    .eq("id", creationId);

  if (creationUpdateError) return "Supabase error: Failed to insert creation.";

  // Delete old ingredients and insert new ones
  await supabase.from("ingredients").delete().eq("creation_id", creationId);

  const { error: ingredientInsertError } = await supabase
    .from("ingredients")
    .insert(
      ingrs.map((i) => ({
        creation_id: creationId,
        serving_id: i.serving_id,
        amount: i.amount,
        updated_at: new Date().toISOString(),
      })),
    );

  if (ingredientInsertError)
    return "Supabase error: Failed to insert ingredients.";

  return "";
}
