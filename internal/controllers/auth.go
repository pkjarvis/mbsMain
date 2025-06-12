package controllers

import (
	"go-auth/models"
	"os"
	"time"
	"go-auth/utils"
	"github.com/dgrijalva/jwt-go" 
	"github.com/gin-gonic/gin"
    "encoding/json"
	"gorm.io/datatypes"
    "github.com/joho/godotenv"
    "log"
    
)






  func Login(c *gin.Context) {

      var user models.User

      if err := c.ShouldBindJSON(&user); err != nil {
          c.JSON(400, gin.H{"error": err.Error()})
          return
      }

      var existingUser models.User

      models.DB.Where("email = ?", user.Email).First(&existingUser)

      if existingUser.ID == 0 {
          c.JSON(400, gin.H{"error": "user does not exist"})
          return
      }

      errHash := utils.CompareHashPassword(user.Password, existingUser.Password)

      if !errHash {
          c.JSON(400, gin.H{"error": "invalid password"})
          return
      }

      expirationTime := time.Now().Add(15 * time.Minute)

      claims := &models.Claims{
          Role: existingUser.Role,
          StandardClaims: jwt.StandardClaims{
              Subject:   existingUser.Email,
              ExpiresAt: expirationTime.Unix(),
          },
      }

      token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

      err1 := godotenv.Load()
      if err1 != nil {
          log.Fatal("Error loading .env file")
        }
        var jwtKey = []byte(os.Getenv("SECRET"));

      tokenString, err := token.SignedString(jwtKey)

      if err != nil {
          c.JSON(500, gin.H{"error": "could not generate token"})
          return
      }

      // SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
      c.SetCookie("token", tokenString, 7*24*60*60, "/", "localhost", false, true)





      c.JSON(200,gin.H{"token":tokenString,
      "msg":"logged in ",
    })
      

  }



  func Signup(c *gin.Context) {
      var user models.User

      if err := c.ShouldBindJSON(&user); err != nil {
          c.JSON(400, gin.H{"error": err.Error()})
          return
      }

      var existingUser models.User

      models.DB.Where("email = ?", user.Email).First(&existingUser)

      if existingUser.ID != 0 {
          c.JSON(400, gin.H{"error": "user already exists"})
          return
      }

      user.Role="admin";

      var errHash error
      user.Password, errHash = utils.GenerateHashPassword(user.Password)

      if errHash != nil {
          c.JSON(500, gin.H{"error": "could not generate password hash"})
          return
      }

      models.DB.Create(&user)

      c.JSON(200, gin.H{"success": "user created"})
  }




  func Home(c *gin.Context) {

      cookie, err := c.Cookie("token")

      if err != nil {
          c.JSON(401, gin.H{"error": "unauthorized"})
          return
      }

      claims, err := utils.ParseToken(cookie)

      if err != nil {
          c.JSON(401, gin.H{"error": "unauthorized"})
          return
      }

      if claims.Role != "user" && claims.Role != "admin" {
          c.JSON(401, gin.H{"error": "unauthorized"})
          return
      }

      c.JSON(200, gin.H{"success": "home page", "role": claims.Role})
  }


  func Premium(c *gin.Context) {

      cookie, err := c.Cookie("token")

      if err != nil {
          c.JSON(401, gin.H{"error": "unauthorized"})
          return
      }

      claims, err := utils.ParseToken(cookie)

      if err != nil {
          c.JSON(401, gin.H{"error": "unauthorized"})
          return
      }

      if claims.Role != "admin" {
          c.JSON(401, gin.H{"error": "unauthorized"})
          return
      }

      c.JSON(200, gin.H{"success": "premium page", "role": claims.Role})
  }


  func Logout(c *gin.Context) {
      c.SetCookie("token", "", -1, "/", "localhost", false, true)
      c.JSON(200, gin.H{"success": "user logged out"})
  }


  func AddMovie(c*gin.Context){
    // Here this struct gets mapped to model but json validates the tpes coming from frontend
    
    var input struct{
        Id           uint    `json:"id"`
        Movie        string `json:"movie"`
        Description  string `json:"description"`
        Genre        string `json:"genre"`
        StartDate    string `json:"startDate"`
        EndDate      string `json:"endDate"`
        Language    []string `json:"language"`
        Status       string `json:"status"`
        MovieURL     string `json:"file"`
    }

    if err:=c.ShouldBindJSON(&input);err!=nil{
        c.JSON(400,gin.H{
            "error":err.Error(),
        })
        return
    }

    languagebytes,err:=json.Marshal(input.Language)

    if err!=nil{
        c.JSON(500,gin.H{"error":"failed to marshal language"})
        return
    }
    


    // parsing into time format 
    
   dateFormat:="Mon Jan 2 2006 15:04:05 GMT-0700 (MST)"
   parsedStartDate,err:=time.Parse(dateFormat,input.StartDate)
   if err!=nil{
    c.JSON(400,gin.H{"error":"Invalid StartDate format"+err.Error()})
   }

   parsedEndDate,err:=time.Parse(dateFormat,input.EndDate)
   if err!=nil{
    c.JSON(400,gin.H{"error":"Invalid EndDate format"+err.Error()})
   }


    movie:=models.Movie{
        Id: input.Id,
        Title:input.Movie,
        Description:input.Description,
        Genre:input.Genre,
        StartDate:parsedStartDate,
        EndDate:parsedEndDate,
        Languages:datatypes.JSON(languagebytes),
        Status:input.Status,
        MovieURL:input.MovieURL,
    }

    if err:=models.DB.Create(&movie).Error;err!=nil{
        c.JSON(500,gin.H{"error":"failed to create movie"})
    }

    c.JSON(200,gin.H{"message":"movie added","movie":movie})


  }


