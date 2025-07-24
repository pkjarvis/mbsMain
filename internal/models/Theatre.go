package models

import (
	// "gorm.io/datatypes"
	"gorm.io/gorm"
)

//  id:editingTheatre?editingTheatre.id: Date.now(),
//       theatrename: theatrename,
//       address: address,
//       cityName: cityName,

//       stateName: stateName,
//       status: status,
//       totalscreens: totalscreens,
//       theatrefile: theatrefile || editingTheatre?.theatrefile,
//       value: value,



type Theatre struct {
	gorm.Model
	// Id           uint           `json:"id" gorm:"primaryKey"`
	TheatreName  string         `json:"theatrename"`
	Address      string         `json:"address"`
	CityName     string         `json:"cityName"`
	StateName    string         `json:"stateName"`
	Status       string         `json:"status"`
	TotalScreens uint           `json:"totalscreens"`
	TheatreURL   string         `json:"theatrefile"`
	// Value        datatypes.JSON `json:"value"`
}