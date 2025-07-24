package controllers

import (
	"io"
	"fmt"
	"strings"

	"go-auth/models"
	
	"strconv"
	
	"github.com/gin-gonic/gin"


)



func AddTheatre(c *gin.Context) {

	var input struct {
		Theatre      string `json:"theatrename"`
		Address      string `json:"address"`
		CityName     string `json:"cityName"`
		StateName    string `json:"stateName"`
		Status       string `json:"status"`
		TotalScreens string `json:"totalscreens"`
		TheatreURL   string `json:"theatrefile"`
		// Value        []string `json:"value"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	totalScreensInt, err := strconv.Atoi(input.TotalScreens)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid TotalScreensInt"})
		return
	}

	// valuebytes, err := json.Marshal(input.Value)

	// if err != nil {
	// 	c.JSON(500, gin.H{"error": "failed to marshal value"})
	// 	return
	// }

	var existingTheatre models.Theatre
	val1 := strings.ToLower(existingTheatre.TheatreName)
	val2 := strings.ToLower(input.Theatre)

	if val1 == val2 {
		c.JSON(400, gin.H{"error": "theatre already existed!"})
		return
	}

	theatre := models.Theatre{
		TheatreName:  input.Theatre,
		Address:      input.Address,
		CityName:     input.CityName,
		StateName:    input.StateName,
		Status:       input.Status,
		TotalScreens: uint(totalScreensInt),
		TheatreURL:   input.TheatreURL,
		// Value:        valuebytes,
	}

	if err := models.DB.Create(&theatre).Error; err != nil {
		c.JSON(500, gin.H{"error": "failed to create theatre"})
		return
	}
	c.JSON(200, gin.H{"message": "theatre added", "theatre": theatre})

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

	models.DB.Delete(&theatre)
	models.DB.Where("theatre_id = ?",theatre.ID).Delete(&models.Showtime{})

	c.JSON(200, gin.H{"message": "successfully deleted theatre", "id": id})

}



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
		// Value        json.RawMessage `json:"value"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"message": err.Error()})
		return
	}

	update := models.Theatre{
		
		Address:      input.Address,
		CityName:     input.CityName,
		StateName:    input.StateName,
		Status:       input.Status,
		TheatreURL:   input.TheatreFile,
		TotalScreens: input.TotalScreens,
		// Value:        datatypes.JSON(input.Value),
		TheatreName: input.TheatreName,
	}

	if err := models.DB.Model(&models.Theatre{}).Where("id =?", input.ID).Updates(update).Error; err != nil {
		c.JSON(400, gin.H{"message": "Updates Failed"})
		return
	}

	c.JSON(200, gin.H{"message": "Theatre Updated Successfully!", "theatre": update})

}



func GetTheatres(c *gin.Context) {
	var theatres []models.Theatre
	if err := models.DB.Find(&theatres).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch theatres"})
		return
	}
	c.JSON(200, theatres)
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