package main

import (
	// "go-auth/middlewares"
	"go-auth/models"
	"go-auth/routes"
    "time"
	"log"
	"os"
  

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
    "github.com/gin-contrib/cors"
	// "github.com/rs/cors"
)

func main() {
    // Create a new gin instance
    r := gin.Default()

    // cors middleware
    corconfig := cors.DefaultConfig()
    corconfig.AllowAllOrigins = true
    corconfig.AllowMethods = []string{"POST", "GET", "PUT", "OPTIONS"}
    corconfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Accept", "User-Agent", "Cache-Control", "Pragma"}
    corconfig.ExposeHeaders = []string{"Content-Length"}
    corconfig.AllowCredentials = true
    corconfig.MaxAge = 12 * time.Hour

    r.Use(cors.New(corconfig))

  


    // Load .env file and Create a new connection to the database
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    config := models.Config{
        Host:     os.Getenv("DB_HOST"),
        Port:     os.Getenv("DB_PORT"),
        User:     os.Getenv("DB_USER"),
        Password: os.Getenv("DB_PASSWORD"),
        DBName:   os.Getenv("DB_NAME"),
        SSLMode:  os.Getenv("DB_SSLMODE"),
    }

    // Initialize DB
    models.InitDB(config)

    

    // Load the routes
    routes.AuthRoutes(r)

    // Run the server
    r.Run(":8080")
}
