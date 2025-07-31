
package controllers

import (
	"go-auth/models"
	"github.com/gin-gonic/gin"
	// "go-auth/utils"
	"strconv"
	"fmt"
	"strings"
	"go-auth/database"
)

func GetSeatLayout(c *gin.Context) {
	theatreIdStr := c.Query("theatreId")

	theatreIdUint64, err := strconv.ParseUint(theatreIdStr, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"message": "Invalid theatre ID"})
		return
	}
	theatreId := uint(theatreIdUint64)

	var seats []models.Seat
	if err := models.DB.Where("theatre_id = ?", theatreId).Find(&seats).Error; err != nil {
		c.JSON(500, gin.H{"message": "Database error"})
		return
	}
	

	// if len(seats) == 0 {
	// 	// Insert default if none found
	// 	defaults := utils.GetDefaultSeatLayout(theatreId)
	// 	models.DB.Create(&defaults)
	// 	seatLayouts = defaults
	// }

	c.JSON(200, gin.H{"layout": seats})
}

func GetSeatsByTheatre(c *gin.Context) {
	theatreIdStr := c.Query("theatreId")

	theatreIdUint64, err := strconv.ParseUint(theatreIdStr, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"message": "Invalid theatre ID"})
		return
	}
	theatreId := uint(theatreIdUint64)

	var seats []models.Seat
	if err := models.DB.Where("theatre_id = ?", theatreId).Find(&seats).Error; err != nil {
		c.JSON(500, gin.H{"message": "Database error"})
		return
	}

	if len(seats) == 0 {
		c.JSON(200, gin.H{"message": "No seats found", "seats": []models.Seat{}})
		return
	}

	c.JSON(200, gin.H{"seats": seats})
}




// GET /locked-seats?showId=abc123
func GetLockedSeats(c *gin.Context) {
	showID := c.Query("showId")
	if showID == "" {
		c.JSON(400, gin.H{"error": "Missing showId"})
		return
	}

	// Redis key pattern: lock:showID:seatID
	pattern := fmt.Sprintf("lock:%s:*", showID)

	// Fetch keys
	keys, err := database.Rdb.Keys(database.Ctx, pattern).Result()
	if err != nil {
		fmt.Println("Redis KEYS error:", err)
		c.JSON(400, gin.H{"error": "Failed to fetch locked seats"})
		return
	}

	// Extract seatIDs from key format: lock:<showID>:<seatID>
	var seatIDs []string
	for _, key := range keys {
		parts := strings.Split(key, ":")
		if len(parts) == 3 {
			seatIDs = append(seatIDs, parts[2])
		}
	}

	c.JSON(200, gin.H{
		"locked": seatIDs,
	})
}
