package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	Amount        float64        `json:"amount"`
	TransactionId string         `json:"transactionId"`
	Ticket        datatypes.JSON `json:"tickets"`
	Status        string         `json:"status"`

	UserId *uint `json:"userId"`
	User   User  `gorm:"foreignKey:UserId;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"-"`

	MovieName      string `json:"movieName"`
	MovieFile      string `json:"movieFile"`
	TheatreName    string `json:"theatreName"`
	TheatreAddress string `json:"theatreAddress"`
	Date           string `json:"date"`
	StartTime      string `json:"from"`
	EndTime        string `json:"to"`
	ShowID         string   `gorm:"column:show_id" json:"showId"`
}


