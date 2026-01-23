package auth

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/auth"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/client"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/ui"
)

// NewWhoamiCommand crée la commande whoami
func NewWhoamiCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "whoami",
		Short: "Afficher les informations de l'utilisateur actuel",
		Long: `Afficher les informations de l'utilisateur actuellement connecté.

Cette commande retourne les informations de l'utilisateur authentifié.

Exemples:
  shield auth whoami
  shield auth whoami --format json
`,
		Run: func(cmd *cobra.Command, args []string) {
			// Récupérer le contexte
			ctx := cmd.Context().Value(context.ContextKey).(*context.Context)

			// Créer un client
			cli := client.NewClient(ctx)

			// Récupérer les informations utilisateur
			loginResponse, err := auth.Whoami(cli)
			if err != nil {
				ui.PrintError(fmt.Sprintf("Échec de la récupération des informations utilisateur: %v", err), true)
				return
			}

			// Afficher les informations utilisateur
			ui.PrintHeader("Informations utilisateur", true)
			ui.PrintKeyValue("Nom d'utilisateur", loginResponse.User.Username, true)
			ui.PrintKeyValue("ID utilisateur", loginResponse.User.ID, true)
			ui.PrintKeyValue("Email", loginResponse.User.Email, true)
		},
	}

	return cmd
}