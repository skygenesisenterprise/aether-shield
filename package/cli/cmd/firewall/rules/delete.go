package rules

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/client"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/ui"
)

// NewDeleteCommand crée la commande pour supprimer une règle
func NewDeleteCommand() *cobra.Command {
	var ruleID string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Supprimer une règle du pare-feu",
		Long: `Supprimer une règle du pare-feu.

Cette commande supprime une règle existante du pare-feu.

Exemples:
  shield firewall rules delete --id rule123
`,
		Run: func(cmd *cobra.Command, args []string) {
			// Vérifier que l'ID de la règle est fourni
			if ruleID == "" {
				ui.PrintError("L'ID de la règle est requis", true)
				return
			}

			// Récupérer le contexte
			ctx := cmd.Context().Value(context.ContextKey).(*context.Context)

			// Créer un client
			cli := client.NewClient(ctx)

			// Supprimer la règle
			err := cli.Delete(fmt.Sprintf("/api/firewall/rules/%s", ruleID))
			if err != nil {
				ui.PrintError(fmt.Sprintf("Échec de la suppression de la règle: %v", err), true)
				return
			}

			ui.PrintSuccess(fmt.Sprintf("Règle %s supprimée avec succès", ruleID), true)
		},
	}

	// Ajouter les flags
	cmd.Flags().StringVarP(&ruleID, "id", "i", "", "ID de la règle à supprimer")
	cmd.MarkFlagRequired("id")

	return cmd
}