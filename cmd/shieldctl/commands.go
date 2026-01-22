package shieldctl

import (
	"fmt"
	"github.com/spf13/cobra"
)

func newVersionCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "version",
		Short: "Afficher la version de shieldctl",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("shieldctl v1.0.0")
			fmt.Println("Aether Shield Console")
		},
	}
	return cmd
}

func newStatusCommand(ctx interface{}) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "status",
		Short: "Afficher le statut du système",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Statut du système: Opérationnel")
		},
	}
	return cmd
}

func newServiceCommand(ctx interface{}) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "service",
		Short: "Gérer les services système",
	}
	return cmd
}

func newNetworkCommand(ctx interface{}) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "network",
		Short: "Gérer la configuration réseau",
	}
	return cmd
}

func newSecurityCommand(ctx interface{}) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "security",
		Short: "Gérer la sécurité",
	}
	return cmd
}

func newMaintenanceCommand(ctx interface{}) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "maintenance",
		Short: "Outils de maintenance",
	}
	return cmd
}
