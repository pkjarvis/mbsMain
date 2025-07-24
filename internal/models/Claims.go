 // PATH: go-auth/models/Claims.go

 package models

 import "github.com/dgrijalva/jwt-go"

type Claims struct {
	UserId uint   `json:"userId"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.StandardClaims
}


