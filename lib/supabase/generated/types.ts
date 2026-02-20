export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      creations: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_public: boolean
          name: string
          owner_user_id: string | null
          search_vector: unknown
          type: Database["public"]["Enums"]["CreationType"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_public?: boolean
          name: string
          owner_user_id?: string | null
          search_vector?: unknown
          type: Database["public"]["Enums"]["CreationType"]
          updated_at: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_public?: boolean
          name?: string
          owner_user_id?: string | null
          search_vector?: unknown
          type?: Database["public"]["Enums"]["CreationType"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creations_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favourite_foods: {
        Row: {
          created_at: string
          food_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          food_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          food_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favourite_foods_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favourite_foods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          brand_name: string
          created_at: string
          deleted_at: string | null
          id: string
          is_public: boolean
          name: string
          owner_user_id: string | null
          search_vector: unknown
          type: Database["public"]["Enums"]["FoodType"]
          updated_at: string
        }
        Insert: {
          brand_name?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_public?: boolean
          name: string
          owner_user_id?: string | null
          search_vector?: unknown
          type: Database["public"]["Enums"]["FoodType"]
          updated_at: string
        }
        Update: {
          brand_name?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_public?: boolean
          name?: string
          owner_user_id?: string | null
          search_vector?: unknown
          type?: Database["public"]["Enums"]["FoodType"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "foods_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          amount: number
          created_at: string
          creation_id: string
          id: string
          serving_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          creation_id: string
          id?: string
          serving_id: string
          updated_at: string
        }
        Update: {
          amount?: number
          created_at?: string
          creation_id?: string
          id?: string
          serving_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_creation_id_fkey"
            columns: ["creation_id"]
            isOneToOne: false
            referencedRelation: "creations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredients_serving_id_fkey"
            columns: ["serving_id"]
            isOneToOne: false
            referencedRelation: "servings"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrients: {
        Row: {
          display_order: number
          id: string
          name: string
          serving_name: string
          unit: string
        }
        Insert: {
          display_order: number
          id?: string
          name: string
          serving_name: string
          unit: string
        }
        Update: {
          display_order?: number
          id?: string
          name?: string
          serving_name?: string
          unit?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          is_admin?: boolean
          updated_at: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      serving_cost_overrides: {
        Row: {
          cost: number
          created_at: string
          id: string
          serving_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cost: number
          created_at?: string
          id?: string
          serving_id: string
          updated_at: string
          user_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          id?: string
          serving_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "serving_cost_overrides_serving_id_fkey"
            columns: ["serving_id"]
            isOneToOne: false
            referencedRelation: "servings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "serving_cost_overrides_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      servings: {
        Row: {
          added_sugars: number | null
          calcium: number | null
          calories: number
          carbs: number
          cholesterol: number | null
          cost: number | null
          created_at: string
          display_serving_size: number
          display_serving_unit: string
          fat: number
          fiber: number | null
          id: string
          iron: number | null
          monounsaturated_fat: number | null
          owner_food_id: string
          polyunsaturated_fat: number | null
          potassium: number | null
          protein: number
          saturated_fat: number | null
          serving_size: number
          serving_unit: Database["public"]["Enums"]["ServingUnit"]
          sodium: number | null
          sugar: number | null
          trans_fat: number | null
          updated_at: string
          vitamin_a: number | null
          vitamin_c: number | null
          vitamin_d: number | null
        }
        Insert: {
          added_sugars?: number | null
          calcium?: number | null
          calories: number
          carbs: number
          cholesterol?: number | null
          cost?: number | null
          created_at?: string
          display_serving_size: number
          display_serving_unit: string
          fat: number
          fiber?: number | null
          id?: string
          iron?: number | null
          monounsaturated_fat?: number | null
          owner_food_id: string
          polyunsaturated_fat?: number | null
          potassium?: number | null
          protein: number
          saturated_fat?: number | null
          serving_size: number
          serving_unit: Database["public"]["Enums"]["ServingUnit"]
          sodium?: number | null
          sugar?: number | null
          trans_fat?: number | null
          updated_at: string
          vitamin_a?: number | null
          vitamin_c?: number | null
          vitamin_d?: number | null
        }
        Update: {
          added_sugars?: number | null
          calcium?: number | null
          calories?: number
          carbs?: number
          cholesterol?: number | null
          cost?: number | null
          created_at?: string
          display_serving_size?: number
          display_serving_unit?: string
          fat?: number
          fiber?: number | null
          id?: string
          iron?: number | null
          monounsaturated_fat?: number | null
          owner_food_id?: string
          polyunsaturated_fat?: number | null
          potassium?: number | null
          protein?: number
          saturated_fat?: number | null
          serving_size?: number
          serving_unit?: Database["public"]["Enums"]["ServingUnit"]
          sodium?: number | null
          sugar?: number | null
          trans_fat?: number | null
          updated_at?: string
          vitamin_a?: number | null
          vitamin_c?: number | null
          vitamin_d?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "servings_owner_food_id_fkey"
            columns: ["owner_food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      tracked_nutrients: {
        Row: {
          created_at: string
          nutrient_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          nutrient_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          nutrient_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracked_nutrients_nutrient_id_fkey"
            columns: ["nutrient_id"]
            isOneToOne: false
            referencedRelation: "nutrients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracked_nutrients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_creations: {
        Args: { creation_name: string; creation_type: string; user_id: string }
        Returns: number
      }
      count_foods_general: {
        Args: { query: string; user_id: string }
        Returns: number
      }
      count_foods_personal: {
        Args: { query: string; user_id: string }
        Returns: number
      }
      count_foods_public: { Args: { query: string }; Returns: number }
      is_admin: { Args: never; Returns: boolean }
      search_creations: {
        Args: {
          creation_name: string
          creation_type: string
          limit_count: number
          offset_count: number
          user_id: string
        }
        Returns: {
          id: string
          name: string
          rank: number
          type: string
        }[]
      }
      search_foods_general: {
        Args: {
          limit_count: number
          offset_count: number
          query: string
          user_id: string
        }
        Returns: {
          brand_name: string
          id: string
          is_public: boolean
          name: string
          owner_user_id: string
          rank: number
        }[]
      }
      search_foods_personal: {
        Args: {
          limit_count: number
          offset_count: number
          query: string
          user_id: string
        }
        Returns: {
          brand_name: string
          id: string
          is_public: boolean
          name: string
          owner_user_id: string
          rank: number
        }[]
      }
      search_foods_public: {
        Args: { limit_count: number; offset_count: number; query: string }
        Returns: {
          brand_name: string
          id: string
          name: string
          rank: number
        }[]
      }
    }
    Enums: {
      CreationType: "MEAL" | "RECIPE"
      FoodType: "GENERIC" | "BRAND"
      ServingUnit: "ML" | "G" | "OZ"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      CreationType: ["MEAL", "RECIPE"],
      FoodType: ["GENERIC", "BRAND"],
      ServingUnit: ["ML", "G", "OZ"],
    },
  },
} as const
