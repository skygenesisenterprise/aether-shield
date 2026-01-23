package context

import (
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/config"
)

// Context représente le contexte d'exécution du CLI
type Context struct {
	Config *config.Config
	// Ajouter d'autres champs au besoin
}

// New crée un nouveau contexte
func New(cfg *config.Config) *Context {
	return &Context{
		Config: cfg,
	}
}

// GetServerURL retourne l'URL du serveur
func (c *Context) GetServerURL() string {
	return c.Config.Server.URL
}

// GetToken retourne le token JWT
func (c *Context) GetToken() string {
	return c.Config.Auth.Token
}

// GetOutputFormat retourne le format de sortie
func (c *Context) GetOutputFormat() string {
	return c.Config.Output.Format
}

// GetColorEnabled retourne si les couleurs sont activées
func (c *Context) GetColorEnabled() bool {
	return c.Config.Output.Color
}
