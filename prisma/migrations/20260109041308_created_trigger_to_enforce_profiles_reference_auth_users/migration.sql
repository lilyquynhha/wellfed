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

