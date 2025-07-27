package utils

import (
    "cloud.google.com/go/storage"
    "context"
    "fmt"
    "mime/multipart"
    "time"
    "google.golang.org/api/option"
    "io"
    "os"
   
)
// /home/singh_pankaj/solid-authority-465116-t6-b5c58e5a12d5.json -> it's on vm address
// const (
//     BUCKET_NAME      := os.Getenv("BUCKET_NAME") // your GCS bucket
//     CREDENTIALS_PATH := os.Getenv("CREDENTIALS_PATH") // full path to your JSON key
// )

func UploadImageToGCS(file multipart.File, header *multipart.FileHeader) (string, error) {
    BUCKET_NAME      := os.Getenv("BUCKET_NAME")
    CREDENTIALS_PATH := os.Getenv("CREDENTIALS_PATH")
    ctx := context.Background()
    client, err := storage.NewClient(ctx, option.WithCredentialsFile(CREDENTIALS_PATH))
    if err != nil {
        return "", fmt.Errorf("failed to create GCS client: %v", err)
    }
    defer client.Close()

    filename := fmt.Sprintf("img_%d_%s", time.Now().Unix(), header.Filename)

    wc := client.Bucket(BUCKET_NAME).Object(filename).NewWriter(ctx)
    wc.ContentType = header.Header.Get("Content-Type")

    if _, err := file.Seek(0, 0); err != nil {
        return "", fmt.Errorf("failed to rewind file: %v", err)
    }

    if _, err := io.Copy(wc, file); err != nil {
        return "", fmt.Errorf("failed to upload to GCS: %v", err)
    }

    if err := wc.Close(); err != nil {
        return "", fmt.Errorf("failed to close GCS writer: %v", err)
    }

    url := fmt.Sprintf("https://storage.googleapis.com/%s/%s", BUCKET_NAME, filename)
    return url, nil
}
