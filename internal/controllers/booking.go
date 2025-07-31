
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
	"go-auth/utils"

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





// func Payment(c *gin.Context) {
// 	var input struct {
// 		Price          float64         `json:"price"`
// 		Store          json.RawMessage `json:"store"` // raw seat array like ["L3", "L4"]
// 		MovieName      string          `json:"moviename"`
// 		MovieFile      string          `json:"moviefile"`
// 		TheatreName    string          `json:"theatrename"`
// 		TheatreAddress string          `json:"theatreaddress"`
// 		Date           string          `json:"date"`
// 		From           string          `json:"from"`
// 		To             string          `json:"to"`
// 		ShowID         string          `json:"showId"`
// 	}

// 	// Validate request body
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(400, gin.H{"error": "Binding failed in payment"})
// 		return
// 	}

// 	// Extract userId from context
// 	userIdVal, exists := c.Get("userId")
// 	if !exists {
// 		c.JSON(401, gin.H{"error": "User Id not found in context"})
// 		return
// 	}

// 	userId, ok := userIdVal.(uint)
// 	if !ok {
// 		c.JSON(400, gin.H{"error": "UserId is not in correct format"})
// 		return
// 	}
// 	fmt.Println("userIdVal is:", userIdVal)


// 	// Parse seat labels from input.Store (["L3", "L4"])
// 	var seatLabels []string
// 	if err := json.Unmarshal(input.Store, &seatLabels); err != nil {
// 		c.JSON(400, gin.H{"error": "Invalid seat data"})
// 		return
// 	}

// 	// STEP 1: Fetch Theatre ID from Theatre Name (you might already have it)
// 	var theatre models.Theatre
// 	if err := models.DB.Where("theatre_name = ?", input.TheatreName).First(&theatre).Error; err != nil {
// 		c.JSON(404, gin.H{"error": "Theatre not found"})
// 		return
// 	}

// 	// STEP 2: Verify if the requested seats are still locked by this user
// 	var seats []models.Seat
// 	if err := models.DB.Where("theatre_id = ? AND label IN ?", theatre.ID, seatLabels).Find(&seats).Error; err != nil {
// 		c.JSON(500, gin.H{"error": "Failed to fetch seats"})
// 		return
// 	}

// 	// STEP 3: Check if failed

// 	var failed []string
// 	for _, seat := range seats {
// 		// Seat must be locked and by this user only
// 		if seat.LockedBy == nil || *seat.LockedBy != userId {
// 			failed = append(failed, seat.Label)
// 			continue
// 		}
// 		// Optional: check if lock is expired (based on LockedAt + timeout)
// 		if seat.LockedAt != nil && time.Since(*seat.LockedAt) > 5*time.Minute {
// 			failed = append(failed, seat.Label)
// 		}
// 	}

// 	if len(failed) > 0 {
// 		c.JSON(409, gin.H{
// 			"error":  "Some seats are no longer locked by you or have expired",
// 			"failed": failed,
// 		})
// 		return
// 	}


// 	// Create transaction
// 	payment := models.Transaction{
// 		Amount:         input.Price,
// 		Ticket:         datatypes.JSON(input.Store),
// 		Status:         "pending",
// 		UserId:         &userId,
// 		TransactionId:  generateRandomTnxId(),
// 		MovieName:      input.MovieName,
// 		MovieFile:      input.MovieFile,
// 		TheatreName:    input.TheatreName,
// 		TheatreAddress: input.TheatreAddress,
// 		Date:           input.Date,
// 		StartTime:      input.From,
// 		EndTime:        input.To,
// 		ShowID:         input.ShowID,
// 	}

// 	// Save to DB
// 	if err := models.DB.Create(&payment).Error; err != nil {
// 		c.JSON(500, gin.H{"error": "Could not create transaction", "details": err.Error()})
// 		return
// 	}

// 	// Generate PayU payment data
// 	payUData := generatePayuPayment(payment)

// 	// Send response
// 	c.JSON(200, gin.H{
// 		"message":     "Transaction created and redirected to PayU",
// 		"transaction": payment,
// 		"payUData":    payUData,
// 	})
// }



// type ReservedSeat struct {
// 	ID        uint      `gorm:"primaryKey"`
// 	ShowID    string    `gorm:"index"`
// 	SeatCode  string    `gorm:"index"` // e.g., "A10"
// 	UserID    uint
// 	CreatedAt time.Time
// 	ExpiresAt time.Time // TTL reservation e.g., 5 min
// }

