CREATE OR REPLACE FUNCTION search_foods_personal(
  user_id uuid, 
  query text, 
  limit_count int, 
  offset_count int
)
RETURNS TABLE (
  id uuid,
  name text,
  brand_name text,
  is_public boolean,
  owner_user_id uuid,
  rank real
)
SET search_path = public
LANGUAGE sql
STABLE
AS $$
SELECT
  f.id,
  f.name,
  f.brand_name,
  f.is_public,
  f.owner_user_id,
  ts_rank(f.search_vector, websearch_to_tsquery('simple', query)) AS rank
FROM foods f
WHERE
  -- existing food
  f.deleted_at IS NULL
  
  AND (
      -- owned private foods
    (f.owner_user_id = user_id AND f.is_public = FALSE)
    -- favourited public foods
    OR (f.is_public = TRUE AND 
        EXISTS( SELECT 1 FROM favourite_foods ff
          WHERE ff.food_id = f.id AND ff.user_id = user_id)
    )
  )
    
  -- match query
  AND (
    f.search_vector @@ websearch_to_tsquery('simple', query)
    OR f.name ILIKE '%' || query || '%'
    OR f.brand_name ILIKE '%' || query || '%'
  )
ORDER BY rank DESC
LIMIT limit_count
OFFSET offset_count
$$;

CREATE OR REPLACE FUNCTION count_foods_personal(
  user_id uuid, 
  query text
)
RETURNS int
SET search_path = public
LANGUAGE sql
STABLE
AS $$
SELECT count(*)
FROM foods f
WHERE
  -- existing food
  f.deleted_at IS NULL
  
  AND (
      -- owned private foods
    (f.owner_user_id = user_id AND f.is_public = FALSE)
    -- favourited public foods
    OR (f.is_public = TRUE AND 
        EXISTS( SELECT 1 FROM favourite_foods ff
          WHERE ff.food_id = f.id AND ff.user_id = user_id)
    )
  )
    
  -- match query
  AND (
    f.search_vector @@ websearch_to_tsquery('simple', query)
    OR f.name ILIKE '%' || query || '%'
    OR f.brand_name ILIKE '%' || query || '%'
  )
$$;





