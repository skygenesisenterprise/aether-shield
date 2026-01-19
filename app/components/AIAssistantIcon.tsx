"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Chatbot } from "@/components/Chatbot";

type AssistantState = "idle" | "notification" | "alert";

interface AIAssistantIconProps {
  onClick?: () => void;
  className?: string;
  initialState?: AssistantState;
}

export function AIAssistantIcon({
  onClick,
  className,
  initialState = "idle",
}: AIAssistantIconProps) {
  const [state, setState] = useState<AssistantState>(initialState);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleClick = () => {
    setIsChatOpen(!isChatOpen);
    onClick?.();
    if (state === "notification" || state === "alert") {
      setState("idle");
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const getStateStyles = () => {
    switch (state) {
      case "notification":
        return "animate-pulse-soft";
      case "alert":
        return "animate-glow";
      default:
        return "";
    }
  };

  const getIndicatorColor = () => {
    switch (state) {
      case "notification":
        return "fill-blue-500";
      case "alert":
        return "fill-orange-500";
      default:
        return "fill-transparent";
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full",
          "bg-gradient-to-br from-slate-800 to-slate-900",
          "border border-slate-700 shadow-lg shadow-slate-900/50",
          "flex items-center justify-center",
          "transition-all duration-300 ease-out",
          "hover:scale-105 hover:shadow-xl hover:shadow-slate-900/70",
          "active:scale-95",
          "z-50",
          getStateStyles(),
          isChatOpen &&
            "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900",
          className,
        )}
      >
        {/* SVG Icon - Shield with AI element */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "transition-all duration-300",
            isHovered && "scale-110",
          )}
        >
          {/* Shield shape */}
          <path
            d="M12 2L4 7V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V7L12 2Z"
            className="fill-slate-700 stroke-slate-400"
            strokeWidth="1.5"
          />

          {/* Inner shield highlight */}
          <path
            d="M12 5L8 7.5V11C8 13.5 9.5 15.5 12 16.5C14.5 15.5 16 13.5 16 11V7.5L12 5Z"
            className="fill-slate-600"
            opacity="0.5"
          />

          {/* AI spark element */}
          <g
            className={cn(
              "transition-all duration-500",
              isHovered && "opacity-100",
            )}
          >
            {/* Central spark */}
            <circle
              cx="12"
              cy="11"
              r="1.5"
              className="fill-blue-400"
              opacity={isHovered ? "1" : "0.7"}
            />

            {/* Radiating lines */}
            <path
              d="M12 7L12 9M12 13L12 15M8 11L10 11M14 11L16 11"
              className="stroke-blue-400"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity={isHovered ? "0.8" : "0.4"}
            />
          </g>

          {/* Status indicator dot */}
          <circle
            cx="18"
            cy="6"
            r="2"
            className={cn("transition-all duration-300", getIndicatorColor())}
          />

          {/* Subtle glow effect */}
          <circle
            cx="12"
            cy="11"
            r="8"
            className="fill-none stroke-blue-400/20"
            strokeWidth="0.5"
            opacity={isHovered ? "0.6" : "0"}
          />
        </svg>

        {/* Tooltip on hover */}
        {isHovered && !isChatOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
            Assistant IA Aether Shield
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
          </div>
        )}
      </button>

      {/* Chatbot */}
      <Chatbot isOpen={isChatOpen} onClose={handleCloseChat} />
    </>
  );
}
