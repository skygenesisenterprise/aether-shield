package unit

import (
	"testing"
	"time"

	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/auth"
)

func TestGenerateToken(t *testing.T) {
	testCases := []struct {
		name     string
		username string
		role     string
		expiresAt time.Time
		wantError bool
	}{
		{
			name:     "Valid token generation",
			username: "admin",
			role:     "admin",
			expiresAt: time.Now().Add(24 * time.Hour),
			wantError: false,
		},
		{
			name:     "Empty username",
			username: "",
			role:     "admin",
			expiresAt: time.Now().Add(24 * time.Hour),
			wantError: false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			token, err := auth.GenerateToken(tc.username, tc.role, tc.expiresAt)

			if tc.wantError {
				if err == nil {
					t.Errorf("Expected error, got nil")
				}
			} else {
				if err != nil {
					t.Errorf("Unexpected error: %v", err)
				}

				if token == "" {
					t.Error("Expected non-empty token")
				}

				// Vérifier que le token peut être parsé
				claims, err := auth.ParseToken(token)
				if err != nil {
					t.Errorf("Failed to parse generated token: %v", err)
				}

				if claims.Username != tc.username {
					t.Errorf("Expected username %s, got %s", tc.username, claims.Username)
				}

				if claims.Role != tc.role {
					t.Errorf("Expected role %s, got %s", tc.role, claims.Role)
				}
			}
		})
	}
}

func TestParseToken(t *testing.T) {
	testCases := []struct {
		name      string
		token     string
		wantError bool
	}{
		{
			name:      "Valid token",
			token:     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNjg5NDc3Nzc3LCJpYXQiOjE2ODk0NzQxNzcsImlzcyI6ImFldGhlci1zaGllbGQifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			wantError: false,
		},
		{
			name:      "Invalid token",
			token:     "invalid.token.here",
			wantError: true,
		},
		{
			name:      "Empty token",
			token:     "",
			wantError: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			claims, err := auth.ParseToken(tc.token)

			if tc.wantError {
				if err == nil {
					t.Errorf("Expected error, got nil")
				}
			} else {
				if err != nil {
					t.Errorf("Unexpected error: %v", err)
				}

				if claims == nil {
					t.Error("Expected non-nil claims")
				}
			}
		})
	}
}

func TestIsTokenExpired(t *testing.T) {
	testCases := []struct {
		name      string
		token     string
		wantExpired bool
	}{
		{
			name:      "Expired token",
			token:     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNjg5NDc3Nzc3LCJpYXQiOjE2ODk0NzQxNzcsImlzcyI6ImFldGhlci1zaGllbGQifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			wantExpired: true,
		},
		{
			name:      "Valid token",
			token:     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNzQ1MDQ0NTc3LCJpYXQiOjE2ODk0NzQxNzcsImlzcyI6ImFldGhlci1zaGllbGQifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			wantExpired: false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			expired := auth.IsTokenExpired(tc.token)

			if expired != tc.wantExpired {
				t.Errorf("Expected expired=%v, got %v", tc.wantExpired, expired)
			}
		})
	}
}

func TestValidateToken(t *testing.T) {
	testCases := []struct {
		name      string
		token     string
		wantError bool
	}{
		{
			name:      "Valid token",
			token:     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNzQ1MDQ0NTc3LCJpYXQiOjE2ODk0NzQxNzcsImlzcyI6ImFldGhlci1zaGllbGQifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			wantError: false,
		},
		{
			name:      "Invalid token",
			token:     "invalid.token.here",
			wantError: true,
		},
		{
			name:      "Empty token",
			token:     "",
			wantError: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			err := auth.ValidateToken(tc.token)

			if tc.wantError {
				if err == nil {
					t.Errorf("Expected error, got nil")
				}
			} else {
				if err != nil {
					t.Errorf("Unexpected error: %v", err)
				}
			}
		})
	}
}