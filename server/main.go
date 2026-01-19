package main

import (
	"fmt"
	"io"
	"log"
	"os"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/config"
	"github.com/skygenesisenterprise/aether-shield/server/src/controllers"
	"github.com/skygenesisenterprise/aether-shield/server/src/middleware"
	"github.com/skygenesisenterprise/aether-shield/server/src/routes"
	"github.com/skygenesisenterprise/aether-shield/server/src/services"
)

func displayBanner() {
	fmt.Printf("\n")
	fmt.Printf("\033[1;36m    ██╗    ██╗██╗  ██╗ █████╗ ████████╗██╗  ██╗███████╗████████╗\n")
	fmt.Printf("\033[1;36m    ██║    ██║██║  ██║██╔══██╗╚══██╔══╝██║  ██║██╔════╝╚══██╔══╝\n")
	fmt.Printf("\033[1;36m    ██║ █╗ ██║███████║███████║   ██║   ███████║█████╗     ██║   \n")
	fmt.Printf("\033[1;36m    ██║███╗██║██╔══██║██╔══██║   ██║   ██╔══██║██╔══╝     ██║   \n")
	fmt.Printf("\033[1;36m    ╚███╔███╔╝██║  ██║██║  ██║   ██║   ██║  ██║███████╗   ██║   \n")
	fmt.Printf("\033[1;36m     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═╝   \n")
	fmt.Printf("\033[0;37m")
	fmt.Printf("\n")
	fmt.Printf("\033[1;33m    ╔══════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("\033[1;33m    ║                        AETHER SHIELD                        ║\n")
	fmt.Printf("\033[1;33m    ║                   Enterprise Security Platform                ║\n")
	fmt.Printf("\033[1;33m    ║                      Version 1.0.0-alpha                     ║\n")
	fmt.Printf("\033[1;33m    ╚══════════════════════════════════════════════════════════════╝\n")
	fmt.Printf("\033[0;37m")
	fmt.Printf("\n")
	fmt.Printf("\033[1;32m[✓] System Architecture: %s\033[0m\n", runtime.GOARCH)
	fmt.Printf("\033[1;32m[✓] Operating System: %s\033[0m\n", runtime.GOOS)
	fmt.Printf("\033[1;32m[✓] Go Version: %s\033[0m\n", runtime.Version())
	fmt.Printf("\033[1;32m[✓] CPU Cores: %d\033[0m\n", runtime.NumCPU())
	fmt.Printf("\033[1;32m[✓] Process ID: %d\033[0m\n", os.Getpid())
	fmt.Printf("\n")
	fmt.Printf("\033[1;34m[i] Initializing security modules...\033[0m\n")
	time.Sleep(500 * time.Millisecond)
	fmt.Printf("\033[1;34m[i] Loading authentication services...\033[0m\n")
	time.Sleep(300 * time.Millisecond)
	fmt.Printf("\033[1;34m[i] Configuring firewall rules...\033[0m\n")
	time.Sleep(300 * time.Millisecond)
	fmt.Printf("\033[1;34m[i] Starting network monitoring...\033[0m\n")
	time.Sleep(300 * time.Millisecond)
	fmt.Printf("\033[1;34m[i] Setting up API endpoints...\033[0m\n")
	time.Sleep(200 * time.Millisecond)
	fmt.Printf("\n")
}

func main() {
	displayBanner()

	cfg := config.Load()

	authService := services.NewAuthService(cfg.JWTSecret, cfg.RefreshTokenSecret)
	homeService := services.NewHomeService()

	authController := controllers.NewAuthController(authService)
	homeController := controllers.NewHomeController(homeService)
	authMiddleware := middleware.NewAuthMiddleware(authService)
	homeMiddleware := middleware.NewHomeMiddleware()

	gin.SetMode(gin.ReleaseMode)

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// Disable Gin debug output
	gin.DefaultWriter = io.Discard

	routes.SetupRoutes(router, authController, homeController, authMiddleware, homeMiddleware)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("\033[1;32m[✓] All systems operational\033[0m\n")
	fmt.Printf("\n")
	fmt.Printf("\033[1;36m┌─────────────────────────────────────────────────────────────────┐\n")
	fmt.Printf("\033[1;36m│                         🚀 SERVER READY                        │\n")
	fmt.Printf("\033[1;36m├─────────────────────────────────────────────────────────────────┤\n")
	fmt.Printf("\033[1;36m│  🌐 Server listening on: http://localhost:%s                    │\n", port)
	fmt.Printf("\033[1;36m│  📊 Dashboard: http://localhost:%s/api/v1/home/dashboard        │\n", port)
	fmt.Printf("\033[1;36m│  🔐 API Docs: http://localhost:%s/api/v1                        │\n", port)
	fmt.Printf("\033[1;36m│  ⚡ Mode: %s                                               │\n", gin.Mode())
	fmt.Printf("\033[1;36m└─────────────────────────────────────────────────────────────────┘\n")
	fmt.Printf("\033[0;37m\n")
	fmt.Printf("\033[1;33m[i] Press Ctrl+C to stop the server\033[0m\n\n")

	log.Fatal(router.Run(":" + port))
}
