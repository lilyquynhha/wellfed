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

