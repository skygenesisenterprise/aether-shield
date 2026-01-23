package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/client"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/ui"
)

// FirewallRule représente une règle de pare-feu
type FirewallRule struct {
	ID          string `json:"id"`
	Description string `json:"description"`
	Interface   string `json:"interface"`
	Action      string `json:"action"`
	Protocol    string `json:"protocol"`
	Source      string `json:"source"`
	Destination string `json:"destination"`
	Enabled     bool   `json:"enabled"`
}

// ListFirewallRules liste les règles de pare-feu
func listFirewallRules(ctx *context.Context, format string, colorEnabled bool) error {
	client := client.NewClient(ctx)

	var rules []FirewallRule
	if err := client.Get("/api/firewall/rules", &rules); err != nil {
		return fmt.Errorf("erreur lors de la récupération des règles: %w", err)
	}

	switch format {
	case "json":
		return ui.PrintJSON(rules)
	case "yaml":
		return ui.PrintYAML(rules)
	default:
		if len(rules) == 0 {
			ui.PrintInfo("Aucune règle trouvée", colorEnabled)
			return nil
		}

		header := []string{"ID", "Description", "Interface", "Action", "Protocol", "Source", "Destination", "Enabled"}
		rows := make([][]string, len(rules))
		for i, rule := range rules {
			rows[i] = []string{
				rule.ID,
				rule.Description,
				rule.Interface,
				rule.Action,
				rule.Protocol,
				rule.Source,
				rule.Destination,
				fmt.Sprintf("%t", rule.Enabled),
			}
		}

		ui.PrintTable(header, rows, colorEnabled)
		return nil
	}
}

func newFirewallRulesCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "rules",
		Short: "Gestion des règles du pare-feu",
		Long:  "Commandes pour la gestion des règles du pare-feu",
	}

	// Commande list
	listCmd := &cobra.Command{
		Use:   "list",
		Short: "Lister les règles du pare-feu",
		Run: func(cmd *cobra.Command, args []string) {
			format := ctx.GetOutputFormat()
			colorEnabled := ctx.GetColorEnabled()

			if err := listFirewallRules(ctx, format, colorEnabled); err != nil {
				ui.PrintError("Erreur: "+err.Error(), colorEnabled)
				os.Exit(1)
			}
		},
	}

	// Commande add
	addCmd := &cobra.Command{
		Use:   "add",
		Short: "Ajouter une règle",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Commande firewall rules add non implémentée")
		},
	}

	// Commande delete
	deleteCmd := &cobra.Command{
		Use:   "delete",
		Short: "Supprimer une règle",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Commande firewall rules delete non implémentée")
		},
	}

	cmd.AddCommand(listCmd, addCmd, deleteCmd)

	return cmd
}
