// PATH: go-auth/routes/auth.go

package routes

import (
	"go-auth/controllers"
	"go-auth/middlewares"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(r *gin.Engine) {
	

	// r.POST("/signup", controllers.Signup)

	// r.POST("/login", controllers.Login)

	// Signup routes
	// Signup routes
	r.POST("/user/signup", func(c *gin.Context) {
		controllers.SignupWithRole(c, "user")
	})
	r.POST("/admin/signup", func(c *gin.Context) {
		controllers.SignupWithRole(c, "admin")
	})

	// Login routes
	r.POST("/user/login", func(c *gin.Context) {
		controllers.LoginWithRole(c, "user")
	})
	r.POST("/admin/login", func(c *gin.Context) {
		controllers.LoginWithRole(c, "admin")
	})

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


	// public api's

	r.GET("/get-movies", controllers.GetMovies)
	r.GET("/get-theatres", controllers.GetTheatres)
	r.GET("/get-showtime", controllers.GetShowTimes)
	r.GET("/get-show",controllers.GetShow)
	r.GET("/get-movie-byname",controllers.GetMovieByName)


	
	// user routes
	user := r.Group("/")
	user.Use( middlewares.UserAuthorized())
	user.POST("/add-review", controllers.AddReview)
	user.GET("/get-review", controllers.GetReviews)
	user.POST("/api-payu", controllers.Payment)
	user.POST("/update-profile",controllers.UpdateProfile)
	user.GET("/booked-seats",controllers.GetBookedSeats)
	user.GET("/get-paid-ticket",controllers.GetPaidTicketUser)

}