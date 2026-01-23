package shieldctl

import (
	"github.com/skygenesisenterprise/aether-shield/cmd/internal/context"
	"github.com/spf13/cobra"
)

// Execute lance la commande principale
func Execute(ctx *context.Context) error {
	rootCmd := NewRootCommand(ctx)
	return rootCmd.Execute()
}

// NewRootCommand crée la commande racine
func NewRootCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "shieldctl",
		Short: "Aether Shield Console",
		Long:  `Console système interactive pour Aether Shield`,
		RunE: func(cmd *cobra.Command, args []string) error {
			return runInteractiveMode(ctx)
		},
	}

	// Ajouter les sous-commandes
	cmd.AddCommand(newVersionCommand())
	cmd.AddCommand(newAuthCommand())
	cmd.AddCommand(newStatusCommand(ctx))
	cmd.AddCommand(newServiceCommand(ctx))
	cmd.AddCommand(newNetworkCommand(ctx))
	cmd.AddCommand(newSecurityCommand(ctx))
	cmd.AddCommand(newMaintenanceCommand(ctx))

	return cmd
}
