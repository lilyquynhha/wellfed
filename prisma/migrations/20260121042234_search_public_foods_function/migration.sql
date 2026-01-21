CREATE OR REPLACE FUNCTION search_foods_public(query text, limit_count int, offset_count int)
  RETURNS TABLE(
    id uuid,
    name text,
    brand_name text,
    rank real)
  LANGUAGE sql
  STABLE
  AS $$
  SELECT
    id,
    name,
    brand_name,
    ts_rank(search_vector, websearch_to_tsquery('simple', query)) AS rank
  FROM
    foods
  WHERE
    is_public = TRUE
    AND(search_vector @@ websearch_to_tsquery('simple', query)
      OR name ILIKE '%' || query || '%'
      OR brand_name ILIKE '%' || query || '%')
  ORDER BY
    rank DESC
  LIMIT limit_count OFFSET offset_count;
$$;

CREATE OR REPLACE FUNCTION count_foods_public(query text)
  RETURNS int
  LANGUAGE sql
  STABLE
  AS $$
  SELECT
    count(*)
  FROM
    foods
  WHERE
    is_public = TRUE
    AND(search_vector @@ websearch_to_tsquery('simple', query)
      OR name ILIKE '%' || query || '%'
      OR brand_name ILIKE '%' || query || '%');
$$;

