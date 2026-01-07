CREATE OR REPLACE FUNCTION handle_user_delete()
    RETURNS TRIGGER
    AS $$
BEGIN
    DELETE FROM foods
    WHERE owner_user_id = OLD.id
        AND is_public = FALSE;

    UPDATE foods
    SET
        owner_user_id = NULL,
        deleted_at = now()
    WHERE
        owner_user_id = OLD.id
        AND is_public = TRUE;

    DELETE FROM creations
    WHERE owner_user_id = OLD.id
        AND is_public = FALSE;

    UPDATE creations
    SET
        owner_user_id = NULL,
        deleted_at = now()
    WHERE
        owner_user_id = OLD.id
        AND is_public = TRUE;
        
    RETURN old;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_user_delete
    AFTER DELETE ON users FOR EACH ROW
    EXECUTE FUNCTION handle_user_delete();

