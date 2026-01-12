-- Helper function to check if the current user is an admin user
CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS boolean
    LANGUAGE sql
    SET search_path = public
    AS $$
    SELECT
        EXISTS(
            SELECT
                1
            FROM
                profiles
            WHERE(
                SELECT
(
                        SELECT
                            auth.uid())) = id
                    AND is_admin = TRUE);
$$ STABLE;

ALTER TABLE public.nutrients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view nutrients." ON nutrients
    FOR SELECT TO authenticated, anon
        USING (TRUE);

CREATE POLICY "Only admins can create new nutrients." ON nutrients
    FOR INSERT TO authenticated
        WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete nutrients." ON nutrients
    FOR DELETE TO authenticated
        USING (public.is_admin());

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their profile only." ON profiles
    FOR SELECT TO authenticated
        USING ((
            SELECT
                auth.uid()) = id);

CREATE POLICY "Users can update their profile only." ON profiles
    FOR UPDATE TO authenticated
        USING ((
            SELECT
                auth.uid()) = id)
            WITH CHECK ((
                SELECT
                    (
                        SELECT
                            auth.uid())) = id);

ALTER TABLE public.tracked_nutrients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their tracked nutrients only." ON tracked_nutrients
    FOR SELECT TO authenticated
        USING ((
            SELECT
                auth.uid()) = tracked_nutrients.user_id);

CREATE POLICY "Users can create their tracked nutrients only." ON tracked_nutrients
    FOR INSERT TO authenticated
        WITH CHECK ((
            SELECT
                auth.uid()) = tracked_nutrients.user_id);

CREATE POLICY "Users can delete their tracked nutrients only." ON tracked_nutrients
    FOR DELETE TO authenticated
        USING ((
            SELECT
                auth.uid()) = tracked_nutrients.user_id);

ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public foods or owned foods." ON foods
    FOR SELECT TO authenticated
        USING (is_public = TRUE
            OR (
                SELECT
                    (
                        SELECT
                            auth.uid())) = owner_user_id);

CREATE POLICY "Only admins can create public foods. Users can create their private foods only." ON foods
    FOR INSERT TO authenticated
        WITH CHECK ((public.is_admin() AND owner_user_id =(
            SELECT
                auth.uid()) AND is_public = TRUE)
                OR ((
                    SELECT
                        auth.uid()) = owner_user_id AND is_public = FALSE));

CREATE POLICY "Only admins can update public foods." ON foods
    FOR UPDATE TO authenticated
        USING (public.is_admin()
            AND is_public = TRUE)
            WITH CHECK (is_public = TRUE);

CREATE POLICY "Users can update their private foods only." ON foods
    FOR UPDATE TO authenticated
        USING ((
            SELECT
                auth.uid()) = owner_user_id
                AND is_public = FALSE)
            WITH CHECK ((
                SELECT
                    (
                        SELECT
                            auth.uid())) = owner_user_id
                            AND is_public = FALSE);

CREATE POLICY "Only admins can delete public foods. Users can delete their private foods only." ON foods
    FOR DELETE TO authenticated
        USING (((
            SELECT
                auth.uid()) = owner_user_id AND is_public = FALSE)
                OR (public.is_admin() AND is_public = TRUE));

ALTER TABLE public.favourite_foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their favourite foods only." ON favourite_foods
    FOR SELECT TO authenticated
        USING ((
            SELECT
                auth.uid()) = user_id);

CREATE POLICY "Users can add public foods to their favourite list only." ON favourite_foods
    FOR INSERT TO authenticated
        WITH CHECK ((
            SELECT
                auth.uid()) = user_id
                AND EXISTS (
                    SELECT
                        1
                    FROM
                        foods
                    WHERE
                        foods.id = favourite_foods.food_id AND foods.is_public = TRUE));

CREATE POLICY "Users can delete foods from their favourite list only." ON favourite_foods
    FOR DELETE TO authenticated
        USING ((
            SELECT
                auth.uid()) = user_id);

