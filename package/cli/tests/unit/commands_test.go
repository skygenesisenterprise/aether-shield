package unit

import (
	"testing"

	"github.com/spf13/cobra"
	"github.com/skygenesisenterprise/aether-shield/package/cli/cmd"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/config"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
)

func TestRootCommand(t *testing.T) {
	// Créer une configuration de test
	cfg := config.DefaultConfig()
	ctx := context.New(cfg)

	// Créer la commande racine
	rootCmd := cmd.NewRootCommand()
	rootCmd.SetContext(ctx)

	// Tester l'exécution de la commande racine sans arguments
	err := rootCmd.Execute()
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}

	// Vérifier que la commande racine a les sous-commandes attendues
	expectedCommands := []string{"auth", "firewall", "interfaces", "services", "system", "vpn", "report"}
	for _, expectedCmd := range expectedCommands {
		found := false
		for _, actualCmd := range rootCmd.Commands() {
			if actualCmd.Name() == expectedCmd {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("Expected command %s not found", expectedCmd)
		}
	}
}

func TestAuthCommands(t *testing.T) {
	// Créer une configuration de test
	cfg := config.DefaultConfig()
	ctx := context.New(cfg)

	// Créer la commande racine
	rootCmd := cmd.NewRootCommand()
	rootCmd.SetContext(ctx)

	// Trouver la commande auth
	authCmd := findCommand(rootCmd, "auth")
	if authCmd == nil {
		t.Fatal("Auth command not found")
	}

	// Vérifier que la commande auth a les sous-commandes attendues
	expectedCommands := []string{"login", "logout", "whoami"}
	for _, expectedCmd := range expectedCommands {
		found := false
		for _, actualCmd := range authCmd.Commands() {
			if actualCmd.Name() == expectedCmd {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("Expected auth subcommand %s not found", expectedCmd)
		}
	}
}

func TestFirewallCommands(t *testing.T) {
	// Créer une configuration de test
	cfg := config.DefaultConfig()
	ctx := context.New(cfg)

	// Créer la commande racine
	rootCmd := cmd.NewRootCommand()
	rootCmd.SetContext(ctx)

	// Trouver la commande firewall
	firewallCmd := findCommand(rootCmd, "firewall")
	if firewallCmd == nil {
		t.Fatal("Firewall command not found")
	}

	// Vérifier que la commande firewall a les sous-commandes attendues
	expectedCommands := []string{"aliases", "rules", "groups", "nat", "shaper", "log"}
	for _, expectedCmd := range expectedCommands {
		found := false
		for _, actualCmd := range firewallCmd.Commands() {
			if actualCmd.Name() == expectedCmd {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("Expected firewall subcommand %s not found", expectedCmd)
		}
	}
}

func TestInterfacesCommands(t *testing.T) {
	// Créer une configuration de test
	cfg := config.DefaultConfig()
	ctx := context.New(cfg)

	// Créer la commande racine
	rootCmd := cmd.NewRootCommand()
	rootCmd.SetContext(ctx)

	// Trouver la commande interfaces
	interfacesCmd := findCommand(rootCmd, "interfaces")
	if interfacesCmd == nil {
		t.Fatal("Interfaces command not found")
	}

	// Vérifier que la commande interfaces a les sous-commandes attendues
	expectedCommands := []string{"overview", "settings", "wan", "wireless", "virtual-ips"}
	for _, expectedCmd := range expectedCommands {
		found := false
		for _, actualCmd := range interfacesCmd.Commands() {
			if actualCmd.Name() == expectedCmd {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("Expected interfaces subcommand %s not found", expectedCmd)
		}
	}
}

func TestServicesCommands(t *testing.T) {
	// Créer une configuration de test
	cfg := config.DefaultConfig()
	ctx := context.New(cfg)

	// Créer la commande racine
	rootCmd := cmd.NewRootCommand()
	rootCmd.SetContext(ctx)

	// Trouver la commande services
	servicesCmd := findCommand(rootCmd, "services")
	if servicesCmd == nil {
		t.Fatal("Services command not found")
	}

	// Vérifier que la commande services a les sous-commandes attendues
	expectedCommands := []string{"dhcp", "dns", "unbound-dns", "openvpn", "wireguard"}
	for _, expectedCmd := range expectedCommands {
		found := false
		for _, actualCmd := range servicesCmd.Commands() {
			if actualCmd.Name() == expectedCmd {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("Expected services subcommand %s not found", expectedCmd)
		}
	}
}

func TestSystemCommands(t *testing.T) {
	// Créer une configuration de test
	cfg := config.DefaultConfig()
	ctx := context.New(cfg)

	// Créer la commande racine
	rootCmd := cmd.NewRootCommand()
	rootCmd.SetContext(ctx)

	// Trouver la commande system
	systemCmd := findCommand(rootCmd, "system")
	if systemCmd == nil {
		t.Fatal("System command not found")
	}

	// Vérifier que la commande system a les sous-commandes attendues
	expectedCommands := []string{"status", "logs", "config", "firmware", "diagnostics"}
	for _, expectedCmd := range expectedCommands {
		found := false
		for _, actualCmd := range systemCmd.Commands() {
			if actualCmd.Name() == expectedCmd {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("Expected system subcommand %s not found", expectedCmd)
		}
	}
}

func TestVPNCommands(t *testing.T) {
	// Créer une configuration de test
	cfg := config.DefaultConfig()
	ctx := context.New(cfg)

	// Créer la commande racine
	rootCmd := cmd.NewRootCommand()
	rootCmd.SetContext(ctx)

	// Trouver la commande vpn
	vpnCmd := findCommand(rootCmd, "vpn")
	if vpnCmd == nil {
		t.Fatal("VPN command not found")
	}

	// Vérifier que la commande vpn a les sous-commandes attendues
	expectedCommands := []string{"ipsec", "openvpn", "wireguard"}
	for _, expectedCmd := range expectedCommands {
		found := false
		for _, actualCmd := range vpnCmd.Commands() {
			if actualCmd.Name() == expectedCmd {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("Expected vpn subcommand %s not found", expectedCmd)
		}
	}
}

func TestReportCommands(t *testing.T) {
	// Créer une configuration de test
	cfg := config.DefaultConfig()
	ctx := context.New(cfg)

	// Créer la commande racine
	rootCmd := cmd.NewRootCommand()
	rootCmd.SetContext(ctx)

	// Trouver la commande report
	reportCmd := findCommand(rootCmd, "report")
	if reportCmd == nil {
		t.Fatal("Report command not found")
	}

	// Vérifier que la commande report a les sous-commandes attendues
	expectedCommands := []string{"health", "traffic", "netflow"}
	for _, expectedCmd := range expectedCommands {
		found := false
		for _, actualCmd := range reportCmd.Commands() {
			if actualCmd.Name() == expectedCmd {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("Expected report subcommand %s not found", expectedCmd)
		}
	}
}

// Helper function to find a command in the command tree
func findCommand(parent *cobra.Command, name string) *cobra.Command {
	for _, cmd := range parent.Commands() {
		if cmd.Name() == name {
			return cmd
		}
	}
	return nil
}