package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/skygenesisenterprise/aether-shield/cmd/internal/config"
)

// Client représente un client HTTP pour communiquer avec le serveur Aether Shield
type Client struct {
	baseURL    *url.URL
	httpClient *http.Client
	token      string
	config     *config.Config
}

// NewClient crée un nouveau client avec la configuration donnée
type ClientConfig struct {
	ServerURL string
	Timeout   time.Duration
}

func NewClient(cfg *config.Config) (*Client, error) {
	// Utiliser le schéma configuré ou par défaut à "http"
	scheme := cfg.Server.Scheme
	if scheme == "" {
		scheme = "http"
	}

	baseURL, err := url.Parse(fmt.Sprintf("%s://%s:%d/api/v1", scheme, cfg.Server.Host, cfg.Server.Port))
	if err != nil {
		return nil, fmt.Errorf("invalid server URL: %w", err)
	}

	httpClient := &http.Client{
		Timeout: 30 * time.Second,
	}

	return &Client{
		baseURL:    baseURL,
		httpClient: httpClient,
		config:     cfg,
	}, nil
}

// SetAuthToken définit le token d'authentification
type SetAuthToken struct {
	Token string
}

func (c *Client) SetAuthToken(token string) {
	c.token = token
}

// GetAuthToken retourne le token d'authentification actuel
func (c *Client) GetAuthToken() string {
	return c.token
}

// Do exécute une requête HTTP
type RequestOptions struct {
	Method      string
	Path        string
	Body        interface{}
	Headers     map[string]string
	QueryParams map[string]string
}

type Response struct {
	StatusCode int
	Body       []byte
	Headers    http.Header
}

func (c *Client) Do(opts RequestOptions) (*Response, error) {
	// Construire l'URL
	url := *c.baseURL
	url.Path = pathJoin(c.baseURL.Path, opts.Path)

	// Ajouter les paramètres de requête
	if len(opts.QueryParams) > 0 {
		query := url.Query()
		for k, v := range opts.QueryParams {
			query.Set(k, v)
		}
		url.RawQuery = query.Encode()
	}

	// Créer la requête
	var req *http.Request
	var err error

	if opts.Body != nil {
		bodyBytes, err := json.Marshal(opts.Body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal request body: %w", err)
		}
		req, err = http.NewRequest(opts.Method, url.String(), bytes.NewBuffer(bodyBytes))
	} else {
		req, err = http.NewRequest(opts.Method, url.String(), nil)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Ajouter les headers
	req.Header.Set("Content-Type", "application/json")
	if c.token != "" {
		req.Header.Set("Authorization", "Bearer "+c.token)
	}

	// Ajouter les headers personnalisés
	for k, v := range opts.Headers {
		req.Header.Set(k, v)
	}

	// Exécuter la requête
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Lire le corps de la réponse
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	return &Response{
		StatusCode: resp.StatusCode,
		Body:       body,
		Headers:    resp.Header,
	}, nil
}

// Login authentifie l'utilisateur et retourne un token
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func (c *Client) Login(username, password string) (*LoginResponse, error) {
	req := LoginRequest{
		Username: username,
		Password: password,
	}

	resp, err := c.Do(RequestOptions{
		Method: "POST",
		Path:   "/auth/login",
		Body:   req,
	})
	if err != nil {
		return nil, fmt.Errorf("login request failed: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("login failed with status %d: %s", resp.StatusCode, string(resp.Body))
	}

	var loginResp LoginResponse
	if err := json.Unmarshal(resp.Body, &loginResp); err != nil {
		return nil, fmt.Errorf("failed to parse login response: %w", err)
	}

	c.token = loginResp.Token
	return &loginResp, nil
}

// GetSystemInfo récupère les informations système
type SystemInfoResponse struct {
	Hostname    string `json:"hostname"`
	Platform    string `json:"platform"`
	Architecture string `json:"architecture"`
	Kernel      string `json:"kernel"`
	Uptime      string `json:"uptime"`
	LoadAverage string `json:"load_average"`
}

func (c *Client) GetSystemInfo() (*SystemInfoResponse, error) {
	resp, err := c.Do(RequestOptions{
		Method: "GET",
		Path:   "/home/dashboard/system-info",
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get system info: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get system info with status %d: %s", resp.StatusCode, string(resp.Body))
	}

	var systemInfo SystemInfoResponse
	if err := json.Unmarshal(resp.Body, &systemInfo); err != nil {
		return nil, fmt.Errorf("failed to parse system info response: %w", err)
	}

	return &systemInfo, nil
}

// GetMemoryInfo récupère les informations mémoire
type MemoryInfoResponse struct {
	Total     int64  `json:"total"`
	Available int64  `json:"available"`
	Used      int64  `json:"used"`
	Percent   float64 `json:"percent"`
}

func (c *Client) GetMemoryInfo() (*MemoryInfoResponse, error) {
	resp, err := c.Do(RequestOptions{
		Method: "GET",
		Path:   "/home/dashboard/memory-info",
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get memory info: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get memory info with status %d: %s", resp.StatusCode, string(resp.Body))
	}

	var memoryInfo MemoryInfoResponse
	if err := json.Unmarshal(resp.Body, &memoryInfo); err != nil {
		return nil, fmt.Errorf("failed to parse memory info response: %w", err)
	}

	return &memoryInfo, nil
}

// GetDiskInfo récupère les informations disque
type DiskInfoResponse struct {
	Size     string `json:"size"`
	Used     string `json:"used"`
	Available string `json:"available"`
	Percent  string `json:"percent"`
}

func (c *Client) GetDiskInfo() (*DiskInfoResponse, error) {
	resp, err := c.Do(RequestOptions{
		Method: "GET",
		Path:   "/home/dashboard/disk-info",
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get disk info: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get disk info with status %d: %s", resp.StatusCode, string(resp.Body))
	}

	var diskInfo DiskInfoResponse
	if err := json.Unmarshal(resp.Body, &diskInfo); err != nil {
		return nil, fmt.Errorf("failed to parse disk info response: %w", err)
	}

	return &diskInfo, nil
}

// pathJoin joint deux chemins URL de manière sécurisée
type pathJoin struct {
	base string
	path string
}

func pathJoin(base, path string) string {
	base = strings.TrimSuffix(base, "/")
	path = strings.TrimPrefix(path, "/")
	return base + "/" + path
}
