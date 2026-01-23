package aliases

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/client"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/ui"
)

// NewListCommand crée la commande pour lister les alias
func NewListCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list",
		Short: "Lister tous les alias du pare-feu",
		Long: `Lister tous les alias du pare-feu.

Cette commande retourne une liste de tous les alias configurés dans le pare-feu.

Exemples:
  shield firewall aliases list
  shield firewall aliases list --format json
  shield firewall aliases list --format yaml
`,
		Run: func(cmd *cobra.Command, args []string) {
			// Récupérer le contexte
			ctx := cmd.Context().Value(context.ContextKey).(*context.Context)

			// Créer un client
			cli := client.NewClient(ctx)

			// Récupérer les alias
			var aliases []map[string]interface{}
			err := cli.Get("/api/firewall/aliases", &aliases)
			if err != nil {
				ui.PrintError(fmt.Sprintf("Échec de la récupération des alias: %v", err), true)
				return
			}

			// Afficher les alias
			if len(aliases) == 0 {
				ui.PrintInfo("Aucun alias trouvé", true)
				return
			}

			// Préparer les données pour l'affichage
			header := []string{"Nom", "Type", "Description"}
			rows := [][]string{}
			for _, alias := range aliases {
				name := alias["name"].(string)
				typeAlias := alias["type"].(string)
				desc := alias["description"].(string)
				rows = append(rows, []string{name, typeAlias, desc})
			}

			ui.PrintTable(header, rows, true)
		},
	}

	return cmd
}