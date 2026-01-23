package unit

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/config"
)

func TestDefaultConfig(t *testing.T) {
	cfg := config.DefaultConfig()

	if cfg.Server.URL != "https://localhost:443" {
		t.Errorf("Expected default URL https://localhost:443, got %s", cfg.Server.URL)
	}

	if cfg.Server.Timeout != 30 {
		t.Errorf("Expected default timeout 30, got %d", cfg.Server.Timeout)
	}

	if cfg.Server.InsecureSkipVerify != false {
		t.Errorf("Expected default insecure_skip_verify false, got %v", cfg.Server.InsecureSkipVerify)
	}

	if cfg.Output.Format != "table" {
		t.Errorf("Expected default format table, got %s", cfg.Output.Format)
	}

	if cfg.Output.Color != true {
		t.Errorf("Expected default color true, got %v", cfg.Output.Color)
	}

	if cfg.Logging.Level != "info" {
		t.Errorf("Expected default logging level info, got %s", cfg.Logging.Level)
	}
}

func TestConfigFilePath(t *testing.T) {
	home, err := os.UserHomeDir()
	if err != nil {
		t.Fatalf("Failed to get home directory: %v", err)
	}

	expectedPath := filepath.Join(home, ".shield", "config.yaml")
	actualPath := config.ConfigFilePath()

	if actualPath != expectedPath {
		t.Errorf("Expected config path %s, got %s", expectedPath, actualPath)
	}
}

func TestLoadConfig(t *testing.T) {
	// Créer un fichier de configuration temporaire
	tmpDir := t.TempDir()
	tmpConfigPath := filepath.Join(tmpDir, "config.yaml")

	configContent := `
server:
  url: "https://test.example.com"
  timeout: 60
  insecure_skip_verify: true

auth:
  token: "test-token"
  username: "testuser"

output:
  format: "json"
  color: false

logging:
  level: "debug"
  file: "/var/log/shield.log"
`

	if err := os.WriteFile(tmpConfigPath, []byte(configContent), 0644); err != nil {
		t.Fatalf("Failed to write test config file: %v", err)
	}

	// Sauvegarder le chemin de configuration original
	originalPath := config.ConfigFilePath()
	defer func() {
		// Restaurer le chemin de configuration original
		config.ConfigFilePath = func() string { return originalPath }
	}()

	// Redéfinir la fonction ConfigFilePath pour utiliser le fichier temporaire
	config.ConfigFilePath = func() string { return tmpConfigPath }

	// Charger la configuration
	cfg, err := config.Load()
	if err != nil {
		t.Fatalf("Failed to load config: %v", err)
	}

	// Vérifier les valeurs chargées
	if cfg.Server.URL != "https://test.example.com" {
		t.Errorf("Expected URL https://test.example.com, got %s", cfg.Server.URL)
	}

	if cfg.Server.Timeout != 60 {
		t.Errorf("Expected timeout 60, got %d", cfg.Server.Timeout)
	}

	if cfg.Server.InsecureSkipVerify != true {
		t.Errorf("Expected insecure_skip_verify true, got %v", cfg.Server.InsecureSkipVerify)
	}

	if cfg.Auth.Token != "test-token" {
		t.Errorf("Expected token test-token, got %s", cfg.Auth.Token)
	}

	if cfg.Auth.Username != "testuser" {
		t.Errorf("Expected username testuser, got %s", cfg.Auth.Username)
	}

	if cfg.Output.Format != "json" {
		t.Errorf("Expected format json, got %s", cfg.Output.Format)
	}

	if cfg.Output.Color != false {
		t.Errorf("Expected color false, got %v", cfg.Output.Color)
	}

	if cfg.Logging.Level != "debug" {
		t.Errorf("Expected logging level debug, got %s", cfg.Logging.Level)
	}

	if cfg.Logging.File != "/var/log/shield.log" {
		t.Errorf("Expected log file /var/log/shield.log, got %s", cfg.Logging.File)
	}
}

