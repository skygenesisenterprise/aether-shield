package unit

import (
	"bytes"
	"encoding/json"
	"os"
	"testing"

	"github.com/skygenesisenterprise/aether-shield/package/cli/internal/ui"
	"gopkg.in/yaml.v3"
)

func TestPrintTable(t *testing.T) {
	testCases := []struct {
		name      string
		color     bool
		header    []string
		rows      [][]string
		wantError bool
	}{
		{
			name:      "Print table with color",
			color:     true,
			header:    []string{"Name", "Age", "Role"},
			rows:      [][]string{{"John", "30", "Admin"}, {"Jane", "25", "User"}},
			wantError: false,
		},
		{
			name:      "Print table without color",
			color:     false,
			header:    []string{"Name", "Age", "Role"},
			rows:      [][]string{{"John", "30", "Admin"}, {"Jane", "25", "User"}},
			wantError: false,
		},
		{
			name:      "Print empty table",
			color:     true,
			header:    []string{"Name"},
			rows:      [][]string{},
			wantError: false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Sauvegarder la sortie standard
			oldStdout := os.Stdout
			rd, wr, _ := os.Pipe()
			os.Stdout = wr

			// Appeler la fonction
			ui.PrintTable(tc.header, tc.rows, tc.color)

			// Restaurer la sortie standard
			wr.Close()
			os.Stdout = oldStdout

			// Lire la sortie
			var buf bytes.Buffer
			buf.ReadFrom(rd)
			output := buf.String()

			// Vérifier que la sortie n'est pas vide
			if len(output) == 0 {
				t.Error("Expected non-empty output")
			}

			// Vérifier que les en-têtes sont présents
			for _, header := range tc.header {
				if !contains(output, header) {
					t.Errorf("Expected header %s not found in output", header)
				}
			}
		})
	}
}

func TestPrintJSON(t *testing.T) {
	testCases := []struct {
		name      string
		data      interface{}
		wantError bool
	}{
		{
			name:      "Print valid JSON",
			data:      map[string]interface{}{"name": "John", "age": 30},
			wantError: false,
		},
		{
			name:      "Print empty JSON",
			data:      map[string]interface{}{},
			wantError: false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Sauvegarder la sortie standard
			oldStdout := os.Stdout
			rd, wr, _ := os.Pipe()
			os.Stdout = wr

			// Appeler la fonction
			err := ui.PrintJSON(tc.data)

			// Restaurer la sortie standard
			wr.Close()
			os.Stdout = oldStdout

			if tc.wantError {
				if err == nil {
					t.Errorf("Expected error, got nil")
				}
			} else {
				if err != nil {
					t.Errorf("Unexpected error: %v", err)
				}

				// Lire la sortie
				var buf bytes.Buffer
				buf.ReadFrom(rd)
				output := buf.String()

				// Vérifier que la sortie n'est pas vide
				if len(output) == 0 {
					t.Error("Expected non-empty output")
				}

				// Vérifier que la sortie est un JSON valide
				var result map[string]interface{}
				if err := json.Unmarshal([]byte(output), &result); err != nil {
					t.Errorf("Output is not valid JSON: %v", err)
				}
			}
		})
	}
}

func TestPrintYAML(t *testing.T) {
	testCases := []struct {
		name      string
		data      interface{}
		wantError bool
	}{
		{
			name:      "Print valid YAML",
			data:      map[string]interface{}{"name": "John", "age": 30},
			wantError: false,
		},
		{
			name:      "Print empty YAML",
			data:      map[string]interface{}{},
			wantError: false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Sauvegarder la sortie standard
			oldStdout := os.Stdout
			rd, wr, _ := os.Pipe()
			os.Stdout = wr

			// Appeler la fonction
			err := ui.PrintYAML(tc.data)

			// Restaurer la sortie standard
			wr.Close()
			os.Stdout = oldStdout

			if tc.wantError {
				if err == nil {
					t.Errorf("Expected error, got nil")
				}
			} else {
				if err != nil {
					t.Errorf("Unexpected error: %v", err)
				}

				// Lire la sortie
				var buf bytes.Buffer
				buf.ReadFrom(rd)
				output := buf.String()

				// Vérifier que la sortie n'est pas vide
				if len(output) == 0 {
					t.Error("Expected non-empty output")
				}

				// Vérifier que la sortie est un YAML valide
				var result map[string]interface{}
				if err := yaml.Unmarshal([]byte(output), &result); err != nil {
					t.Errorf("Output is not valid YAML: %v", err)
				}
			}
		})
	}
}