ALTER TABLE public.servings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view servings of public or owned foods." ON servings
    FOR SELECT
        USING (EXISTS (
            SELECT
                1
            FROM
                foods
            WHERE
                foods.id = servings.owner_food_id AND (foods.is_public = TRUE OR (
                    SELECT
                        (
                            SELECT
                                auth.uid())) = foods.owner_user_id)));

CREATE POLICY "Only admins can create servings of public foods. Users can create servings of their private foods only." ON servings
    FOR INSERT TO authenticated
        WITH CHECK ((public.is_admin() AND EXISTS (
            SELECT
                1
            FROM
                foods
            WHERE
                foods.id = servings.owner_food_id AND foods.is_public = TRUE))
                OR (EXISTS (
                    SELECT
                        1
                    FROM
                        foods
                    WHERE
                        foods.id = servings.owner_food_id AND (
                            SELECT
                                (
                                    SELECT
                                        auth.uid())) = foods.owner_user_id AND foods.is_public = FALSE)));

CREATE POLICY "Only admin can update servings of public foods." ON servings
    FOR UPDATE TO authenticated
        USING (public.is_admin()
            AND EXISTS (
                SELECT
                    1
                FROM
                    foods
                WHERE
                    foods.id = servings.owner_food_id AND foods.is_public = TRUE));

CREATE POLICY "Users can update servings of their private foods only." ON servings
    FOR UPDATE TO authenticated
        USING (EXISTS (
            SELECT
                1
            FROM
                foods
            WHERE
                foods.id = servings.owner_food_id AND (
                    SELECT
                        (
                            SELECT
                                auth.uid())) = foods.owner_user_id AND foods.is_public = FALSE));

CREATE POLICY "Only admins can delete servings of public foods. Users can delete servings of their private foods only." ON servings
    FOR DELETE TO authenticated
        USING ((public.is_admin() AND EXISTS (
            SELECT
                1
            FROM
                foods
            WHERE
                foods.id = servings.owner_food_id AND foods.is_public = TRUE))
                OR (EXISTS (
                    SELECT
                        1
                    FROM
                        foods
                    WHERE
                        foods.id = servings.owner_food_id AND (
                            SELECT
                                (
                                    SELECT
                                        auth.uid())) = foods.owner_user_id AND foods.is_public = FALSE)));

ALTER TABLE serving_cost_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their serving cost overrides only." ON serving_cost_overrides
    FOR SELECT TO authenticated
        USING ((
            SELECT
                auth.uid()) = user_id);

CREATE POLICY "Users can create their serving cost overrides of public or owned foods." ON serving_cost_overrides
    FOR INSERT TO authenticated
        WITH CHECK ((
            SELECT
                auth.uid()) = user_id
                AND EXISTS (
                    SELECT
                        1
                    FROM
                        servings s
                        JOIN foods f ON f.id = s.owner_food_id
                    WHERE
                        s.id = serving_cost_overrides.serving_id AND (f.is_public = TRUE OR (
                            SELECT
                                (
                                    SELECT
                                        auth.uid())) = f.owner_user_id)));

CREATE POLICY "Users can update their serving cost overrides of public or owned foods." ON serving_cost_overrides
    FOR UPDATE TO authenticated
        USING ((
            SELECT
                auth.uid()) = user_id)
            WITH CHECK ((
                SELECT
                    (
                        SELECT
                            auth.uid())) = user_id
                            AND EXISTS (
                                SELECT
                                    1
                                FROM
                                    servings s
                                    JOIN foods f ON f.id = s.owner_food_id
                                WHERE
                                    s.id = serving_cost_overrides.serving_id AND (f.is_public = TRUE OR (
                                        SELECT
                                            (
                                                SELECT
                                                    auth.uid())) = f.owner_user_id)));

