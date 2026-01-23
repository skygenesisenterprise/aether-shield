package main

import (
	"fmt"
	"os"

	"github.com/skygenesisenterprise/aether-shield/package/cli/cmd"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/config"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
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
	if err := cmd.Execute(ctx); err != nil {
		fmt.Fprintf(os.Stderr, "Erreur: %v\n", err)
		os.Exit(1)
	}
}
