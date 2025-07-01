package main

import (
	"go-auth/controllers"
	"go-auth/models"
	"go-auth/routes"
	"log"
	"os"

	// "os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Create a new gin instance

	r := gin.Default()

	r.POST("/payment-success", controllers.PaymentSuccess)
	r.POST("/payment-failure", controllers.PaymentFailure)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000","https://incandescent-semolina-95ca12.netlify.app"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Load .env file and Create a new connection to the database
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// config := models.Config{
	// 	Host:     os.Getenv("DB_HOST"),
	// 	Port:     os.Getenv("DB_PORT"),
	// 	User:     os.Getenv("DB_USER"),
	// 	Password: os.Getenv("DB_PASSWORD"),
	// 	DBName:   os.Getenv("DB_NAME"),
	// 	SSLMode:  os.Getenv("DB_SSLMODE"),
	// }

	// Initialize DB
	models.InitDB()

	// Load the routes
	routes.AuthRoutes(r)

	// Run the server
	r.Run(os.Getenv("PORT"))
}
