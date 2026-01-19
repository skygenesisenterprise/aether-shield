package main

import (
	"log"
	"os"

	"github.com/skygenesisenterprise/aether-shield/server/src/config"
	"github.com/skygenesisenterprise/aether-shield/server/src/controllers"
	"github.com/skygenesisenterprise/aether-shield/server/src/middleware"
	"github.com/skygenesisenterprise/aether-shield/server/src/routes"
	"github.com/skygenesisenterprise/aether-shield/server/src/services"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	authService := services.NewAuthService(cfg.JWTSecret, cfg.RefreshTokenSecret)

	authController := controllers.NewAuthController(authService)
	authMiddleware := middleware.NewAuthMiddleware(authService)

	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	if cfg.Mode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	routes.SetupRoutes(router, authController, authMiddleware)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(router.Run(":" + port))
}
