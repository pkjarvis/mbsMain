package controllers

import (
        "go-auth/utils"
        "github.com/gin-gonic/gin"

)

func UploadImageHandler(c *gin.Context) {
    file, fileHeader, err := c.Request.FormFile("image")
    if err != nil {
        c.JSON(400, gin.H{"error": "Invalid image"})
        return
    }
    defer file.Close()

    url, err := utils.UploadImageToGCS(file, fileHeader)
    if err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    c.JSON(200, gin.H{"url": url})
}