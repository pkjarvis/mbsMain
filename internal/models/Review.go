package models

import "gorm.io/gorm"

type Review struct{
	gorm.Model
	// Id  uint `json:"id" gorm:"primaryKey;auto_increment"`
	MovieId uint `json:"movieId"`
	UserId uint `json:"userId"`
	Star int `json:"star"`
	Text string `json:"text"`
	Username string `json:"username"`
	Movie Movie `gorm:"foreignKey:MovieId;constraint:OnDelete:CASCADE;" json:"-"`
	User User `gorm:"foreignKey:UserId;contraint:OnDelete:CASCADE;" json:"-"`
	
}