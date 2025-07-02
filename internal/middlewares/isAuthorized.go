// PATH: go-auth/middlewares/isAuthorized.go

package middlewares

import (
    // "go-auth/utils"
    "github.com/gin-gonic/gin"
    "fmt"
)

func IsAuthorized() gin.HandlerFunc {
    return func(c *gin.Context) {

        // fmt.Println("Check in middleware isAuthorized");

        // cookie, err := c.Cookie("token")               
        
        // fmt.Println("cookie is:",cookie)

        // fmt.Println("No error part 1")
        // if err != nil {
        //     c.JSON(401, gin.H{"error": "unauthorized"})
        //     c.Abort()
        //     return
        // }

        // fmt.Println("IsAuthorized middleware is running")

        // fmt.Println("No error part 2")

        // claims, err := utils.ParseToken(cookie)

        // fmt.Println("No error part 3")
        

        // if err != nil {
        //     c.JSON(401, gin.H{"error": "unauthorized"})
        //     c.Abort()
        //     return
        // }


        // fmt.Println("No error part 4")

        // c.Set("role", claims.Role)
        // c.Set("userId",claims.UserId)
        c.Next()
    }
}

func UserAuthorized() gin.HandlerFunc{
    return func(c*gin.Context){

        fmt.Print("UserAuthorized is running")

        userIdVal, exists := c.Get("userId")
        if !exists {
            c.JSON(401, gin.H{"error": "Unauthorized: userId not found"})
            c.Abort()
            return
        }

        

        userId, ok := userIdVal.(uint)
        if !ok {
            c.JSON(500, gin.H{"error": "Invalid userId type"})
            c.Abort()
            return
        }

        fmt.Println("Authorized userId:", userId)
        c.Next()

    }
}