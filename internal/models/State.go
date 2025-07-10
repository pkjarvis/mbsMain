// models/state.go

package models

import "gorm.io/gorm"

type State struct {
	gorm.Model
	UserID   uint   `json:"user_id"`
	CityName string `json:"city_name"`
}
