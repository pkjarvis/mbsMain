package utils

import (
	"log"
	"time"
	"go-auth/models"
)

func RunPendingTransactionCleanup() {
	ticker := time.NewTicker(10 * time.Minute)

	go func() {
		for {
			<-ticker.C
			err := models.DB.Exec(`
				DELETE FROM transactions
				WHERE status = 'pending' AND created_at < NOW() - INTERVAL '5 minutes'
			`).Error

			if err != nil {
				log.Println("Failed to clean up pending transactions:", err)
			} else {
				log.Println("Pending transactions cleaned up")
			}
		}
	}()
}