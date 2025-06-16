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
	protected := r.Group("/")
	protected.Use(middlewares.IsAuthorized())

	// add api
	protected.POST("/add-movie", controllers.AddMovie)
	protected.POST("/add-theatre", controllers.AddTheatre)
	protected.POST("/add-showtime", controllers.AddShowTime)

	// delete api
	protected.POST("/delete-movie", controllers.DeleteMovie)
	protected.POST("/delete-theatre", controllers.DeleteTheatre)
	protected.POST("/archive-showtime", controllers.ArchiveShowTime)

	// update api
	protected.POST("/update-movie", controllers.UpdateMovie)
	protected.POST("/update-theatre", controllers.UpdateTheatre)
	protected.POST("/update-showtime", controllers.UpdateShowTime)

	// get data api's
	protected.GET("/get-movies",controllers.GetMovies)
	protected.GET("/get-theatres",controllers.GetTheatres)
	protected.GET("/get-showtime",controllers.GetShowTime)

}
