package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"strings"

	// "strings"

	// "io/ioutil"

	// "fmt"
	"crypto/sha512"
	"encoding/hex"
	"go-auth/models"
	"go-auth/utils"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"

	// "github.com/joho/godotenv"
	"gorm.io/datatypes"
)

func LoginWithRole(c *gin.Context, expectedRole string) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var existingUser models.User
	models.DB.Where("email = ?", user.Email).First(&existingUser)

	if existingUser.Id == 0 {
		c.JSON(400, gin.H{"error": "user does not exist"})
		return
	}

	if existingUser.Role != expectedRole {
		c.JSON(403, gin.H{"error": "invalid role"})
		return
	}

	if !utils.CompareHashPassword(user.Password, existingUser.Password) {
		c.JSON(400, gin.H{"error": "invalid password"})
		return
	}

	expirationTime := time.Now().Add(7 * 24 * time.Hour)

	claims := &models.Claims{
		UserId: existingUser.Id,
		Name:   existingUser.Name,
		Email:  existingUser.Email,
		Role:   existingUser.Role,
		StandardClaims: jwt.StandardClaims{
			Subject:   existingUser.Email,
			ExpiresAt: expirationTime.Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("SECRET")

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		c.JSON(500, gin.H{"error": "could not generate token"})
		return
	}

	// domain:="mbsmain-hksv.onrender.com"
	// if expectedRole=="admin"{
	// 	domain="mbsmain-hksv.onrender.com/admin/login"
	// } else {
	// 	domain="mbsmain-hksv.onrender.com/user/login"
	// }

	log.Println("CP-1")
	c.SetCookie("token", tokenString, 365*24*60*60, "", "", true, true)
	c.Header("Set-Cookie", fmt.Sprintf(
		"token=%s; Path=/; Domain=%s; Max-Age=%d; Secure; HttpOnly; SameSite=None",
		tokenString,
		"",
		365*24*60*60,
	))
	log.Println("CP-2", tokenString)

	c.Set("userId", claims.UserId)
	c.Set("userToken", tokenString)
	c.Set("role", claims.Role)

	fmt.Print("existingUser.Id", existingUser.Id)
	c.JSON(200, gin.H{
		"msg":      "logged in",
		"token":    tokenString,
		"username": existingUser.Name,
		"role":     existingUser.Role,
		"userId":   existingUser.Id,
		"email":    existingUser.Email,
	})
}

func SignupWithRole(c *gin.Context, role string) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	var existingUser models.User
	models.DB.Where("email = ?", user.Email).First(&existingUser)

	if existingUser.Id != 0 {
		c.JSON(400, gin.H{"error": "user already exists"})
		return
	}

	// Hash password
	hashedPwd, err := utils.GenerateHashPassword(user.Password)
	if err != nil {
		c.JSON(500, gin.H{"error": "could not hash password"})
		return
	}

	user.Password = hashedPwd
	user.Role = role

	if err := models.DB.Create(&user).Error; err != nil {
		c.JSON(500, gin.H{"error": "could not create user"})
		return
	}

	expirationTime := time.Now().Add(7 * 24 * time.Hour)

	claims := &models.Claims{
		UserId: user.Id,
		Name:   user.Name,
		Email:  user.Email,
		Role:   user.Role,
		StandardClaims: jwt.StandardClaims{
			Subject:   existingUser.Email,
			ExpiresAt: expirationTime.Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("SECRET")

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		c.JSON(500, gin.H{"error": "could not generate token"})
		return
	}

	log.Println("CP-1")
	c.SetCookie("token", tokenString, 365*24*60*60, "", "", true, true)
	c.Header("Set-Cookie", fmt.Sprintf(
		"token=%s; Path=/; Domain=%s; Max-Age=%d; Secure; HttpOnly; SameSite=None",
		tokenString,
		"",
		365*24*60*60,
	))
	log.Println("CP-2", tokenString)

	c.Set("userId", claims.UserId)
	c.Set("userToken", tokenString)
	c.Set("role", claims.Role)

	// c.JSON(200, gin.H{"message": "signup successful", "role": role})
	c.JSON(200, gin.H{
		"msg":      "signed in",
		"token":    tokenString,
		"username": user.Name,
		"role":     user.Role,
		"userId":   user.Id,
		"email":    user.Email,
	})

}

