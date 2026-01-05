/*
  Warnings:

  - You are about to drop the `Creation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavouriteFood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Food` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Nutrient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Serving` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Creation" DROP CONSTRAINT "Creation_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "FavouriteFood" DROP CONSTRAINT "FavouriteFood_foodId_fkey";

-- DropForeignKey
ALTER TABLE "FavouriteFood" DROP CONSTRAINT "FavouriteFood_userId_fkey";

-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_creationId_fkey";

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_servingId_fkey";

-- DropForeignKey
ALTER TABLE "Serving" DROP CONSTRAINT "Serving_ownerFoodId_fkey";

-- DropForeignKey
ALTER TABLE "_NutrientToUser" DROP CONSTRAINT "_NutrientToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_NutrientToUser" DROP CONSTRAINT "_NutrientToUser_B_fkey";

-- DropTable
DROP TABLE "Creation";

-- DropTable
DROP TABLE "FavouriteFood";

-- DropTable
DROP TABLE "Food";

-- DropTable
DROP TABLE "Ingredient";

-- DropTable
DROP TABLE "Nutrient";

-- DropTable
DROP TABLE "Serving";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrients" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "nutrients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foods" (
    "id" TEXT NOT NULL,
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
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "food_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favourite_foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servings" (
    "id" TEXT NOT NULL,
    "owner_food_id" TEXT NOT NULL,
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
CREATE TABLE "creations" (
    "id" TEXT NOT NULL,
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
    "id" TEXT NOT NULL,
    "creation_id" TEXT NOT NULL,
    "serving_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "favourite_foods_user_id_food_id_key" ON "favourite_foods"("user_id", "food_id");

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite_foods" ADD CONSTRAINT "favourite_foods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite_foods" ADD CONSTRAINT "favourite_foods_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servings" ADD CONSTRAINT "servings_owner_food_id_fkey" FOREIGN KEY ("owner_food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creations" ADD CONSTRAINT "creations_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_creation_id_fkey" FOREIGN KEY ("creation_id") REFERENCES "creations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_serving_id_fkey" FOREIGN KEY ("serving_id") REFERENCES "servings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NutrientToUser" ADD CONSTRAINT "_NutrientToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "nutrients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NutrientToUser" ADD CONSTRAINT "_NutrientToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
