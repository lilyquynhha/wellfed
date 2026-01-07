import { PrismaClient } from "@/lib/generated/prisma/client";

export async function seedAdmin(prisma: PrismaClient) {
  // Create admin user
  const admin = "9135c9eb-b292-40b7-beae-60789608ec94";
  await prisma.user.upsert({
    where: { id: admin },
    create: {
      id: admin,
      username: "admin",
    },
    update: {},
  });

  // Create public foods: rice, pasta, chicken, beef, broccoli, tomatoes, egg, olive oil
  const rice = "d00a15bd-9ce4-47a7-8fe2-1d3f565eb0dc";
  const pasta = "0b0ea8ac-60f9-49a1-b934-89ffaea8df83";
  const chicken = "e53f521e-12c8-44f2-9ff9-46fa811efaee";
  const beef = "657600e4-d065-4fa7-acf1-93ec07ee1915";
  const broccoli = "4c479cab-7a7a-4311-a86e-1f783926749c";
  const tomatoes = "f6e201da-9682-4f14-88c4-6ea36d1e2843";
  const egg = "8fcd4f78-0a45-4e4e-97e5-e9e8f6047da4";
  const oliveOil = "b97db662-e881-4296-9408-6c6c0883ab52";

  await Promise.all([
    prisma.food.upsert({
      where: { id: rice },
      create: {
        id: rice,
        name: "Brown Rice",
        type: "BRAND",
        brandName: "Coles",
        ownerUserId: admin,
        isPublic: true,
        servings: {
          create: [
            {
              servingUnit: "G",
              servingSize: 100,
              displayServingUnit: "g",
              displayServingSize: 100,
              cost: 0.25,
              calories: 347,
              carbs: 69.1,
              protein: 7.9,
              fat: 3.1,
              polyunsaturatedFat: 1.3,
              monounsaturatedFat: 1.2,
              sodium: 0,
              fiber: 3.5,
              potassium: 230,
            },
          ],
        },
      },
      update: {},
    }),

    prisma.food.upsert({
      where: { id: pasta },
      create: {
        id: pasta,
        name: "Pasta Bowties",
        type: "BRAND",
        brandName: "Coles",
        ownerUserId: admin,
        isPublic: true,
        servings: {
          create: [
            {
              servingUnit: "G",
              servingSize: 100,
              displayServingUnit: "g",
              displayServingSize: 100,
              cost: 0.2,
              calories: 356,
              carbs: 69.5,
              protein: 12,
              fat: 1.9,
              saturatedFat: 0.5,
              sodium: 37.3,
              fiber: 3.9,
            },
          ],
        },
      },
      update: {},
    }),

    prisma.food.upsert({
      where: { id: chicken },
      create: {
        id: chicken,
        name: "Chicken Breast",
        type: "GENERIC",
        ownerUserId: admin,
        isPublic: true,
        servings: {
          create: [
            {
              servingUnit: "G",
              servingSize: 100,
              displayServingUnit: "g",
              displayServingSize: 100,
              cost: 1.1,
              calories: 195,
              carbs: 0,
              protein: 29.55,
              fat: 7.72,
              saturatedFat: 2.172,
              polyunsaturatedFat: 1.646,
              monounsaturatedFat: 3.005,
              cholesterol: 83,
              sodium: 393,
              fiber: 0,
              sugar: 0,
              calcium: 14,
              iron: 1.06,
              potassium: 243,
              vitaminA: 28,
              vitaminC: 0,
            },
          ],
        },
      },
      update: {},
    }),

    prisma.food.upsert({
      where: { id: beef },
      create: {
        id: beef,
        name: "Extra Lean Beef Mince",
        type: "BRAND",
        brandName: "Coles",
        ownerUserId: admin,
        isPublic: true,
        servings: {
          create: [
            {
              servingUnit: "G",
              servingSize: 100,
              displayServingUnit: "g",
              displayServingSize: 100,
              cost: 2.2,
              calories: 133,
              carbs: 0.5,
              protein: 21.3,
              fat: 5,
              saturatedFat: 2,
              sugar: 0.5,
              sodium: 66,
              fiber: 0,
            },
          ],
        },
      },
      update: {},
    }),

    prisma.food.upsert({
      where: { id: broccoli },
      create: {
        id: broccoli,
        name: "Broccoli",
        type: "GENERIC",
        ownerUserId: admin,
        isPublic: true,
        servings: {
          create: [
            {
              servingUnit: "G",
              servingSize: 100,
              displayServingUnit: "g",
              displayServingSize: 100,
              cost: 0.399,
              calories: 34,
              carbs: 6.64,
              protein: 2.82,
              fat: 0.37,
              saturatedFat: 0.039,
              polyunsaturatedFat: 0.038,
              monounsaturatedFat: 0.011,
              cholesterol: 0,
              sodium: 33,
              fiber: 2.6,
              sugar: 1.7,
              calcium: 47,
              iron: 0.73,
              potassium: 316,
              vitaminA: 31,
              vitaminC: 89.2,
            },
          ],
        },
      },
      update: {},
    }),

    prisma.food.upsert({
      where: { id: tomatoes },
      create: {
        id: tomatoes,
        name: "Tomatoes",
        type: "GENERIC",
        ownerUserId: admin,
        isPublic: true,
        servings: {
          create: [
            {
              servingUnit: "G",
              servingSize: 100,
              displayServingUnit: "g",
              displayServingSize: 100,
              cost: 0.299,
              calories: 18,
              carbs: 3.92,
              protein: 0.88,
              fat: 0.2,
              saturatedFat: 0.046,
              polyunsaturatedFat: 0.135,
              monounsaturatedFat: 0.051,
              cholesterol: 0,
              sodium: 5,
              fiber: 1.2,
              sugar: 2.63,
              calcium: 10,
              iron: 0.27,
              potassium: 237,
              vitaminA: 42,
              vitaminC: 12.7,
            },
          ],
        },
      },
      update: {},
    }),

    prisma.food.upsert({
      where: { id: egg },
      create: {
        id: egg,
        name: "Egg",
        type: "GENERIC",
        ownerUserId: admin,
        isPublic: true,
        servings: {
          create: [
            {
              servingUnit: "G",
              servingSize: 50,
              displayServingUnit: "large",
              displayServingSize: 1,
              cost: 0.415,
              calories: 74,
              carbs: 0.38,
              protein: 6.29,
              fat: 4.97,
              saturatedFat: 1.55,
              polyunsaturatedFat: 0.682,
              monounsaturatedFat: 1.905,
              cholesterol: 212,
              sodium: 70,
              potassium: 67,
              sugar: 0.38,
              vitaminA: 70,
              calcium: 26,
              iron: 0.92,
            },
            {
              servingUnit: "G",
              servingSize: 100,
              displayServingUnit: "g",
              displayServingSize: 100,
              cost: 0.83,
              calories: 147,
              carbs: 0.77,
              protein: 12.58,
              fat: 9.94,
              saturatedFat: 3.099,
              polyunsaturatedFat: 1.364,
              monounsaturatedFat: 3.81,
              cholesterol: 423,
              sodium: 140,
              potassium: 134,
              sugar: 0.77,
              vitaminA: 140,
              calcium: 53,
              iron: 1.83,
            },
          ],
        },
      },
      update: {},
    }),

    prisma.food.upsert({
      where: { id: oliveOil },
      create: {
        id: oliveOil,
        name: "Extra Virgin Olive Oil",
        type: "BRAND",
        brandName: "La Espanola",
        ownerUserId: admin,
        isPublic: true,
        servings: {
          create: [
            {
              servingUnit: "ML",
              servingSize: 15,
              displayServingUnit: "tbsp",
              displayServingSize: 1,
              cost: 0.195,
              calories: 121,
              carbs: 0,
              protein: 0,
              fat: 13.7,
              saturatedFat: 1.9,
              polyunsaturatedFat: 1.2,
              monounsaturatedFat: 10.6,
              transFat: 0,
              fiber: 0,
              sugar: 0,
              sodium: 2,
            },
            {
              servingUnit: "ML",
              servingSize: 100,
              displayServingUnit: "ml",
              displayServingSize: 100,
              cost: 1.3,
              calories: 811,
              carbs: 0,
              protein: 0,
              fat: 91.6,
              saturatedFat: 12.8,
              polyunsaturatedFat: 8.2,
              monounsaturatedFat: 70.5,
              transFat: 0,
              fiber: 0,
              sugar: 0,
              sodium: 4,
            },
          ],
        },
      },
      update: {},
    }),
  ]);
}