// func Payment(c *gin.Context) {
// 	var input struct {
// 		Price          float64         `json:"price"`
// 		Store          json.RawMessage `json:"store"` // raw seat array like ["L3", "L4"]
// 		MovieName      string          `json:"moviename"`
// 		MovieFile      string          `json:"moviefile"`
// 		TheatreName    string          `json:"theatrename"`
// 		TheatreAddress string          `json:"theatreaddress"`
// 		Date           string          `json:"date"`
// 		From           string          `json:"from"`
// 		To             string          `json:"to"`
// 		ShowID         string          `json:"showId"`
// 	}


// 	// Validate request body
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(400, gin.H{"error": "Binding failed in payment"})
// 		return
// 	}

// 	var requestedSeats []string
// 	if err := json.Unmarshal(input.Store, &requestedSeats); err != nil {
// 		c.JSON(400, gin.H{"error": "Invalid seat data"})
// 		return
// 	}
// 	tx := models.DB.Begin()

// 	var conflictingTransactions []models.Transaction
// 	if err := tx.
// 		Where("show_id = ? AND status = ?", input.ShowID, "paid").
// 		Find(&conflictingTransactions).Error; err != nil {
// 		tx.Rollback()
// 		c.JSON(500, gin.H{"error": "Error checking booked seats"})
// 		return
// 	}
// 	// Extract all booked seat codes
// 	var bookedSeats map[string]bool = map[string]bool{}
// 	for _, txn := range conflictingTransactions {
// 		var booked []string
// 		json.Unmarshal([]byte(txn.Ticket), &booked)
// 		for _, s := range booked {
// 			bookedSeats[s] = true
// 		}
// 	}

// 	// Check for conflicts
// 	for _, s := range requestedSeats {
// 		if bookedSeats[s] {
// 			tx.Rollback()
// 			c.JSON(409, gin.H{"error": fmt.Sprintf("Seat %s already booked", s)})
// 			return
// 		}
// 	}

// 	// Extract userId from context
// 	userIdVal, exists := c.Get("userId")
// 	if !exists {
// 		c.JSON(401, gin.H{"error": "User Id not found in context"})
// 		return
// 	}

// 	userId, ok := userIdVal.(uint)
// 	if !ok {
// 		c.JSON(400, gin.H{"error": "UserId is not in correct format"})
// 		return
// 	}
// 	fmt.Println("userIdVal is from payment handler is:", userIdVal)

// 	// Create transaction
// 	payment := models.Transaction{
// 		Amount:         input.Price,
// 		Ticket:         datatypes.JSON(input.Store),
// 		Status:         "pending",
// 		UserId:         &userId,
// 		TransactionId:  generateRandomTnxId(),
// 		MovieName:      input.MovieName,
// 		MovieFile:      input.MovieFile,
// 		TheatreName:    input.TheatreName,
// 		TheatreAddress: input.TheatreAddress,
// 		Date:           input.Date,
// 		StartTime:      input.From,
// 		EndTime:        input.To,
// 		ShowID:         input.ShowID,
// 	}

// 	// // Save to DB
// 	// if err := models.DB.Create(&payment).Error; err != nil {
// 	// 	c.JSON(500, gin.H{"error": "Could not create transaction", "details": err.Error()})
// 	// 	return
// 	// }
// 	if err := tx.Create(&payment).Error; err != nil {
// 		tx.Rollback()
// 		c.JSON(500, gin.H{"error": "Could not create transaction"})
// 		return
// 	}

// 	tx.Commit()

// 	// Generate PayU payment data
// 	payUData := generatePayuPayment(payment)

// 	// Send response
// 	c.JSON(200, gin.H{
// 		"message":     "Transaction created and redirected to PayU",
// 		"transaction": payment,
// 		"payUData":    payUData,
// 	})
// }

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

	// Step 1: Parse and validate input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	// Step 2: Extract userId from context
	userIdVal, exists := c.Get("userId")
	if !exists {
		c.JSON(401, gin.H{"error": "User ID not found in context"})
		return
	}
	userId, ok := userIdVal.(uint)
	if !ok {
		c.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}
	userIdStr := fmt.Sprintf("%d", userId)

	// Step 3: Parse selected seats
	var seatLabels []string
	if err := json.Unmarshal(input.Store, &seatLabels); err != nil {
		c.JSON(400, gin.H{"error": "Invalid seat data"})
		return
	}

	// Step 4: Validate seat locks in Redis
	var failed []string
	for _, seat := range seatLabels {
		locked, lockedBy := utils.IsSeatLocked(input.ShowID, seat)
		if !locked || lockedBy != userIdStr {
			failed = append(failed, seat)
		}
	}

	if len(failed) > 0 {
		c.JSON(409, gin.H{
			"error":  "Some seats are not locked by you or have expired",
			"failed": failed,
		})
		return
	}

	// Step 5: Create transaction
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

	if err := models.DB.Create(&payment).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create transaction", "details": err.Error()})
		return
	}

	// Step 6: Prepare payment payload
	payUData := generatePayuPayment(payment)

	// Step 7: Respond with transaction and payment data
	c.JSON(200, gin.H{
		"message":     "Transaction created and ready for payment",
		"transaction": payment,
		"payUData":    payUData,
	})
}




