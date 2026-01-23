package client

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
)

// Client représente le client HTTP pour l'API
type Client struct {
	ctx     *context.Context
	baseURL string
	httpClient *http.Client
}

// NewClient crée un nouveau client HTTP
func NewClient(ctx *context.Context) *Client {
	return &Client{
		ctx:     ctx,
		baseURL: ctx.GetServerURL(),
		httpClient: &http.Client{
			Timeout: time.Duration(ctx.Config.Server.Timeout) * time.Second,
			Transport: &http.Transport{
				TLSClientConfig: &tls.Config{
					InsecureSkipVerify: ctx.Config.Server.InsecureSkipVerify,
				},
			},
		},
	}
}

// Get fait une requête GET
func (c *Client) Get(path string, target interface{}) error {
	req, err := http.NewRequest("GET", c.baseURL+path, nil)
	if err != nil {
		return fmt.Errorf("erreur lors de la création de la requête: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	token := c.ctx.GetToken()
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("erreur lors de l'envoi de la requête: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("erreur HTTP %d: %s", resp.StatusCode, string(body))
	}

	return json.NewDecoder(resp.Body).Decode(target)
}

// Post fait une requête POST
func (c *Client) Post(path string, body interface{}, target interface{}) error {
	jsonBody, err := json.Marshal(body)
	if err != nil {
		return fmt.Errorf("erreur lors de la sérialisation du corps: %w", err)
	}

	req, err := http.NewRequest("POST", c.baseURL+path, bytes.NewBuffer(jsonBody))
	if err != nil {
		return fmt.Errorf("erreur lors de la création de la requête: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	token := c.ctx.GetToken()
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("erreur lors de l'envoi de la requête: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("erreur HTTP %d: %s", resp.StatusCode, string(body))
	}

	if target != nil {
		return json.NewDecoder(resp.Body).Decode(target)
	}

	return nil
}

// Put fait une requête PUT
func (c *Client) Put(path string, body interface{}, target interface{}) error {
	jsonBody, err := json.Marshal(body)
	if err != nil {
		return fmt.Errorf("erreur lors de la sérialisation du corps: %w", err)
	}

	req, err := http.NewRequest("PUT", c.baseURL+path, bytes.NewBuffer(jsonBody))
	if err != nil {
		return fmt.Errorf("erreur lors de la création de la requête: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	token := c.ctx.GetToken()
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("erreur lors de l'envoi de la requête: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("erreur HTTP %d: %s", resp.StatusCode, string(body))
	}

	if target != nil {
		return json.NewDecoder(resp.Body).Decode(target)
	}

	return nil
}

// Delete fait une requête DELETE
func (c *Client) Delete(path string) error {
	req, err := http.NewRequest("DELETE", c.baseURL+path, nil)
	if err != nil {
		return fmt.Errorf("erreur lors de la création de la requête: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	token := c.ctx.GetToken()
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("erreur lors de l'envoi de la requête: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("erreur HTTP %d: %s", resp.StatusCode, string(body))
	}

	return nil
}
