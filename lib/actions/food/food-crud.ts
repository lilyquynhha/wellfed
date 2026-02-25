import { spFood, spNewFood, spNewServing } from "@/lib/supabase/database-types";
import { toNumber } from "@/lib/utils";
import { SupabaseClient } from "@supabase/supabase-js";

export const MAX_RESULTS = 7;

interface FatSecretServingRes {
  metric_serving_unit: "ml" | "g" | "oz";
  metric_serving_amount: number;

  measurement_description: string;
  number_of_units: number;

  calories: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  saturated_fat?: number;
  polyunsaturated_fat?: number;
  monounsaturated_fat?: number;
  cholesterol?: number;
  sodium?: number;
  potassium?: number;
  fiber?: number;
  sugar?: number;
  vitamin_a?: number;
  vitamin_c?: number;
  calcium?: number;
  iron?: number;
  trans_fat?: number;
  added_sugars?: number;
  vitamin_d?: number;
}

interface FatsecretFoodRes {
  food: {
    food_name: string;
    food_type: string;
    brand_name?: string;
    servings: {
      serving: FatSecretServingRes[];
    };
  };
}

interface NewFood {
  food: spNewFood;
  servings: spNewServing[];
}

// Map the Fatsecret JSON response to the Food model
function mapToFoodAndServings(res: FatsecretFoodRes): NewFood {
  const toServingUnit = (value: string): "ML" | "G" | "OZ" => {
    if (value.toLowerCase() == "ml") {
      return "ML";
    } else if (value.toLowerCase() == "g") {
      return "G";
    } else if (value.toLowerCase() == "oz") {
      return "OZ";
    } else {
      throw `${value} is not a valid serving unit.`;
    }
  };

  // Map servings
  const servings = res.food.servings.serving;
  const mappedServings: spNewServing[] = servings.map((serving, i) => {
    const convertedServingSize = toNumber(serving.metric_serving_amount);
    const convertedDisplayServingSize = toNumber(serving.number_of_units);
    const convertedCalories = toNumber(serving.calories);
    const convertedCarbs = toNumber(serving.carbohydrate);
    const convertedProtein = toNumber(serving.protein);
    const convertedFat = toNumber(serving.fat);

    if (
      convertedServingSize == null ||
      convertedDisplayServingSize == null ||
      convertedCalories == null ||
      convertedCarbs == null ||
      convertedProtein == null ||
      convertedFat == null
    ) {
      throw "Missing required field(s).";
    }

    return {
      id: i.toString(),
      serving_unit: toServingUnit(serving.metric_serving_unit),
      serving_size: convertedServingSize,
      display_serving_unit: serving.measurement_description,
      display_serving_size: convertedDisplayServingSize,

      cost: null,

      calories: convertedCalories,
      carbs: convertedCarbs,
      protein: convertedProtein,
      fat: convertedFat,
      saturated_fat: toNumber(serving.saturated_fat),
      polyunsaturated_fat: toNumber(serving.polyunsaturated_fat),
      monounsaturated_fat: toNumber(serving.monounsaturated_fat),
      cholesterol: toNumber(serving.cholesterol),
      sodium: toNumber(serving.sodium),
      potassium: toNumber(serving.potassium),
      fiber: toNumber(serving.fiber),
      sugar: toNumber(serving.sugar),
      vitamin_a: toNumber(serving.vitamin_a),
      vitamin_c: toNumber(serving.vitamin_c),
      calcium: toNumber(serving.calcium),
      iron: toNumber(serving.iron),
      trans_fat: toNumber(serving.trans_fat),
      added_sugars: toNumber(serving.added_sugars),
      vitamin_d: toNumber(serving.vitamin_d),
    };
  });

  return {
    food: {
      name: res.food.food_name,
      brand_name: res.food.brand_name ? res.food.brand_name : "",
    },
    servings: mappedServings,
  };
}

export interface ValidateState {
  foodAndServings?: NewFood;
  errorMessage?: string;
}

// Validate Fatsecret response
export async function validateFatsecretFood(
  prevState: ValidateState,
  formData: FormData,
): Promise<ValidateState> {
  // Parse user input to JSON
  const rawResponse = formData.get("fatsecretResponse") as string;
  let jsonData;
  try {
    jsonData = JSON.parse(rawResponse);
  } catch (error) {
    return {
      errorMessage: "Format error: Invalid JSON.",
    };
  }

  // Map JSON to Food model
  jsonData = jsonData as FatsecretFoodRes;
  let convertedData;
  try {
    convertedData = mapToFoodAndServings(jsonData);
  } catch (e) {
    return {
      errorMessage: "Error: Invalid Fatsecret JSON response.",
    };
  }

  return {
    foodAndServings: convertedData,
  };
}

