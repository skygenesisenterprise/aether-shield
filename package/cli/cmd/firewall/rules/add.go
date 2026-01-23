package rules

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/client"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/ui"
)

// NewAddCommand crée la commande pour ajouter une règle
func NewAddCommand() *cobra.Command {
	var action string
	var source string
	var destination string
	var port string
	var protocol string
	var description string

	cmd := &cobra.Command{
		Use:   "add",
		Short: "Ajouter une nouvelle règle au pare-feu",
		Long: `Ajouter une nouvelle règle au pare-feu.

Cette commande ajoute une nouvelle règle au pare-feu avec les paramètres spécifiés.

Exemples:
  shield firewall rules add --action allow --source 192.168.1.0/24 --destination any --port 80 --protocol tcp --description "Allow HTTP traffic"
`,
		Run: func(cmd *cobra.Command, args []string) {
			// Vérifier que tous les paramètres requis sont fournis
			if action == "" || source == "" || destination == "" || port == "" || protocol == "" {
				ui.PrintError("Tous les paramètres requis doivent être fournis", true)
				return
			}

			// Récupérer le contexte
			ctx := cmd.Context().Value(context.ContextKey).(*context.Context)

			// Créer un client
			cli := client.NewClient(ctx)

			// Préparer les données de la règle
			ruleData := map[string]interface{}{
				"action":      action,
				"source":      source,
				"destination": destination,
				"port":        port,
				"protocol":    protocol,
				"description": description,
			}

			// Ajouter la règle
			var response map[string]interface{}
			err := cli.Post("/api/firewall/rules", ruleData, &response)
			if err != nil {
				ui.PrintError(fmt.Sprintf("Échec de l'ajout de la règle: %v", err), true)
				return
			}

			ui.PrintSuccess("Règle ajoutée avec succès", true)
			if id, ok := response["id"].(string); ok {
				ui.PrintInfo(fmt.Sprintf("ID de la règle: %s", id), true)
			}
		},
	}

	// Ajouter les flags
	cmd.Flags().StringVarP(&action, "action", "a", "", "Action (allow|deny)")
	cmd.Flags().StringVarP(&source, "source", "s", "", "Source (adresse IP ou alias)")
	cmd.Flags().StringVarP(&destination, "destination", "d", "", "Destination (adresse IP ou alias)")
	cmd.Flags().StringVarP(&port, "port", "p", "", "Port ou plage de ports")
	cmd.Flags().StringVarP(&protocol, "protocol", "P", "", "Protocole (tcp|udp|icmp)")
	cmd.Flags().StringVarP(&description, "description", "D", "", "Description de la règle")

	// Marquer les flags requis
	cmd.MarkFlagRequired("action")
	cmd.MarkFlagRequired("source")
	cmd.MarkFlagRequired("destination")
	cmd.MarkFlagRequired("port")
	cmd.MarkFlagRequired("protocol")

	return cmd
}