// PATH: go-auth/middlewares/isAuthorized.go

package middlewares

import (
	"go-auth/utils"
	// "github.com/rs/cors"
	"github.com/gin-gonic/gin"
)


func IsAuthorized() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("token")

		if err != nil {
			c.JSON(401, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}

		claims, err := utils.ParseToken(cookie)

		if err != nil {
			c.JSON(401, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}

		c.Set("admin", claims.Role)
		c.Next()
	}
}


// func corsMiddleware() gin.HandlerFunc {
//     return func(c *gin.Context) {
//         c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
//         c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
//         c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

//         if c.Request.Method == "OPTIONS" {
//             c.AbortWithStatus(204)
//             return
//         }

//         c.Next()
//     }
// }

