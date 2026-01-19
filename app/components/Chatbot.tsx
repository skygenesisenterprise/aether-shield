"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  parseCommand,
  getCommand,
  getCommandSuggestions,
  getAllCommands,
  Command,
  CommandContext,
  CommandResult,
} from "@/lib/commands";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Bonjour ! Je suis votre assistant IA pour Aether Shield. Comment puis-je vous aider aujourd'hui ?\n\n💡 **Astuce**: Utilisez `/help` pour voir les commandes disponibles.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Vérifier si c'est une commande
    const { command, args } = parseCommand(inputValue);

    if (command) {
      const commandObj = getCommand(command);

      if (commandObj) {
        const context: CommandContext = {
          messages,
          setMessages,
          setInputValue,
          setIsTyping,
        };

        const result: CommandResult = commandObj.handler(args, context);

        // Ajouter le message de résultat de la commande
        setTimeout(() => {
          const commandMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: result.message,
            sender: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, commandMessage]);
        }, 300);

        setInputValue("");
        return;
      } else {
        // Commande non trouvée
        setTimeout(() => {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `❌ Commande inconnue: \`/${command}\`\nUtilisez \`/help\` pour voir les commandes disponibles.`,
            sender: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }, 300);

        setInputValue("");
        return;
      }
    }

    setInputValue("");
    setIsTyping(true);

    // Simuler une réponse de l'IA pour les messages normaux
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Je comprends votre demande. Je suis en train d'analyser les informations de votre système Aether Shield pour vous fournir la meilleure réponse possible.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);

    // Gérer l'autocomplétion
    if (value.startsWith("/")) {
      const commandSuggestions = getCommandSuggestions(value);
      setSuggestions(commandSuggestions);
      setShowSuggestions(commandSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion + " ");
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Gérer la navigation dans les suggestions
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (suggestions.length === 1) {
          handleSuggestionClick(suggestions[0]);
        } else if (inputValue === "/" && suggestions.length > 0) {
          handleSuggestionClick(suggestions[0]);
        }
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showSuggestions && selectedIndex >= 0) {
        handleSuggestionClick(suggestions[selectedIndex]);
        return;
      }
      handleSendMessage();
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Garder pour compatibilité, mais logique déplacée dans handleKeyDown
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L4 7V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V7L12 2Z"
                className="fill-white"
              />
              <circle cx="12" cy="11" r="1.5" className="fill-blue-200" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Assistant IA</h3>
            <p className="text-slate-400 text-xs">Aether Shield</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-3 py-2",
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-200 border border-slate-700",
              )}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p
                className={cn(
                  "text-xs mt-1",
                  message.sender === "user"
                    ? "text-blue-200"
                    : "text-slate-500",
                )}
              >
                {message.timestamp.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-3 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="relative">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => {
                if (inputValue.startsWith("/")) {
                  const commandSuggestions = getCommandSuggestions(inputValue);
                  setSuggestions(commandSuggestions);
                  setShowSuggestions(commandSuggestions.length > 0);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(false);
                  setSelectedIndex(-1);
                }, 200);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Tapez votre message ou /help..."
              className="flex-1 bg-slate-800 text-white placeholder-slate-400 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-lg px-3 py-2 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 max-h-32 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors flex items-center justify-between group"
                >
                  <span>{suggestion}</span>
                  <kbd className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Tab
                  </kbd>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
