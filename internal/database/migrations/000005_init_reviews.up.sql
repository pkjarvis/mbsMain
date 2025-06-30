CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,

    movie_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    star INTEGER NOT NULL,
    text TEXT,
    username TEXT,

    CONSTRAINT fk_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);