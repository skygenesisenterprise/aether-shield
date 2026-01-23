package cmd

import (
	"fmt"
	"os"
	"syscall"

	"github.com/spf13/cobra"
	"golang.org/x/term"

	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/auth"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/client"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/ui"
)

var rootCmd = &cobra.Command{
	Use:   "shield",
	Short: "Shield CLI - Client en ligne de commande pour Aether-Shield",
	Long: `Shield CLI est un client en ligne de commande pour gérer le firewall Aether-Shield.

Ce CLI permet de gérer toutes les fonctionnalités du pare-feu depuis la ligne de commande,
incluant la gestion des règles, des interfaces réseau, des services, des VPN et plus encore.

Exemples:
  shield firewall rules list
  shield interfaces status
  shield services restart dhcp
  shield system status
  shield vpn wireguard list
`,
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			cmd.Help()
		}
	},
}

func Execute(ctx *context.Context) error {
	return rootCmd.Execute()
}

func init() {
	// Ajouter les commandes principales
	rootCmd.AddCommand(
		newAuthCommand(ctx),
		newFirewallCommand(ctx),
		newInterfacesCommand(ctx),
		newServicesCommand(ctx),
		newSystemCommand(ctx),
		newVPNCommand(ctx),
		newReportCommand(ctx),
	)

	// Configuration globale
	rootCmd.PersistentFlags().StringP("format", "f", "table", "Format de sortie (table, json, yaml)")
	rootCmd.PersistentFlags().BoolP("color", "c", true, "Activer les couleurs dans la sortie")
	rootCmd.PersistentFlags().StringP("server", "s", "", "URL du serveur (override la configuration)")
}

func newAuthCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "auth",
		Short: "Gestion de l'authentification",
		Long:  "Commandes pour la gestion de l'authentification JWT",
	}

	cmd.AddCommand(
		newLoginCommand(ctx),
		newLogoutCommand(ctx),
		newWhoamiCommand(ctx),
	)

	return cmd
}

func newFirewallCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "firewall",
		Short: "Gestion du pare-feu",
		Long:  "Commandes pour la gestion du pare-feu",
	}

	cmd.AddCommand(
		newFirewallRulesCommand(ctx),
		newFirewallAliasesCommand(ctx),
		newFirewallGroupsCommand(ctx),
		newFirewallNATCommand(ctx),
		newFirewallShaperCommand(ctx),
		newFirewallLogCommand(ctx),
	)

	return cmd
}

func newInterfacesCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "interfaces",
		Short: "Gestion des interfaces réseau",
		Long:  "Commandes pour la gestion des interfaces réseau",
	}

	cmd.AddCommand(
		newInterfacesListCommand(ctx),
		newInterfacesStatusCommand(ctx),
		newInterfacesWANCommand(ctx),
		newInterfacesWirelessCommand(ctx),
		newInterfacesVirtualIPsCommand(ctx),
	)

	return cmd
}

func newServicesCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "services",
		Short: "Gestion des services",
		Long:  "Commandes pour la gestion des services",
	}

	cmd.AddCommand(
		newServicesDHCPCommand(ctx),
		newServicesDNSCommand(ctx),
		newServicesUnboundDNSCommand(ctx),
		newServicesOpenVPNCommand(ctx),
		newServicesWireGuardCommand(ctx),
	)

	return cmd
}

func newSystemCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "system",
		Short: "Gestion du système",
		Long:  "Commandes pour la gestion du système",
	}

	cmd.AddCommand(
		newSystemStatusCommand(ctx),
		newSystemLogsCommand(ctx),
		newSystemConfigCommand(ctx),
		newSystemFirmwareCommand(ctx),
		newSystemDiagnosticsCommand(ctx),
	)

	return cmd
}

func newVPNCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "vpn",
		Short: "Gestion des VPN",
		Long:  "Commandes pour la gestion des VPN",
	}

	cmd.AddCommand(
		newVPNIPSecCommand(ctx),
		newVPNOpenVPNCommand(ctx),
		newVPNWireGuardCommand(ctx),
	)

	return cmd
}

func newReportCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "report",
		Short: "Génération de rapports",
		Long:  "Commandes pour la génération de rapports",
	}

	cmd.AddCommand(
		newReportHealthCommand(ctx),
		newReportTrafficCommand(ctx),
		newReportNetFlowCommand(ctx),
	)

	return cmd
}

