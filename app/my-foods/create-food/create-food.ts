import { SupabaseClient } from "@supabase/supabase-js";

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

interface Serving {
  servingUnit: "ML" | "G" | "OZ";
  servingSize: number;
  displayServingUnit: string;
  displayServingSize: number;

  cost: number | null;

  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  saturatedFat: number | null;
  polyunsaturatedFat: number | null;
  monounsaturatedFat: number | null;
  cholesterol: number | null;
  sodium: number | null;
  potassium: number | null;
  fiber: number | null;
  sugar: number | null;
  vitaminA: number | null;
  vitaminC: number | null;
  calcium: number | null;
  iron: number | null;
  transFat: number | null;
  addedSugars: number | null;
  vitaminD: number | null;
}

interface Food {
  foodName: string;
  foodType: "BRAND" | "GENERIC";
  brandName: string;
  servings: {
    serving: Serving[];
  };
}

const toNumber = (value?: string | number | FormDataEntryValue | null) => {
  if (value == null || value == "") return null;
  if (isNaN(Number(value))) throw TypeError(`${value} is not a number.`);
  return Number(value);
};

// Map the Fatsecret JSON response to the Food model
function mapToFood(res: FatsecretFoodRes): Food {
  const toFoodType = (value: string): "BRAND" | "GENERIC" => {
    if (value.toLowerCase() == "brand") {
      return "BRAND";
    } else if (value.toLowerCase() == "generic") {
      return "GENERIC";
    } else {
      throw `${value} is not a valid food type.`;
    }
  };

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
  const mappedServings: Serving[] = servings.map((serving) => {
    const convertedServingSize = toNumber(serving.metric_serving_amount);
    const convertedDisplayServingSize = toNumber(serving.number_of_units);
    const convertedCalories = toNumber(serving.calories);
    const convertedCarbs = toNumber(serving.carbohydrate);
    const convertedProtein = toNumber(serving.protein);
    const convertedFat = toNumber(serving.fat);

    if (
      !convertedServingSize ||
      !convertedDisplayServingSize ||
      !convertedCalories ||
      !convertedCarbs ||
      !convertedProtein ||
      !convertedFat
    ) {
      throw "Missing required field(s).";
    }

    return {
      servingUnit: toServingUnit(serving.metric_serving_unit),
      servingSize: convertedServingSize,
      displayServingUnit: serving.measurement_description,
      displayServingSize: convertedDisplayServingSize,

      cost: null,

      calories: convertedCalories,
      carbs: convertedCarbs,
      protein: convertedProtein,
      fat: convertedFat,
      saturatedFat: toNumber(serving.saturated_fat),
      polyunsaturatedFat: toNumber(serving.polyunsaturated_fat),
      monounsaturatedFat: toNumber(serving.monounsaturated_fat),
      cholesterol: toNumber(serving.cholesterol),
      sodium: toNumber(serving.sodium),
      potassium: toNumber(serving.potassium),
      fiber: toNumber(serving.fiber),
      sugar: toNumber(serving.sugar),
      vitaminA: toNumber(serving.vitamin_a),
      vitaminC: toNumber(serving.vitamin_c),
      calcium: toNumber(serving.calcium),
      iron: toNumber(serving.iron),
      transFat: toNumber(serving.trans_fat),
      addedSugars: toNumber(serving.added_sugars),
      vitaminD: toNumber(serving.vitamin_d),
    };
  });

  return {
    foodName: res.food.food_name,
    foodType: toFoodType(res.food.food_type),
    brandName: res.food.brand_name ? res.food.brand_name : "",

    servings: {
      serving: mappedServings,
    },
  };
}

export interface ValidateState {
  error?: string;
  data?: {
    food: Food;
    ownerUserId: string;
    isAdmin: boolean;
  };
}

