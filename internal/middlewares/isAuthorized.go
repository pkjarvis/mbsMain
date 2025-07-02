// PATH: go-auth/middlewares/isAuthorized.go

package middlewares

import (
    // "go-auth/utils"
    "github.com/gin-gonic/gin"
    "fmt"
)

func IsAuthorized() gin.HandlerFunc {
    return func(c *gin.Context) {

        fmt.Println("Check in middleware isAuthorized")

        // cookie, err := c.Cookie("token")
        // fmt.Println("cookie is:", cookie)

        // if err != nil || cookie == "" {
        //     c.JSON(401, gin.H{"error": "unauthorized"})
        //     c.Abort()
        //     return
        // }

        // claims, err := utils.ParseToken(cookie)
        // if err != nil {
        //     c.JSON(401, gin.H{"error": "unauthorized"})
        //     c.Abort()
        //     return
        // }

        // c.Set("role", claims.Role)
        // c.Set("userId", claims.UserId)
        c.Next()
    }
}

func UserAuthorized() gin.HandlerFunc{
    return func(c*gin.Context){

        fmt.Println("Check in middleware isAuthorized")

        // cookie, err := c.Cookie("token")
        // fmt.Println("cookie is:", cookie)

        // if err != nil || cookie == "" {
        //     c.JSON(401, gin.H{"error": "unauthorized"})
        //     c.Abort()
        //     return
        // }

        // claims, err := utils.ParseToken(cookie)
        // if err != nil {
        //     c.JSON(401, gin.H{"error": "unauthorized"})
        //     c.Abort()
        //     return
        // }

        // c.Set("role", claims.Role)
        // c.Set("userId", claims.UserId)
        c.Next()

    }
}