// func Signup(c *gin.Context) {
// 	var req models.User

// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(400, gin.H{"error": "Invalid request"})
// 		return
// 	}

// 	// Check if user exists
// 	var existing models.User
// 	models.DB.Where("email = ?", req.Email).First(&existing)
// 	if existing.ID != 0 {
// 		c.JSON(409, gin.H{"error": "User already exists"})
// 		return
// 	}

// 	// Create user
// 	hashedPwd, _ := utils.GenerateHashPassword(req.Password)

// 	newUser := models.User{
// 		Name:     req.Name,
// 		Email:    req.Email,
// 		Password: hashedPwd,
// 		Role:     "user", // default role
// 	}
// 	models.DB.Create(&newUser)

// 	// Generate token
// 	tokenString, _ := utils.GenerateToken(newUser.ID, newUser.Email, newUser.Role)

// 	// Set token as cookie
// 	// http.SetCookie(c.Writer, &http.Cookie{
// 	// 	Name:     "token",
// 	// 	Value:    tokenString,
// 	// 	Path:     "/",
// 	// 	HttpOnly: true,
// 	// 	Secure:   true,
// 	// 	SameSite: http.SameSiteNoneMode,
// 	// })
// 	c.SetCookie("token", tokenString, 365*24*60*60, "", "", true, true)

// 	// Return response
// 	c.JSON(200, gin.H{
// 		"message":    "Signup successful",
// 		"userName":   newUser.Name,
// 		"email":      newUser.Email,
// 		"token":  tokenString,
// 		"role": newUser.Role,
// 	})
// }

// func Login(c *gin.Context) {
// 	var req models.User

// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(400, gin.H{"error": err.Error()})
// 		return
// 	}

// 	var user models.User
// 	models.DB.Where("email = ?", req.Email).First(&user)

// 	if user.Id == 0 {
// 		c.JSON(400, gin.H{"error": "user does not exist"})
// 		return
// 	}

// 	if !utils.CompareHashPassword(req.Password, user.Password) {
// 		c.JSON(400, gin.H{"error": "incorrect password"})
// 		return
// 	}

// 	tokenString, _ := utils.GenerateToken(user.ID, user.Email, user.Role)

// 	// http.SetCookie(c.Writer, &http.Cookie{
// 	// 	Name:     "token",
// 	// 	Value:    tokenString,
// 	// 	Path:     "/",
// 	// 	HttpOnly: true,
// 	// 	Secure:   true,
// 	// 	SameSite: http.SameSiteNoneMode,
// 	// })

// 	c.SetCookie("token", tokenString, 365*24*60*60, "", "", true, true)

// 	// c.JSON(200, gin.H{"message": "Login successful", "role": user.Role})
// 	c.JSON(200, gin.H{
// 		"message":   "Login successful",
// 		"userName":  user.Name,
// 		"email":     user.Email,
// 		"token": tokenString,
// 		"role":      user.Role,
// 	})
// }

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
		Id:          input.Id,
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

func AddTheatre(c *gin.Context) {
	var input struct {
		Id           uint   `json:"id"`
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
		Id:           input.Id,
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
		Id:          input.Id,
		TheatreName: input.TheatreName,
		StartDate:   parsedStartDate,
		MovieName:   input.MovieName,
		TimeArray:   timearraybytes,
		Language:    languagebytes,
		Archived:    input.Archived,
		MovieID:     movie.Id,
		TheatreID:   theatre.Id,
	}

	if err := models.DB.Create(&showtime).Error; err != nil {
		c.JSON(500, gin.H{"error": "failed to add showtime"})
		return
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
	models.DB.Unscoped().Delete(&movie)
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

	models.DB.Unscoped().Delete(&theatre)
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
	showtime.Archived = true
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
		Id:          input.Id,
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
	if err := models.DB.Model(&models.Movie{}).Where("id =?", update.Id).Updates(update).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to update movie"})
		return
	}

	c.JSON(200, gin.H{"message": "movie updated", "movie": update})

}

