"use client";

import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@stackframe/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React from "react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "#about" },
  { label: "Pricing", to: "#pricing" },
];

interface HeaderProps {
  displayHeader?: boolean;
}

export function Header({ displayHeader = true }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (!displayHeader) return null;
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Project Title */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-3xl font-bold tracking-tight text-primary hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-colors">
            Arcade
          </Link>
        </div>

        {/* Center: Nav Links (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu className="bg-transparent shadow-none">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.to}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={link.to}
                      className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus:outline-none transition-colors"
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: ModeToggle & UserButton */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserButton />
          {/* Hamburger for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-2"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>
      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-background shadow-lg flex flex-col p-6 gap-4 animate-in slide-in-from-right-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold">Menu</span>
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <Menu className="h-6 w-6 rotate-90" />
              </Button>
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus:outline-none transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex gap-2">
              <ModeToggle />
              <UserButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
