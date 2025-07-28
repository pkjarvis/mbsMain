
package controllers

import (
	"fmt"
	"encoding/json"
	"go-auth/models"
	"time"
	"gorm.io/datatypes"
	"os"
	"log"
	"github.com/gin-gonic/gin"
	"crypto/sha512"
	"encoding/hex"

)


// Payu integration  ---------------------------

func generateRandomTnxId() string {
	return fmt.Sprintf("TXN-%d", time.Now().UnixNano())
}

// ngrok used for using public url instead of local - https://122f-139-5-254-235.ngrok-free.app

func generatePayuPayment(tx models.Transaction) map[string]interface{} {
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }

	key := os.Getenv("KEY")
	salt := os.Getenv("SALT")

	actionURL := "https://test.payu.in/_payment"

	// productinfo, firstname, email are required fields
	productinfo := "MovieBooking"
	firstname := "testuser"
	email := "test@example.com"

	// PayU hash format must be exact
	hashString := fmt.Sprintf(
		"%s|%s|%.2f|%s|%s|%s|||||||||||%s",
		key,
		tx.TransactionId,
		tx.Amount,
		productinfo,
		firstname,
		email,
		salt,
	)

	hash := sha512.Sum512([]byte(hashString))
	hashHex := hex.EncodeToString(hash[:])

	successurl := os.Getenv("SUCCESS_URL")

	// if successurl == "" {
	// 	successurl = "http://34.131.125.137:8080"
	// }

	fmt.Println("successurl is", successurl)

	return map[string]interface{}{
		"payuFormFields": map[string]string{
			"key":         key,
			"city":        "city",
			"furl":        fmt.Sprintf("%s/payment-failure", successurl),
			"hash":        hashHex,
			"surl":        fmt.Sprintf("%s/payment-success", successurl),
			"email":       email,
			"phone":       "phone number",
			"state":       "state",
			"txnid":       tx.TransactionId,
			"amount":      fmt.Sprintf("%.2f", tx.Amount),
			"country":     "India",
			"zipcode":     "pincode",
			"address1":    "address",
			"firstname":   firstname,
			"productinfo": productinfo,
		},
		"actionURL": actionURL,
	}

}

type ReservedSeat struct {
	ID        uint      `gorm:"primaryKey"`
	ShowID    string    `gorm:"index"`
	SeatCode  string    `gorm:"index"` // e.g., "A10"
	UserID    uint
	CreatedAt time.Time
	ExpiresAt time.Time // TTL reservation e.g., 5 min
}

func Payment(c *gin.Context) {
	var input struct {
		Price          float64         `json:"price"`
		Store          json.RawMessage `json:"store"` // raw seat array like ["L3", "L4"]
		MovieName      string          `json:"moviename"`
		MovieFile      string          `json:"moviefile"`
		TheatreName    string          `json:"theatrename"`
		TheatreAddress string          `json:"theatreaddress"`
		Date           string          `json:"date"`
		From           string          `json:"from"`
		To             string          `json:"to"`
		ShowID         string          `json:"showId"`
	}


	// Validate request body
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Binding failed in payment"})
		return
	}

	var requestedSeats []string
	if err := json.Unmarshal(input.Store, &requestedSeats); err != nil {
		c.JSON(400, gin.H{"error": "Invalid seat data"})
		return
	}
	tx := models.DB.Begin()

	var conflictingTransactions []models.Transaction
	if err := tx.
		Where("show_id = ? AND status = ?", input.ShowID, "paid").
		Find(&conflictingTransactions).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "Error checking booked seats"})
		return
	}
	// Extract all booked seat codes
	var bookedSeats map[string]bool = map[string]bool{}
	for _, txn := range conflictingTransactions {
		var booked []string
		json.Unmarshal([]byte(txn.Ticket), &booked)
		for _, s := range booked {
			bookedSeats[s] = true
		}
	}

	// Check for conflicts
	for _, s := range requestedSeats {
		if bookedSeats[s] {
			tx.Rollback()
			c.JSON(409, gin.H{"error": fmt.Sprintf("Seat %s already booked", s)})
			return
		}
	}

	// Extract userId from context
	userIdVal, exists := c.Get("userId")
	if !exists {
		c.JSON(401, gin.H{"error": "User Id not found in context"})
		return
	}

	userId, ok := userIdVal.(uint)
	if !ok {
		c.JSON(400, gin.H{"error": "UserId is not in correct format"})
		return
	}
	fmt.Println("userIdVal is from payment handler is:", userIdVal)

	// Create transaction
	payment := models.Transaction{
		Amount:         input.Price,
		Ticket:         datatypes.JSON(input.Store),
		Status:         "pending",
		UserId:         &userId,
		TransactionId:  generateRandomTnxId(),
		MovieName:      input.MovieName,
		MovieFile:      input.MovieFile,
		TheatreName:    input.TheatreName,
		TheatreAddress: input.TheatreAddress,
		Date:           input.Date,
		StartTime:      input.From,
		EndTime:        input.To,
		ShowID:         input.ShowID,
	}

	// // Save to DB
	// if err := models.DB.Create(&payment).Error; err != nil {
	// 	c.JSON(500, gin.H{"error": "Could not create transaction", "details": err.Error()})
	// 	return
	// }
	if err := tx.Create(&payment).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "Could not create transaction"})
		return
	}

	tx.Commit()

	// Generate PayU payment data
	payUData := generatePayuPayment(payment)

	// Send response
	c.JSON(200, gin.H{
		"message":     "Transaction created and redirected to PayU",
		"transaction": payment,
		"payUData":    payUData,
	})
}