func AddTheatre(c*gin.Context){
    var input struct{
        Id uint `json:"id"`
        Theatre string `json:"theatrename"`
        Address string `json:"address"`
        CityName string `json:"cityName"`
        StateName string `json:"stateName"`
        Status string `json:"status"`
        TotalScreens uint `json:"totalscreens"`
        TheatreURL  string `json:"theatrefile"`
        Value []string `json:"value"`
    }

    if err:=c.ShouldBindJSON(&input);err!=nil{
        c.JSON(400,gin.H{"error":err.Error()})
        return
    }

    valuebytes,err:=json.Marshal(input.Value)

    if err!=nil{
        c.JSON(500,gin.H{"error":"failed to marshal value"})
        return
    }

    theatre:=models.Theatre{
        Id:input.Id,
        TheatreName:input.Theatre,
        Address:input.Address,
        CityName: input.CityName,
        StateName: input.StateName,
        Status:input.Status,
        TotalScreens: input.TotalScreens,
        TheatreURL: input.TheatreURL,
        Value: valuebytes,
    }

    if err:=models.DB.Create(&theatre).Error;err!=nil{
        c.JSON(500,gin.H{"error":"failed to create theatre"})
        return
    }
    c.JSON(200,gin.H{"message":"theatre added","theatre":theatre})

}


func AddShowTime(c*gin.Context){
    var input struct{
        Id uint `json:"id"`
        TheatreName string `json:"theatrename"`
        StartDate string `json:"startDate"`
        MovieName string `josn:"moviename"`
        ShowStartTime string `json:"datetime12h"`
        ShowEndTime string `json:"datetime"`
        TimeArray []string `json:"timearray"`
        Language []string `json:"language"`
        Archived bool `json:"archived"`
    }

    if err:=c.ShouldBindJSON(&input);err!=nil{
        c.JSON(400,gin.H{
            "error":err.Error(),
        })
        return
    }

    languagebytes,err:=json.Marshal(input.Language)
    
    if err!=nil{
        c.JSON(500,gin.H{"error":"failed to marshal language"})
        return
    }

    timearraybytes,err:=json.Marshal(input.TimeArray)

    if err!=nil{
        c.JSON(500,gin.H{"error":"failed to marshal timearray"})
    }


    // parsing into time format
    dateFormat:="Mon Jan 2 2006 15:04:05 GMT-0700 (MST)"


    // parsedShowStartTime,err:=time.Parse(dateFormat,input.ShowStartTime)

    // if err!=nil{
    //     c.JSON(400,gin.H{"error":"Invalid ShowStartTime format"+err.Error()})
    // }

    // parsedShowEndTime,err:=time.Parse(dateFormat,input.ShowEndTime)

    // if err!=nil{
    //     c.JSON(400,gin.H{"error":"Invalid ShowEndTime format"+err.Error()})
    // }

    parsedStartDate,err:=time.Parse(dateFormat,input.StartDate)

    if err!=nil{
        c.JSON(400,gin.H{"error":"Invalid StartDate format"+err.Error()})
    }

    showtime:=models.Showtime{
        Id:input.Id,
        TheatreName: input.TheatreName,
        StartDate: parsedStartDate,
        MovieName: input.MovieName,
        ShowStartTime:input.ShowStartTime,
        ShowEndTime: input.ShowEndTime,
        TimeArray: timearraybytes,
        Language: languagebytes,
        Archived: input.Archived,

    }

    if err:=models.DB.Create(&showtime).Error;err!=nil{
        c.JSON(500,gin.H{"error":"failed to add showtime"})
    }

    c.JSON(200,gin.H{"message":"showtime added","showtime":showtime})

}