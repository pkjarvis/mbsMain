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

    fmt.Println("Inside initdb")
    // dsn:=os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
        panic(err)
    }

    fmt.Println("Between InitDb file");

    
	// Run all migrations
	if err := db.AutoMigrate(&User{}, &Movie{}, &Theatre{}, &Review{},&Showtime{}, &Transaction{},&State{},&SeatLayout{}); err != nil {
		panic(err)
	}

	fmt.Println("Migrated database")

	DB = db

}