func UpdateTheatre(c *gin.Context) {

	var input struct {
		Id           uint   `json:"id"`
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
		Id:           input.Id,
		Address:      input.Address,
		CityName:     input.CityName,
		StateName:    input.StateName,
		Status:       input.Status,
		TheatreURL:   input.TheatreFile,
		TotalScreens: input.TotalScreens,
		// Value:        datatypes.JSON(input.Value),
		TheatreName: input.TheatreName,
	}

	if err := models.DB.Model(&models.Theatre{}).Where("id =?", update.Id).Updates(update).Error; err != nil {
		c.JSON(400, gin.H{"message": "Updates Failed"})
		return
	}

	c.JSON(200, gin.H{"message": "Theatre Updated Successfully!", "theatre": update})

}

func UpdateShowTime(c *gin.Context) {
	var input struct {
		Id          uint            `json:"id"`
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
		Id:          input.Id,
		MovieName:   input.MovieName,
		TheatreName: input.TheatreName,
		Archived:    input.Archived,
		StartDate:   parsedStartDate,
		Language:    datatypes.JSON(input.Language),
		TimeArray:   datatypes.JSON(input.TimeArray),
	}

	if err := models.DB.Model(&models.Showtime{}).Where("id =?", update.Id).Updates(update).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to update showtime"})
		return
	}

	c.JSON(200, gin.H{"message": "Successfully updated showtime", "showtime": update})

}

func GetMovies(c *gin.Context) {
	var movies []models.Movie
	if err := models.DB.Find(&movies).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch movies"})
		return
	}

	c.JSON(200, movies)

}

func GetTheatres(c *gin.Context) {
	var theatres []models.Theatre
	if err := models.DB.Find(&theatres).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch theatres"})
		return
	}
	c.JSON(200, theatres)
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

func AddReview(c *gin.Context) {

	var input struct {
		Star    int    `json:"star"`
		Text    string `json:"text"`
		MovieId uint   `json:"movieId"`
	}

	userIdVal, exists := c.Get("userId")
	if !exists {
		c.JSON(400, gin.H{"error": "User Id not found in context"})
		return
	}

	userId, ok := userIdVal.(uint)
	if !ok {
		c.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}

	var existingMovieId models.Review
	var existingUserId models.Review
	models.DB.Where("movie_id = ?", input.MovieId).First(&existingMovieId)
	models.DB.Where("user_id = ?", userId).First(&existingUserId)

	if existingMovieId.MovieId != 0 && existingUserId.UserId != 0 {
		c.JSON(400, gin.H{"error": "already gave review for movieId with userId"})
		return
	}

	var user models.User
	if err := models.DB.First(&user, userId).Error; err != nil {
		c.JSON(400, gin.H{"error": "user not found"})
		return
	}

	review := models.Review{
		Star:     input.Star,
		Text:     input.Text,
		MovieId:  input.MovieId,
		UserId:   userId,
		Username: user.Name, // Storing snapshot of username
	}
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(400, gin.H{"error": "Binding error "})
		return
	}
	// review.UserId=userId

	if err := models.DB.Create(&review).Error; err != nil {
		c.JSON(400, gin.H{"error": "could not create review"})
		return
	}

	c.JSON(200, gin.H{"message": "review added", "review": review})

}

// Payu integration  ---------------------------

func generateRandomTnxId() string {
	return fmt.Sprintf("TXN-%d", time.Now().UnixNano())
}

// ngrok used for using public url instead of local - https://122f-139-5-254-235.ngrok-free.app

func generatePayuPayment(tx models.Transaction) map[string]interface{} {
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }

	key := os.Getenv("KEY")
	salt := os.Getenv("SALT")

	actionURL := "https://test.payu.in/_payment"

	// productinfo, firstname, email are required fields
	productinfo := "MovieBooking"
	firstname := "testuser"
	email := "test@example.com"

	// PayU hash format must be exact
	hashString := fmt.Sprintf(
		"%s|%s|%.2f|%s|%s|%s|||||||||||%s",
		key,
		tx.TransactionId,
		tx.Amount,
		productinfo,
		firstname,
		email,
		salt,
	)

	hash := sha512.Sum512([]byte(hashString))
	hashHex := hex.EncodeToString(hash[:])

	successurl := os.Getenv("SUCCESS_URL")

	if successurl == "" {
		successurl = "http://localhost:8080"
	}

	fmt.Println("successurl is", successurl)

	return map[string]interface{}{
		"payuFormFields": map[string]string{
			"key":         key,
			"city":        "city",
			"furl":        fmt.Sprintf("%s/payment-failure", successurl),
			"hash":        hashHex,
			"surl":        fmt.Sprintf("%s/payment-success", successurl),
			"email":       email,
			"phone":       "phone number",
			"state":       "state",
			"txnid":       tx.TransactionId,
			"amount":      fmt.Sprintf("%.2f", tx.Amount),
			"country":     "India",
			"zipcode":     "pincode",
			"address1":    "address",
			"firstname":   firstname,
			"productinfo": productinfo,
		},
		"actionURL": actionURL,
	}

}

