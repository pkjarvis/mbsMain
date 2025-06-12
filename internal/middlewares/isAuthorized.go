// PATH: go-auth/middlewares/isAuthorized.go

package middlewares

import (
    "go-auth/utils"
    "github.com/gin-gonic/gin"
    "fmt"
)

func IsAuthorized() gin.HandlerFunc {
    return func(c *gin.Context) {
        cookie, err := c.Cookie("token")               
        
        fmt.Println("cookie is:",cookie)

        fmt.Println("No error part 1")
        if err != nil {
            c.JSON(401, gin.H{"error": "unauthorized"})
            c.Abort()
            return
        }

        fmt.Println("No error part 2")

        claims, err := utils.ParseToken(cookie)

        fmt.Println("No error part 3")
        fmt.Println("Check",err);

        if err != nil {
            c.JSON(401, gin.H{"error": "unauthorized"})
            c.Abort()
            return
        }


        fmt.Println("No error part 4")

        c.Set("role", claims.Role)
        c.Next()
    }
}





