export interface Command {
  name: string;
  description: string;
  usage: string;
  category: "general" | "conversation" | "system" | "advanced";
  handler: (args: string[], context: CommandContext) => CommandResult;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export interface CommandContext {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  setInputValue: (value: string) => void;
  setIsTyping: (typing: boolean) => void;
}

export interface CommandResult {
  success: boolean;
  message: string;
  action?: "clear" | "reset" | "export" | "theme";
  data?: unknown;
}

export const COMMANDS: Command[] = [
  {
    name: "help",
    description: "Affiche toutes les commandes disponibles",
    usage: "/help [catégorie]",
    category: "general",
    handler: (args) => {
      const category = args[0];

      if (category) {
        const filteredCommands = COMMANDS.filter(
          (cmd) => cmd.category === category,
        );
        if (filteredCommands.length === 0) {
          return {
            success: false,
            message: `Catégorie "${category}" non trouvée. Catégories disponibles: general, conversation, system, advanced`,
          };
        }

        const commandList = filteredCommands
          .map(
            (cmd) =>
              `**/${cmd.name}** - ${cmd.description}\n  Usage: \`${cmd.usage}\``,
          )
          .join("\n\n");

        return {
          success: true,
          message: `📋 Commandes de la catégorie **${category}**:\n\n${commandList}`,
        };
      }

      const commandsByCategory = COMMANDS.reduce(
        (acc, cmd) => {
          if (!acc[cmd.category]) acc[cmd.category] = [];
          acc[cmd.category].push(cmd);
          return acc;
        },
        {} as Record<string, Command[]>,
      );

      let helpText = "🤖 **Commandes disponibles**\n\n";

      Object.entries(commandsByCategory).forEach(([cat, commands]) => {
        const categoryIcons = {
          general: "🔧",
          conversation: "💬",
          system: "⚙️",
          advanced: "🚀",
        };

        helpText += `${categoryIcons[cat as keyof typeof categoryIcons]} **${cat.toUpperCase()}**\n`;
        commands.forEach((cmd) => {
          helpText += `  /${cmd.name} - ${cmd.description}\n`;
        });
        helpText += "\n";
      });

      helpText +=
        "💡 **Astuce**: Utilisez `/help [catégorie]` pour voir les détails d'une catégorie.";

      return { success: true, message: helpText };
    },
  },

  {
    name: "new",
    description: "Démarre une nouvelle conversation",
    usage: "/new",
    category: "conversation",
    handler: (args, context) => {
      context.setMessages([
        {
          id: Date.now().toString(),
          content:
            "🆕 Nouvelle conversation démarrée. Comment puis-je vous aider avec Aether Shield ?",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);

      return { success: true, message: "", action: "reset" };
    },
  },

  {
    name: "clear",
    description: "Efface tout l'historique de la conversation",
    usage: "/clear",
    category: "conversation",
    handler: (args, context) => {
      context.setMessages([]);
      return { success: true, message: "", action: "clear" };
    },
  },

  {
    name: "export",
    description: "Exporte la conversation au format JSON ou Markdown",
    usage: "/export [format]",
    category: "advanced",
    handler: (args, context) => {
      const format = args[0] || "markdown";
      const messages = context.messages;

      if (messages.length === 0) {
        return { success: false, message: "Aucun message à exporter." };
      }

      if (format === "json") {
        const exportData = {
          timestamp: new Date().toISOString(),
          messages: messages.map((msg) => ({
            sender: msg.sender,
            content: msg.content,
            timestamp: msg.timestamp,
          })),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `aether-shield-chat-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        return {
          success: true,
          message: "📄 Conversation exportée en JSON.",
          action: "export",
        };
      }

      if (format === "markdown") {
        let markdown = `# Conversation Aether Shield\n\n`;
        markdown += `*Exporté le: ${new Date().toLocaleString("fr-FR")}*\n\n---\n\n`;

        messages.forEach((msg) => {
          const sender = msg.sender === "user" ? "👤 Vous" : "🤖 Assistant";
          const time = msg.timestamp.toLocaleTimeString("fr-FR");
          markdown += `**${sender}** (${time}):\n${msg.content}\n\n`;
        });

        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `aether-shield-chat-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);

        return {
          success: true,
          message: "📝 Conversation exportée en Markdown.",
          action: "export",
        };
      }

      return {
        success: false,
        message:
          "Format non supporté. Utilisez: `/export json` ou `/export markdown`",
      };
    },
  },

  {
    name: "status",
    description: "Affiche le statut du système Aether Shield",
    usage: "/status",
    category: "system",
    handler: () => {
      const status = {
        firewall: "🟢 Actif",
        rules: "142 chargées",
        threats: "🟡 3 menaces détectées aujourd'hui",
        uptime: "15j 7h 32m",
        version: "v2.4.1",
      };

      let statusText = "📊 **Statut Aether Shield**\n\n";
      Object.entries(status).forEach(([key, value]) => {
        statusText += `**${key.charAt(0).toUpperCase() + key.slice(1)}**: ${value}\n`;
      });

      return { success: true, message: statusText };
    },
  },

  {
    name: "theme",
    description: "Change le thème d'affichage",
    usage: "/theme [light|dark|auto]",
    category: "system",
    handler: (args) => {
      const theme = args[0];

      if (!theme) {
        const currentTheme = document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
        return {
          success: true,
          message: `🎨 Thème actuel: **${currentTheme}**\nUtilisez \`/theme light\`, \`/theme dark\` ou \`/theme auto\` pour changer.`,
        };
      }

      if (theme === "light") {
        document.documentElement.classList.remove("dark");
        return {
          success: true,
          message: "☀️ Thème clair activé.",
          action: "theme",
        };
      }

      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        return {
          success: true,
          message: "🌙 Thème sombre activé.",
          action: "theme",
        };
      }

      if (theme === "auto") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        return {
          success: true,
          message: "🔄 Thème automatique activé.",
          action: "theme",
        };
      }

      return {
        success: false,
        message: "Thème non valide. Utilisez: `light`, `dark` ou `auto`.",
      };
    },
  },

  {
    name: "about",
    description: "Affiche des informations sur Aether Shield",
    usage: "/about",
    category: "general",
    handler: () => {
      return {
        success: true,
        message:
          `🛡️ **Aether Shield**\n\n` +
          `Firewall nouvelle génération orienté orchestration, sécurité et automatisation.\n\n` +
          `**Version**: v2.4.1\n` +
          `**Build**: 2024.01.15\n` +
          `**Architecture**: Next.js 16 + React 19\n\n` +
          `🚀 Fonctionnalités principales:\n` +
          `• Protection réseau avancée\n` +
          `• Automatisation des règles\n` +
          `• Monitoring en temps réel\n` +
          `• Assistant IA intégré\n\n` +
          `© 2024 Aether Shield - Open Source Security Platform`,
      };
    },
  },
];

export function parseCommand(input: string): {
  command: string | null;
  args: string[];
} {
  const trimmedInput = input.trim();

  if (!trimmedInput.startsWith("/")) {
    return { command: null, args: [] };
  }

  const parts = trimmedInput.slice(1).split(" ");
  const command = parts[0]?.toLowerCase();
  const args = parts.slice(1);

  return { command, args };
}

export function getCommand(name: string): Command | null {
  return COMMANDS.find((cmd) => cmd.name === name) || null;
}

export function getCommandSuggestions(partial: string): string[] {
  if (!partial.startsWith("/")) return [];

  const commandName = partial.slice(1).toLowerCase();

  // Si juste "/", afficher toutes les commandes
  if (commandName === "") {
    return COMMANDS.map((cmd) => `/${cmd.name}`);
  }

  return COMMANDS.filter((cmd) => cmd.name.startsWith(commandName)).map(
    (cmd) => `/${cmd.name}`,
  );
}

export function getAllCommands() {
  return COMMANDS;
}