func TestSaveConfig(t *testing.T) {
	tmpDir := t.TempDir()
	tmpConfigPath := filepath.Join(tmpDir, "config.yaml")

	// Sauvegarder le chemin de configuration original
	originalPath := config.ConfigFilePath()
	defer func() {
		// Restaurer le chemin de configuration original
		config.ConfigFilePath = func() string { return originalPath }
	}()

	// Redéfinir la fonction ConfigFilePath pour utiliser le fichier temporaire
	config.ConfigFilePath = func() string { return tmpConfigPath }

	// Créer une configuration de test
	cfg := &config.Config{
		Server: struct {
			URL                 string `yaml:"url"`
			Timeout             int    `yaml:"timeout"`
			InsecureSkipVerify bool   `yaml:"insecure_skip_verify"`
		}{
			URL:                 "https://save-test.example.com",
			Timeout:             90,
			InsecureSkipVerify: true,
		},
		Auth: struct {
			Token    string `yaml:"token"`
			Username string `yaml:"username"`
		}{
			Token:    "save-test-token",
			Username: "save-testuser",
		},
		Output: struct {
			Format string `yaml:"format"`
			Color  bool   `yaml:"color"`
		}{
			Format: "yaml",
			Color:  false,
		},
		Logging: struct {
			Level string `yaml:"level"`
			File  string `yaml:"file"`
		}{
			Level: "warn",
			File:  "/var/log/shield-save.log",
		},
	}

	// Sauvegarder la configuration
	err := config.Save(cfg)
	if err != nil {
		t.Fatalf("Failed to save config: %v", err)
	}

	// Vérifier que le fichier a été créé
	if _, err := os.Stat(tmpConfigPath); os.IsNotExist(err) {
		t.Fatal("Config file was not created")
	}

	// Charger la configuration sauvegardée
	loadedCfg, err := config.Load()
	if err != nil {
		t.Fatalf("Failed to load saved config: %v", err)
	}

	// Vérifier que les valeurs ont été sauvegardées correctement
	if loadedCfg.Server.URL != cfg.Server.URL {
		t.Errorf("Expected URL %s, got %s", cfg.Server.URL, loadedCfg.Server.URL)
	}

	if loadedCfg.Server.Timeout != cfg.Server.Timeout {
		t.Errorf("Expected timeout %d, got %d", cfg.Server.Timeout, loadedCfg.Server.Timeout)
	}

	if loadedCfg.Server.InsecureSkipVerify != cfg.Server.InsecureSkipVerify {
		t.Errorf("Expected insecure_skip_verify %v, got %v", cfg.Server.InsecureSkipVerify, loadedCfg.Server.InsecureSkipVerify)
	}

	if loadedCfg.Auth.Token != cfg.Auth.Token {
		t.Errorf("Expected token %s, got %s", cfg.Auth.Token, loadedCfg.Auth.Token)
	}

	if loadedCfg.Auth.Username != cfg.Auth.Username {
		t.Errorf("Expected username %s, got %s", cfg.Auth.Username, loadedCfg.Auth.Username)
	}

	if loadedCfg.Output.Format != cfg.Output.Format {
		t.Errorf("Expected format %s, got %s", cfg.Output.Format, loadedCfg.Output.Format)
	}

	if loadedCfg.Output.Color != cfg.Output.Color {
		t.Errorf("Expected color %v, got %v", cfg.Output.Color, loadedCfg.Output.Color)
	}

	if loadedCfg.Logging.Level != cfg.Logging.Level {
		t.Errorf("Expected logging level %s, got %s", cfg.Logging.Level, loadedCfg.Logging.Level)
	}

	if loadedCfg.Logging.File != cfg.Logging.File {
		t.Errorf("Expected log file %s, got %s", cfg.Logging.File, loadedCfg.Logging.File)
	}
}