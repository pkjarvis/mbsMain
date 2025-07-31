package models
import ("time")

type Seat struct {
	ID        uint   `gorm:"primaryKey"`
	TheatreID uint
	Row       string
	Number    int
	Label     string
	Price     int
	Status    string // "available", "disabled", etc.
	LockedBy  *uint  // User who temporarily locked it
	LockedAt  *time.Time // Timestamp when locked
	Theatre   Theatre `gorm:"constraint:OnDelete:CASCADE;"`

}
