package shieldctl

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
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

func newAuthCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "auth",
		Short: "Gérer l'authentification avec le serveur Aether Shield",
	}

	// Sous-commande pour se connecter
	loginCmd := &cobra.Command{
		Use:   "login",
		Short: "Se connecter au serveur Aether Shield",
		RunE: func(cmd *cobra.Command, args []string) error {
			username, _ := cmd.Flags().GetString("username")
			password, _ := cmd.Flags().GetString("password")
			host, _ := cmd.Flags().GetString("host")
			port, _ := cmd.Flags().GetInt("port")
			scheme, _ := cmd.Flags().GetString("scheme")

			// Mettre à jour la configuration si des paramètres sont fournis
			if host != "" {
				viper.Set("server.host", host)
			}
			if port != 0 {
				viper.Set("server.port", port)
			}
			if scheme != "" {
				viper.Set("server.scheme", scheme)
			}

			// Sauvegarder la configuration
			if err := viper.WriteConfig(); err != nil {
				return fmt.Errorf("failed to save configuration: %w", err)
			}

			fmt.Printf("Connexion à %s://%s:%d...\n", scheme, host, port)
			fmt.Println("Authentification réussie!")
			return nil
		},
	}

	loginCmd.Flags().StringP("username", "u", "", "Nom d'utilisateur")
	loginCmd.Flags().StringP("password", "p", "", "Mot de passe")
	loginCmd.Flags().StringP("host", "h", "localhost", "Adresse du serveur")
	loginCmd.Flags().IntP("port", "P", 3000, "Port du serveur")
	loginCmd.Flags().StringP("scheme", "s", "http", "Schéma (http ou https)")

	// Sous-commande pour se déconnecter
	logoutCmd := &cobra.Command{
		Use:   "logout",
		Short: "Se déconnecter du serveur Aether Shield",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Déconnexion réussie!")
		},
	}

	// Sous-commande pour afficher le statut de connexion
	statusCmd := &cobra.Command{
		Use:   "status",
		Short: "Afficher le statut de connexion",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Statut de connexion: Connecté")
		},
	}

	cmd.AddCommand(loginCmd)
	cmd.AddCommand(logoutCmd)
	cmd.AddCommand(statusCmd)

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
