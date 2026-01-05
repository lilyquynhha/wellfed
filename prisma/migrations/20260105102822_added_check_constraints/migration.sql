ALTER TABLE "public"."foods" ADD CONSTRAINT "brand_food_has_brand_name_check" CHECK (
    (
        type = 'BRAND'
        AND brand_name IS NOT NULL
    )
    OR (type = 'GENERIC')
);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_serving_size" CHECK (serving_size > 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_display_serving_size" CHECK (display_serving_size > 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_cost" CHECK (cost >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_calories" CHECK (calories >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_carbs" CHECK (carbs >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_protein" CHECK (protein >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_fat" CHECK (fat >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_saturated_fat" CHECK (saturated_fat >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_polyunsaturated_fat" CHECK (polyunsaturated_fat >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_monounsaturated_fat" CHECK (monounsaturated_fat >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_trans_fat" CHECK (trans_fat >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_cholesterol" CHECK (cholesterol >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_fiber" CHECK (fiber >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_sugar" CHECK (sugar >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_added_sugars" CHECK (added_sugars >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_sodium" CHECK (sodium >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_potassium" CHECK (potassium >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_vitamin_a" CHECK (vitamin_a >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_vitamin_c" CHECK (vitamin_c >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_vitamin_d" CHECK (vitamin_d >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_calcium" CHECK (calcium >= 0);

ALTER TABLE "public"."servings" ADD CONSTRAINT "positive_iron" CHECK (iron >= 0);