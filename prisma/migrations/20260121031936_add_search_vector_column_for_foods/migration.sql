ALTER TABLE foods
ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector (
        'simple',
        coalesce(name, '') || ' ' || coalesce(brand_name, '')
    )
) STORED;

CREATE INDEX foods_search_idx ON foods USING GIN (search_vector);