package models

import "gorm.io/gorm"

type Review struct{
	gorm.Model
	// Id  uint `json:"id" gorm:"primaryKey;auto_increment"`
	MovieId uint `json:"movieId" gorm:"index:idx_user,unique"`
	UserId uint `json:"userId" gorm:"index:idx_user,unique"`
	Star int `json:"star"`
	Text string `json:"text"`
	Username string `json:"username"`
	Movie Movie `gorm:"foreignKey:MovieId;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"-"`
	User User `gorm:"foreignKey:UserId;constraint:OnDelete:CASCADE,onUpdate:CASCADE;" json:"-"`
}