func PaymentSuccess(c *gin.Context) {
	fmt.Println("PaymentSuccess controller invoked")

	txnId := c.PostForm("txnid")
	status := c.PostForm("status")

	frontend := os.Getenv("ALLOWED_ORIGIN1")
	

	// Only proceed if PayU reports "success"
	if status != "success" {
		c.Redirect(302, fmt.Sprintf("%s/payment-status?success=false", frontend))
		return
	}

	// Step 1: Fetch transaction
	var txn models.Transaction
	if err := models.DB.Where("transaction_id = ?", txnId).First(&txn).Error; err != nil {
		fmt.Println("Transaction not found:", err)
		c.Redirect(302, fmt.Sprintf("%s/payment-status?success=false", frontend))
		return
	}

	// Step 2: Parse seat info from transaction
	var seats []string
	if err := json.Unmarshal(txn.Ticket, &seats); err != nil {
		fmt.Println("Failed to unmarshal ticket seats:", err)
		c.Redirect(302, fmt.Sprintf("%s/payment-status?success=false", frontend))
		return
	}

	// Step 3: Check if all seats are still locked by this user
	userIdStr := fmt.Sprintf("%d", *txn.UserId)
	var failed []string

	for _, seat := range seats {
		locked, lockedBy := utils.IsSeatLocked(txn.ShowID, seat)
		if !locked || lockedBy != userIdStr {
			failed = append(failed, seat)
		}
	}

	if len(failed) > 0 {
		// Step 4: If any seat failed, mark transaction failed and unlock any still-locked seats
		models.DB.Model(&models.Transaction{}).Where("transaction_id = ?", txnId).Update("status", "failed")

		for _, seat := range seats {
			utils.UnlockSeat(txn.ShowID, seat, userIdStr)
		}

		fmt.Println("Seats were not properly locked:", failed)
		c.Redirect(302, fmt.Sprintf("%s/payment-status?success=false", frontend))
		return
	}

	// Step 5: All seats are validly locked — mark transaction as paid
	if err := models.DB.Model(&models.Transaction{}).
		Where("transaction_id = ?", txnId).
		Update("status", "paid").Error; err != nil {
		fmt.Println("Failed to update transaction to paid:", err)
		c.Redirect(302, fmt.Sprintf("%s/payment-status?success=false", frontend))
		return
	}

	// Step 6: Success redirect
	fmt.Println("Payment success. Transaction marked as paid.")
	c.Redirect(302, fmt.Sprintf("%s/payment-status?success=true", frontend))
}


func PaymentFailure(c *gin.Context) {
	txnId := c.PostForm("txnid")
	var txn models.Transaction
	fmt.Println("Passed 1")
	if err := models.DB.Model(&models.Transaction{}).Where("transaction_id = ?", txnId).Update("status", "failed").Error; err != nil {
		c.JSON(400, gin.H{"error": "Failed to create transaction"})
		c.Abort()
		return
	}

	// Unlock seats from Redis
	var seats []string
	if err := json.Unmarshal(txn.Ticket, &seats); err == nil {
		userId := fmt.Sprintf("%d", *txn.UserId)
		for _, seat := range seats {
			utils.UnlockSeat(txn.ShowID, seat, userId)
		}
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

// Lock seats

type LockRequest struct {
	ShowID   string   `json:"showId"`
	Seats    []string `json:"seats"`
	UserID   string   `json:"userId"`
	Duration int      `json:"duration"` // in seconds
}
const defaultLockDuration = 300

func LockSeats(c *gin.Context) {
	var req LockRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	userIdVal, exists := c.Get("userId")
	if !exists {
		c.JSON(400, gin.H{"error": "User Id not found in context"})
		return
	}

	userId, ok := userIdVal.(uint)
	if !ok {
		c.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}
	// req.UserID=userId

	userIDStr := fmt.Sprintf("%d", userId)

	req.Duration=defaultLockDuration

	fmt.Println("user id is:",userIdVal)
	fmt.Println("duration is:",req.Duration)


	var failed []string
	for _, seat := range req.Seats {
		success := utils.LockSeat(req.ShowID, seat, userIDStr, time.Duration(req.Duration)*time.Second)
		if !success {
			failed = append(failed, seat)
		}
	}

	if len(failed) > 0 {
		c.JSON(409, gin.H{"error": "Some seats are already locked", "failed": failed})
		return
	}

	c.JSON(200, gin.H{"message": "Seats locked successfully"})
	
}