export interface ActionState {
  success: boolean;
  errorMessage?: string;
}

// Insert a food
export async function insertFood(
  supabase: SupabaseClient,
  food: spNewFood | undefined,
  servings: spNewServing[] | undefined,
): Promise<ActionState> {
  if (!food || !servings) {
    return {
      success: false,
      errorMessage: "Food is empty.",
    };
  }

  // Check: Food name must not be empty
  if (!food.name) {
    return {
      success: false,
      errorMessage: "Error: Missing food name.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      errorMessage: "Error: No user.",
    };
  }

  const { data, error: profileSelectError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .limit(1)
    .single();

  if (profileSelectError) {
    return {
      success: false,
      errorMessage: "Error: No profile.",
    };
  }

  const { is_admin: isAdmin } = data as { is_admin: boolean };

  // Check: Food name and brand name must not be duplicate
  if (isAdmin) {
    const { data: publicFood, error: foodSelectError } = await supabase
      .from("foods")
      .select("id")
      .eq("is_public", true)
      .is("deleted_at", null)
      .ilike("name", food.name.trim())
      .ilike("brand_name", food.brand_name.trim());

    if (foodSelectError) {
      return {
        success: false,
        errorMessage: `Error selecting food: ${foodSelectError.message}`,
      };
    }
    if (publicFood.length > 0) {
      return {
        success: false,
        errorMessage:
          "Error: Another public food with the same name and brand name already exists.",
      };
    }
  } else {
    const { data, error: foodSelectError } = await supabase
      .from("foods")
      .select()
      .eq("owner_user_id", user.id)
      .eq("is_public", false)
      .is("deleted_at", null)
      .ilike("name", food.name.trim())
      .ilike("brand_name", food.brand_name.trim());

    if (foodSelectError) {
      return {
        success: false,
        errorMessage: `Error selecting food: ${foodSelectError.message}`,
      };
    }
    if (data.length > 0) {
      return {
        success: false,
        errorMessage:
          "Error: Another private food with the same name and brand name already exists.",
      };
    }
  }

  // Check: Serving size must be positive and display serving unit must not be empty
  for (const s of servings) {
    if (s.serving_size <= 0 || s.display_serving_size <= 0) {
      return {
        success: false,
        errorMessage: "Error: Serving size must be positive.",
      };
    }
    if (!s.display_serving_unit) {
      return {
        success: false,
        errorMessage: "Error: Display serving unit must not be empty.",
      };
    }
  }

  // Insert food
  const { data: insertedFood, error: foodInsertError } = await supabase
    .from("foods")
    .insert({
      name: food.name,
      type: food.brand_name ? "BRAND" : "GENERIC",
      brand_name: food.brand_name,
      owner_user_id: user.id,
      is_public: isAdmin,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (foodInsertError) {
    return {
      success: false,
      errorMessage: `Error inserting food: ${foodInsertError.message}`,
    };
  }

  // Insert servings
  const { error: servingInsertError } = await supabase.from("servings").insert(
    servings.map((s) => ({
      owner_food_id: insertedFood.id,
      serving_unit: s.serving_unit,
      serving_size: s.serving_size,
      display_serving_unit: s.display_serving_unit,
      display_serving_size: s.display_serving_size,
      cost: s.cost,
      calories: s.calories,
      carbs: s.carbs,
      protein: s.protein,
      fat: s.fat,
      saturated_fat: s.saturated_fat,
      polyunsaturated_fat: s.polyunsaturated_fat,
      monounsaturated_fat: s.monounsaturated_fat,
      trans_fat: s.trans_fat,
      cholesterol: s.cholesterol,
      fiber: s.fiber,
      sugar: s.sugar,
      added_sugars: s.added_sugars,
      sodium: s.sodium,
      potassium: s.potassium,
      vitamin_a: s.vitamin_a,
      vitamin_c: s.vitamin_c,
      vitamin_d: s.vitamin_d,
      calcium: s.calcium,
      iron: s.iron,

      updated_at: new Date().toISOString(),
    })),
  );

  // Rollback food insert if servings insert fails
  if (servingInsertError) {
    const { error: foodDeleteError } = await supabase
      .from("foods")
      .delete()
      .eq("id", insertedFood.id);

    if (foodDeleteError) {
      return {
        success: false,
        errorMessage: `Error inserting servings and deleting inserted food: ${foodDeleteError.message}`,
      };
    }
    return {
      success: false,
      errorMessage: `Error inserting servings: ${servingInsertError.message}`,
    };
  }

  return {
    success: true,
  };
}

// Update a food: delete all servings then add them again
export async function updateFood(
  supabase: SupabaseClient,
  food: spFood,
  servings: spNewServing[],
): Promise<ActionState> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      errorMessage: "Error: No user.",
    };
  }

  const { data, error: profileSelectError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .limit(1)
    .single();

  if (profileSelectError) {
    return {
      success: false,
      errorMessage: "Error: No profile.",
    };
  }
  const { is_admin: isAdmin } = data as { is_admin: boolean };

  // check if food might be duplicate
  if (isAdmin) {
    const { data: publicFood, error: foodSelectError } = await supabase
      .from("foods")
      .select("id")
      .eq("is_public", true)
      .is("deleted_at", null)
      .eq("name", food.name)
      .eq("type", food.brand_name ? "BRAND" : "GENERIC")
      .eq("brand_name", food.brand_name)
      .neq("id", food.id);

    if (foodSelectError) {
      return {
        success: false,
        errorMessage: `Error selecting food: ${foodSelectError.message}`,
      };
    }
    if (publicFood.length > 0) {
      return {
        success: false,
        errorMessage:
          "Error: Another public food with the same name and brand name already exists.",
      };
    }
  } else {
    const { data, error: foodSelectError } = await supabase
      .from("foods")
      .select()
      .eq("owner_user_id", user.id)
      .eq("is_public", false)
      .is("deleted_at", null)
      .eq("name", food.name)
      .eq("type", food.brand_name ? "BRAND" : "GENERIC")
      .eq("brand_name", food.brand_name)
      .neq("id", food.id);

    if (foodSelectError) {
      return {
        success: false,
        errorMessage: `Error selecting food: ${foodSelectError.message}`,
      };
    }
    if (data.length > 0) {
      return {
        success: false,
        errorMessage:
          "Error: Another private food with the same name and brand name already exists.",
      };
    }
  }

  // Update food
  const { error: foodUpdateError } = await supabase
    .from("foods")
    .update({
      name: food.name,
      type: food.brand_name ? "BRAND" : "GENERIC",
      brand_name: food.brand_name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", food.id);

  if (foodUpdateError) {
    return {
      success: false,
      errorMessage: `Error updating food: ${foodUpdateError.message}`,
    };
  }

  // Delete old servings and insert new ones
  await supabase.from("servings").delete().eq("owner_food_id", food.id);

  try {
    const { error: servingInsertError } = await supabase
      .from("servings")
      .insert(
        servings.map((s) => ({
          owner_food_id: food.id,
          serving_unit: s.serving_unit,
          serving_size: s.serving_size,
          display_serving_unit: s.display_serving_unit,
          display_serving_size: s.display_serving_size,
          cost: s.cost,
          calories: s.calories,
          carbs: s.carbs,
          protein: s.protein,
          fat: s.fat,
          saturated_fat: s.saturated_fat,
          polyunsaturated_fat: s.polyunsaturated_fat,
          monounsaturated_fat: s.monounsaturated_fat,
          trans_fat: s.trans_fat,
          cholesterol: s.cholesterol,
          fiber: s.fiber,
          sugar: s.sugar,
          added_sugars: s.added_sugars,
          sodium: s.sodium,
          potassium: s.potassium,
          vitamin_a: s.vitamin_a,
          vitamin_c: s.vitamin_c,
          vitamin_d: s.vitamin_d,
          calcium: s.calcium,
          iron: s.iron,

          updated_at: new Date().toISOString(),
        })),
      );

    // Rollback food insert if servings insert fails
    if (servingInsertError) {
      const { error: foodDeleteError } = await supabase
        .from("foods")
        .delete()
        .eq("id", food.id);

      if (foodDeleteError) {
        return {
          success: false,
          errorMessage: `Error inserting servings and deleting inserted food: ${foodDeleteError.message}`,
        };
      }

      return {
        success: false,
        errorMessage: `Error inserting servings: ${servingInsertError.message}`,
      };
    }
  } catch (e) {
    return {
      success: false,
      errorMessage: `${e}`,
    };
  }

  return {
    success: true,
  };
}