func PaymentSuccess(c *gin.Context) {
	fmt.Println("Check if controller is running or not")

	txnId := c.PostForm("txnid")
	status := c.PostForm("status")

	if status == "success" {
		if err := models.DB.Model(&models.Transaction{}).Where("transaction_id = ?", txnId).Update("status", "paid").Error; err != nil {
			c.JSON(400, gin.H{"error": "Failed to create Transaction Model"})
			c.Abort()
			return
		}
	}
	fmt.Println("redirect message")
	frontend := os.Getenv("ALLOWED_ORIGIN1")
	// if frontend == "" {
	// 	frontend = "http://34.131.125.137"
	// }

	c.Redirect(302, fmt.Sprintf("%s/payment-status?success=true", frontend))

}

func PaymentFailure(c *gin.Context) {
	txnId := c.PostForm("txnid")
	fmt.Println("Passed 1")
	if err := models.DB.Model(&models.Transaction{}).Where("transaction_id = ?", txnId).Update("status", "failed").Error; err != nil {
		c.JSON(400, gin.H{"error": "Failed to create transaction"})
		c.Abort()
		return
	}

	fmt.Println("Passed 2")

	frontend := os.Getenv("ALLOWED_ORIGIN1")
	// if frontend == "" {
	// 	frontend = "http://34.131.125.137"
	// }

	c.Redirect(302, fmt.Sprintf("%s/payment-status?success=false", frontend))

}


func GetBookedSeats(c *gin.Context) {
	showIdParam := c.Query("showId")

	if showIdParam == "" {
		c.JSON(400, gin.H{"error": "missing showId"})
		return
	}

	log.Println("Incoming showId:", showIdParam)

	var transactions []models.Transaction
	if err := models.DB.Where("show_id = ? AND status = ?", showIdParam, "paid").Find(&transactions).Error; err != nil {
		log.Println("DB ERROR:", err) // print full error
		c.JSON(500, gin.H{"error": "Failed to fetch transactions"})
		return
	}
	c.JSON(200, gin.H{"tickets": transactions})

}

func GetPaidTicketUser(c *gin.Context) {

	var transactions []models.Transaction
	userIDVal, exists := c.Get("userId")
	if !exists {
		c.JSON(401, gin.H{"message": "Unauthorized"})
		return
	}

	userID, ok := userIDVal.(uint)
	if !ok {
		c.JSON(400, gin.H{"message": "Invalid userId format"})
		return
	}

	if err := models.DB.Where("status = ? AND user_id = ?", "paid", userID).Find(&transactions).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch transactions"})
		return
	}

	c.JSON(200, gin.H{"tickets": transactions})

}