func TestPrintMessages(t *testing.T) {
	testCases := []struct {
		name      string
		color     bool
		message   string
		printFunc func(string, bool)
	}{
		{
			name:      "Print success message",
			color:     true,
			message:   "Operation completed successfully",
			printFunc: ui.PrintSuccess,
		},
		{
			name:      "Print error message",
			color:     true,
			message:   "Operation failed",
			printFunc: ui.PrintError,
		},
		{
			name:      "Print info message",
			color:     true,
			message:   "This is an information message",
			printFunc: ui.PrintInfo,
		},
		{
			name:      "Print warning message",
			color:     true,
			message:   "This is a warning message",
			printFunc: ui.PrintWarning,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Sauvegarder la sortie standard
			oldStdout := os.Stdout
			rd, wr, _ := os.Pipe()
			os.Stdout = wr

			// Appeler la fonction
			tc.printFunc(tc.message, tc.color)

			// Restaurer la sortie standard
			wr.Close()
			os.Stdout = oldStdout

			// Lire la sortie
			var buf bytes.Buffer
			buf.ReadFrom(rd)
			output := buf.String()

			// Vérifier que la sortie n'est pas vide
			if len(output) == 0 {
				t.Error("Expected non-empty output")
			}

			// Vérifier que le message est présent
			if !contains(output, tc.message) {
				t.Errorf("Expected message %s not found in output", tc.message)
			}
		})
	}
}

func TestPrintHeader(t *testing.T) {
	testCases := []struct {
		name    string
		color   bool
		title   string
	}{
		{
			name:    "Print header with color",
			color:   true,
			title:   "System Information",
		},
		{
			name:    "Print header without color",
			color:   false,
			title:   "System Information",
		},
		{
			name:    "Print empty header",
			color:   true,
			title:   "",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Sauvegarder la sortie standard
			oldStdout := os.Stdout
			rd, wr, _ := os.Pipe()
			os.Stdout = wr

			// Appeler la fonction
			ui.PrintHeader(tc.title, tc.color)

			// Restaurer la sortie standard
			wr.Close()
			os.Stdout = oldStdout

			// Lire la sortie
			var buf bytes.Buffer
			buf.ReadFrom(rd)
			output := buf.String()

			// Vérifier que la sortie n'est pas vide
			if len(output) == 0 {
				t.Error("Expected non-empty output")
			}

			// Vérifier que le titre est présent
			if tc.title != "" && !contains(output, tc.title) {
				t.Errorf("Expected title %s not found in output", tc.title)
			}
		})
	}
}

func TestPrintSection(t *testing.T) {
	testCases := []struct {
		name    string
		color   bool
		title   string
	}{
		{
			name:    "Print section with color",
			color:   true,
			title:   "Network Interfaces",
		},
		{
			name:    "Print section without color",
			color:   false,
			title:   "Network Interfaces",
		},
		{
			name:    "Print empty section",
			color:   true,
			title:   "",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Sauvegarder la sortie standard
			oldStdout := os.Stdout
			rd, wr, _ := os.Pipe()
			os.Stdout = wr

			// Appeler la fonction
			ui.PrintSection(tc.title, tc.color)

			// Restaurer la sortie standard
			wr.Close()
			os.Stdout = oldStdout

			// Lire la sortie
			var buf bytes.Buffer
			buf.ReadFrom(rd)
			output := buf.String()

			// Vérifier que la sortie n'est pas vide
			if len(output) == 0 {
				t.Error("Expected non-empty output")
			}

			// Vérifier que le titre est présent
			if tc.title != "" && !contains(output, tc.title) {
				t.Errorf("Expected title %s not found in output", tc.title)
			}
		})
	}
}

func TestPrintKeyValue(t *testing.T) {
	testCases := []struct {
		name    string
		color   bool
		key     string
		value   string
	}{
		{
			name:    "Print key-value with color",
			color:   true,
			key:     "Hostname",
			value:   "server1.example.com",
		},
		{
			name:    "Print key-value without color",
			color:   false,
			key:     "Hostname",
			value:   "server1.example.com",
		},
		{
			name:    "Print empty key-value",
			color:   true,
			key:     "",
			value:   "",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Sauvegarder la sortie standard
			oldStdout := os.Stdout
			rd, wr, _ := os.Pipe()
			os.Stdout = wr

			// Appeler la fonction
			ui.PrintKeyValue(tc.key, tc.value, tc.color)

			// Restaurer la sortie standard
			wr.Close()
			os.Stdout = oldStdout

			// Lire la sortie
			var buf bytes.Buffer
			buf.ReadFrom(rd)
			output := buf.String()

			// Vérifier que la sortie n'est pas vide
			if len(output) == 0 {
				t.Error("Expected non-empty output")
			}

			// Vérifier que la clé et la valeur sont présents
			if tc.key != "" && !contains(output, tc.key) {
				t.Errorf("Expected key %s not found in output", tc.key)
			}
			if tc.value != "" && !contains(output, tc.value) {
				t.Errorf("Expected value %s not found in output", tc.value)
			}
		})
	}
}

// Helper function to check if a string contains another string
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > len(substr) && containsHelper(s, substr))
}

func containsHelper(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}