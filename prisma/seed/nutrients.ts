import { PrismaClient } from "@/lib/generated/prisma/client";

export async function seedNutrients(prisma: PrismaClient) {
  await prisma.nutrient.createMany({
    data: [
      { name: "Carbohydrate" },
      { name: "Protein" },
      { name: "Fat" },
      { name: "Saturated Fat" },
      { name: "Polyunsaturated Fat" },
      { name: "Monounsaturated Fat" },
      { name: "Trans Fat" },
      { name: "Cholesterol" },
      { name: "Fiber" },
      { name: "Sugar" },
      { name: "Added Sugars" },
      { name: "Sodium" },
      { name: "Potassium" },
      { name: "Vitamin A" },
      { name: "Vitamin C" },
      { name: "Vitamin D" },
      { name: "Calcium" },
      { name: "Iron" },
    ],
    skipDuplicates: true,
  });
}
