// NOTE: RLS tests doesn't cover every case due to request rate limit

import { describe, expect, beforeEach, it } from "vitest";
import { adminClient, userClient } from "../setup/supabase-clients";
import {
  signIn,
  ADMIN_EMAIL,
  ADMIN_ID,
  USER1_EMAIL,
  USER1_ID,
  USER2_ID,
} from "../setup/sign-in";
import { resetTables } from "../setup/utils";

describe("nutrients", () => {
  beforeEach(async () => {
    await resetTables();
  });

  it("allows admins to create new nutrients", async () => {
    await signIn(userClient, ADMIN_EMAIL);

    const { error } = await userClient
      .from("nutrients")
      .insert({ name: "Vitamin A" });

    expect(error).toBeNull();
  });

  it("allows admins to delete nutrients", async () => {
    // await signIn(userClient, ADMIN_EMAIL);
    await adminClient.from("nutrients").insert({ name: "Vitamin A" });

    const { data, error } = await userClient
      .from("nutrients")
      .delete()
      .eq("name", "Vitamin A")
      .select();

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it("prevents non-admins from creating new nutrients", async () => {
    await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient
      .from("nutrients")
      .insert({ name: "Vitamin A" });

    expect(error).not.toBeNull();
  });

  it("prevents non-admins from deleting nutrients", async () => {
    // await signIn(userClient, USER1_EMAIL);
    await adminClient.from("nutrients").insert({ name: "Vitamin A" });

    await userClient.from("nutrients").delete().eq("name", "Vitamin A");

    const { data } = await adminClient
      .from("nutrients")
      .select()
      .eq("name", "Vitamin A");

    expect(data).toHaveLength(1);
  });
});

describe("profiles", () => {
  beforeEach(async () => {
    await resetTables();
  });

  it("allows users to view their profile", async () => {
    // await signIn(userClient, USER1_EMAIL);

    const { data } = await userClient.from("profiles").select();

    expect(data).toHaveLength(1);
    expect(data![0].username).toBe("user1");
  });

  it("allows users to update their profile", async () => {
    // await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient
      .from("profiles")
      .update({ username: "user_one" })
      .eq("username", "user1");

    await userClient
      .from("profiles")
      .update({ username: "user1" })
      .eq("username", "user_one");

    expect(error).toBeNull();
  });

  it("prevents users from updating other users' profiles", async () => {
    // await signIn(userClient, USER1_EMAIL);

    await userClient
      .from("profiles")
      .update({ username: "user2" })
      .eq("username", "user_two");

    const { data } = await adminClient
      .from("profiles")
      .select()
      .eq("username", "user2");

    expect(data![0].username).toBe("user2");
  });
});

describe("tracked_nutrients", () => {
  beforeEach(async () => {
    await resetTables();
  });

  it("allows users to create their tracked nutrients", async () => {
    // await signIn(userClient, USER1_EMAIL);
    await adminClient.from("nutrients").insert({
      id: "11111111-1111-1111-1111-111111111111",
      name: "Vitamin A",
    });

    const { error } = await userClient.from("tracked_nutrients").insert({
      user_id: USER1_ID,
      nutrient_id: "11111111-1111-1111-1111-111111111111",
    });

    expect(error).toBeNull();
  });

  it("allows users to delete their tracked nutrients", async () => {
    // await signIn(userClient, USER1_EMAIL);
    await adminClient.from("nutrients").insert({
      id: "11111111-1111-1111-1111-111111111111",
      name: "Vitamin A",
    });
    await userClient.from("tracked_nutrients").insert({
      user_id: USER1_ID,
      nutrient_id: "11111111-1111-1111-1111-111111111111",
    });

    const { data, error } = await userClient
      .from("tracked_nutrients")
      .delete()
      .eq("user_id", USER1_ID)
      .select();

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    expect(data![0].user_id).toBe(USER1_ID);
  });

  it("prevents users from creating other users' tracked nutrients", async () => {
    // await signIn(userClient, USER1_EMAIL);
    await adminClient.from("nutrients").insert({
      id: "11111111-1111-1111-1111-111111111111",
      name: "Vitamin A",
    });

    const { error } = await userClient.from("tracked_nutrients").insert({
      user_id: USER2_ID,
      nutrient_id: "11111111-1111-1111-1111-111111111111",
    });

    expect(error).not.toBeNull();
  });
});

describe("foods", () => {
  beforeEach(async () => {
    await resetTables();
  });

  it("allows users to view public foods", async () => {
    const { error } = await adminClient.from("foods").insert({
      id: "22222222-2222-2222-2222-222222222222",
      name: "Apples",
      type: "GENERIC",
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { data } = await userClient
      .from("foods")
      .select()
      .eq("name", "Apples");

    expect(data).toHaveLength(1);
  });

  it("allows users to view owned foods", async () => {
    await adminClient.from("foods").insert({
      id: "33333333-3333-3333-3333-333333333333",
      name: "Private Apple",
      type: "GENERIC",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { data } = await userClient
      .from("foods")
      .select()
      .eq("owner_user_id", USER1_ID);

    expect(data).toHaveLength(1);
    expect(data![0].name).toBe("Private Apple");
  });

  it("prevents users from viewing other users' private foods", async () => {
    await adminClient.from("foods").insert({
      id: "44444444-4444-4444-4444-444444444444",
      name: "Other Private",
      type: "GENERIC",
      owner_user_id: USER2_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { data } = await userClient
      .from("foods")
      .select()
      .eq("id", "44444444-4444-4444-4444-444444444444");

    expect(data).toHaveLength(0);
  });

  it("allows users to create private foods", async () => {
    // await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient.from("foods").insert({
      name: "My Private Food",
      type: "GENERIC",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    expect(error).toBeNull();
  });
});

describe("favourite_foods", () => {
  beforeEach(async () => {
    await resetTables();
  });

  it("allows users to view their favourite foods", async () => {
    await adminClient.from("foods").insert({
      id: "99999999-9999-9999-9999-999999999999",
      name: "Fav Apple",
      type: "GENERIC",
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { error: insertError } = await userClient
      .from("favourite_foods")
      .insert({
        user_id: USER1_ID,
        food_id: "99999999-9999-9999-9999-999999999999",
      });

    expect(insertError).toBeNull();

    const { data } = await userClient.from("favourite_foods").select();

    expect(data).toHaveLength(1);
    expect(data![0].user_id).toBe(USER1_ID);
  });

  it("prevents users from viewing other users' favourite foods", async () => {
    await adminClient.from("foods").insert({
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      name: "Other Fav",
      type: "GENERIC",
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("favourite_foods").insert({
      user_id: USER2_ID,
      food_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    });

    // await signIn(userClient, USER1_EMAIL);

    const { data } = await userClient.from("favourite_foods").select();

    expect(data).toHaveLength(0);
  });

  it("allows users to add public foods to their favourite foods", async () => {
    await adminClient.from("foods").insert({
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      name: "Public Fav",
      type: "GENERIC",
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient.from("favourite_foods").insert({
      user_id: USER1_ID,
      food_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    });

    expect(error).toBeNull();
  });
});

describe("servings", () => {
  beforeEach(async () => {
    await resetTables();
  });

  it("allows admins to create servings of public foods", async () => {
    await adminClient.from("foods").insert({
      id: "aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa",
      name: "Public Food For Serving",
      type: "GENERIC",
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await signIn(userClient, ADMIN_EMAIL);

    const { error } = await userClient.from("servings").insert({
      owner_food_id: "aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa",
      serving_unit: "G",
      serving_size: 100,
      display_serving_unit: "g",
      display_serving_size: 100,
      calories: 100,
      carbs: 10,
      protein: 5,
      fat: 3,
      updated_at: new Date().toISOString(),
    });

    expect(error).toBeNull();
  });

  it("prevents users from creatings serving of public foods", async () => {
    await adminClient.from("foods").insert({
      id: "bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb",
      name: "Public Food For Serving 2",
      type: "GENERIC",
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient.from("servings").insert({
      owner_food_id: "bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb",
      serving_unit: "G",
      serving_size: 50,
      display_serving_unit: "g",
      display_serving_size: 50,
      calories: 50,
      carbs: 5,
      protein: 2,
      fat: 1,
      updated_at: new Date().toISOString(),
    });

    expect(error).not.toBeNull();
  });

  it("allows users to create servings of owned private foods", async () => {
    await adminClient.from("foods").insert({
      id: "cccccccc-3333-3333-3333-cccccccccccc",
      name: "User Private Food For Serving",
      type: "GENERIC",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient.from("servings").insert({
      owner_food_id: "cccccccc-3333-3333-3333-cccccccccccc",
      serving_unit: "G",
      serving_size: 25,
      display_serving_unit: "g",
      display_serving_size: 25,
      calories: 25,
      carbs: 2.5,
      protein: 1.2,
      fat: 0.5,
      updated_at: new Date().toISOString(),
    });

    expect(error).toBeNull();
  });
});

describe("serving_cost_overrides", () => {
  beforeEach(async () => {
    await resetTables();
  });

  it("allows users to create serving cost overrides of public foods", async () => {
    await adminClient.from("foods").insert({
      id: "fffffff0-6666-6666-6666-fffffffffff0",
      name: "Public Food For Override",
      type: "GENERIC",
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("servings").insert({
      id: "aaaaaaaa-aaaa-1111-1111-111111111111",
      owner_food_id: "fffffff0-6666-6666-6666-fffffffffff0",
      serving_unit: "G",
      serving_size: 10,
      display_serving_unit: "g",
      display_serving_size: 10,
      calories: 10,
      carbs: 1,
      protein: 1,
      fat: 0.5,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient.from("serving_cost_overrides").insert({
      user_id: USER1_ID,
      serving_id: "aaaaaaaa-aaaa-1111-1111-111111111111",
      cost: 1.23,
      updated_at: new Date().toISOString(),
    });

    expect(error).toBeNull();
  });

  it("allows users to create serving cost overrides of private foods", async () => {
    await adminClient.from("foods").insert({
      id: "fffffff1-7777-7777-7777-fffffffffff1",
      name: "Private Food For Override",
      type: "GENERIC",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("servings").insert({
      id: "11111111-2011-2111-2014-101181111121",
      owner_food_id: "fffffff1-7777-7777-7777-fffffffffff1",
      serving_unit: "G",
      serving_size: 15,
      display_serving_unit: "g",
      display_serving_size: 15,
      calories: 15,
      carbs: 1.5,
      protein: 1,
      fat: 0.6,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient.from("serving_cost_overrides").insert({
      user_id: USER1_ID,
      serving_id: "11111111-2011-2111-2014-101181111121",
      cost: 2.5,
      updated_at: new Date().toISOString(),
    });

    expect(error).toBeNull();
  });

  it("prevents users from deleting other users' serving cost overrides", async () => {
    await adminClient.from("foods").insert({
      id: "fffffff3-9999-9999-9999-fffffffffff3",
      name: "Public Food For Override 3",
      type: "GENERIC",
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("servings").insert({
      id: "cccccccc-aaaa-1111-1111-111111111111",
      owner_food_id: "fffffff3-9999-9999-9999-fffffffffff3",
      serving_unit: "G",
      serving_size: 25,
      display_serving_unit: "g",
      display_serving_size: 25,
      calories: 25,
      carbs: 2.5,
      protein: 1.5,
      fat: 1,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("serving_cost_overrides").insert({
      user_id: USER2_ID,
      serving_id: "cccccccc-aaaa-1111-1111-111111111111",
      cost: 4.0,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    await userClient
      .from("serving_cost_overrides")
      .delete()
      .eq("user_id", USER2_ID);

    const { data } = await adminClient
      .from("serving_cost_overrides")
      .select()
      .eq("user_id", USER2_ID);

    expect(data).toHaveLength(1);
  });
});

describe("creations", () => {
  beforeEach(async () => {
    await resetTables();
  });

  it("allows users to view owned creations", async () => {
    await adminClient.from("creations").insert({
      id: "dddddddd-aaaa-1111-1111-111111111111",
      name: "Private Creation",
      type: "RECIPE",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { data } = await userClient
      .from("creations")
      .select()
      .eq("owner_user_id", USER1_ID);

    expect(data).toHaveLength(1);
    expect(data![0].name).toBe("Private Creation");
  });

  it("prevents users from viewing other users' private creations", async () => {
    await adminClient.from("creations").insert({
      id: "dddddddd-aaaa-1111-1111-111111111111",
      name: "Other Private Creation",
      type: "MEAL",
      owner_user_id: USER2_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { data } = await userClient
      .from("creations")
      .select()
      .eq("id", "dddddddd-aaaa-1111-1111-111111111111");

    expect(data).toHaveLength(0);
  });

  it("allows admins to create public creations", async () => {
    await signIn(userClient, ADMIN_EMAIL);

    const { error } = await userClient.from("creations").insert({
      name: "Admin Creation",
      type: "MEAL",
      owner_user_id: ADMIN_ID,
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    expect(error).toBeNull();
  });

  it("allows users to create private creations", async () => {
    await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient.from("creations").insert({
      name: "My Creation",
      type: "RECIPE",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    expect(error).toBeNull();
  });
});

describe("ingredients", () => {
  beforeEach(async () => {
    await resetTables();
  });

  it("allows users to view ingredients of public creations", async () => {
    await adminClient.from("foods").insert({
      id: "11111111-2911-2111-2014-101181111121",
      name: "Ingredient Public Food",
      type: "GENERIC",
      owner_user_id: ADMIN_ID,
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("servings").insert({
      id: "11111111-2011-2111-2014-101181111121",
      owner_food_id: "11111111-2911-2111-2014-101181111121",
      serving_unit: "G",
      serving_size: 10,
      display_serving_unit: "g",
      display_serving_size: 10,
      calories: 10,
      carbs: 1,
      protein: 1,
      fat: 0.5,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("creations").insert({
      id: "11111111-2911-2111-2614-111111111121",
      owner_user_id: ADMIN_ID,
      name: "Public Creation For Ingredient",
      type: "MEAL",
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("ingredients").insert({
      id: "11111111-2911-2111-2014-101111111121",
      creation_id: "11111111-2911-2111-2614-111111111121",
      serving_id: "11111111-2011-2111-2014-101181111121",
      amount: 1,
      updated_at: new Date().toISOString(),
    });

    await signIn(userClient, USER1_EMAIL);

    const { data } = await userClient
      .from("ingredients")
      .select()
      .eq("creation_id", "11111111-2911-2111-2614-111111111121");

    expect(data).toHaveLength(1);
  });

  it("allows users to view ingredients of owned private creations", async () => {
    await adminClient.from("foods").insert({
      id: "11111111-2011-2111-2014-131181111121",
      name: "Private Ingredient Food",
      type: "GENERIC",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("servings").insert({
      id: "11111111-2011-2111-2014-131181191121",
      owner_food_id: "11111111-2011-2111-2014-131181111121",
      serving_unit: "G",
      serving_size: 20,
      display_serving_unit: "g",
      display_serving_size: 20,
      calories: 20,
      carbs: 2,
      protein: 2,
      fat: 1,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("creations").insert({
      id: "11111111-2911-2111-2014-111111111121",
      name: "Private Creation For Ingredient",
      type: "RECIPE",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("ingredients").insert({
      id: "11111111-2091-2111-2014-131181191121",
      creation_id: "11111111-2911-2111-2014-111111111121",
      serving_id: "11111111-2011-2111-2014-131181191121",
      amount: 3,
      updated_at: new Date().toISOString(),
    });

    // await signIn(userClient, USER1_EMAIL);

    const { data } = await userClient
      .from("ingredients")
      .select()
      .eq("creation_id", "11111111-2911-2111-2014-111111111121");

    expect(data).toHaveLength(1);
  });

  it("allows admins to create ingredients of public creations", async () => {
    await adminClient.from("foods").insert({
      id: "11111111-1111-1111-1111-111111111112",
      name: "Admin Public Food",
      type: "GENERIC",
      owner_user_id: ADMIN_ID,
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    const { error: error1 } = await adminClient.from("servings").insert({
      id: "66666666-1111-1111-1111-111111111111",
      owner_food_id: "11111111-1111-1111-1111-111111111112",
      serving_unit: "G",
      serving_size: 30,
      display_serving_unit: "g",
      display_serving_size: 30,
      calories: 30,
      carbs: 3,
      protein: 3,
      fat: 1.5,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("creations").insert({
      id: "11111111-1111-1111-1111-111111111111",
      name: "Admin Public Creation",
      type: "MEAL",
      owner_user_id: ADMIN_ID,
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await signIn(userClient, ADMIN_EMAIL);

    const { error } = await userClient.from("ingredients").insert({
      creation_id: "11111111-1111-1111-1111-111111111111",
      serving_id: "66666666-1111-1111-1111-111111111111",
      amount: 4,
      updated_at: new Date().toISOString(),
    });

    expect(error).toBeNull();
  });

  it("allows users to create ingredients of owned private creations", async () => {
    await adminClient.from("foods").insert({
      id: "11111111-1111-1111-1111-111111111113",
      name: "User Private Food For Ingredient",
      type: "GENERIC",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("servings").insert({
      id: "11111111-1111-1111-1111-111111111111",
      owner_food_id: "11111111-1111-1111-1111-111111111113",
      serving_unit: "G",
      serving_size: 40,
      display_serving_unit: "g",
      display_serving_size: 40,
      calories: 40,
      carbs: 4,
      protein: 4,
      fat: 2,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("creations").insert({
      id: "77777777-1111-1111-1111-111111111111",
      name: "User Private Creation For Ingredient",
      type: "RECIPE",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient.from("ingredients").insert({
      creation_id: "77777777-1111-1111-1111-111111111111",
      serving_id: "11111111-1111-1111-1111-111111111111",
      amount: 5,
      updated_at: new Date().toISOString(),
    });

    expect(error).toBeNull();
  });

  it("allows users to update ingredients of owned private creations", async () => {
    await adminClient.from("foods").insert({
      id: "11111111-1111-1111-1111-111111111114",
      name: "User Private Food For Ingredient Update",
      type: "GENERIC",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("servings").insert({
      id: "11111111-1111-1111-1111-111111111117",
      owner_food_id: "11111111-1111-1111-1111-111111111114",
      serving_unit: "G",
      serving_size: 50,
      display_serving_unit: "g",
      display_serving_size: 50,
      calories: 50,
      carbs: 5,
      protein: 5,
      fat: 2.5,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("creations").insert({
      id: "11111111-1111-1111-1111-111111111116",
      name: "User Private Creation For Ingredient Update",
      type: "MEAL",
      owner_user_id: USER1_ID,
      is_public: false,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("ingredients").insert({
      id: "55555555-1111-1111-1111-111111111111",
      creation_id: "11111111-1111-1111-1111-111111111116",
      serving_id: "11111111-1111-1111-1111-111111111117",
      amount: 6,
      updated_at: new Date().toISOString(),
    });

    await signIn(userClient, USER1_EMAIL);

    const { error } = await userClient
      .from("ingredients")
      .update({ amount: 7 })
      .eq("id", "55555555-1111-1111-1111-111111111111");

    expect(error).toBeNull();
  });

  it("prevents users from updating ingredients of public creations", async () => {
    await adminClient.from("foods").insert({
      id: "11111111-1111-1111-1111-111111111118",
      name: "Public Food For Ingredient Protected",
      type: "GENERIC",
      owner_user_id: USER1_ID,
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("servings").insert({
      id: "11111111-1111-1111-1111-111111111119",
      owner_food_id: "11111111-1111-1111-1111-111111111118",
      serving_unit: "G",
      serving_size: 60,
      display_serving_unit: "g",
      display_serving_size: 60,
      calories: 60,
      carbs: 6,
      protein: 6,
      fat: 3,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("creations").insert({
      id: "11111111-1111-1111-1111-111111111121",
      name: "Public Creation For Ingredient Protected",
      type: "RECIPE",
      owner_user_id: ADMIN_ID,
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("ingredients").insert({
      id: "11111111-1111-2111-1111-111111111121",
      creation_id: "11111111-1111-1111-1111-111111111121",
      serving_id: "11111111-1111-1111-1111-111111111119",
      amount: 9,
      updated_at: new Date().toISOString(),
    });

    await signIn(userClient, USER1_EMAIL);

    await userClient
      .from("ingredients")
      .update({ amount: 10 })
      .eq("id", "11111111-1111-2111-1111-111111111121");

    const { data } = await adminClient
      .from("ingredients")
      .select()
      .eq("id", "11111111-1111-2111-1111-111111111121");

    expect(data![0].amount).toBe(9);
  });

  it("prevents users from deleting ingredients of public creations", async () => {
    await adminClient.from("foods").insert({
      id: "11111111-1111-2111-2111-111111111121",
      name: "Public Food For Ingredient Delete",
      type: "GENERIC",
      owner_user_id: ADMIN_ID,
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("servings").insert({
      id: "11111111-2111-2111-2111-111111111121",
      owner_food_id: "11111111-1111-2111-2111-111111111121",
      serving_unit: "G",
      serving_size: 70,
      display_serving_unit: "g",
      display_serving_size: 70,
      calories: 70,
      carbs: 7,
      protein: 7,
      fat: 3.5,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("creations").insert({
      id: "11111111-2111-2111-2114-111111111121",
      name: "Public Creation For Ingredient Delete",
      type: "MEAL",
      owner_user_id: ADMIN_ID,
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    await adminClient.from("ingredients").insert({
      id: "11111111-2111-2111-2614-111111111121",
      creation_id: "11111111-2111-2111-2114-111111111121",
      serving_id: "11111111-2111-2111-2111-111111111121",
      amount: 11,
      updated_at: new Date().toISOString(),
    });

    await signIn(userClient, USER1_EMAIL);

    await userClient
      .from("ingredients")
      .delete()
      .eq("id", "11111111-2111-2111-2614-111111111121");

    const { data } = await adminClient
      .from("ingredients")
      .select()
      .eq("id", "11111111-2111-2111-2614-111111111121");

    expect(data).toHaveLength(1);
  });
});
