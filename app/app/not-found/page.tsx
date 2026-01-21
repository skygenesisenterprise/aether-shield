"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
}

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    setStars(
      Array.from({ length: 150 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
      })),
    );
  }, []);

  useEffect(() => {
    // Shooting stars interval
    const shootingInterval = setInterval(() => {
      const newShootingStar: ShootingStar = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 30,
        angle: Math.random() * 30 + 15,
        speed: Math.random() * 3 + 2,
        length: Math.random() * 80 + 40,
      };
      setShootingStars((prev) => [...prev.slice(-3), newShootingStar]);
    }, 3000);

    return () => clearInterval(shootingInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / 50,
          y: (e.clientY - rect.top - rect.height / 2) / 50,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#0d1117] flex flex-col items-center justify-center px-4"
    >
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${2 + star.speed * 3}s`,
              transform: `translate(${mousePosition.x * star.speed * -1}px, ${mousePosition.y * star.speed * -1}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        ))}

        {/* Shooting Stars */}
        {shootingStars.map((shootingStar) => (
          <div
            key={shootingStar.id}
            className="absolute h-[2px] bg-linear-to-r from-white via-cyan-400 to-transparent animate-shooting-star"
            style={{
              left: `${shootingStar.x}%`,
              top: `${shootingStar.y}%`,
              width: `${shootingStar.length}px`,
              transform: `rotate(${shootingStar.angle}deg)`,
            }}
          />
        ))}
      </div>

      {/* Nebula Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)",
            left: "10%",
            top: "20%",
            transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
            transition: "transform 0.5s ease-out",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
            right: "5%",
            bottom: "10%",
            transform: `translate(${mousePosition.x * -1.5}px, ${mousePosition.y * -1.5}px)`,
            transition: "transform 0.5s ease-out",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="absolute -inset-1 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 opacity-30 blur-sm -z-10" />
          </div>
          <span className="text-white text-xl font-semibold tracking-tight">
            Sky Genesis <span className="text-cyan-400">Enterprise</span>
          </span>
        </div>

        {/* 404 Number with Parallax */}
        <div
          className="relative mb-6"
          style={{
            transform: `translate(${mousePosition.x * -2}px, ${mousePosition.y * -2}px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <h1 className="text-[180px] md:text-[220px] font-bold leading-none tracking-tighter bg-linear-to-b from-white via-slate-300 to-slate-600 bg-clip-text text-transparent select-none">
            404
          </h1>
          <div className="absolute inset-0 text-[180px] md:text-[220px] font-bold leading-none tracking-tighter text-cyan-500/10 blur-xl select-none">
            404
          </div>
        </div>

        {/* Floating Astronaut / Satellite */}
        <div
          className="absolute top-1/4 right-0 md:right-10 opacity-80"
          style={{
            transform: `translate(${mousePosition.x * 3}px, ${mousePosition.y * 3}px)`,
            transition: "transform 0.4s ease-out",
          }}
        >
          <div className="relative animate-float">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              className="drop-shadow-2xl"
            >
              {/* Satellite Body */}
              <rect
                x="40"
                y="45"
                width="40"
                height="30"
                rx="4"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <rect
                x="45"
                y="50"
                width="12"
                height="8"
                rx="2"
                fill="#38bdf8"
                opacity="0.5"
              />
              <rect
                x="60"
                y="50"
                width="15"
                height="20"
                rx="2"
                fill="#0f172a"
                stroke="#64748b"
                strokeWidth="1"
              />
              {/* Solar Panels */}
              <rect
                x="5"
                y="52"
                width="30"
                height="16"
                rx="2"
                fill="#0ea5e9"
                opacity="0.8"
              />
              <rect
                x="85"
                y="52"
                width="30"
                height="16"
                rx="2"
                fill="#0ea5e9"
                opacity="0.8"
              />
              {/* Panel Lines */}
              <line
                x1="12"
                y1="52"
                x2="12"
                y2="68"
                stroke="#0369a1"
                strokeWidth="1"
              />
              <line
                x1="20"
                y1="52"
                x2="20"
                y2="68"
                stroke="#0369a1"
                strokeWidth="1"
              />
              <line
                x1="28"
                y1="52"
                x2="28"
                y2="68"
                stroke="#0369a1"
                strokeWidth="1"
              />
              <line
                x1="92"
                y1="52"
                x2="92"
                y2="68"
                stroke="#0369a1"
                strokeWidth="1"
              />
              <line
                x1="100"
                y1="52"
                x2="100"
                y2="68"
                stroke="#0369a1"
                strokeWidth="1"
              />
              <line
                x1="108"
                y1="52"
                x2="108"
                y2="68"
                stroke="#0369a1"
                strokeWidth="1"
              />
              {/* Antenna */}
              <line
                x1="60"
                y1="45"
                x2="60"
                y2="30"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <circle cx="60" cy="27" r="4" fill="#f43f5e" />
              <circle
                cx="60"
                cy="27"
                r="6"
                fill="#f43f5e"
                opacity="0.3"
                className="animate-ping"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            {"Lost in Space"}
          </h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            {
              "The page you're looking for has drifted into the cosmic void. Our satellites couldn't locate it."
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-105"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              {"Back to Home"}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all hover:scale-105"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              {"Go Back"}
            </Link>
          </Button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-slate-400">
            <Search className="h-5 w-5 text-cyan-400" />
            <span className="text-sm">
              {"Try searching or check the URL for typos"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-slate-500 text-sm">
          {"© 2026 Sky Genesis Enterprise. All rights reserved."}
        </p>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(2deg);
          }
          50% {
            transform: translateY(-5px) rotate(-1deg);
          }
          75% {
            transform: translateY(-15px) rotate(1deg);
          }
        }

        @keyframes shooting-star {
          0% {
            opacity: 1;
            transform: translateX(0) rotate(inherit);
          }
          100% {
            opacity: 0;
            transform: translateX(300px) rotate(inherit);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-shooting-star {
          animation: shooting-star 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
