package config

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

type Config struct {
	JWTSecret          string
	RefreshTokenSecret string
	Mode               string
	Database           *sql.DB
}

func Load() *Config {
	// Initialize database connection
	db, err := sql.Open("postgres", getEnv("DATABASE_URL", "postgres://user:password@localhost/aether_shield?sslmode=disable"))
	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}

	return &Config{
		JWTSecret:          getEnv("JWT_SECRET", "your-secret-key"),
		RefreshTokenSecret: getEnv("REFRESH_TOKEN_SECRET", "your-refresh-secret-key"),
		Mode:               getEnv("GIN_MODE", "debug"),
		Database:           db,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