func Payment(c *gin.Context) {
	var input struct {
		Price          float64         `json:"price"`
		Store          json.RawMessage `json:"store"` // raw seat array like ["L3", "L4"]
		MovieName      string          `json:"moviename"`
		MovieFile      string          `json:"moviefile"`
		TheatreName    string          `json:"theatrename"`
		TheatreAddress string          `json:"theatreaddress"`
		Date           string          `json:"date"`
		From           string          `json:"from"`
		To             string          `json:"to"`
		ShowID         string          `json:"showId"`
	}

	// Validate request body
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Binding failed in payment"})
		return
	}

	// Extract userId from context
	userIdVal, exists := c.Get("userId")
	if !exists {
		c.JSON(401, gin.H{"error": "User Id not found in context"})
		return
	}

	userId, ok := userIdVal.(uint)
	if !ok {
		c.JSON(400, gin.H{"error": "UserId is not in correct format"})
		return
	}
	fmt.Println("userIdVal is:", userIdVal)

	// Create transaction
	payment := models.Transaction{
		Amount:         input.Price,
		Ticket:         datatypes.JSON(input.Store),
		Status:         "pending",
		UserId:         &userId,
		TransactionId:  generateRandomTnxId(),
		MovieName:      input.MovieName,
		MovieFile:      input.MovieFile,
		TheatreName:    input.TheatreName,
		TheatreAddress: input.TheatreAddress,
		Date:           input.Date,
		StartTime:      input.From,
		EndTime:        input.To,
		ShowID:         input.ShowID,
	}

	// Save to DB
	if err := models.DB.Create(&payment).Error; err != nil {
		c.JSON(500, gin.H{"error": "Could not create transaction", "details": err.Error()})
		return
	}

	// Generate PayU payment data
	payUData := generatePayuPayment(payment)

	// Send response
	c.JSON(200, gin.H{
		"message":     "Transaction created and redirected to PayU",
		"transaction": payment,
		"payUData":    payUData,
	})
}

func PaymentSuccess(c *gin.Context) {
	fmt.Println("Check if controller is running or not")

	txnId := c.PostForm("txnid")
	status := c.PostForm("status")

	if status == "success" {
		if err := models.DB.Model(&models.Transaction{}).Where("transaction_id = ?", txnId).Update("status", "paid").Error; err != nil {
			c.JSON(400, gin.H{"error": "Failed to create Transaction Model"})
			c.Abort()
			return
		}
	}
	fmt.Println("redirect message")
	frontend := os.Getenv("ALLOWED_ORIGIN1")
	if frontend == "" {
		frontend = "http://localhost:5173"
	}

	c.Redirect(302, fmt.Sprintf("%s/payment-status?success=true", frontend))

}


func PaymentFailure(c *gin.Context) {
	txnId := c.PostForm("txnid")
	fmt.Println("Passed 1")
	if err := models.DB.Model(&models.Transaction{}).Where("transaction_id = ?", txnId).Update("status", "failed").Error; err != nil {
		c.JSON(400, gin.H{"error": "Failed to create transaction"})
		c.Abort()
		return
	}

	fmt.Println("Passed 2")

	frontend := os.Getenv("ALLOWED_ORIGIN1")
	if frontend == "" {
		frontend = "http://localhost:5173"
	}

	c.Redirect(302, fmt.Sprintf("%s/payment-status?success=false", frontend))

}


//------------------------

