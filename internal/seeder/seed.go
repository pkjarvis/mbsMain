package seeder

import (
	"go-auth/models"
	"go-auth/utils"
	"fmt"
)

func SeedDefaultAdmin() {
	var admin models.User
	models.DB.Where("email = ?", "a1@gmail.com").First(&admin)

	if admin.ID == 0 {
		password := "a11234"
		hashed, _ := utils.GenerateHashPassword(password)

		newAdmin := models.User{
			Name:     "a1",
			Email:    "a1@gmail.com",
			Password: hashed,
			Role:     "admin",
		}
		models.DB.Create(&newAdmin)
		fmt.Println("Admin user seeded successfully.")
	} else {
		fmt.Println("Admin user already exists.")
	}
}
