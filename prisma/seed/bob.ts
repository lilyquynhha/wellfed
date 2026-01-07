import { PrismaClient } from "@/lib/generated/prisma/client";

export async function seedBob(prisma: PrismaClient) {
  // Get nutrients to track
  const [carbs, protein, fat, sugar, fiber] = await Promise.all([
    prisma.nutrient.findFirstOrThrow({
      where: {
        name: "Carbohydrate",
      },
    }),
    prisma.nutrient.findFirstOrThrow({
      where: {
        name: "Protein",
      },
    }),
    prisma.nutrient.findFirstOrThrow({
      where: {
        name: "Fat",
      },
    }),
    prisma.nutrient.findFirstOrThrow({
      where: {
        name: "Sugar",
      },
    }),
    prisma.nutrient.findFirstOrThrow({
      where: {
        name: "Fiber",
      },
    }),
  ]);

  // Get public foods to favourite
  const [rice, oliveOil, egg] = await Promise.all([
    prisma.food.findFirstOrThrow({
      where: { name: "Brown Rice", type: "BRAND", brandName: "Coles" },
    }),
    prisma.food.findFirstOrThrow({
      where: {
        name: "Extra Virgin Olive Oil",
        type: "BRAND",
        brandName: "La Espanola",
      },
    }),
    prisma.food.findFirstOrThrow({
      where: { name: "Egg", type: "GENERIC" },
    }),
  ]);

  // Create user with tracked nutrients and favourited foods
  const bob = "e099a7d6-6356-4fe0-8573-a8f2829b5f63";
  await prisma.user.upsert({
    where: { id: bob },
    create: {
      id: bob,
      username: "bob",
      nutrients: {
        connect: [
          { id: carbs.id },
          { id: protein.id },
          { id: fat.id },
          { id: sugar.id },
          { id: fiber.id },
        ],
      },
      favouriteFoods: {
        create: [
          { foodId: rice.id },
          { foodId: oliveOil.id },
          { foodId: egg.id },
        ],
      },
    },
    update: {},
  });

  // Create user's private foods: chickpeas, apple, yogurt
  const chickpeas = "7d5bf18e-284c-454e-8aa4-cba941f33956";
  await prisma.food.upsert({
    where: { id: chickpeas },
    create: {
      id: chickpeas,
      name: "Chickpeas",
      type: "BRAND",
      brandName: "McKenzie's",
      ownerUserId: bob,
      servings: {
        create: [
          {
            servingUnit: "G",
            servingSize: 100,
            displayServingUnit: "g (dry)",
            displayServingSize: 100,
            cost: 0.507,
            protein: 19.5,
            carbs: 31.1,
            calories: 320.2677,
            saturatedFat: 0,
            sugar: 2.5,
            sodium: 12,
            fiber: 31.6,
            fat: 6,
          },
          {
            servingUnit: "G",
            servingSize: 46.4,
            displayServingUnit: "g (cooked)",
            displayServingSize: 100,
            cost: 0.235248,
            protein: 9.048,
            carbs: 14.4304,
            calories: 148.6042128,
            saturatedFat: 0,
            sugar: 1.16,
            sodium: 5.568,
            fiber: 14.6624,
            fat: 2.784,
          },
        ],
      },
    },
    update: {},
  });
  const apple = "b71f9380-2db7-48f0-89cc-1dbb020627d9";
  await prisma.food.upsert({
    where: { id: apple },
    create: {
      id: apple,
      name: "Apple",
      type: "GENERIC",
      ownerUserId: bob,
      servings: {
        create: [
          {
            servingUnit: "G",
            servingSize: 100,
            displayServingUnit: "g",
            displayServingSize: 100,
            cost: 0.399,
            calories: 52,
            carbs: 13.81,
            protein: 0.26,
            fat: 0.17,
            saturatedFat: 0.028,
            polyunsaturatedFat: 0.051,
            monounsaturatedFat: 0.007,
            cholesterol: 0,
            sodium: 1,
            fiber: 2.4,
            sugar: 10.39,
            calcium: 6,
            iron: 0.12,
            potassium: 107,
            vitaminA: 3,
            vitaminC: 4.6,
          },
        ],
      },
    },
    update: {},
  });
  const yogurt = "28fd9d7b-d1fe-463b-8d1f-df2aacd50975";
  await prisma.food.upsert({
    where: { id: yogurt },
    create: {
      id: yogurt,
      name: "High Protein Greek Yoghurt",
      type: "BRAND",
      brandName: "Coles",
      ownerUserId: bob,
      servings: {
        create: [
          {
            servingUnit: "G",
            servingSize: 100,
            displayServingUnit: "g",
            displayServingSize: 100,
            cost: 0.69,
            calories: 56.3,
            protein: 9.35,
            carbs: 4,
            fat: 0.2,
            saturatedFat: 0.1,
            sugar: 3.6,
            calcium: 120,
            sodium: 41,
            fiber: 0.1,
          },
        ],
      },
    },
    update: {},
  });

  // Create "Egg Fried Rice" meal: rice, egg, olive oil
  const [riceServ1, eggServ1, oliveOilServ1] = await Promise.all([
    prisma.serving.findFirstOrThrow({
      where: {
        ownerFoodId: rice.id,
        displayServingUnit: "g",
      },
    }),
    prisma.serving.findFirstOrThrow({
      where: {
        ownerFoodId: egg.id,
        displayServingUnit: "large",
      },
    }),
    prisma.serving.findFirstOrThrow({
      where: {
        ownerFoodId: oliveOil.id,
        displayServingUnit: "ml",
      },
    }),
  ]);
  const eggFriedRice = "0242b78f-b916-44e0-8f56-072ba1c6465d";
  await prisma.creation.upsert({
    where: {
      id: eggFriedRice,
    },
    create: {
      id: eggFriedRice,
      ownerUserId: bob,
      name: "Egg Fried Rice",
      type: "MEAL",
      ingredients: {
        create: [
          { servingId: riceServ1.id, amount: 100 },
          { servingId: eggServ1.id, amount: 3 },
          { servingId: oliveOilServ1.id, amount: 5 },
        ],
      },
    },
    update: {},
  });

  // Create "Apple Yogurt" meal: yogurt, apple
  const [appleServ2, yogurtServ2] = await Promise.all([
    prisma.serving.findFirstOrThrow({
      where: {
        ownerFoodId: apple,
        displayServingUnit: "g",
      },
    }),
    prisma.serving.findFirstOrThrow({
      where: {
        ownerFoodId: yogurt,
        displayServingUnit: "g",
      },
    }),
  ]);
  const appleYogurt = "85b5d77d-2af3-4c3f-a0a4-4f4e2bff2dee";
  await prisma.creation.upsert({
    where: {
      id: appleYogurt,
    },
    create: {
      id: appleYogurt,
      ownerUserId: bob,
      name: "Apple Yogurt",
      type: "MEAL",
      ingredients: {
        create: [
          { servingId: appleServ2.id, amount: 300 },
          { servingId: yogurtServ2.id, amount: 200 },
        ],
      },
    },
    update: {},
  });
}
