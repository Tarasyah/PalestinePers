"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { navItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [hidden, setHidden] = React.useState(false);
  const [isAtTop, setIsAtTop] = React.useState(true);
  const isMobile = useIsMobile();
  const lastScrollY = React.useRef(0);

  const handleScroll = React.useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setHidden(true); // Hide on scroll down
    } else {
      setHidden(false); // Show on scroll up
    }
    setIsAtTop(currentScrollY < 10);
    lastScrollY.current = currentScrollY;
  }, []);
  
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (e.clientY < 50) {
        setHidden(false); // Show when mouse is near top
    } else {
        // Hide when mouse is not near top, but only if not at the top of the page
        if (window.scrollY > 10) {
            setHidden(true);
        }
    }
  }, []);

  React.useEffect(() => {
    // Initialize last scroll position
    lastScrollY.current = window.scrollY;
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousemove", handleMouseMove);
    setLoading(false); // No user to check, so set loading to false

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleScroll, handleMouseMove]);

  const renderNav = () => {
    if (isMobile) {
      return (
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
       <nav className="hidden md:flex items-center gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
             <Link href={item.href} key={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="font-bold"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
          );
        })}
        <ThemeToggle />
      </nav>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header 
        className={cn(
            "fixed top-0 z-50 w-full border-b backdrop-blur-sm transition-all duration-300",
            (hidden && !isAtTop) ? "-translate-y-full" : "translate-y-0",
            isAtTop ? "bg-transparent border-transparent" : "bg-background/50 border-border"
        )}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mr-auto">
            <Globe className="w-8 h-8 text-primary" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Genocide Media</h1>
            </div>
          </div>
          {renderNav()}
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24">
        {children}
      </main>
       <footer className="py-6 md:px-8 md:py-0 bg-background/50 border-t">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 sm:px-6 lg:px-8">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by activists, for activists. This is an open-source project.
            </p>
        </div>
      </footer>
    </div>
  );
}
