# Architecture du CLI Shield

## Vue d'ensemble

Le CLI Shield est un client en ligne de commande pour gérer le firewall Aether-Shield. Il fournit une interface de ligne de commande complète pour toutes les fonctionnalités disponibles dans l'interface web.

## Structure du projet

```
package/cli/
├── cmd/                  # Commandes principales du CLI
├── internal/             # Code interne et modules partagés
├── pkg/                  # Packages publics et API
├── server/               # Serveur backend (si nécessaire)
├── web/                  # Interface web (si nécessaire)
├── examples/             # Exemples d'utilisation
├── go.mod                # Module Go
├── main.go               # Point d'entrée principal
├── Makefile              # Scripts de build
├── Dockerfile            # Configuration Docker
├── docker-compose.yml    # Configuration Docker Compose
└── architecture.md       # Ce fichier
```

## Modules principaux

### 1. Commandes (cmd/)

Le module `cmd/` contient les commandes principales du CLI. Chaque commande est organisée par fonctionnalité.

**Structure proposée :**

```
cmd/
├── firewall/             # Commandes pour le pare-feu
│   ├── aliases/          # Gestion des alias
│   ├── rules/            # Gestion des règles
│   ├── groups/           # Gestion des groupes
│   ├── nat/              # Gestion du NAT
│   ├── shaper/           # Gestion du trafic
│   └── log/              # Journaux du pare-feu
├── interfaces/          # Commandes pour les interfaces réseau
│   ├── overview/         # Vue d'ensemble des interfaces
│   ├── settings/         # Configuration des interfaces
│   ├── wan/              # Configuration WAN
│   ├── wireless/         # Configuration Wi-Fi
│   └── virtual-ips/      # Adresses IP virtuelles
├── services/            # Commandes pour les services
│   ├── dhcp/             # DHCP
│   ├── dns/              # DNS
│   ├── unbound_dns/      # Unbound DNS
│   ├── openvpn/          # OpenVPN
│   └── wireguard/        # WireGuard
├── system/              # Commandes système
│   ├── status/           # Statut du système
│   ├── logs/             # Journaux système
│   ├── config/           # Configuration
│   ├── firmware/         # Mise à jour du firmware
│   └── diagnostics/      # Diagnostics
├── vpn/                 # Commandes VPN
│   ├── ipsec/            # IPsec
│   ├── openvpn/          # OpenVPN
│   └── wireguard/        # WireGuard
├── report/              # Commandes de rapport
│   ├── health/           # Santé du système
│   ├── traffic/          # Trafic réseau
│   └── netflow/          # NetFlow
└── auth/                # Authentification
```

### 2. Modules internes (internal/)

Le module `internal/` contient le code interne et les modules partagés.

**Structure proposée :**

```
internal/
├── auth/                 # Gestion de l'authentification JWT
├── client/               # Client HTTP pour l'API
├── config/               # Gestion de la configuration
├── context/              # Contexte d'exécution
├── logger/               # Journalisation
├── menu/                 # Interface interactive (optionnelle)
├── ui/                   # Interface utilisateur (couleurs, formats)
└── utils/                # Utilitaires divers
```

### 3. Packages publics (pkg/)

Le module `pkg/` contient les packages publics qui peuvent être utilisés par d'autres projets.

**Structure proposée :**

```
pkg/
├── api/                  # Client API public
├── types/                # Types et structures de données
└── errors/               # Gestion des erreurs
```

## Flux de données

### Authentification

1. L'utilisateur se connecte avec `shield login`
2. Le CLI stocke le token JWT dans le fichier de configuration
3. Toutes les requêtes ultérieures incluent le token dans l'en-tête Authorization

### Commandes

1. L'utilisateur exécute une commande (ex: `shield firewall rules list`)
2. Le CLI construit la requête HTTP appropriée
3. Le client envoie la requête au serveur avec le token JWT
4. Le serveur traite la requête et retourne la réponse
5. Le CLI affiche les résultats au format approprié (JSON, table, etc.)

## Configuration

Le CLI utilise un fichier de configuration YAML pour stocker les paramètres.

**Fichier de configuration par défaut :** `~/.shield/config.yaml`

**Exemple de configuration :**

```yaml
server:
  url: https://firewall.example.com
  timeout: 30
  insecure_skip_verify: false

auth:
  token: "" # Token JWT
  username: "admin"

output:
  format: table # table, json, yaml
  color: true

logging:
  level: info # debug, info, warn, error
  file: "" # Chemin vers le fichier de log
```

