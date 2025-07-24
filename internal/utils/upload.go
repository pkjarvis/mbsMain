package utils

import (
	
        "context"
        "fmt"
        "io"
        "mime/multipart"
        "os"
        "time"
        "cloud.google.com/go/storage"

)

func UploadImageToGCS(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
        ctx := context.Background()

        client, err := storage.NewClient(ctx)
        if err != nil {
                return "", err
        }
        defer client.Close()

        bucketName := os.Getenv("BUCKET_NAME")
        objectName := fmt.Sprintf("images/%d_%s", time.Now().Unix(), fileHeader.Filename)

        wc := client.Bucket(bucketName).Object(objectName).NewWriter(ctx)
        wc.ContentType = fileHeader.Header.Get("Content-Type")

        if _, err := io.Copy(wc, file); err != nil {
                return "", err
        }
        if err := wc.Close(); err != nil {
                return "", err
        }

        publicURL := fmt.Sprintf("https://storage.googleapis.com/%s/%s", bucketName, objectName)
        return publicURL, nil
}