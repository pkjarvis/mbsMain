package utils

import (
	"errors"
	"fmt"
	"go-auth/models"
	"os"
   	"github.com/dgrijalva/jwt-go"
	// "github.com/joho/godotenv"
	// "log"
)


func ParseToken(tokenString string) (claims *models.Claims, err error) {

	// err1 := godotenv.Load()
    // if err1 != nil {
    //     log.Fatal("Error loading .env file")
    // }

	secret:=os.Getenv("SECRET")
	if secret==""{
		return nil,errors.New("SECRET env  variable is empty")
	}

	token, err := jwt.ParseWithClaims(tokenString, &models.Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _,ok:=token.Method.(*jwt.SigningMethodHMAC); !ok{
			return nil,fmt.Errorf("unexpected signing method")
		}


		return []byte(secret), nil  
	})

	fmt.Println("Secret is :",secret)
	

	if err != nil {
		return nil,err;
	}

	claims, ok := token.Claims.(*models.Claims)

	fmt.Println("Parsed claims",claims)

	if !ok || !token.Valid{
		return nil,errors.New("invalid token claims")
	}

	return claims, nil
}

// package utils

// import (
// 	"errors"
// 	"fmt"
// 	"os"

// 	"github.com/golang-jwt/jwt/v5"
// )

// func ParseToken(tokenString string) (*JWTClaim, error) {
// 	secret := os.Getenv("SECRET")
// 	if secret == "" {
// 		return nil, errors.New("SECRET env variable is empty")
// 	}

// 	token, err := jwt.ParseWithClaims(tokenString, &JWTClaim{}, func(token *jwt.Token) (interface{}, error) {
// 		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
// 			return nil, fmt.Errorf("unexpected signing method")
// 		}
// 		return []byte(secret), nil
// 	})

// 	if err != nil {
// 		return nil, err
// 	}

// 	claims, ok := token.Claims.(*JWTClaim)
// 	if !ok || !token.Valid {
// 		return nil, errors.New("invalid token claims")
// 	}

// 	return claims, nil
// }