// Validate Fatsecret response
export async function validateFatsecretFood(
  supabase: SupabaseClient,
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
      error: "Format error: Invalid JSON.",
    };
  }

  // Map JSON to Food model
  jsonData = jsonData as FatsecretFoodRes;
  let convertedData;
  try {
    convertedData = mapToFood(jsonData);
  } catch (e) {
    return {
      error: "Error: Invalid Fatsecret JSON response.",
    };
  }

  // Get the user
  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();
  if (error) {
    return {
      error: `Error fetching user: ${error.message}`,
    };
  }
  if (!user) {
    return {
      error: "Error: Unauthenticated user.",
    };
  }

  // Get user's profile to check if user is admin
  let profile;
  const { data: returnedProfile, error: profileSelectError } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .maybeSingle();
  if (profileSelectError)
    return {
      error: `Error fetching profile: ${profileSelectError.message}`,
    };
  if (!returnedProfile) {
    return {
      error: "Error: Profile not found.",
    };
  }
  profile = returnedProfile as { is_admin: boolean };

  // Check if food already exists
  if (profile.is_admin) {
    const { data: publicFood, error: foodSelectError } = await supabase
      .from("foods")
      .select("id")
      .eq("is_public", true)
      .is("deleted_at", null)
      .eq("name", convertedData.foodName)
      .eq("type", convertedData.foodType)
      .eq("brand_name", convertedData.brandName);

    if (foodSelectError) {
      return {
        error: `Error selecting food: ${foodSelectError.message}`,
      };
    }
    if (publicFood.length > 0) {
      return {
        error: "Error: Food (public) already exists.",
      };
    }
  } else {
    const { data, error: foodSelectError } = await supabase
      .from("foods")
      .select()
      .eq("owner_user_id", user.id)
      .eq("is_public", false)
      .is("deleted_at", null)
      .eq("name", convertedData.foodName)
      .eq("type", convertedData.foodType)
      .eq("brand_name", convertedData.brandName);

    if (foodSelectError) {
      return {
        error: `Error selecting food: ${foodSelectError.message}`,
      };
    }
    if (data.length > 0) {
      return {
        error: "Error: Food (private) already exists.",
      };
    }
  }

  return {
    data: {
      food: convertedData,
      ownerUserId: user.id,
      isAdmin: profile.is_admin,
    },
  };
}

export interface InsertState {
  success: boolean;
  errorMessage?: string;
}

// Validate servings details and insert food
export async function insertFood(
  supabase: SupabaseClient,
  foodData: ValidateState,
  prevState: InsertState,
  formData: FormData,
): Promise<InsertState> {
  if (!foodData.data)
    return {
      success: false,
      errorMessage: "Error: No food data.",
    };

  // Insert food
  const { data, error: foodInsertError } = await supabase
    .from("foods")
    .insert({
      name: foodData.data.food.foodName,
      type: foodData.data.food.foodType,
      brand_name: foodData.data.food.brandName,
      owner_user_id: foodData.data.ownerUserId,
      is_public: foodData.data.isAdmin,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (foodInsertError) {
    return {
      success: false,
      errorMessage: `Error inserting food: ${foodInsertError.message}`,
    };
  }
  const insertedFood = data as { id: string };

  // Insert servings
  try {
    const { error: servingInsertError } = await supabase
      .from("servings")
      .insert(
        foodData.data.food.servings.serving.map((s, i) => ({
          owner_food_id: insertedFood.id,
          serving_unit: formData.get(`serving-unit-${i}`),
          serving_size: toNumber(formData.get(`serving-size-${i}`)),
          display_serving_unit: formData.get(`display-serving-unit-${i}`),
          display_serving_size: formData.get(`display-serving-size-${i}`),
          cost: toNumber(formData.get(`cost-${i}`)),
          calories: toNumber(formData.get(`calories-${i}`)),
          carbs: toNumber(formData.get(`carbs-${i}`)),
          protein: toNumber(formData.get(`protein-${i}`)),
          fat: toNumber(formData.get(`fat-${i}`)),
          saturated_fat: toNumber(formData.get(`saturated-fat-${i}`)),
          polyunsaturated_fat: toNumber(
            formData.get(`polyunsaturated-fat-${i}`),
          ),
          monounsaturated_fat: toNumber(
            formData.get(`monounsaturated-fat-${i}`),
          ),
          trans_fat: toNumber(formData.get(`trans-fat-${i}`)),
          cholesterol: toNumber(formData.get(`cholesterol-${i}`)),
          fiber: toNumber(formData.get(`fiber-${i}`)),
          sugar: toNumber(formData.get(`sugar-${i}`)),
          added_sugars: toNumber(formData.get(`added-sugars-${i}`)),
          sodium: toNumber(formData.get(`sodium-${i}`)),
          potassium: toNumber(formData.get(`potassium-${i}`)),
          vitamin_a: toNumber(formData.get(`vitamin-a-${i}`)),
          vitamin_c: toNumber(formData.get(`vitamin-c-${i}`)),
          vitamin_d: toNumber(formData.get(`vitamin-d-${i}`)),
          calcium: toNumber(formData.get(`calcium-${i}`)),
          iron: toNumber(formData.get(`iron-${i}`)),

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
