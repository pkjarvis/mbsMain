// PATH: go-auth/models/index.go

package models

import (
    "fmt"
    // "os"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

type Config struct {
    Host     string
    Port     string
    User     string
    Password string
    DBName   string
    SSLMode  string
}

var DB *gorm.DB

func InitDB(cfg Config) {

    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", cfg.Host, cfg.User, cfg.Password, cfg.DBName, cfg.Port, cfg.SSLMode)

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic(err)
    }

    if err := db.AutoMigrate(&User{}); err != nil {
        panic(err)
    }

    if err := db.AutoMigrate(&Movie{});err !=nil{
        panic(err)
    }

    if err :=db.AutoMigrate(&Theatre{});err!=nil{
        panic(err)
    }

    if err :=db.AutoMigrate(&Showtime{});err!=nil{
        panic(err)
    }
    if err :=db.AutoMigrate(&Review{});err!=nil{
        panic(err)
    }
    if err :=db.AutoMigrate(&Transaction{});err!=nil{
        panic(err)
    }
    if err :=db.AutoMigrate(&State{});err!=nil{
        panic(err)
    }

    fmt.Println("Migrated database")

    DB = db

    // dsn := os.Getenv("DATABASE_URL") // Load from .env or Render environment

	// db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	// if err != nil {
	// 	panic(fmt.Sprintf("failed to connect to database: %v", err))
	// }

    
	// Run all migrations
	// if err := db.AutoMigrate(&User{}, &Movie{}, &Theatre{}, &Review{},&Showtime{}, &Transaction{}); err != nil {
	// 	panic(err)
	// }

	// fmt.Println("Migrated database")

	// DB = db
}