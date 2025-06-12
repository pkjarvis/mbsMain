package utils

import (
	"errors"
	"fmt"
	"go-auth/models"
	"os"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey=[]byte(os.Getenv("SECRET"))

func ParseToken(tokenString string) (claims *models.Claims, err error) {
	token, err := jwt.ParseWithClaims(tokenString, &models.Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _,ok:=token.Method.(*jwt.SigningMethodHMAC); !ok{
			return nil,fmt.Errorf("unexpected signing method")
		}
		return []byte(os.Getenv("SECRET")), nil  
	})

	fmt.Println("Secret is :",jwtKey)
	

	if err != nil {
		return nil,errors.New("invalid signed token");
	}

	claims, ok := token.Claims.(*models.Claims)

	if !ok || !token.Valid{
		return nil,errors.New("invalid token claims")
	}

	return claims, nil
}
