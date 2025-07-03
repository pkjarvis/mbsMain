include .env

create_migration:
	migrate create -ext=sql -dir=internal/database/migrations -seq init 
    
migrate_up:
	migrate -path=internal/database/migrations -database "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/golang_migrate?sslmode=disable" -verbose up 

migrate_down:
	migrate -path=internal/database/migrations -database "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/golang_migrate?sslmode=disable" -verbose down 

.PHONY: create_migration migrate_up migrate_down
