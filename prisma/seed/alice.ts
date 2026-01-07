import { PrismaClient } from "@/lib/generated/prisma/client";

export async function seedAlice(prisma: PrismaClient) {
  // Get nutrients to track
  const [carbs, protein, fat, sodium, fiber, cholesterol] = await Promise.all([
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
        name: "Sodium",
      },
    }),
    prisma.nutrient.findFirstOrThrow({
      where: {
        name: "Fiber",
      },
    }),
    prisma.nutrient.findFirstOrThrow({
      where: {
        name: "Cholesterol",
      },
    }),
  ]);

  // Get public foods to favourite
  const [rice, chicken, oliveOil, egg, beef, pasta, tomatoes] =
    await Promise.all([
      prisma.food.findFirstOrThrow({
        where: { name: "Brown Rice", type: "BRAND", brandName: "Coles" },
      }),
      prisma.food.findFirstOrThrow({
        where: { name: "Chicken Breast", type: "GENERIC" },
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
      prisma.food.findFirstOrThrow({
        where: {
          name: "Extra Lean Beef Mince",
          type: "BRAND",
          brandName: "Coles",
        },
      }),
      prisma.food.findFirstOrThrow({
        where: {
          name: "Pasta Bowties",
          type: "BRAND",
          brandName: "Coles",
        },
      }),
      prisma.food.findFirstOrThrow({
        where: {
          name: "Tomatoes",
          type: "GENERIC",
        },
      }),
    ]);

  // Create user with tracked nutrients and favourited foods
  const alice = "7d27e3e6-52f2-4141-9ed2-0a181516a5b9";
  await prisma.user.upsert({
    where: { id: alice },
    create: {
      id: alice,
      username: "alice",
      nutrients: {
        connect: [
          {
            id: carbs.id,
          },
          {
            id: protein.id,
          },
          {
            id: fat.id,
          },
          {
            id: sodium.id,
          },
          {
            id: fiber.id,
          },
          {
            id: cholesterol.id,
          },
        ],
      },
      favouriteFoods: {
        create: [
          {
            foodId: rice.id,
          },
          {
            foodId: chicken.id,
          },
          {
            foodId: oliveOil.id,
          },
          {
            foodId: egg.id,
          },
          {
            foodId: beef.id,
          },
        ],
      },
    },
    update: {},
  });

  // Create user's private foods: frozen veggies, bread
  const frozenVeggies = "07843158-905c-485b-a9c3-6a480599c874";
  await prisma.food.upsert({
    where: { id: frozenVeggies },
    create: {
      id: frozenVeggies,
      name: "Frozen Mixed Vegetables",
      type: "BRAND",
      brandName: "Coles",
      ownerUserId: alice,
      servings: {
        create: [
          {
            servingUnit: "G",
            servingSize: 100,
            displayServingUnit: "g",
            displayServingSize: 100,
            cost: 0.28,
            calories: 41,
            protein: 2.3,
            carbs: 4.63,
            fat: 0.5,
            saturatedFat: 0,
            sugar: 1.93,
            sodium: 23.4,
            fiber: 4.36,
          },
        ],
      },
    },
    update: {},
  });
  const bread = "a84a9906-8db3-47ea-bfb7-0cd7ba45c0a1";
  await prisma.food.upsert({
    where: { id: bread },
    create: {
      id: bread,
      name: "7 Seeds & Grains Sandwich Bread Loaf",
      type: "BRAND",
      brandName: "Coles",
      ownerUserId: alice,
      servings: {
        create: [
          {
            servingUnit: "G",
            servingSize: 100,
            displayServingUnit: "g",
            displayServingSize: 100,
            cost: 0.5,
            calories: 263,
            protein: 10.8,
            carbs: 33.1,
            fat: 7.5,
            saturatedFat: 1.3,
            transFat: 0.1,
            sugar: 0.8,
            sodium: 314,
            fiber: 9.3,
          },
          {
            servingUnit: "G",
            servingSize: 40,
            displayServingUnit: "slice",
            displayServingSize: 1,
            cost: 0.2,
            calories: 105.2,
            protein: 4.32,
            carbs: 13.24,
            fat: 3,
            saturatedFat: 0.52,
            transFat: 0.04,
            sugar: 0.32,
            sodium: 125.6,
            fiber: 3.72,
          },
        ],
      },
    },
    update: {},
  });

  // Create "Chicken Stir Fry" meal: chicken, rice, frozen veggies, olive oil
  const [chickenServ1, riceServ1, frozenVeggiesServ1, oliveOilServ1] =
    await Promise.all([
      prisma.serving.findFirstOrThrow({
        where: {
          ownerFoodId: chicken.id,
          displayServingUnit: "g",
        },
      }),
      prisma.serving.findFirstOrThrow({
        where: {
          ownerFoodId: rice.id,
          displayServingUnit: "g",
        },
      }),
      prisma.serving.findFirstOrThrow({
        where: {
          ownerFoodId: frozenVeggies,
          displayServingUnit: "g",
        },
      }),
      prisma.serving.findFirstOrThrow({
        where: {
          ownerFoodId: oliveOil.id,
          displayServingUnit: "ml",
        },
      }),
    ]);
  const chickenRice = "f28ca061-c760-46fd-abb5-278e83e1895f";
  await prisma.creation.upsert({
    where: {
      id: chickenRice,
    },
    create: {
      id: chickenRice,
      ownerUserId: alice,
      name: "Chicken Stir Fry",
      type: "MEAL",
      ingredients: {
        create: [
          { servingId: chickenServ1.id, amount: 200 },
          { servingId: riceServ1.id, amount: 100 },
          { servingId: frozenVeggiesServ1.id, amount: 130 },
          { servingId: oliveOilServ1.id, amount: 5 },
        ],
      },
    },
    update: {},
  });

  // Create "Bolognese Pasta" meal: pasta, beef, tomatoes, olive oil
  const [pastaServ2, beefServ2, tomatoesServ2, oliveOilServ2] =
    await Promise.all([
      prisma.serving.findFirstOrThrow({
        where: {
          ownerFoodId: pasta.id,
          displayServingUnit: "g",
        },
      }),
      prisma.serving.findFirstOrThrow({
        where: {
          ownerFoodId: beef.id,
          displayServingUnit: "g",
        },
      }),
      prisma.serving.findFirstOrThrow({
        where: {
          ownerFoodId: tomatoes.id,
          displayServingUnit: "g",
        },
      }),
      prisma.serving.findFirstOrThrow({
        where: {
          ownerFoodId: oliveOil.id,
          displayServingUnit: "ml",
        },
      }),
    ]);
  const bolognesePasta = "0210cba3-d767-401f-bfbd-baec600513f9";
  await prisma.creation.upsert({
    where: {
      id: bolognesePasta,
    },
    create: {
      id: bolognesePasta,
      ownerUserId: alice,
      name: "Bolognese Pasta",
      type: "MEAL",
      ingredients: {
        create: [
          { servingId: pastaServ2.id, amount: 100 },
          { servingId: beefServ2.id, amount: 150 },
          { servingId: tomatoesServ2.id, amount: 350 },
          { servingId: oliveOilServ2.id, amount: 5 },
        ],
      },
    },
    update: {},
  });

  // Create "Scrambled Egg Toast" meal: bread, egg
  const [breadServ3, eggServ3] = await Promise.all([
    prisma.serving.findFirstOrThrow({
      where: {
        ownerFoodId: bread,
        displayServingUnit: "slice",
      },
    }),
    prisma.serving.findFirstOrThrow({
      where: {
        ownerFoodId: egg.id,
        displayServingUnit: "large",
      },
    }),
  ]);
  const eggToast = "e627a03b-a6b8-4c66-8572-95dc3e1da6ff";
  await prisma.creation.upsert({
    where: {
      id: eggToast,
    },
    create: {
      id: eggToast,
      ownerUserId: alice,
      name: "Scrambled Egg Toast",
      type: "MEAL",
      ingredients: {
        create: [
          { servingId: breadServ3.id, amount: 2 },
          {
            servingId: eggServ3.id,
            amount: 2,
          },
        ],
      },
    },
    update: {},
  });
}
