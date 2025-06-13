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

    protected.POST("/add-movie",controllers.AddMovie);
    protected.POST("/add-theatre",controllers.AddTheatre);
    protected.POST("/add-showtime",controllers.AddShowTime);


    protected.POST("/delete-movie",controllers.DeleteMovie);
    protected.POST("/delete-theatre",controllers.DeleteTheatre);
    protected.POST("/delete-showtime",controllers.DeleteShowTime);

 
}



