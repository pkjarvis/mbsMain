package controllers

import (
	"encoding/json"
	"fmt"
	"io"

	// "fmt"
	"go-auth/models"
	"go-auth/utils"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"

	"log"
)

func Login(c *gin.Context) {

	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var existingUser models.User

	models.DB.Where("email = ?", user.Email).First(&existingUser)

	if existingUser.ID == 0 {
		c.JSON(400, gin.H{"error": "user does not exist"})
		return
	}

	errHash := utils.CompareHashPassword(user.Password, existingUser.Password)

	if !errHash {
		c.JSON(400, gin.H{"error": "invalid password"})
		return
	}

	expirationTime := time.Now().Add(24 * 7 * time.Hour)

	claims := &models.Claims{
		Role: "admin",
		StandardClaims: jwt.StandardClaims{
			Subject:   existingUser.Email,
			ExpiresAt: expirationTime.Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	secret := (os.Getenv("SECRET"))
	if secret == "" {
		log.Fatal("SECRET env is empty")
	}

	tokenString, err := token.SignedString([]byte(secret))

	if err != nil {
		c.JSON(500, gin.H{"error": "could not generate token"})
		return
	}


	// SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
	c.SetCookie("token", tokenString, 7*24*60*60, "/", "localhost", false, true)

	fmt.Println("User",existingUser.Name)

	c.JSON(200, gin.H{
		"msg": "logged in ",
		"token": tokenString,
		"username":existingUser.Name,
	})

}

func Signup(c *gin.Context) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var existingUser models.User

	models.DB.Where("email = ?", user.Email).First(&existingUser)

	if existingUser.ID != 0 {
		c.JSON(400, gin.H{"error": "user already exists"})
		return
	}

	user.Role = "admin"

	var errHash error
	user.Password, errHash = utils.GenerateHashPassword(user.Password)

	if errHash != nil {
		c.JSON(500, gin.H{"error": "could not generate password hash"})
		return
	}

	models.DB.Create(&user)

	c.JSON(200, gin.H{"success": "user created"})
}

func Home(c *gin.Context) {

	cookie, err := c.Cookie("token")

	if err != nil {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}

	claims, err := utils.ParseToken(cookie)

	if err != nil {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}

	if claims.Role != "user" && claims.Role != "admin" {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}

	c.JSON(200, gin.H{"success": "home page", "role": claims.Role})
}

func Premium(c *gin.Context) {

	cookie, err := c.Cookie("token")

	if err != nil {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}

	claims, err := utils.ParseToken(cookie)

	if err != nil {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}

	if claims.Role != "admin" {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}

	c.JSON(200, gin.H{"success": "premium page", "role": claims.Role})
}

func Logout(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", "localhost", false, true)
	c.JSON(200, gin.H{"success": "user logged out"})
}

// Add Controller calls

func AddMovie(c *gin.Context) {
	// Here this struct gets mapped to model but json validates the tpes coming from frontend

	type Language struct {
		Name string `json:"name"`
		Code string `json:"code"`
	}

	var input struct {
		Id          uint       `json:"id"`
		Movie       string     `json:"movie"`
		Description string     `json:"description"`
		Genre       string     `json:"genre"`
		StartDate   string     `json:"startDate"`
		EndDate     string     `json:"endDate"`
		Language    []Language `json:"language"`
		Status      string     `json:"status"`
		File        string     `json:"file"`
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
		Id:          input.Id,
		Title:       input.Movie,
		Description: input.Description,
		Genre:       input.Genre,
		StartDate:   parsedStartDate,
		EndDate:     parsedEndDate,
		Languages:   datatypes.JSON(languagebytes),
		Status:      input.Status,
		MovieURL:    input.File,
	}

	if err := models.DB.Create(&movie).Error; err != nil {
		c.JSON(500, gin.H{"error": "failed to create movie"})
		return
	}

	c.JSON(200, gin.H{"message": "movie added", "movie": movie})

}

func AddTheatre(c *gin.Context) {
	var input struct {
		Id           uint     `json:"id"`
		Theatre      string   `json:"theatrename"`
		Address      string   `json:"address"`
		CityName     string   `json:"cityName"`
		StateName    string   `json:"stateName"`
		Status       string   `json:"status"`
		TotalScreens string   `json:"totalscreens"`
		TheatreURL   string   `json:"theatrefile"`
		Value        []string `json:"value"`
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

	valuebytes, err := json.Marshal(input.Value)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to marshal value"})
		return
	}

	theatre := models.Theatre{
		Id:           input.Id,
		TheatreName:  input.Theatre,
		Address:      input.Address,
		CityName:     input.CityName,
		StateName:    input.StateName,
		Status:       input.Status,
		TotalScreens: uint(totalScreensInt),
		TheatreURL:   input.TheatreURL,
		Value:        valuebytes,
	}

	if err := models.DB.Create(&theatre).Error; err != nil {
		c.JSON(500, gin.H{"error": "failed to create theatre"})
		return
	}
	c.JSON(200, gin.H{"message": "theatre added", "theatre": theatre})

}

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
		Id          uint        `json:"id"`
		TheatreName string      `json:"theatrename"`
		StartDate   string      `json:"startDate"`
		MovieName   string      `josn:"moviename"`
		TimeArray   []Timearray `json:"timearray"`
		Language    []Language  `json:"language"`
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

	showtime := models.Showtime{
		Id:          input.Id,
		TheatreName: input.TheatreName,
		StartDate:   parsedStartDate,
		MovieName:   input.MovieName,
		TimeArray:   timearraybytes,
		Language:    languagebytes,
		Archived:    input.Archived,
	}

	if err := models.DB.Create(&showtime).Error; err != nil {
		c.JSON(500, gin.H{"error": "failed to add showtime"})
	}

	c.JSON(200, gin.H{"message": "showtime added", "showtime": showtime})

}

