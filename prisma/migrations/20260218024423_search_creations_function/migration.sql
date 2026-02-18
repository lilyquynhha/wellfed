ALTER TABLE creations
    ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (to_tsvector('simple', name)) STORED;

CREATE OR REPLACE FUNCTION search_creations(user_id uuid, creation_name text, creation_type text, limit_count int, offset_count int)
    RETURNS TABLE(
        id uuid,
        name text,
        type text,
        rank real)
    SET search_path = public
    LANGUAGE sql
    STABLE
    AS $$
    WITH search_query AS(
        SELECT
            websearch_to_tsquery('simple', creation_name) AS tsq
)
    SELECT
        c.id,
        c.name,
        c.type,
        ts_rank(c.search_vector, sq.tsq) AS rank
    FROM
        creations c,
        search_query sq
    WHERE
        -- existing creation
        deleted_at IS NULL
        AND
        -- owned creation
        c.owner_user_id = user_id
        AND
        --match creation name
        (c.search_vector @@ sq.tsq
            OR c.name ILIKE '%' || creation_name || '%')
        AND
        --match creation type
(creation_type IS NULL
            OR creation_type = ''
            OR c.type::text = creation_type)
    ORDER BY
        rank DESC
    LIMIT limit_count OFFSET offset_count
$$;

CREATE OR REPLACE FUNCTION count_creations(user_id uuid, creation_name text, creation_type text)
    RETURNS int
    SET search_path = public
    LANGUAGE sql
    STABLE
    AS $$
    WITH search_query AS(
        SELECT
            websearch_to_tsquery('simple', creation_name) AS tsq
)
    SELECT
        count(*)
    FROM
        creations c,
        search_query sq
    WHERE
        -- existing creation
        deleted_at IS NULL
        AND
        -- owned creation
        c.owner_user_id = user_id
        AND
        --match creation name
        (c.search_vector @@ sq.tsq
            OR c.name ILIKE '%' || creation_name || '%')
        AND
        --match creation type
(creation_type IS NULL
            OR creation_type = ''
            OR c.type::text = creation_type)
$$;

