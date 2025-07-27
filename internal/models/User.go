// PATH: go-auth/models/User.go

package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name         string `json:"name"`
	Email        string `gorm:"unique" json:"email"`
	Password     string `json:"password"`
	Role         string `json:"role"`
	ProfilePhoto string `json:"profilePhoto,omitempty"`
	// Reviews   []Review `gorm:"foreignKey:UserID"`
	// Reviews []Reviews `gorm:"constraint:OnDelete:CASCADE" json:"-"`
}
