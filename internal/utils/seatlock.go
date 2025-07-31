package utils

import (
	"fmt"
	"time"
	"go-auth/database"
	"github.com/redis/go-redis/v9" 
)

// Try to lock a seat for a show (temporary lock)
func LockSeat(showID, seatID, userID string, duration time.Duration) bool {
	key := fmt.Sprintf("lock:%s:%s", showID, seatID)

	ok, err := database.Rdb.SetNX(database.Ctx, key, userID, duration).Result()
	if err != nil {
		fmt.Println("Redis SETNX error:", err)
		return false
	}

	if ok {
		fmt.Printf("Seat locked: %s for user %s (expires in %v)\n", key, userID, duration)
	} else {
		fmt.Printf("Seat %s already locked by another user.\n", key)
	}
	return ok
}

// Remove lock (manually)
func UnlockSeat(showID, seatID, userID string) {
	key := fmt.Sprintf("lock:%s:%s", showID, seatID)

	val, err := database.Rdb.Get(database.Ctx, key).Result()
	if err == redis.Nil {
		// Key doesn't exist (already expired or never locked)
		return
	} else if err != nil {
		fmt.Println("Redis error while unlocking:", err)
		return
	}

	if val == userID {
		_, delErr := database.Rdb.Del(database.Ctx, key).Result()
		if delErr != nil {
			fmt.Println("Error deleting lock key:", delErr)
		} else {
			fmt.Println("Unlocked seat:", key)
		}
	} else {
		fmt.Println("Seat not locked by user. Skipping unlock.")
	}
}

// Check if seat is already locked
func IsSeatLocked(showID, seatID string) (bool, string) {
	key := fmt.Sprintf("lock:%s:%s", showID, seatID)
	val, err := database.Rdb.Get(database.Ctx, key).Result()

	if err == redis.Nil {
		// Key does not exist (expired or never set)
		return false, ""
	} else if err != nil {
		// Redis internal error
		fmt.Println("Redis GET error:", err)
		return false, ""
	}

	fmt.Printf("Seat %s is locked by user: %s\n", key, val)
	return true, val
}
