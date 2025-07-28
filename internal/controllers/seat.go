
package controllers

import (
	"go-auth/models"
	"github.com/gin-gonic/gin"
	"go-auth/utils"
	"strconv"
)

func GetSeatLayout(c *gin.Context) {
	theatreIdStr := c.Query("theatreId")

	theatreIdUint64, err := strconv.ParseUint(theatreIdStr, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"message": "Invalid theatre ID"})
		return
	}
	theatreId := uint(theatreIdUint64)

	var seatLayouts []models.SeatLayout
	if err := models.DB.Where("theatre_id = ?", theatreId).Find(&seatLayouts).Error; err != nil {
		c.JSON(500, gin.H{"message": "Database error"})
		return
	}
	

	if len(seatLayouts) == 0 {
		// Insert default if none found
		defaults := utils.GetDefaultSeatLayout(theatreId)
		models.DB.Create(&defaults)
		seatLayouts = defaults
	}

	c.JSON(200, gin.H{"layout": seatLayouts})
}
