package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"time"
)

//  id: editingMovie ? editingMovie.id : Date.now(),
//       movie: movie,
//       description: description,
//       startDate: startDate,
//       endDate: endDate,
//       genre: genre,
//       language: selectedCities,
//       status: status,
//       file: file || editingMovie?.file,

type Movie struct {
	gorm.Model
	Id          uint           `json:"id" gorm:"primaryKey"`
	Title       string         `json:"movie"`
	Description string         `json:"description"`
	Genre       string         `json:"genre"`
	StartDate   time.Time      `json:"startDate"`
	EndDate     time.Time      `json:"endDate"`
	Languages   datatypes.JSON `json:"language"`
	Status      string         `json:"status"`
	MovieURL    string         `json:"file"`
	// Reviews   []Review `gorm:"foreignKey:MovieID"`
}

