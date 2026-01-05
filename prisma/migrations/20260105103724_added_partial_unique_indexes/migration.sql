CREATE UNIQUE INDEX unique_public_foods ON foods (name, type, brand_name)
WHERE
    is_public = true
    AND deleted_at IS NULL;

CREATE UNIQUE INDEX unique_private_foods ON foods (owner_user_id, name, type, brand_name)
WHERE
    is_public = false
    AND deleted_at IS NULL;

CREATE UNIQUE INDEX unique_public_creations ON creations (name, type)
WHERE
    is_public = true
    AND deleted_at IS NULL;

CREATE UNIQUE INDEX unique_private_creations ON creations (owner_user_id, name, type)
WHERE
    is_public = false
    AND deleted_at IS NULL;