-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('GENERIC', 'BRAND');

-- CreateEnum
CREATE TYPE "ServingUnit" AS ENUM ('ML', 'G', 'OZ');

-- CreateEnum
CREATE TYPE "CreationType" AS ENUM ('MEAL', 'RECIPE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nutrient" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "FoodType" NOT NULL,
    "brandName" VARCHAR(100) NOT NULL,
    "ownerUserId" UUID,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavouriteFood" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "foodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FavouriteFood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Serving" (
    "id" TEXT NOT NULL,
    "ownerFoodId" TEXT NOT NULL,
    "servingUnit" "ServingUnit" NOT NULL,
    "servingSize" DECIMAL(65,30) NOT NULL,
    "displayServingUnit" VARCHAR(100) NOT NULL,
    "displayServingSize" DECIMAL(65,30) NOT NULL,
    "cost" DECIMAL(65,30),
    "calories" DECIMAL(65,30) NOT NULL,
    "carbs" DECIMAL(65,30) NOT NULL,
    "protein" DECIMAL(65,30) NOT NULL,
    "fat" DECIMAL(65,30) NOT NULL,
    "saturatedFat" DECIMAL(65,30),
    "polyunsaturatedFat" DECIMAL(65,30),
    "monounsaturatedFat" DECIMAL(65,30),
    "transFat" DECIMAL(65,30),
    "cholesterol" DECIMAL(65,30),
    "fiber" DECIMAL(65,30),
    "sugar" DECIMAL(65,30),
    "addedSugars" DECIMAL(65,30),
    "sodium" DECIMAL(65,30),
    "potassium" DECIMAL(65,30),
    "vitaminA" DECIMAL(65,30),
    "vitaminC" DECIMAL(65,30),
    "vitaminD" DECIMAL(65,30),
    "calcium" DECIMAL(65,30),
    "iron" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Serving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creation" (
    "id" TEXT NOT NULL,
    "ownerUserId" UUID,
    "name" VARCHAR(100) NOT NULL,
    "type" "CreationType" NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Creation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "creationId" TEXT NOT NULL,
    "servingId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NutrientToUser" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_NutrientToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteFood_userId_foodId_key" ON "FavouriteFood"("userId", "foodId");

-- CreateIndex
CREATE INDEX "_NutrientToUser_B_index" ON "_NutrientToUser"("B");

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteFood" ADD CONSTRAINT "FavouriteFood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteFood" ADD CONSTRAINT "FavouriteFood_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serving" ADD CONSTRAINT "Serving_ownerFoodId_fkey" FOREIGN KEY ("ownerFoodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creation" ADD CONSTRAINT "Creation_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_creationId_fkey" FOREIGN KEY ("creationId") REFERENCES "Creation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_servingId_fkey" FOREIGN KEY ("servingId") REFERENCES "Serving"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NutrientToUser" ADD CONSTRAINT "_NutrientToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Nutrient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NutrientToUser" ADD CONSTRAINT "_NutrientToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
