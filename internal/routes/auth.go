// PATH: go-auth/routes/auth.go

package routes

import (
	"go-auth/controllers"
	"go-auth/middlewares"
	"github.com/gin-gonic/gin"
)

func AuthRoutes(r *gin.Engine) {

    r.POST("/signup", controllers.Signup)
  
    r.POST("/login", controllers.Login)


    // protected routes
    protected:=r.Group("/");
    protected.Use(middlewares.IsAuthorized());

    // r.GET("/home", controllers.Home)
    // r.GET("/premium", controllers.Premium)
    // r.GET("/logout", controllers.Logout)
}



