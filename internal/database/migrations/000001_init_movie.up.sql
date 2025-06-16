CREATE TABLE IF NOT EXISTs movies (
   id BIGSERIAL PRIMARY KEY,
   title TEXT NOT NULL,
   description TEXT NOT NULL,
   genre TEXT NOT NULL,
   start_date TIMESTAMP NOT NULL,
   end_date TIMESTAMP NOT NULL,
   languages JSONB NOT NULL,
   status TEXT NOT NULL,
   movie_url TEXT NOT NULL,
   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
   deleted_at TIMESTAMP
);


