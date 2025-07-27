package controllers

import (
	"github.com/gin-gonic/gin"
	"go-auth/models"
)

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

	var existingReview models.Review
	err := models.DB.Where("movie_id = ? AND user_id = ?", input.MovieId, userId).First(&existingReview).Error

	if err == nil {
		// A review already exists
		c.JSON(400, gin.H{"error": "You have already submitted a review for this movie"})
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

func GetReviewByMovie(c *gin.Context) {
	movieId := c.Query("movieId")
	var review []models.Review

	if err := models.DB.Where("movie_id = ?", movieId).Find(&review).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch reviews by movieId"})
		return
	}
	c.JSON(200, gin.H{"reviews": review})

}

func GetReviews(c *gin.Context) {
	var review []models.Review
	if err := models.DB.Find(&review).Error; err != nil {
		c.JSON(400, gin.H{"message": "Failed to fetch review"})
		return
	}
	c.JSON(200, gin.H{"reviews": review})
}
