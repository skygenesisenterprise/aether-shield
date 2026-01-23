package config

import (
	"os"
	"path/filepath"

	"github.com/spf13/viper"
	"gopkg.in/yaml.v3"
)

// Config représente la configuration du CLI
type Config struct {
	Server struct {
		URL                 string `yaml:"url"`
		Timeout             int    `yaml:"timeout"`
		InsecureSkipVerify bool   `yaml:"insecure_skip_verify"`
	} `yaml:"server"`

	Auth struct {
		Token    string `yaml:"token"`
		Username string `yaml:"username"`
	} `yaml:"auth"`

	Output struct {
		Format string `yaml:"format"`
		Color  bool   `yaml:"color"`
	} `yaml:"output"`

	Logging struct {
		Level string `yaml:"level"`
		File  string `yaml:"file"`
	} `yaml:"logging"`
}

// DefaultConfig retourne la configuration par défaut
func DefaultConfig() *Config {
	return &Config{
		Server: struct {
			URL                 string `yaml:"url"`
			Timeout             int    `yaml:"timeout"`
			InsecureSkipVerify bool   `yaml:"insecure_skip_verify"`
		}{
			URL:                 "https://localhost:443",
			Timeout:             30,
			InsecureSkipVerify: false,
		},
		Auth: struct {
			Token    string `yaml:"token"`
			Username string `yaml:"username"`
		}{
			Token:    "",
			Username: "",
		},
		Output: struct {
			Format string `yaml:"format"`
			Color  bool   `yaml:"color"`
		}{
			Format: "table",
			Color:  true,
		},
		Logging: struct {
			Level string `yaml:"level"`
			File  string `yaml:"file"`
		}{
			Level: "info",
			File:  "",
		},
	}
}

// ConfigFilePath retourne le chemin du fichier de configuration
func ConfigFilePath() string {
	home, err := os.UserHomeDir()
	if err != nil {
		return "config.yaml"
	}
	return filepath.Join(home, ".shield", "config.yaml")
}

// Load charge la configuration depuis le fichier
func Load() (*Config, error) {
	viper.SetConfigType("yaml")
	viper.SetConfigFile(ConfigFilePath())

	// Définir les valeurs par défaut
	viper.SetDefault("server.url", "https://localhost:443")
	viper.SetDefault("server.timeout", 30)
	viper.SetDefault("server.insecure_skip_verify", false)
	viper.SetDefault("auth.token", "")
	viper.SetDefault("auth.username", "")
	viper.SetDefault("output.format", "table")
	viper.SetDefault("output.color", true)
	viper.SetDefault("logging.level", "info")
	viper.SetDefault("logging.file", "")

	// Lire le fichier de configuration
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// Fichier de configuration non trouvé, utiliser les valeurs par défaut
			return DefaultConfig(), nil
		}
		return nil, err
	}

	// Décoder la configuration
	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}

// Save sauvegarde la configuration dans le fichier
func Save(config *Config) error {
	// Créer le répertoire si nécessaire
	home, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	configDir := filepath.Join(home, ".shield")
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return err
	}

	// Écrire le fichier de configuration
	data, err := yaml.Marshal(config)
	if err != nil {
		return err
	}

	return os.WriteFile(ConfigFilePath(), data, 0644)
}

// GetToken retourne le token JWT depuis la configuration
func GetToken() (string, error) {
	config, err := Load()
	if err != nil {
		return "", err
	}
	return config.Auth.Token, nil
}

// SetToken sauvegarde le token JWT dans la configuration
func SetToken(token string) error {
	config, err := Load()
	if err != nil {
		return err
	}
	config.Auth.Token = token
	return Save(config)
}

// ClearToken supprime le token JWT de la configuration
func ClearToken() error {
	config, err := Load()
	if err != nil {
		return err
	}
	config.Auth.Token = ""
	config.Auth.Username = ""
	return Save(config)
}
