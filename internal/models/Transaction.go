package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Transaction struct{
	gorm.Model
	Amount float64 `json:"amount"`
	TransactionId string `json:"transactionId"`
	Ticket datatypes.JSON `json:"tickets"`
	Status string `json:"status"`
	UserId uint `json:"userId"`
	MovieId uint64 `json:"movieId"`
	Movie Movie `gorm:"foreignKey:MovieId;constraint:OnDelete:CASCADE" json:"movie"` 
	User User `gorm:"foreignKey:UserId;constraint:OnDelete:CASCADE;" json:"-"`
}