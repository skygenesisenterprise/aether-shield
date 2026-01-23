package unit

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/client"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/config"
	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/context"
)

func TestClientGet(t *testing.T) {
	testCases := []struct {
		name           string
		statusCode     int
		responseBody   string
		wantError      bool
		expectedData   interface{}
	}{
		{
			name:           "Successful GET request",
			statusCode:     http.StatusOK,
			responseBody:   `{"message": "success"}`,
			wantError:      false,
			expectedData:   map[string]interface{}{"message": "success"},
		},
		{
			name:           "GET request with error",
			statusCode:     http.StatusInternalServerError,
			responseBody:   `{"error": "internal server error"}`,
			wantError:      true,
			expectedData:   nil,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Créer un serveur de test
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(tc.statusCode)
				w.Write([]byte(tc.responseBody))
			}))
			defer server.Close()

			// Créer une configuration de test
			cfg := config.DefaultConfig()
			cfg.Server.URL = server.URL
			cfg.Server.Timeout = 30

			// Créer un contexte de test
			ctx := context.New(cfg)

			// Créer un client
			cli := client.NewClient(ctx)

			// Tester la requête GET
			var result map[string]interface{}
			err := cli.Get("/test", &result)

			if tc.wantError {
				if err == nil {
					t.Errorf("Expected error, got nil")
				}
			} else {
				if err != nil {
					t.Errorf("Unexpected error: %v", err)
				}

				if result == nil {
					t.Error("Expected non-nil result")
				}
			}
		}))
	}
}

func TestClientPost(t *testing.T) {
	testCases := []struct {
		name           string
		statusCode     int
		responseBody   string
		wantError      bool
		expectedData   interface{}
	}{
		{
			name:           "Successful POST request",
			statusCode:     http.StatusCreated,
			responseBody:   `{"id": "123", "message": "created"}`,
			wantError:      false,
			expectedData:   map[string]interface{}{"id": "123", "message": "created"},
		},
		{
			name:           "POST request with error",
			statusCode:     http.StatusBadRequest,
			responseBody:   `{"error": "bad request"}`,
			wantError:      true,
			expectedData:   nil,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Créer un serveur de test
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if r.Method != "POST" {
					t.Errorf("Expected POST method, got %s", r.Method)
				}
				w.WriteHeader(tc.statusCode)
				w.Write([]byte(tc.responseBody))
			}))
			defer server.Close()

			// Créer une configuration de test
			cfg := config.DefaultConfig()
			cfg.Server.URL = server.URL
			cfg.Server.Timeout = 30

			// Créer un contexte de test
			ctx := context.New(cfg)

			// Créer un client
			cli := client.NewClient(ctx)

			// Tester la requête POST
			requestData := map[string]interface{}{"name": "test"}
			var result map[string]interface{}
			err := cli.Post("/test", requestData, &result)

			if tc.wantError {
				if err == nil {
					t.Errorf("Expected error, got nil")
				}
			} else {
				if err != nil {
					t.Errorf("Unexpected error: %v", err)
				}

				if result == nil {
					t.Error("Expected non-nil result")
				}
			}
		}))
	}
}

func TestClientDelete(t *testing.T) {
	testCases := []struct {
		name       string
		statusCode int
		wantError  bool
	}{
		{
			name:       "Successful DELETE request",
			statusCode: http.StatusNoContent,
			wantError:  false,
		},
		{
			name:       "DELETE request with error",
			statusCode: http.StatusNotFound,
			wantError:  true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Créer un serveur de test
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if r.Method != "DELETE" {
					t.Errorf("Expected DELETE method, got %s", r.Method)
				}
				w.WriteHeader(tc.statusCode)
			}))
			defer server.Close()

			// Créer une configuration de test
			cfg := config.DefaultConfig()
			cfg.Server.URL = server.URL
			cfg.Server.Timeout = 30

			// Créer un contexte de test
			ctx := context.New(cfg)

			// Créer un client
			cli := client.NewClient(ctx)

			// Tester la requête DELETE
			err := cli.Delete("/test/123")

			if tc.wantError {
				if err == nil {
					t.Errorf("Expected error, got nil")
				}
			} else {
				if err != nil {
					t.Errorf("Unexpected error: %v", err)
				}
			}
		}))
	}
}