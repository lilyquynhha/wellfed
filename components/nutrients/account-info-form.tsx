"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import {
  spNutrient,
  spProfile,
  spTrackedNutrient,
} from "@/lib/supabase/database-types";
import { Input } from "../ui/input";
import { isUsernameUnique } from "@/lib/actions/profile/profile-crud";
import { User } from "@supabase/supabase-js";
import { Spinner } from "../ui/spinner";
import { updateAccount } from "@/lib/actions/account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function AccountInfoForm({
  nutrients,
  profile,
  trackedNutrients,
  redirect,
}: {
  nutrients: spNutrient[];
  profile?: spProfile;
  trackedNutrients?: spTrackedNutrient[];
  redirect?: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  type UsernameState = {
    username: string;
    isUnique: boolean;
  };

  const [username, setUsername] = useState<UsernameState>({
    username: profile?.username ?? "",
    isUnique: false,
  });
  const [isValidating, setIsValidating] = useState(false);
  const [updatedTracked, setUpdatedTracked] = useState<spTrackedNutrient[]>(
    trackedNutrients ?? [],
  );

  const insertActionFunc = updateAccount.bind(null, nutrients, supabase);
  const [insertState, insertAction, isInserting] = useActionState(
    insertActionFunc,
    {
      insertedData: updatedTracked,
      message: "",
    },
  );
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    setUsername({
      username: profile?.username ?? "",
      isUnique: false,
    });
    setUpdatedTracked(trackedNutrients ?? []);
  }, []);

  useEffect(() => {
    if (!username.username) return;

    async function validateUsername() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (await isUsernameUnique(user as User, username.username)) {
        setUsername((prev) => ({ ...prev, isUnique: true }));
      } else {
        setUsername((prev) => ({ ...prev, isUnique: false }));
      }

      setIsValidating(false);
    }

    setIsValidating(true);
    const timer = setTimeout(validateUsername, 1000);

    return () => clearTimeout(timer);
  }, [username.username]);

  useEffect(() => {
    if (insertState.message != lastUpdate) {
      toast.success("Account updated successfully!", {
        position: "top-center",
      });
      setLastUpdate(insertState.message);
      setUpdatedTracked(insertState.insertedData);
      if (redirect) router.push(redirect);
    }
  }, [insertState.insertedData]);
  return (
    <div>
      {nutrients && (
        <form action={insertAction}>
          <Field className="flex flex-row flex-wrap items-center mb-2">
            <FieldLabel className="max-w-fit">Username:</FieldLabel>
            <Input
              value={username.username}
              onChange={(e) =>
                setUsername((prev) => ({ ...prev, username: e.target.value }))
              }
              id="username"
              name="username"
              className="max-w-52"
              type="text"
              required
            />
            {username.username && isValidating && (
              <Spinner className="max-w-fit" />
            )}
            {username.username &&
              !isValidating &&
              (username.isUnique ? (
                <p className="text-sm text-green-500 max-w-fit">Valid</p>
              ) : (
                <p className="text-sm text-red-500 max-w-fit">
                  Username already exists.
                </p>
              ))}
          </Field>
          <FieldSet>
            <FieldLegend variant="label" className="mb-1">
              Choose nutrients to track:
            </FieldLegend>
            <FieldDescription>
              Select nutrients you want to highlight when viewing your
              foods/creations details.
            </FieldDescription>
            <FieldGroup
              className="grid grid-cols-3 md:grid-cols-4 gap-4"
              key={updatedTracked.toString()}
            >
              {nutrients.map((n) => (
                <Field key={n.id} orientation="horizontal">
                  <Checkbox
                    id={`${n.id}`}
                    name={`${n.id}`}
                    defaultChecked={
                      n.serving_name == "calories" ||
                      n.serving_name == "carbs" ||
                      n.serving_name == "protein" ||
                      n.serving_name == "fat" ||
                      updatedTracked?.find((tn) => tn.nutrient_id == n.id)
                        ? true
                        : false
                    }
                    disabled={
                      n.serving_name == "calories" ||
                      n.serving_name == "carbs" ||
                      n.serving_name == "protein" ||
                      n.serving_name == "fat"
                        ? true
                        : false
                    }
                  />
                  <FieldLabel>{n.name}</FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>
          <Button
            type="submit"
            disabled={
              isInserting ||
              isValidating ||
              !username.username ||
              (!isValidating && !username.isUnique)
            }
            className="w-full mt-4"
          >
            Update
          </Button>
        </form>
      )}
    </div>
  );
}
