package ui

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/fatih/color"
	"github.com/olekukonko/tablewriter"
	"gopkg.in/yaml.v3"
)

// OutputFormat représente le format de sortie
type OutputFormat string

const (
	OutputFormatTable OutputFormat = "table"
	OutputFormatJSON  OutputFormat = "json"
	OutputFormatYAML  OutputFormat = "yaml"
)

// PrintTable affiche les données sous forme de tableau
func PrintTable(header []string, rows [][]string, colorEnabled bool) {
	if colorEnabled {
		color.New(color.FgCyan).Println("\n" + header[0] + "\n")
	}

	// Créer un buffer pour capturer la sortie
	buf := new(bytes.Buffer)
	table := tablewriter.NewWriter(buf)
	table.SetHeader(header)
	table.SetBorder(false)
	table.SetHeaderAlignment(tablewriter.ALIGN_LEFT)
	table.SetAlignment(tablewriter.ALIGN_LEFT)
	table.SetCenterSeparator("")
	table.SetColumnSeparator("")
	table.SetRowSeparator("")
	table.SetHeaderLine(false)
	table.SetTablePadding(" ")
	table.SetNoWhiteSpace(false)

	for _, row := range rows {
		table.Append(row)
	}

	table.Render()
	fmt.Print(buf.String())
}

// PrintJSON affiche les données au format JSON
func PrintJSON(data interface{}) error {
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}
	fmt.Println(string(jsonData))
	return nil
}

// PrintYAML affiche les données au format YAML
func PrintYAML(data interface{}) error {
	yamlData, err := yaml.Marshal(data)
	if err != nil {
		return err
	}
	fmt.Println(string(yamlData))
	return nil
}

// PrintSuccess affiche un message de succès
func PrintSuccess(message string, colorEnabled bool) {
	if colorEnabled {
		color.New(color.FgGreen).Println("✓ " + message)
	} else {
		fmt.Println("✓ " + message)
	}
}

// PrintError affiche un message d'erreur
func PrintError(message string, colorEnabled bool) {
	if colorEnabled {
		color.New(color.FgRed).Println("✗ " + message)
	} else {
		fmt.Println("✗ " + message)
	}
}

// PrintInfo affiche un message d'information
func PrintInfo(message string, colorEnabled bool) {
	if colorEnabled {
		color.New(color.FgBlue).Println("ℹ " + message)
	} else {
		fmt.Println("ℹ " + message)
	}
}

// PrintWarning affiche un message d'avertissement
func PrintWarning(message string, colorEnabled bool) {
	if colorEnabled {
		color.New(color.FgYellow).Println("⚠ " + message)
	} else {
		fmt.Println("⚠ " + message)
	}
}

// PrintHeader affiche un en-tête
func PrintHeader(title string, colorEnabled bool) {
	if colorEnabled {
		color.New(color.FgCyan, color.Bold).Println("\n" + title + "\n")
		color.New(color.FgCyan).Println("=" + strings.Repeat("=", len(title)) + "\n")
	} else {
		fmt.Printf("\n%s\n", title)
		fmt.Printf("%s\n\n", strings.Repeat("=", len(title)+2))
	}
}

// PrintSection affiche une section
func PrintSection(title string, colorEnabled bool) {
	if colorEnabled {
		color.New(color.FgCyan, color.Bold).Println("\n" + title + "")
	} else {
		fmt.Printf("\n%s\n", title)
	}
}

// PrintKeyValue affiche une paire clé-valeur
func PrintKeyValue(key, value string, colorEnabled bool) {
	if colorEnabled {
		color.New(color.FgYellow).Printf("%s: ", key)
		color.New(color.FgWhite).Println(value)
	} else {
		fmt.Printf("%s: %s\n", key, value)
	}
}
