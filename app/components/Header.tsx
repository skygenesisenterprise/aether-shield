"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Settings, User, LogOut, Menu } from "lucide-react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-800 bg-gray-900 px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-300 hover:bg-gray-800"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-300 hover:bg-gray-800"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:bg-gray-800"
        >
          <Settings className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 pl-2">
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-300" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-200">Administrator</p>
            <p className="text-xs text-gray-400">admin@aether.local</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:bg-gray-800"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
