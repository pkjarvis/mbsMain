// PATH: go-auth/middlewares/isAuthorized.go

package middlewares

import (
    "go-auth/utils"
    "github.com/gin-gonic/gin"
    "fmt"
)

func IsAuthorized() gin.HandlerFunc {
    return func(c *gin.Context) {

         fmt.Println("IsAuthorized middleware called")

        // 1. Get token from cookie
        tokenStr, err := c.Cookie("token")
        if err != nil {
            fmt.Println("Token cookie not found:", err)
            c.JSON(401, gin.H{"error": "Unauthorized: Token not found in cookies"})
            c.Abort()
            return
        }

        // 2. Parse and validate the JWT token
        claims, err := utils.ParseToken(tokenStr)
        if err != nil {
            fmt.Println("Invalid token:", err)
            c.JSON(401, gin.H{"error": "Unauthorized: Invalid token"})
            c.Abort()
            return
        }

        // 3. Set values in context for downstream handlers
        c.Set("claims", claims)
        c.Set("userId", claims.UserId)
        c.Set("role", claims.Role)

        fmt.Printf("Authorized - UserID: %v, Role: %v\n", claims.UserId, claims.Role)

        c.Next()
    }
}

func UserAuthorized() gin.HandlerFunc{
    return func(c*gin.Context){

         fmt.Println("UserAuthorized middleware called")

        // 1. Extract token from cookie
        token, err := c.Cookie("token")
        fmt.Println("token from middleware",token)
        if err != nil || token == "" {
            fmt.Println("Token not found in cookie:", err)
            c.JSON(401, gin.H{"error": "Unauthorized: Token not found"})
            c.Abort()
            return
        }

        // 2. Parse JWT token
        claims, err := utils.ParseToken(token)
        if err != nil {
            fmt.Println("Invalid token:", err)
            c.JSON(401, gin.H{"error": "Unauthorized: Invalid token"})
            c.Abort()
            return
        }

        // 3. Set context values
        c.Set("claims", claims)
        c.Set("userId", claims.UserId)
        c.Set("role", claims.Role)

        fmt.Printf("Authorized user - ID: %v, Role: %v\n", claims.UserId, claims.Role)

        c.Next()

    }
}