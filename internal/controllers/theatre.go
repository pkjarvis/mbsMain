package controllers

import (
	"io"
	"fmt"
	"strings"

	"go-auth/models"
	
	"strconv"
	
	"github.com/gin-gonic/gin"


)



// func AddTheatre(c *gin.Context) {

// 	var input struct {
// 		Theatre      string `json:"theatrename"`
// 		Address      string `json:"address"`
// 		CityName     string `json:"cityName"`
// 		StateName    string `json:"stateName"`
// 		Status       string `json:"status"`
// 		TotalScreens string `json:"totalscreens"`
// 		TheatreURL   string `json:"theatrefile"`
// 		// Value        []string `json:"value"`
// 	}

// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(400, gin.H{"error": err.Error()})
// 		return
// 	}

// 	totalScreensInt, err := strconv.Atoi(input.TotalScreens)
// 	if err != nil {
// 		c.JSON(400, gin.H{"error": "Invalid TotalScreensInt"})
// 		return
// 	}

// 	// valuebytes, err := json.Marshal(input.Value)

// 	// if err != nil {
// 	// 	c.JSON(500, gin.H{"error": "failed to marshal value"})
// 	// 	return
// 	// }

// 	var existingTheatre models.Theatre
// 	val1 := strings.ToLower(existingTheatre.TheatreName)
// 	val2 := strings.ToLower(input.Theatre)

// 	if val1 == val2 {
// 		c.JSON(400, gin.H{"error": "theatre already existed!"})
// 		return
// 	}

// 	theatre := models.Theatre{
// 		TheatreName:  input.Theatre,
// 		Address:      input.Address,
// 		CityName:     input.CityName,
// 		StateName:    input.StateName,
// 		Status:       input.Status,
// 		TotalScreens: uint(totalScreensInt),
// 		TheatreURL:   input.TheatreURL,
// 		// Value:        valuebytes,
// 	}

// 	if err := models.DB.Create(&theatre).Error; err != nil {
// 		c.JSON(500, gin.H{"error": "failed to create theatre"})
// 		return
// 	}
// 	c.JSON(200, gin.H{"message": "theatre added", "theatre": theatre})

// }