CREATE POLICY "Users can delete their serving cost overrides only." ON serving_cost_overrides
    FOR DELETE TO authenticated
        USING ((
            SELECT
                auth.uid()) = user_id);

ALTER TABLE creations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public creations or owned creations." ON creations
    FOR SELECT
        USING (is_public = TRUE
            OR (
                SELECT
                    (
                        SELECT
                            auth.uid())) = owner_user_id);

CREATE POLICY "Only admins can create public creations. Users can create their private creations only." ON creations
    FOR INSERT TO authenticated
        WITH CHECK ((public.is_admin() AND (
            SELECT
                auth.uid()) = owner_user_id AND is_public = TRUE)
                OR ((
                    SELECT
                        auth.uid()) = owner_user_id AND is_public = FALSE));

CREATE POLICY "Only admins can update public creations." ON creations
    FOR UPDATE TO authenticated
        USING (public.is_admin()
            AND is_public = TRUE)
            WITH CHECK (is_public = TRUE);

CREATE POLICY "Users can update their private creations only." ON creations
    FOR UPDATE TO authenticated
        USING ((
            SELECT
                auth.uid()) = owner_user_id
                AND is_public = FALSE)
            WITH CHECK ((
                SELECT
                    (
                        SELECT
                            auth.uid())) = owner_user_id
                            AND is_public = FALSE);

CREATE POLICY "Only admins can delete public creations. Users can delete their private creations only." ON creations
    FOR DELETE TO authenticated
        USING ((public.is_admin() AND is_public = TRUE)
            OR ((
                SELECT
                    auth.uid()) = owner_user_id AND is_public = FALSE));

ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ingredients of public or owned creations." ON ingredients
    FOR SELECT
        USING (EXISTS (
            SELECT
                1
            FROM
                creations
            WHERE
                creations.id = ingredients.creation_id AND (creations.is_public = TRUE OR (
                    SELECT
                        (
                            SELECT
                                auth.uid())) = creations.owner_user_id)));

CREATE POLICY "Only admins can create ingredients of public creations. Users can create ingredients of their private creations only." ON ingredients
    FOR INSERT TO authenticated
        WITH CHECK ((public.is_admin() AND EXISTS (
            SELECT
                1
            FROM
                creations
            WHERE
                creations.id = ingredients.creation_id AND creations.is_public = TRUE))
                OR (EXISTS (
                    SELECT
                        1
                    FROM
                        creations
                    WHERE
                        creations.id = ingredients.creation_id AND (
                            SELECT
                                (
                                    SELECT
                                        auth.uid())) = creations.owner_user_id AND creations.is_public = FALSE)));

CREATE POLICY "Only admin can update ingredients of public creations." ON ingredients
    FOR UPDATE TO authenticated
        USING (public.is_admin()
            AND EXISTS (
                SELECT
                    1
                FROM
                    creations
                WHERE
                    creations.id = ingredients.creation_id AND creations.is_public = TRUE));

CREATE POLICY "Users can update ingredients of their private creations only." ON ingredients
    FOR UPDATE TO authenticated
        USING (EXISTS (
            SELECT
                1
            FROM
                creations
            WHERE
                creations.id = ingredients.creation_id AND (
                    SELECT
                        (
                            SELECT
                                auth.uid())) = creations.owner_user_id AND creations.is_public = FALSE));

CREATE POLICY "Only admins can delete ingredients of public creations. Users can delete ingredients of their private creations only." ON ingredients
    FOR DELETE TO authenticated
        USING ((public.is_admin() AND EXISTS (
            SELECT
                1
            FROM
                creations
            WHERE
                creations.id = ingredients.creation_id AND creations.is_public = TRUE))
                OR (EXISTS (
                    SELECT
                        1
                    FROM
                        creations
                    WHERE
                        creations.id = ingredients.creation_id AND (
                            SELECT
                                (
                                    SELECT
                                        auth.uid())) = creations.owner_user_id AND creations.is_public = FALSE)));

