CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,

    amount DOUBLE PRECISION NOT NULL,
    transaction_id TEXT NOT NULL,
    ticket JSONB NOT NULL,
    status TEXT NOT NULL,

    user_id INTEGER NOT NULL,
    movie_id BIGINT NOT NULL,

    CONSTRAINT fk_transaction_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_transaction_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);