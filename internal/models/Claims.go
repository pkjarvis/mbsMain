 // PATH: go-auth/models/Claims.go

 package models

 import "github.com/dgrijalva/jwt-go"

 type Claims struct {
     UserId uint `json:"user_id"`
     Role string `json:"role"`
     jwt.StandardClaims
 }
