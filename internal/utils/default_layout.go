package utils

import "go-auth/models"

func GetDefaultSeatLayout(theatreID uint) []models.SeatLayout {
	return []models.SeatLayout{
		{TheatreID: theatreID, Row: "A", SeatCount: 15, Price: 300},
		{TheatreID: theatreID, Row: "B", SeatCount: 15, Price: 300},
		{TheatreID: theatreID, Row: "C", SeatCount: 15, Price: 300},
		{TheatreID: theatreID, Row: "D", SeatCount: 15, Price: 300},
		{TheatreID: theatreID, Row: "E", SeatCount: 15, Price: 300},
		{TheatreID: theatreID, Row: "F", SeatCount: 15, Price: 300},
		{TheatreID: theatreID, Row: "G", SeatCount: 15, Price: 320},
		{TheatreID: theatreID, Row: "H", SeatCount: 15, Price: 320},
		{TheatreID: theatreID, Row: "I", SeatCount: 15, Price: 320},
		{TheatreID: theatreID, Row: "M", SeatCount: 10, Price: 560},
	}
}
