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
	"time"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Showtime struct {
	gorm.Model
	// Id          uint           `json:"id" gorm:"primaryKey"`
	MovieID     uint           `json:"movieId"`
	TheatreID   uint           `json:"theatreId"`
	TheatreName string         `json:"theatrename"`
	StartDate   time.Time      `json:"startDate"`
	MovieName   string         `json:"moviename"`
	TimeArray   datatypes.JSON `json:"timearray"`
	Language    datatypes.JSON `json:"language"`
	Archived    bool           `json:"archived"`
	Movie       Movie          `gorm:"foreignKey:MovieID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;"`
	Theatre     Theatre        `gorm:"foreignKey:TheatreID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;"`
}





