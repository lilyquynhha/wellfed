-- Clean up after profile deletion
CREATE OR REPLACE FUNCTION public.handle_profile_delete()
    RETURNS TRIGGER
    SET search_path = public
    AS $$
BEGIN
    DELETE FROM foods
    WHERE owner_user_id = OLD.id
        AND is_public = FALSE;
    UPDATE
        foods
    SET
        owner_user_id = NULL,
        deleted_at = now()
    WHERE
        owner_user_id = OLD.id
        AND is_public = TRUE;
    DELETE FROM creations
    WHERE owner_user_id = OLD.id
        AND is_public = FALSE;
    UPDATE
        creations
    SET
        owner_user_id = NULL,
        deleted_at = now()
    WHERE
        owner_user_id = OLD.id
        AND is_public = TRUE;
    RETURN old;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_profile_delete
    AFTER DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_profile_delete();

-- Prevent updating certain columns
CREATE OR REPLACE FUNCTION public.prevent_update_of_columns()
    RETURNS TRIGGER
    SET search_path = public
    AS $$
DECLARE
    col text;
BEGIN
    FOREACH col IN ARRAY TG_ARGV LOOP
        IF (to_jsonb(OLD) -> col) IS DISTINCT FROM (to_jsonb(NEW) -> col) THEN
            RAISE EXCEPTION 'Column "%" is immutable and cannot be updated.', col
                USING ERRCODE = '22000';
        END IF;
    END LOOP;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE TRIGGER check_nutrient_update
    BEFORE UPDATE ON nutrients
    FOR EACH ROW
    EXECUTE FUNCTION prevent_update_of_columns('id', 'name');

CREATE TRIGGER check_profile_update
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_update_of_columns('id', 'is_admin', 'created_at');

CREATE TRIGGER check_food_update
    BEFORE UPDATE ON foods
    FOR EACH ROW
    EXECUTE FUNCTION prevent_update_of_columns('id', 'created_at');

CREATE TRIGGER check_serving_update
    BEFORE UPDATE ON servings
    FOR EACH ROW
    EXECUTE FUNCTION prevent_update_of_columns('id', 'owner_food_id', 'created_at');

CREATE TRIGGER check_serving_cost_override_update
    BEFORE UPDATE ON serving_cost_overrides
    FOR EACH ROW
    EXECUTE FUNCTION prevent_update_of_columns('id', 'user_id', 'serving_id', 'created_at');

CREATE TRIGGER check_creation_update
    BEFORE UPDATE ON creations
    FOR EACH ROW
    EXECUTE FUNCTION prevent_update_of_columns('id', 'created_at');

CREATE TRIGGER check_ingredient_update
    BEFORE UPDATE ON ingredients
    FOR EACH ROW
    EXECUTE FUNCTION prevent_update_of_columns('id', 'creation_id', 'serving_id', 'created_at');

-- Ensure profiles reference auth users
CREATE OR REPLACE FUNCTION public.profile_references_auth_user_check()
    RETURNS TRIGGER
    SET search_path = public
    AS $$
BEGIN
    IF NOT EXISTS(
        SELECT
            1
        FROM
            auth.users
        WHERE
            id = NEW.id) THEN
    RAISE EXCEPTION 'Error: id % does not exist in auth.users', NEW.id
        USING ERRCODE = '23503';
END IF;
    RETURN new;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE TRIGGER check_profile_references_auth_user
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION profile_references_auth_user_check();

