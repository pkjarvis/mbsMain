CREATE TABLE IF NOT EXISTS showtimes (
    id BIGSERIAL PRIMARY KEY,
   theatre_name TEXT NOT NULL,
   start_date TIMESTAMP NOT NULL,
   movie_name TEXT NOT NULL,
   time_array JSONB NOT NULL,
   language JSONB NOT NULL,
   archived BOOLEAN NOT NULL DEFAULT FALSE,
   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
   deleted_at TIMESTAMP
);
