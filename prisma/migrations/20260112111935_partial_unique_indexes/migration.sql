CREATE UNIQUE INDEX unique_public_foods ON foods(name, type, COALESCE(brand_name, ''))
WHERE
    is_public = TRUE AND deleted_at IS NULL;

CREATE UNIQUE INDEX unique_private_foods ON foods(owner_user_id, name, type, COALESCE(brand_name, ''))
WHERE
    is_public = FALSE AND deleted_at IS NULL;

CREATE UNIQUE INDEX unique_public_creations ON creations(name, type)
WHERE
    is_public = TRUE AND deleted_at IS NULL;

CREATE UNIQUE INDEX unique_private_creations ON creations(owner_user_id, name, type)
WHERE
    is_public = FALSE AND deleted_at IS NULL;