// Fonctions pour les commandes d'authentification
func newLoginCommand(ctx *context.Context) *cobra.Command {
	var username, password, serverURL string

	cmd := &cobra.Command{
		Use:   "login",
		Short: "Se connecter au serveur",
		Long:  "Se connecter au serveur Aether-Shield avec un nom d'utilisateur et un mot de passe",
		Run: func(cmd *cobra.Command, args []string) {
			if username == "" {
				fmt.Print("Nom d'utilisateur: ")
				fmt.Scanln(&username)
			}
			if password == "" {
				fmt.Print("Mot de passe: ")
				bytePassword, _ := term.ReadPassword(int(syscall.Stdin))
				password = string(bytePassword)
				fmt.Println()
			}

			if serverURL == "" {
				serverURL = ctx.GetServerURL()
			}

			loginResponse, err := auth.Login(serverURL, username, password)
			if err != nil {
				ui.PrintError("Échec de la connexion: "+err.Error(), ctx.GetColorEnabled())
				os.Exit(1)
			}

			ui.PrintSuccess("Connexion réussie !", ctx.GetColorEnabled())
			ui.PrintInfo("Utilisateur: "+loginResponse.User.Username, ctx.GetColorEnabled())
		},
	}

	cmd.Flags().StringVarP(&username, "username", "u", "", "Nom d'utilisateur")
	cmd.Flags().StringVarP(&password, "password", "p", "", "Mot de passe")
	cmd.Flags().StringVarP(&serverURL, "server", "s", "", "URL du serveur (override la configuration)")

	return cmd
}

func newLogoutCommand(ctx *context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "logout",
		Short: "Se déconnecter",
		Long:  "Supprimer le token JWT de la configuration",
		Run: func(cmd *cobra.Command, args []string) {
			if err := auth.Logout(); err != nil {
				ui.PrintError("Échec de la déconnexion: "+err.Error(), ctx.GetColorEnabled())
				os.Exit(1)
			}
			ui.PrintSuccess("Déconnexion réussie !", ctx.GetColorEnabled())
		},
	}
}

func newWhoamiCommand(ctx *context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "whoami",
		Short: "Afficher l'utilisateur actuel",
		Long:  "Afficher les informations de l'utilisateur actuellement connecté",
		Run: func(cmd *cobra.Command, args []string) {
			client := client.NewClient(ctx)
			
			whoamiResponse, err := auth.Whoami(client)
			if err != nil {
				ui.PrintError("Échec de la récupération des informations utilisateur: "+err.Error(), ctx.GetColorEnabled())
				os.Exit(1)
			}

			ui.PrintHeader("Informations utilisateur", ctx.GetColorEnabled())
			ui.PrintKeyValue("Nom d'utilisateur", whoamiResponse.User.Username, ctx.GetColorEnabled())
			ui.PrintKeyValue("Email", whoamiResponse.User.Email, ctx.GetColorEnabled())
			ui.PrintKeyValue("ID", whoamiResponse.User.ID, ctx.GetColorEnabled())
		},
	}
}

// Cette fonction est maintenant dans firewall_rules.go

func newFirewallAliasesCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "aliases",
		Short: "Gestion des alias",
		Long:  "Commandes pour la gestion des alias",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les alias",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande firewall aliases list non implémentée")
			},
		},
	)

	return cmd
}

func newFirewallGroupsCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "groups",
		Short: "Gestion des groupes",
		Long:  "Commandes pour la gestion des groupes",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les groupes",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande firewall groups list non implémentée")
			},
		},
	)

	return cmd
}

func newFirewallNATCommand(ctx *cobra.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "nat",
		Short: "Gestion du NAT",
		Long:  "Commandes pour la gestion du NAT",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les règles NAT",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande firewall nat list non implémentée")
			},
		},
	)

	return cmd
}

func newFirewallShaperCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "shaper",
		Short: "Gestion du trafic",
		Long:  "Commandes pour la gestion du trafic",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les règles de trafic",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande firewall shaper list non implémentée")
			},
		},
	)

	return cmd
}

func newFirewallLogCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "log",
		Short: "Journaux du pare-feu",
		Long:  "Commandes pour la gestion des journaux du pare-feu",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les journaux",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande firewall log list non implémentée")
			},
		},
	)

	return cmd
}

func newInterfacesListCommand(ctx *context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "Lister les interfaces",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Commande interfaces list non implémentée")
		},
	}
}

func newInterfacesStatusCommand(ctx *context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "status",
		Short: "Afficher le statut des interfaces",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Commande interfaces status non implémentée")
		},
	}
}

func newInterfacesWANCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "wan",
		Short: "Gestion de l'interface WAN",
		Long:  "Commandes pour la gestion de l'interface WAN",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "status",
			Short: "Afficher le statut WAN",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande interfaces wan status non implémentée")
			},
		},
	)

	return cmd
}

func newInterfacesWirelessCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "wireless",
		Short: "Gestion des interfaces sans fil",
		Long:  "Commandes pour la gestion des interfaces sans fil",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les interfaces sans fil",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande interfaces wireless list non implémentée")
			},
		},
	)

	return cmd
}

func newInterfacesVirtualIPsCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "virtual-ips",
		Short: "Gestion des adresses IP virtuelles",
		Long:  "Commandes pour la gestion des adresses IP virtuelles",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les adresses IP virtuelles",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande interfaces virtual-ips list non implémentée")
			},
		},
	)

	return cmd
}

func newServicesDHCPCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "dhcp",
		Short: "Gestion du service DHCP",
		Long:  "Commandes pour la gestion du service DHCP",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les configurations DHCP",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande services dhcp list non implémentée")
			},
		},
	)

	return cmd
}

func newServicesDNSCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "dns",
		Short: "Gestion du service DNS",
		Long:  "Commandes pour la gestion du service DNS",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "status",
			Short: "Afficher le statut DNS",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande services dns status non implémentée")
			},
		},
	)

	return cmd
}

func newServicesUnboundDNSCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "unbound-dns",
		Short: "Gestion du service Unbound DNS",
		Long:  "Commandes pour la gestion du service Unbound DNS",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "status",
			Short: "Afficher le statut Unbound DNS",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande services unbound-dns status non implémentée")
			},
		},
	)

	return cmd
}

func newServicesOpenVPNCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "openvpn",
		Short: "Gestion du service OpenVPN",
		Long:  "Commandes pour la gestion du service OpenVPN",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les configurations OpenVPN",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande services openvpn list non implémentée")
			},
		},
	)

	return cmd
}

func newServicesWireGuardCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "wireguard",
		Short: "Gestion du service WireGuard",
		Long:  "Commandes pour la gestion du service WireGuard",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les configurations WireGuard",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande services wireguard list non implémentée")
			},
		},
	)

	return cmd
}

func newSystemStatusCommand(ctx *context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "status",
		Short: "Afficher le statut du système",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Commande system status non implémentée")
		},
	}
}

func newSystemLogsCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "logs",
		Short: "Gestion des journaux système",
		Long:  "Commandes pour la gestion des journaux système",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les journaux",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande system logs list non implémentée")
			},
		},
	)

	return cmd
}

func newSystemConfigCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "config",
		Short: "Gestion de la configuration",
		Long:  "Commandes pour la gestion de la configuration",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "backup",
			Short: "Créer une sauvegarde de la configuration",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande system config backup non implémentée")
			},
		},
	)

	return cmd
}

func newSystemFirmwareCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "firmware",
		Short: "Gestion du firmware",
		Long:  "Commandes pour la gestion du firmware",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "upgrade",
			Short: "Mettre à jour le firmware",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande system firmware upgrade non implémentée")
			},
		},
	)

	return cmd
}

func newSystemDiagnosticsCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "diagnostics",
		Short: "Diagnostics système",
		Long:  "Commandes pour les diagnostics système",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "run",
			Short: "Exécuter des diagnostics",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande system diagnostics run non implémentée")
			},
		},
	)

	return cmd
}

func newVPNIPSecCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "ipsec",
		Short: "Gestion du VPN IPsec",
		Long:  "Commandes pour la gestion du VPN IPsec",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "status",
			Short: "Afficher le statut IPsec",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande vpn ipsec status non implémentée")
			},
		},
	)

	return cmd
}

func newVPNOpenVPNCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "openvpn",
		Short: "Gestion du VPN OpenVPN",
		Long:  "Commandes pour la gestion du VPN OpenVPN",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les configurations OpenVPN",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande vpn openvpn list non implémentée")
			},
		},
	)

	return cmd
}

func newVPNWireGuardCommand(ctx *context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "wireguard",
		Short: "Gestion du VPN WireGuard",
		Long:  "Commandes pour la gestion du VPN WireGuard",
	}

	cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "Lister les configurations WireGuard",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Commande vpn wireguard list non implémentée")
			},
		},
	)

	return cmd
}

func newReportHealthCommand(ctx *context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "health",
		Short: "Afficher la santé du système",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Commande report health non implémentée")
		},
	}
}

func newReportTrafficCommand(ctx *context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "traffic",
		Short: "Afficher le trafic réseau",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Commande report traffic non implémentée")
		},
	}
}

func newReportNetFlowCommand(ctx *context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "netflow",
		Short: "Afficher les données NetFlow",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Commande report netflow non implémentée")
		},
	}
}
