/*
  Warnings:

  - You are about to drop the `_NutrientToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_NutrientToUser" DROP CONSTRAINT "_NutrientToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_NutrientToUser" DROP CONSTRAINT "_NutrientToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "creations" DROP CONSTRAINT "creations_owner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "favourite_foods" DROP CONSTRAINT "favourite_foods_user_id_fkey";

-- DropForeignKey
ALTER TABLE "foods" DROP CONSTRAINT "foods_owner_user_id_fkey";

-- DropTable
DROP TABLE "_NutrientToUser";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NutrientToProfile" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_NutrientToProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE INDEX "_NutrientToProfile_B_index" ON "_NutrientToProfile"("B");

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite_foods" ADD CONSTRAINT "favourite_foods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creations" ADD CONSTRAINT "creations_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NutrientToProfile" ADD CONSTRAINT "_NutrientToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "nutrients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NutrientToProfile" ADD CONSTRAINT "_NutrientToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
