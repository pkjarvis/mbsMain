package controllers

import (
	// "io"
	"strings"
	"encoding/json"
	"go-auth/models"
	"time"
	// "strconv"
	"gorm.io/datatypes"
	"github.com/gin-gonic/gin"

)


func AddShowTime(c *gin.Context) {
	type Timearray struct {
		Val1 string `json:"val1"`
		Val2 string `json:"val2"`
	}

	type Language struct {
		Name string `json:"name"`
		Code string `json:"code"`
	}

	var input struct {
		
		TheatreName string      `json:"theatrename"`
		StartDate   string      `json:"startDate"`
		MovieName   string      `json:"moviename"`
		TimeArray   []Timearray `json:"timearray"`
		Language    Language    `json:"language"`
		Archived    bool        `json:"archived"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	languagebytes, err := json.Marshal(input.Language)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to marshal language"})
		return
	}

	timearraybytes, err := json.Marshal(input.TimeArray)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to marshal timearray"})
		return
	}

	// parsing into time format
	dateFormat := "2006-01-02"

	parsedStartDate, err := time.Parse(dateFormat, input.StartDate)

	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid StartDate format" + err.Error()})
		return
	}

	// Fetch Movie and Theatre IDs
	var movie models.Movie
	if err := models.DB.Where("title = ?", input.MovieName).First(&movie).Error; err != nil {
		c.JSON(404, gin.H{"error": "Movie not found"})
		return
	}

	var theatre models.Theatre
	if err := models.DB.Where("theatre_name = ?", input.TheatreName).First(&theatre).Error; err != nil {
		c.JSON(404, gin.H{"error": "Theatre not found"})
		return
	}

	val1 := strings.ToLower(movie.Title)
	val2 := strings.ToLower(theatre.TheatreName)

	var existingShowtime models.Showtime

	val3 := strings.ToLower(existingShowtime.TheatreName)
	val4 := strings.ToLower(existingShowtime.MovieName)

	if val1 == val3 && val2 == val4 {
		c.JSON(400, gin.H{"error": "showtime already existed!"})
		return
	}

	showtime := models.Showtime{
		
		TheatreName: input.TheatreName,
		StartDate:   parsedStartDate,
		MovieName:   input.MovieName,
		TimeArray:   timearraybytes,
		Language:    languagebytes,
		Archived:    input.Archived,
		MovieID:     movie.ID,
		TheatreID:   theatre.ID,
	}

	if err := models.DB.Create(&showtime).Error; err != nil {
		c.JSON(500, gin.H{"error": "failed to add showtime"})
		return
	}

	c.JSON(200, gin.H{"message": "showtime added", "showtime": showtime})

}


func ArchiveShowTime(c *gin.Context) {
	var reqBody struct {
		ID uint `json:"id"`
	}

	if err := c.BindJSON(&reqBody); err != nil {
		c.JSON(400, gin.H{"message": "Invalid JSON body"})
		return
	}

	var showtime models.Showtime
	if err := models.DB.First(&showtime, reqBody.ID).Error; err != nil {
		c.JSON(400, gin.H{"message": "Showtime not found in DB"})
		return
	}

	showtime.Archived = true
	if err := models.DB.Save(&showtime).Error; err != nil {
		c.JSON(500, gin.H{"message": "Failed to archive showtime"})
		return
	}

	c.JSON(200, gin.H{
		"message": "Successfully archived showtime",
		"id":      reqBody.ID,
	})

}




func UpdateShowTime(c *gin.Context) {
	var input struct {
		MovieName   string          `json:"moviename"`
		TheatreName string          `json:"theatrename"`
		Archived    bool            `json:"archived"`
		StartDate   string          `json:"startDate"`
		Language    json.RawMessage `json:"language"`
		TimeArray   json.RawMessage `json:"timearray"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"message": err.Error()})
		return
	}

	// Parse StartDate
	layout := "2006-01-02"
	parsedStartDate, err := time.Parse(layout, input.StartDate)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid StartDate format" + err.Error()})
		return
	}

	update := models.Showtime{
		
		MovieName:   input.MovieName,
		TheatreName: input.TheatreName,
		Archived:    input.Archived,
		StartDate:   parsedStartDate,
		Language:    datatypes.JSON(input.Language),
		TimeArray:   datatypes.JSON(input.TimeArray),
	}

	if err := models.DB.Model(&models.Showtime{}).Where("id =?", update.ID).Updates(update).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to update showtime"})
		return
	}

	c.JSON(200, gin.H{"message": "Successfully updated showtime", "showtime": update})

}




func GetShowTimes(c *gin.Context) {
	var showtime []models.Showtime
	if err := models.DB.Preload("Movie").Preload("Theatre").Find(&showtime).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch showtime"})
		return
	}
	c.JSON(200, showtime)
}



func GetShow(c *gin.Context) {
	movieId := c.Query("movieId")
	var showtime []models.Showtime
	if movieId != "" {
		if err := models.DB.Where("movie_id = ?", movieId).Preload("Movie").Preload("Theatre").Find(&showtime).Error; err != nil {
			c.JSON(400, gin.H{"message": "Failed to fetch showtime"})
			return
		}
	}

	dateSet := make(map[string]bool)
	for _, st := range showtime {
		dateOnly := st.StartDate.Format("2006-01-02") // Format as string date
		dateSet[dateOnly] = true
	}

	var bookedDates []string
	for date := range dateSet {
		bookedDates = append(bookedDates, date)
	}

	c.JSON(200, gin.H{"showtime": showtime, "bookedDates": bookedDates})
}


func GetShowTimeByID(c *gin.Context) {
	id := c.Param("id")
	var showtime models.Showtime

	if err := models.DB.Preload("Movie").Preload("Theatre").First(&showtime, id).Error; err != nil {
		c.JSON(400, gin.H{"error": "Showtime not found"})
		return
	}

	c.JSON(200, showtime)
	
}

