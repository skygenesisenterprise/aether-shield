package auth

import (
	"fmt"

	"github.com/skygenesisenterprise/aether-shield/cmd/internal/context"
)

// LoginAction authentifie l'utilisateur avec le serveur
type LoginAction struct {
	Username string
	Password string
}

func NewLoginAction(username, password string) *LoginAction {
	return &LoginAction{
		Username: username,
		Password: password,
	}
}

func (a *LoginAction) Name() string {
	return "auth-login"
}

func (a *LoginAction) Description() string {
	return "Authentifie l'utilisateur avec le serveur Aether Shield"
}

func (a *LoginAction) Execute(ctx interface{}, args []string) error {
	context := ctx.(*context.Context)

	if context.Client == nil {
		return fmt.Errorf("client HTTP non disponible, impossible de se connecter au serveur")
	}

	// Authentifier l'utilisateur
	loginResp, err := context.Client.Login(a.Username, a.Password)
	if err != nil {
		return fmt.Errorf("authentification échouée: %w", err)
	}

	// Stocker le token dans le contexte
	context.Client.SetAuthToken(loginResp.Token)

	fmt.Println("Authentification réussie!")
	fmt.Printf("Token: %s\n", loginResp.Token)

	return nil
}

func (a *LoginAction) Validate(args []string) error {
	if a.Username == "" {
		return fmt.Errorf("nom d'utilisateur requis")
	}
	if a.Password == "" {
		return fmt.Errorf("mot de passe requis")
	}
	return nil
}

func (a *LoginAction) RequiresAuth() bool {
	return false
}

// LogoutAction déconnecte l'utilisateur
type LogoutAction struct{}

func NewLogoutAction() *LogoutAction {
	return &LogoutAction{}
}

func (a *LogoutAction) Name() string {
	return "auth-logout"
}

func (a *LogoutAction) Description() string {
	return "Déconnecte l'utilisateur du serveur Aether Shield"
}

func (a *LogoutAction) Execute(ctx interface{}, args []string) error {
	context := ctx.(*context.Context)

	if context.Client == nil {
		return fmt.Errorf("client HTTP non disponible")
	}

	// Supprimer le token
	context.Client.SetAuthToken("")

	fmt.Println("Déconnexion réussie!")

	return nil
}

func (a *LogoutAction) Validate(args []string) error {
	return nil
}

func (a *LogoutAction) RequiresAuth() bool {
	return true
}