// Delete Controller Call

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
	c.JSON(200, gin.H{"message": "succesfully deleted", "id": id})

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
	c.JSON(200, gin.H{"message": "successfully deleted theatre", "id": id})

}

func ArchiveShowTime(c *gin.Context) {
	data, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(400, gin.H{"message": "Invalid body data"})
		return
	}

	id, err := strconv.ParseInt(string(data), 0, 64)
	if err != nil {
		c.JSON(400, gin.H{"message": "Invalid Parsing"})
		return
	}

	var showtime models.Showtime
	if err := models.DB.First(&showtime, id).Error; err != nil {
		c.JSON(400, gin.H{"message": "Data doesn't exist in db"})
		return
	}
	showtime.Archived=true
	models.DB.Save(&showtime)
	c.JSON(200, gin.H{"message": "successfully deleted showtime", "id": id})

}

// Update Controllers

func UpdateMovie(c *gin.Context) {

	var input struct {
		Id          uint            `json:"id"`
		Movie       string          `json:"movie"`
		Description string          `json:"description"`
		Genre       string          `json:"genre"`
		StartDate   string          `json:"startDate"`
		EndDate     string          `json:"endDate"`
		Language    json.RawMessage `json:"language"`
		Status      string          `json:"status"`
		File        string          `json:"file"`
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
		Id:          input.Id,
		Title:       input.Movie,
		Description: input.Description,
		Genre:       input.Genre,
		StartDate:   parsedStartDate,
		EndDate:     parsedEndDate,
		Languages:   datatypes.JSON(input.Language),
		Status:      input.Status,
		MovieURL:    input.File,
	}

	// model was not updating previously then i google this way
	if err := models.DB.Model(&models.Movie{}).Where("id =?", update.Id).Updates(update).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to update movie"})
		return
	}

	c.JSON(200, gin.H{"message": "movie updated", "movie": update})

}

func UpdateTheatre(c *gin.Context) {

	var input struct {
		Id           uint            `json:"id"`
		Address      string          `json:"address"`
		CityName     string          `json:"cityName"`
		StateName    string          `json:"stateName"`
		Status       string          `json:"status"`
		TheatreName  string          `json:"theatrename"`
		TheatreFile  string          `json:"theatrefile"`
		TotalScreens uint          `json:"totalscreens"`
		Value        json.RawMessage `json:"value"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"message": err.Error()})
		return
	}

	
	update := models.Theatre{
		Id:           input.Id,
		Address:      input.Address,
		CityName:     input.CityName,
		StateName:    input.StateName,
		Status:       input.Status,
		TheatreURL:   input.TheatreFile,
		TotalScreens: input.TotalScreens,
		Value:        datatypes.JSON(input.Value),
		TheatreName:  input.TheatreName,
	}

	if err := models.DB.Model(&models.Theatre{}).Where("id =?", update.Id).Updates(update).Error; err != nil {
		c.JSON(400, gin.H{"message": "Updates Failed"})
		return
	}

	c.JSON(200, gin.H{"message": "Theatre Updated Successfully!", "theatre": update})

}

func UpdateShowTime(c *gin.Context) {
	var input struct{
		Id uint `json:"id"`
		MovieName string `json:"moviename"`
		TheatreName string `json:"theatrename"`
		Archived bool `json:"archived"`
		StartDate string `json:"startDate"`
		Language json.RawMessage `json:"language"`
		TimeArray json.RawMessage `json:"timearray"`
	}

	if err:=c.ShouldBindJSON(&input);err!=nil{
		c.JSON(400,gin.H{"message":err.Error()})
		return 
	}

	// Parse StartDate 
	layout := "2006-01-02"
	parsedStartDate, err := time.Parse(layout, input.StartDate)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid StartDate format" + err.Error()})
		return
	}

	update:=models.Showtime{
		Id:input.Id,
		MovieName: input.MovieName,
		TheatreName: input.TheatreName,
		Archived: input.Archived,
		StartDate: parsedStartDate,
		Language: datatypes.JSON(input.Language),
		TimeArray: datatypes.JSON(input.TimeArray),

	}

	if err:=models.DB.Model(&models.Showtime{}).Where("id =?",update.Id).Updates(update).Error;err!=nil{
		c.JSON(400,gin.H{"message":"Failed to update showtime"})
		return 
	}

	c.JSON(200,gin.H{"message":"Successfully updated showtime","showtime":update})



}	


func GetMovies(c*gin.Context){
	var movies []models.Movie
	if err:=models.DB.Find(&movies).Error; err!=nil{
		c.JSON(400,gin.H{"message":"Failed to fetch movies"})
		return
	}

	c.JSON(200,movies)


}

func GetTheatres(c*gin.Context){
	var theatres []models.Theatre
	if err:=models.DB.Find(&theatres).Error;err!=nil{
		c.JSON(400,gin.H{"message":"Failed to fetch theatres"})
		return
	}
	c.JSON(200,theatres)
}

func GetShowTime(c*gin.Context){
	var showtime []models.Showtime
	if err:=models.DB.Find(&showtime).Error;err!=nil{
		c.JSON(400,gin.H{"message":"Failed to fetch showtime"})
		return
	}
	c.JSON(200,showtime)
}