func GetReviews(c *gin.Context) {
	var review []models.Review
	if err := models.DB.Find(&review).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch review"})
		return
	}
	c.JSON(200, gin.H{"reviews": review})
}

func GetReviewByMovie(c *gin.Context) {
	movieId := c.Query("movieId")
	var review []models.Review

	if err := models.DB.Where("movie_id = ?", movieId).Find(&review).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch reviews by movieId"})
		return
	}
	c.JSON(200, gin.H{"reviews": review})

}

func UpdateProfile(c *gin.Context) {
	var input struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"message": "Binding failed with input payload"})
		return
	}

	userIDVal, exists := c.Get("userId")
	if !exists {
		c.JSON(401, gin.H{"message": "Unauthorized"})
		return
	}

	userID, ok := userIDVal.(uint)
	if !ok {
		c.JSON(400, gin.H{"message": "Invalid userId format"})
		return
	}

	var user models.User
	if err := models.DB.First(&user, userID).Error; err != nil {
		c.JSON(404, gin.H{"message": "user not found"})
		return
	}
	user.Name = input.Name
	user.Email = input.Email

	if err := models.DB.Save(&user).Error; err != nil {
		c.JSON(500, gin.H{"message": "Failed to update user model"})
		return
	}

	c.JSON(200, gin.H{"message": "Successfully updated User", "update": user})

}

func GetBookedSeats(c *gin.Context) {
	showIdParam := c.Query("showId")

	if showIdParam == "" {
		c.JSON(400, gin.H{"error": "missing showId"})
		return
	}

	log.Println("Incoming showId:", showIdParam)

	var transactions []models.Transaction
	if err := models.DB.Where("show_id = ? AND status = ?", showIdParam, "paid").Find(&transactions).Error; err != nil {
		log.Println("DB ERROR:", err) // print full error
		c.JSON(500, gin.H{"error": "Failed to fetch transactions"})
		return
	}
	c.JSON(200, gin.H{"tickets": transactions})

}

func GetPaidTicketUser(c *gin.Context) {

	var transactions []models.Transaction
	userIDVal, exists := c.Get("userId")
	if !exists {
		c.JSON(401, gin.H{"message": "Unauthorized"})
		return
	}

	userID, ok := userIDVal.(uint)
	if !ok {
		c.JSON(400, gin.H{"message": "Invalid userId format"})
		return
	}

	if err := models.DB.Where("status = ? AND user_id = ?", "paid", userID).Find(&transactions).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch transactions"})
		return
	}

	c.JSON(200, gin.H{"tickets": transactions})

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

func SaveUserState(c *gin.Context) {
	var input struct {
		CityName string `json:"city_name"`
	}

	userIDVal, exists := c.Get("userId")
	if !exists {
		c.JSON(401, gin.H{"message": "unauthorized"})
		return
	}
	userID := userIDVal.(uint)

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	state := models.State{
		UserID:   userID,
		CityName: input.CityName,
	}

	if err := models.DB.Create(&state).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to save state"})
		return
	}

	c.JSON(200, gin.H{"message": "State saved successfully"})
}

func GetState(c *gin.Context) {
	var state []models.State
	if err := models.DB.Find(&state).Error; err != nil {
		c.JSON(400, gin.H{"error": "Couldn't find the state"})
		return
	}
	c.JSON(200, gin.H{"state": state})
}

func PromoteUser(c *gin.Context) {
	type Req struct {
		Email string `json:"email"`
	}

	var body Req
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "invalid payload"})
		return
	}

	var user models.User
	if err := models.DB.Where("email = ?", body.Email).First(&user).Error; err != nil {
		c.JSON(404, gin.H{"error": "user not found"})
		return
	}

	user.Role = "admin"
	models.DB.Save(&user)

	c.JSON(200, gin.H{"message": "User promoted to admin"})
}

func DemoteUser(c *gin.Context) {
	type Req struct {
		Email string `json:"email"`
	}

	var body Req
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "invalid payload"})
		return
	}

	var user models.User
	if err := models.DB.Where("email = ?", body.Email).First(&user).Error; err != nil {
		c.JSON(404, gin.H{"error": "user not found"})
		return
	}

	user.Role = "user"
	models.DB.Save(&user)

	c.JSON(200, gin.H{"message": "User demoted to user"})
}
