package models

type SeatLayout struct {
    ID        uint   `gorm:"primaryKey"`
    TheatreID uint
    Row       string
    SeatCount int
    Price     int
}


