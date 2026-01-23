package auth

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/client"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/config"
)

// LoginRequest représente une requête de connexion
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginResponse représente une réponse de connexion
type LoginResponse struct {
	Token string `json:"token"`
	User  struct {
		ID       string `json:"id"`
		Username string `json:"username"`
		Email    string `json:"email"`
	} `json:"user"`
}

// Login effectue une connexion à l'API
func Login(serverURL, username, password string) (*LoginResponse, error) {
	// Créer un client HTTP temporaire sans authentification
	httpClient := &http.Client{
		Timeout: 30 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: false, // Ne pas ignorer les erreurs TLS pour la connexion
			},
		},
	}

	loginURL := serverURL + "/api/auth/login"
	reqBody := LoginRequest{
		Username: username,
		Password: password,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("erreur lors de la sérialisation des données de connexion: %w", err)
	}

	req, err := http.NewRequest("POST", loginURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("erreur lors de la création de la requête: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("erreur lors de l'envoi de la requête: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("erreur de connexion: %s", string(body))
	}

	var loginResponse LoginResponse
	if err := json.NewDecoder(resp.Body).Decode(&loginResponse); err != nil {
		return nil, fmt.Errorf("erreur lors du décodage de la réponse: %w", err)
	}

	// Sauvegarder le token dans la configuration
	if err := config.SetToken(loginResponse.Token); err != nil {
		return nil, fmt.Errorf("erreur lors de la sauvegarde du token: %w", err)
	}

	// Sauvegarder le nom d'utilisateur
	cfg, err := config.Load()
	if err != nil {
		return nil, fmt.Errorf("erreur lors du chargement de la configuration: %w", err)
	}
	cfg.Auth.Username = username
	if err := config.Save(cfg); err != nil {
		return nil, fmt.Errorf("erreur lors de la sauvegarde de la configuration: %w", err)
	}

	return &loginResponse, nil
}

// Logout effectue une déconnexion
func Logout() error {
	if err := config.ClearToken(); err != nil {
		return fmt.Errorf("erreur lors de la suppression du token: %w", err)
	}
	return nil
}

// Whoami retourne les informations de l'utilisateur actuel
func Whoami(client *client.Client) (*LoginResponse, error) {
	var response LoginResponse
	if err := client.Get("/api/auth/whoami", &response); err != nil {
		return nil, fmt.Errorf("erreur lors de la récupération des informations utilisateur: %w", err)
	}
	return &response, nil
}

// IsAuthenticated vérifie si l'utilisateur est authentifié
func IsAuthenticated() (bool, error) {
	token, err := config.GetToken()
	if err != nil {
		return false, err
	}
	return token != "", nil
}