func AddTheatre(c *gin.Context) {
	var input struct {
		Theatre      string `json:"theatrename"`
		Address      string `json:"address"`
		CityName     string `json:"cityName"`
		StateName    string `json:"stateName"`
		Status       string `json:"status"`
		TotalScreens string `json:"totalscreens"`
		TheatreURL   string `json:"theatrefile"`
		RowCount     int    `json:"rowCount"`
		ColCount     int    `json:"colCount"`
		SeatPrice    int    `json:"seatPrice"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Limit row and column count
	if input.RowCount > 10 || input.ColCount > 15 {
		c.JSON(400, gin.H{"error": "Max 10 rows and 15 columns allowed"})
		return
	}

	totalScreensInt, err := strconv.Atoi(input.TotalScreens)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid TotalScreens value"})
		return
	}

	// Check for duplicate theatre name
	var existingTheatre models.Theatre
	if err := models.DB.Where("LOWER(theatre_name) = ?", strings.ToLower(input.Theatre)).First(&existingTheatre).Error; err == nil {
		c.JSON(400, gin.H{"error": "Theatre already exists"})
		return
	}

	// Create theatre record
	theatre := models.Theatre{
		TheatreName:  input.Theatre,
		Address:      input.Address,
		CityName:     input.CityName,
		StateName:    input.StateName,
		Status:       input.Status,
		TotalScreens: uint(totalScreensInt),
		TheatreURL:   input.TheatreURL,
	}

	if err := models.DB.Create(&theatre).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create theatre"})
		return
	}

	// Seat creation logic
	letters := []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
	if input.RowCount > len(letters) {
		c.JSON(400, gin.H{"error": "Row count exceeds supported range"})
		return
	}

	var seats []models.Seat
	for i := 0; i < input.RowCount; i++ {
		row := string(letters[i])

		// Calculate price by row segment
		var price int
		switch {
		case i < 4: // A-D
			price = input.SeatPrice
		case i < 8: // E-H
			price = input.SeatPrice + 50
		default: // I-J
			price = input.SeatPrice + 100
		}

		for j := 1; j <= input.ColCount; j++ {
			seats = append(seats, models.Seat{
				TheatreID: theatre.ID,
				Row:       row,
				Number:    j,
				Label:     fmt.Sprintf("%s%d", row, j),
				Price:     price,
				Status:    "available",
			})
		}
	}

	if err := models.DB.Create(&seats).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create seat layout"})
		return
	}

	c.JSON(200, gin.H{
		"message": "Theatre added with seat layout",
		"theatre": theatre,
		"rowCount":input.RowCount,
		"colCount":input.ColCount,
		"seatPrice":input.SeatPrice,
	})
	
}




func DeleteTheatre(c *gin.Context) {
	data, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(400, gin.H{"message": "Invalid theatre body"})
		return
	}
	fmt.Println("Data is:", data)

	id, err := strconv.ParseInt(string(data), 0, 64)
	if err != nil {
		c.JSON(400, gin.H{"message": "Parsing error"})
		return
	}

	fmt.Print("Parsed id is", id)

	var theatre models.Theatre
	if err := models.DB.First(&theatre, id).Error; err != nil {
		c.JSON(400, gin.H{"message": "Data doesn't exist"})
		return
	}

	// models.DB.Delete(&theatre)
	// models.DB.Where("theatre_id = ?",theatre.ID).Delete(&models.Showtime{})

	
	// Soft delete the theatre
	if err := models.DB.Delete(&theatre).Error; err != nil {
		c.JSON(500, gin.H{"message": "Failed to delete theatre"})
		return
	}

	// Soft delete associated showtimes
	if err := models.DB.Where("theatre_id = ?", theatre.ID).Delete(&models.Showtime{}).Error; err != nil {
		c.JSON(500, gin.H{"message": "Failed to delete showtimes"})
		return
	}

	// Soft delete associated seats
	if err := models.DB.Where("theatre_id = ?", theatre.ID).Delete(&models.Seat{}).Error; err != nil {
		c.JSON(500, gin.H{"message": "Failed to delete seats"})
		return
	}


	c.JSON(200, gin.H{"message": "successfully deleted theatre", "id": id})

}



// func UpdateTheatre(c *gin.Context) {

// 	var input struct {
// 		ID           uint   `json:"id"`
// 		Address      string `json:"address"`
// 		CityName     string `json:"cityName"`
// 		StateName    string `json:"stateName"`
// 		Status       string `json:"status"`
// 		TheatreName  string `json:"theatrename"`
// 		TheatreFile  string `json:"theatrefile"`
// 		TotalScreens uint   `json:"totalscreens"`
// 		// Value        json.RawMessage `json:"value"`
// 	}

// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(400, gin.H{"message": err.Error()})
// 		return
// 	}

// 	update := models.Theatre{
		
// 		Address:      input.Address,
// 		CityName:     input.CityName,
// 		StateName:    input.StateName,
// 		Status:       input.Status,
// 		TheatreURL:   input.TheatreFile,
// 		TotalScreens: input.TotalScreens,
// 		// Value:        datatypes.JSON(input.Value),
// 		TheatreName: input.TheatreName,
// 	}

// 	if err := models.DB.Model(&models.Theatre{}).Where("id =?", input.ID).Updates(update).Error; err != nil {
// 		c.JSON(400, gin.H{"message": "Updates Failed"})
// 		return
// 	}

// 	c.JSON(200, gin.H{"message": "Theatre Updated Successfully!", "theatre": update})

// }


func UpdateTheatre(c *gin.Context) {
	var input struct {
		ID           uint   `json:"id"`
		Address      string `json:"address"`
		CityName     string `json:"cityName"`
		StateName    string `json:"stateName"`
		Status       string `json:"status"`
		TheatreName  string `json:"theatrename"`
		TheatreFile  string `json:"theatrefile"`
		TotalScreens uint   `json:"totalscreens"`
		RowCount     int    `json:"rowCount"`
		ColCount     int    `json:"colCount"`
		SeatPrice    int    `json:"seatPrice"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"message": err.Error()})
		return
	}

	// Update theatre metadata
	update := models.Theatre{
		Address:      input.Address,
		CityName:     input.CityName,
		StateName:    input.StateName,
		Status:       input.Status,
		TheatreURL:   input.TheatreFile,
		TotalScreens: input.TotalScreens,
		TheatreName:  input.TheatreName,
	}

	if err := models.DB.Model(&models.Theatre{}).Where("id = ?", input.ID).Updates(update).Error; err != nil {
		c.JSON(400, gin.H{"message": "Theatre update failed"})
		return
	}

	// --- Seat layout regeneration ---
	if input.RowCount > 0 && input.ColCount > 0 && input.SeatPrice > 0 {
		letters := []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
		if input.RowCount > len(letters) {
			c.JSON(400, gin.H{"error": "Row count exceeds supported range"})
			return
		}

		// Delete old seats
		if err := models.DB.Where("theatre_id = ?", input.ID).Delete(&models.Seat{}).Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to delete old seat layout"})
			return
		}

		// Recreate seats
		var seats []models.Seat
		for i := 0; i < input.RowCount; i++ {
			row := string(letters[i])
			var price int
			switch {
			case i < 4:
				price = input.SeatPrice
			case i < 8:
				price = input.SeatPrice + 50
			default:
				price = input.SeatPrice + 100
			}
			for j := 1; j <= input.ColCount; j++ {
				seats = append(seats, models.Seat{
					TheatreID: input.ID,
					Row:       row,
					Number:    j,
					Label:     fmt.Sprintf("%s%d", row, j),
					Price:     price,
					Status:    "available",
				})
			}
		}

		if err := models.DB.Create(&seats).Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to regenerate seat layout"})
			return
		}
	}

	c.JSON(200, gin.H{"message": "Theatre updated successfully!"})
}



func GetTheatres(c *gin.Context) {
	var theatres []models.Theatre
	if err := models.DB.Find(&theatres).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch theatres"})
		return
	}
	c.JSON(200, theatres)
}


func UpdateSeatLayout(c *gin.Context) {
	var newLayout []models.Seat
	if err := c.ShouldBindJSON(&newLayout); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	if len(newLayout) == 0 {
		c.JSON(400, gin.H{"error": "Layout cannot be empty"})
		return
	}

	theatreId := newLayout[0].TheatreID

	// Delete old layout
	if err := models.DB.Where("theatre_id = ?", theatreId).Delete(&models.SeatLayout{}).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete old layout"})
		return
	}

	// Insert new layout
	if err := models.DB.Create(&newLayout).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to save new layout"})
		return
	}

	c.JSON(200, gin.H{"message": "Seat layout updated successfully"})
}




func GetTheatreByName(c *gin.Context) {
	theatreName := c.Query("theatrename")
	if theatreName == "" {
		c.JSON(400, gin.H{"error": "Theatre name is required"})
		return
	}

	var theatre []models.Theatre
	if err := models.DB.Where("theatre_name = ?", theatreName).Find(&theatre).Error; err != nil {
		c.JSON(400, gin.H{"error": "Failed to fetch theatre"})
		return
	}

	if len(theatre) == 0 {
		c.JSON(400, gin.H{"error": "Theatre not found"})
		return
	}

	c.JSON(200, gin.H{"theatre": theatre})
}