package main

import (
	"fmt"
	"os"

	"github.com/skygenesisenterprise/aether-shield/cmd/internal/config"
	"github.com/skygenesisenterprise/aether-shield/cmd/internal/context"
	"github.com/skygenesisenterprise/aether-shield/cmd/shieldctl"
)

func main() {
	// Initialiser la configuration
	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Erreur de configuration: %v\n", err)
		os.Exit(1)
	}

	// Créer le contexte global
	ctx := context.New(cfg)

	// Lancer la commande principale
	if err := shieldctl.Execute(ctx); err != nil {
		fmt.Fprintf(os.Stderr, "Erreur: %v\n", err)
		os.Exit(1)
	}
}
