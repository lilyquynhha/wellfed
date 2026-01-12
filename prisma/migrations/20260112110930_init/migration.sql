-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('GENERIC', 'BRAND');

-- CreateEnum
CREATE TYPE "ServingUnit" AS ENUM ('ML', 'G', 'OZ');

-- CreateEnum
CREATE TYPE "CreationType" AS ENUM ('MEAL', 'RECIPE');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "nutrients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracked_nutrients" (
    "user_id" UUID NOT NULL,
    "nutrient_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracked_nutrients_pkey" PRIMARY KEY ("user_id","nutrient_id")
);

-- CreateTable
CREATE TABLE "foods" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "type" "FoodType" NOT NULL,
    "brand_name" VARCHAR(100),
    "owner_user_id" UUID,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favourite_foods" (
    "user_id" UUID NOT NULL,
    "food_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favourite_foods_pkey" PRIMARY KEY ("user_id","food_id")
);

-- CreateTable
CREATE TABLE "servings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_food_id" UUID NOT NULL,
    "serving_unit" "ServingUnit" NOT NULL,
    "serving_size" DECIMAL(65,30) NOT NULL,
    "display_serving_unit" VARCHAR(100) NOT NULL,
    "display_serving_size" DECIMAL(65,30) NOT NULL,
    "cost" DECIMAL(65,30),
    "calories" DECIMAL(65,30) NOT NULL,
    "carbs" DECIMAL(65,30) NOT NULL,
    "protein" DECIMAL(65,30) NOT NULL,
    "fat" DECIMAL(65,30) NOT NULL,
    "saturated_fat" DECIMAL(65,30),
    "polyunsaturated_fat" DECIMAL(65,30),
    "monounsaturated_fat" DECIMAL(65,30),
    "trans_fat" DECIMAL(65,30),
    "cholesterol" DECIMAL(65,30),
    "fiber" DECIMAL(65,30),
    "sugar" DECIMAL(65,30),
    "added_sugars" DECIMAL(65,30),
    "sodium" DECIMAL(65,30),
    "potassium" DECIMAL(65,30),
    "vitamin_a" DECIMAL(65,30),
    "vitamin_c" DECIMAL(65,30),
    "vitamin_d" DECIMAL(65,30),
    "calcium" DECIMAL(65,30),
    "iron" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serving_cost_overrides" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "serving_id" UUID NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "serving_cost_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_user_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "type" "CreationType" NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "creations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "creation_id" UUID NOT NULL,
    "serving_id" UUID NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "nutrients_name_key" ON "nutrients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "serving_cost_overrides_user_id_serving_id_key" ON "serving_cost_overrides"("user_id", "serving_id");

-- AddForeignKey
ALTER TABLE "tracked_nutrients" ADD CONSTRAINT "tracked_nutrients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracked_nutrients" ADD CONSTRAINT "tracked_nutrients_nutrient_id_fkey" FOREIGN KEY ("nutrient_id") REFERENCES "nutrients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite_foods" ADD CONSTRAINT "favourite_foods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite_foods" ADD CONSTRAINT "favourite_foods_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servings" ADD CONSTRAINT "servings_owner_food_id_fkey" FOREIGN KEY ("owner_food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serving_cost_overrides" ADD CONSTRAINT "serving_cost_overrides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serving_cost_overrides" ADD CONSTRAINT "serving_cost_overrides_serving_id_fkey" FOREIGN KEY ("serving_id") REFERENCES "servings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creations" ADD CONSTRAINT "creations_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_creation_id_fkey" FOREIGN KEY ("creation_id") REFERENCES "creations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_serving_id_fkey" FOREIGN KEY ("serving_id") REFERENCES "servings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
