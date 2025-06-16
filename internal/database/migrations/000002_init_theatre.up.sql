CREATE TABLE IF NOT EXISTS theatres (
  id BIGSERIAL PRIMARY KEY,
   theatre_name TEXT NOT NULL,
   address TEXT NOT NULL,
   city_name TEXT NOT NULL,
   state_name TEXT NOT NULL,
   status TEXT NOT NULL,
   total_screens INTEGER NOT NULL,
   theatre_url TEXT NOT NULL,
   value JSONB NOT NULL,
   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
   deleted_at TIMESTAMP
);
