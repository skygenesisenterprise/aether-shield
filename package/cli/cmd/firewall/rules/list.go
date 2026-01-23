package rules

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/client"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/ui"
)

// NewListCommand crée la commande pour lister les règles
func NewListCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list",
		Short: "Lister toutes les règles du pare-feu",
		Long: `Lister toutes les règles du pare-feu.

Cette commande retourne une liste de toutes les règles configurées dans le pare-feu.

Exemples:
  shield firewall rules list
  shield firewall rules list --format json
  shield firewall rules list --format yaml
`,
		Run: func(cmd *cobra.Command, args []string) {
			// Récupérer le contexte
			ctx := cmd.Context().Value(context.ContextKey).(*context.Context)

			// Créer un client
			cli := client.NewClient(ctx)

			// Récupérer les règles
			var rules []map[string]interface{}
			err := cli.Get("/api/firewall/rules", &rules)
			if err != nil {
				ui.PrintError(fmt.Sprintf("Échec de la récupération des règles: %v", err), true)
				return
			}

			// Afficher les règles
			if len(rules) == 0 {
				ui.PrintInfo("Aucune règle trouvée", true)
				return
			}

			// Préparer les données pour l'affichage
			header := []string{"ID", "Action", "Source", "Destination", "Port", "Protocole", "Description"}
			rows := [][]string{}
			for _, rule := range rules {
				id := rule["id"].(string)
				action := rule["action"].(string)
				source := rule["source"].(string)
				destination := rule["destination"].(string)
				port := rule["port"].(string)
				protocol := rule["protocol"].(string)
				desc := rule["description"].(string)
				rows = append(rows, []string{id, action, source, destination, port, protocol, desc})
			}

			ui.PrintTable(header, rows, true)
		},
	}

	return cmd
}