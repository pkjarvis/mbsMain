// PATH: go-auth/middlewares/isAuthorized.go

package middlewares

import (
    "go-auth/utils"
    "net/http"
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

        c.Set("role", claims.Role)
        c.Next()
    }
}

func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // your frontend origin
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}



