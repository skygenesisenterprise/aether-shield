package context

import (
	"github.com/skygenesisenterprise/aether-shield/cmd/internal/config"
	"github.com/skygenesisenterprise/aether-shield/cmd/pkg/client"
)

// Context représente l'état global de la session
type Context struct {
	Config     *config.Config
	Client     *client.Client
	Session    *Session
	Permission *Permission
}

// Session contient les informations de session utilisateur
type Session struct {
	User      string
	TTY       string
	StartTime int64
	IsRoot    bool
}

// Permission gère les permissions utilisateur
type Permission struct {
	ReadOnly bool
	Level    string // "admin", "user", "readonly"
}

// New crée un nouveau contexte
func New(cfg *config.Config) *Context {
	// Créer le client HTTP
	httpClient, err := client.NewClient(cfg)
	if err != nil {
		// Si la création du client échoue, continuer sans client
		// (mode hors ligne ou commandes locales)
		httpClient = nil
	}

	return &Context{
		Config:     cfg,
		Client:     httpClient,
		Session:    NewSession(),
		Permission: NewPermission(),
	}
}

// NewSession crée une nouvelle session
func NewSession() *Session {
	return &Session{
		User:      getCurrentUser(),
		TTY:       getCurrentTTY(),
		StartTime: getCurrentTime(),
		IsRoot:    isRoot(),
	}
}

// NewPermission crée un nouveau gestionnaire de permissions
func NewPermission() *Permission {
	return &Permission{
		ReadOnly: false,
		Level:    getPermissionLevel(),
	}
}
