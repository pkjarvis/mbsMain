package database

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
)

var Rdb *redis.Client
var Ctx = context.Background()

func InitRedis() {
	Rdb = redis.NewClient(&redis.Options{
		Addr: "localhost:6379", // Change to "redis:6379" if using Docker
		// Password: "",         // Set if Redis has auth
		DB: 0,
	})

	// Ping to test connection
	if _, err := Rdb.Ping(Ctx).Result(); err != nil {
		panic(fmt.Sprintf("Failed to connect to Redis: %v", err))
	}
}
