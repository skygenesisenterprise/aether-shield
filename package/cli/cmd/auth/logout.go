package auth

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/auth"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/ui"
)

// NewLogoutCommand crée la commande de déconnexion
func NewLogoutCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "logout",
		Short: "Se déconnecter du serveur Aether-Shield",
		Long: `Se déconnecter du serveur Aether-Shield.

Cette commande supprime le token JWT du fichier de configuration.

Exemples:
  shield auth logout
`,
		Run: func(cmd *cobra.Command, args []string) {
			// Effectuer la déconnexion
			err := auth.Logout()
			if err != nil {
				ui.PrintError(fmt.Sprintf("Échec de la déconnexion: %v", err), true)
				return
			}

			ui.PrintSuccess("Déconnexion réussie", true)
			ui.PrintInfo("Vous êtes maintenant déconnecté", true)
		},
	}

	return cmd
}