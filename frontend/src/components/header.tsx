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
import { Menu, X } from "lucide-react"; // Import X icon for close button
import React from "react";
import { LineShadowText } from "./ui/line-shadow-text";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet"; // Import Sheet components

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
    <header className="sticky top-0 z-50 w-full bg-gradient-to-br from-background via-muted/20 to-background text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Project Title */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-3xl font-bold tracking-tight text-primary hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-colors">
            <LineShadowText className="italic">Tourify</LineShadowText>
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
          {/* Hamburger for mobile using SheetTrigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden ml-2"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4 max-w-xs p-6 flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
                <SheetDescription className="sr-only">Mobile navigation menu</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-4 flex-1">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className="px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus:outline-none transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6 flex gap-2 justify-end">
                <ModeToggle />
                <UserButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default Header;
