package controllers

import (
	"encoding/json"

	"io"

	"strings"

	"go-auth/models"

	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"
	
)


func AddMovie(c *gin.Context) {
	// Here this struct gets mapped to model but json validates the tpes coming from frontend

	type Language struct {
		Name string `json:"name"`
		Code string `json:"code"`
	}

	var input struct {
	
		Movie       string     `json:"movie"`
		Description string     `json:"description"`
		Genre       string     `json:"genre"`
		StartDate   string     `json:"startDate"`
		EndDate     string     `json:"endDate"`
		Language    []Language `json:"language"`
		Status      string     `json:"status"`
		File        string     `json:"file"`
		Duration    int        `json:"duration"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	// if already existed
	var existingMovie models.Movie
	val1 := strings.ToLower(existingMovie.Title)
	val2 := strings.ToLower(input.Movie)
	if val1 == val2 {
		c.JSON(400, gin.H{"error": "movie already existed!"})
		return
	}

	languagebytes, err := json.Marshal(input.Language)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to marshal language"})
		return
	}

	// parsing into time format  , here we need to pass this reference time else it would give error

	layout := "2006-01-02"
	parsedStartDate, err := time.Parse(layout, input.StartDate)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid StartDate format" + err.Error()})
		return
	}

	parsedEndDate, err := time.Parse(layout, input.EndDate)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid EndDate format" + err.Error()})
		return
	}

	movie := models.Movie{
		
		Title:       input.Movie,
		Description: input.Description,
		Genre:       input.Genre,
		StartDate:   parsedStartDate,
		EndDate:     parsedEndDate,
		Languages:   datatypes.JSON(languagebytes),
		Status:      input.Status,
		MovieURL:    input.File,
		Duration:    input.Duration,
	}

	if err := models.DB.Create(&movie).Error; err != nil {
		c.JSON(500, gin.H{"error": "failed to create movie"})
		return
	}

	c.JSON(200, gin.H{"message": "movie added", "movie": movie})

}



func DeleteMovie(c *gin.Context) {

	// for reading raw data we use io.read all
	data, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(400, gin.H{"message": "Failed to read request body"})
		return
	}

	// convert to base64
	// For ParseInt, the 0 means infer the base from the string. 64 requires that the result fit in 64 bits.
	id, err := strconv.ParseInt(string(data), 0, 64)
	if err != nil {
		c.JSON(400, gin.H{"message": "Error in parsing"})
		return
	}

	// Fetch movie
	var movie models.Movie
	if err := models.DB.First(&movie, id).Error; err != nil {
		c.JSON(400, gin.H{"message": "Data with id doesn't exist"})
		return
	}

	// Delete movie
	models.DB.Delete(&movie)
	models.DB.Where("movie_id = ?",movie.ID).Delete(&models.Showtime{})
	models.DB.Where("movie_id = ?",movie.ID).Delete(&models.Review{})

	c.JSON(200, gin.H{"message": "succesfully deleted", "id": id})

}



func UpdateMovie(c *gin.Context) {

	var input struct {
		ID         uint            `json:"id"`
		Movie       string          `json:"movie"`
		Description string          `json:"description"`
		Genre       string          `json:"genre"`
		StartDate   string          `json:"startDate"`
		EndDate     string          `json:"endDate"`
		Language    json.RawMessage `json:"language"`
		Status      string          `json:"status"`
		File        string          `json:"file"`
		Duration    int             `json:"duration"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}
	
	// parsing into time format  , here we need to pass this reference time else it would give error

	layout := "2006-01-02"
	parsedStartDate, err := time.Parse(layout, input.StartDate)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid StartDate format" + err.Error()})
		return
	}

	parsedEndDate, err := time.Parse(layout, input.EndDate)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid EndDate format" + err.Error()})
		return
	}

	update := models.Movie{
		Title:       input.Movie,
		Description: input.Description,
		Genre:       input.Genre,
		StartDate:   parsedStartDate,
		EndDate:     parsedEndDate,
		Languages:   datatypes.JSON(input.Language),
		Status:      input.Status,
		MovieURL:    input.File,
		Duration:    input.Duration,
	}

	// model was not updating previously then i google this way
	if err := models.DB.Model(&models.Movie{}).Where("id =?", input.ID).Updates(update).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to update movie"})
		return
	}

	c.JSON(200, gin.H{"message": "movie updated", "movie": update})

}


func GetMovies(c *gin.Context) {
	var movies []models.Movie
	if err := models.DB.Find(&movies).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch movies"})
		return
	}

	c.JSON(200, movies)

}



func GetMovieByName(c *gin.Context) {
	moviename := c.Query("moviename")
	var movie []models.Movie
	if moviename != "" {
		if err := models.DB.Where("title = ?", moviename).Find(&movie).Error; err != nil {
			c.JSON(400, gin.H{"message": "Failed to fetch moviename"})
			return
		}
	}
	c.JSON(200, gin.H{"movie": movie})
}

func GetMovieById(c *gin.Context) {
	movieId := c.Query("movieId")
	var movie []models.Movie

	if err := models.DB.Where("id = ?", movieId).Find(&movie).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch moviename"})
		return
	}

	c.JSON(200, gin.H{"movie": movie})
}
