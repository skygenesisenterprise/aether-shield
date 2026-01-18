"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Settings, User, LogOut, Menu } from "lucide-react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-700 hover:bg-gray-100"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-700 hover:bg-gray-100"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 pl-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Administrator</p>
            <p className="text-xs text-muted-foreground">admin@aether.local</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