## Commandes principales

### Authentification

- `shield login` - Se connecter au serveur
- `shield logout` - Se déconnecter
- `shield whoami` - Afficher l'utilisateur actuel

### Pare-feu

- `shield firewall rules list` - Lister les règles
- `shield firewall rules add` - Ajouter une règle
- `shield firewall rules delete` - Supprimer une règle
- `shield firewall aliases list` - Lister les alias
- `shield firewall nat list` - Lister les règles NAT

### Interfaces réseau

- `shield interfaces list` - Lister les interfaces
- `shield interfaces status` - Afficher le statut
- `shield interfaces wan status` - Afficher le statut WAN

### Services

- `shield services dhcp list` - Lister les configurations DHCP
- `shield services dns status` - Afficher le statut DNS
- `shield services restart` - Redémarrer un service

### Système

- `shield system status` - Afficher le statut du système
- `shield system logs` - Afficher les journaux
- `shield system reboot` - Redémarrer le système
- `shield system shutdown` - Éteindre le système

### VPN

- `shield vpn openvpn list` - Lister les configurations OpenVPN
- `shield vpn wireguard list` - Lister les configurations WireGuard
- `shield vpn ipsec status` - Afficher le statut IPsec

### Rapports

- `shield report health` - Afficher la santé du système
- `shield report traffic` - Afficher le trafic réseau

## Format de sortie

Le CLI supporte plusieurs formats de sortie :

- **Table** (par défaut) : Format lisible pour l'utilisateur
- **JSON** : Format JSON pour l'automatisation
- **YAML** : Format YAML pour la configuration

**Exemple :**

```bash
# Format table (par défaut)
shield firewall rules list

# Format JSON
shield firewall rules list --format json

# Format YAML
shield firewall rules list --format yaml
```

## Dépendances

### Dépendances Go

- `github.com/spf13/cobra` - Framework pour les applications CLI
- `github.com/spf13/viper` - Gestion de la configuration
- `github.com/spf13/pflag` - Gestion des flags
- `github.com/fatih/color` - Couleurs dans la sortie console
- `github.com/olekukonko/tablewriter` - Tables formatées
- `gopkg.in/yaml.v3` - Support YAML
- `github.com/dgrijalva/jwt-go` - Gestion JWT

### Dépendances JavaScript (si nécessaire)

- `axios` - Client HTTP
- `commander` - Framework CLI (alternative à Cobra)
- `chalk` - Couleurs dans la sortie console
- `cli-table3` - Tables formatées
- `yaml` - Support YAML
- `jsonwebtoken` - Gestion JWT

## Développement

### Prérequis

- Go 1.25.5 ou supérieur
- Node.js 20.x ou supérieur (si web)
- Docker (optionnel)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/skygenesisenterprise/aether-shield.git
cd aether-shield/package/cli

# Installer les dépendances
go mod download

# Build
go build -o shield main.go

# Installer globalement
sudo cp shield /usr/local/bin/shield
```

### Exécution

```bash
# Mode interactif
shield

# Mode non interactif
shield firewall rules list
```

### Tests

```bash
# Tests unitaires
go test ./...

# Tests d'intégration
go test -tags=integration ./...
```

### Build Docker

```bash
# Build l'image Docker
docker build -t shield-cli .

# Exécuter dans un conteneur
docker run -it shield-cli
```

## Roadmap

### Version 1.0 (MVP)

- ✅ Authentification JWT
- ✅ Commandes de base pour le pare-feu
- ✅ Commandes pour les interfaces réseau
- ✅ Commandes pour les services
- ✅ Commandes système de base
- ✅ Support multi-format (table, JSON, YAML)

### Version 1.1

- Commandes VPN complètes
- Commandes de rapport avancées
- Mode interactif amélioré
- Autocomplétion

### Version 1.2

- Support pour les scripts et automatisation
- Plugins personnalisés
- Interface web intégrée
- Support multi-langue

## Contribution

Les contributions sont les bienvenues ! Veuillez suivre les directives de contribution du projet principal.

### Bonnes pratiques

1. **Nommage des commandes** : Utiliser des noms courts et intuitifs
2. **Consistance** : Suivre les conventions existantes
3. **Documentation** : Documenter chaque commande avec des exemples
4. **Tests** : Écrire des tests pour chaque nouvelle fonctionnalité
5. **Sécurité** : Toujours valider les entrées utilisateur

## Licence

Ce projet est sous licence [LICENSE](LICENSE).
