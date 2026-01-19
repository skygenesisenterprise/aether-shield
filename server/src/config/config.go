package config

import (
	"os"
)

type Config struct {
	JWTSecret          string
	RefreshTokenSecret string
	Mode               string
}

func Load() *Config {
	return &Config{
		JWTSecret:          getEnv("JWT_SECRET", "your-secret-key"),
		RefreshTokenSecret: getEnv("REFRESH_TOKEN_SECRET", "your-refresh-secret-key"),
		Mode:               getEnv("GIN_MODE", "debug"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
