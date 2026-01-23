package auth

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/auth"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/ui"
)

// NewLoginCommand crée la commande de connexion
func NewLoginCommand() *cobra.Command {
	var username string
	var password string
	var serverURL string

	cmd := &cobra.Command{
		Use:   "login",
		Short: "Se connecter au serveur Aether-Shield",
		Long: `Se connecter au serveur Aether-Shield avec des identifiants.

Cette commande authentifie l'utilisateur et stocke le token JWT dans le fichier de configuration.

Exemples:
  shield auth login -u admin -p motdepasse
  shield auth login -u admin -p motdepasse --server https://firewall.example.com
`,
		Run: func(cmd *cobra.Command, args []string) {
			// Vérifier que l'utilisateur a fourni un nom d'utilisateur et un mot de passe
			if username == "" {
				fmt.Println("Veuillez entrer votre nom d'utilisateur:")
				fmt.Scanln(&username)
			}

			if password == "" {
				fmt.Println("Veuillez entrer votre mot de passe:")
				fmt.Scanln(&password)
			}

			if serverURL == "" {
				serverURL = "https://localhost:443"
			}

			// Effectuer la connexion
			loginResponse, err := auth.Login(serverURL, username, password)
			if err != nil {
				ui.PrintError(fmt.Sprintf("Échec de la connexion: %v", err), true)
				return
			}

			ui.PrintSuccess(fmt.Sprintf("Connexion réussie en tant que %s", loginResponse.User.Username), true)
			ui.PrintInfo(fmt.Sprintf("Bienvenue, %s!", loginResponse.User.Username), true)
		},
	}

	// Ajouter les flags
	cmd.Flags().StringVarP(&username, "username", "u", "", "Nom d'utilisateur")
	cmd.Flags().StringVarP(&password, "password", "p", "", "Mot de passe")
	cmd.Flags().StringVarP(&serverURL, "server", "s", "", "URL du serveur (ex: https://firewall.example.com)")

	return cmd
}