# internal/Dockerfile

# Start from official Go image
FROM golang:1.24

# Set working directory inside container
WORKDIR /app

# Copy go.mod and go.sum
COPY go.mod go.sum ./



# Download dependencies
RUN go mod download

# Copy the rest of the code
COPY . .

# Build the application
RUN go build -o server main.go


# Expose port (same as your app port)
EXPOSE 8080

# Start the app
CMD ["./server"]
