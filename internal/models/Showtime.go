package models

//  id:editingNewShowTime?editingNewShowTime.id:Date.now(),
//       theatrename:theatrename,
//       startDate:startDate,
//       moviename:moviename,
//       datetime12h:datetime12h,
//       datetime:datetime,
//       timearray:timearray,
//       language:selectedCities,
//       archived:false,

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"time"
)

type Showtime struct {
	gorm.Model
	Id          uint           `json:"id" gorm:"primaryKey"`
	TheatreName string         `json:"theatrename"`
	StartDate   time.Time      `json:"startDate"`
	MovieName   string         `json:"moviename"`
	TimeArray   datatypes.JSON `json:"timearray"`
	Language    datatypes.JSON `json:"language"`
	Archived    bool           `json:"archived"`
}
