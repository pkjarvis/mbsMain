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

	// promote, demote
	protected.POST("/promote", controllers.PromoteUser)
	protected.POST("/demote", controllers.DemoteUser)

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
	protected.POST("/update-seat-layout", controllers.UpdateSeatLayout)
	r.POST("/upload", controllers.UploadImageHandler)

	// public api's

	r.GET("/get-movies", controllers.GetMovies)
	r.GET("/get-theatres", controllers.GetTheatres)
	r.GET("/get-showtime", controllers.GetShowTimes)
	r.GET("/get-show", controllers.GetShow)
	r.GET("/get-movie-byname", controllers.GetMovieByName)
	r.GET("/get-movie-byid", controllers.GetMovieById)
	r.GET("/get-state", controllers.GetState)
	r.GET("/get-review-bymovie", controllers.GetReviewByMovie)
	r.GET("/get-showtime/:id", controllers.GetShowTimeByID)
	r.GET("/get-theatre-byname", controllers.GetTheatreByName)
	r.GET("/seat-layout", controllers.GetSeatLayout)
	r.GET("/seats", controllers.GetSeatsByTheatre)
	// r.POST("/lock-seats", controllers.LockSeats)

	// user routes
	user := r.Group("/")
	user.Use(middlewares.UserAuthorized())
	user.GET("/user-details", controllers.GetUserDetails)
	user.POST("/add-review", controllers.AddReview)
	user.GET("/get-review", controllers.GetReviews)
	user.POST("/api-payu", controllers.Payment)
	user.POST("/update-profile", controllers.UpdateProfile)
	user.GET("/booked-seats", controllers.GetBookedSeats)
	user.GET("/get-paid-ticket", controllers.GetPaidTicketUser)
	user.POST("/save-state", controllers.SaveUserState)

	// Locking of seats
	user.POST("/lock-seats",controllers.LockSeats)


}