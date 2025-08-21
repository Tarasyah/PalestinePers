"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, User, LogIn, LogOut, Menu, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { navItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import { MovingBorderButton } from "./ui/moving-border-button";

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleScroll, handleMouseMove]);

  React.useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderNav = () => {
    if (isMobile) {
      return (
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
      );
    }

    return (
       <nav className="hidden md:flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
             <Link href={item.href} key={item.href}>
                <MovingBorderButton
                  as="button"
                  containerClassName="h-10 w-auto"
                  className={cn(
                    "text-sm font-semibold flex items-center gap-2",
                    isActive ? "text-green-400" : "text-white"
                  )}
                  borderClassName="bg-[radial-gradient(var(--green-500)_40%,transparent_60%)]"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </MovingBorderButton>
              </Link>
          );
        })}
      </nav>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header 
        className={cn(
            "fixed top-0 z-50 w-full border-b backdrop-blur-sm transition-all duration-300",
            (hidden && !isAtTop) ? "-translate-y-full" : "translate-y-0",
            isAtTop ? "bg-transparent border-transparent" : "bg-black/50 border-white/20"
        )}
      >
        <div className="container flex items-center h-16 px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mr-auto">
            <Globe className="w-8 h-8 text-green-400" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Palestine Perspectives</h1>
              <p className="text-sm text-green-300/70">
                Independent news aggregation
              </p>
            </div>
          </div>
          {renderNav()}
           <div className="flex items-center gap-2 ml-4">
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="w-5 h-5" />
                        <span className="sr-only">User Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem asChild>
                          <Link href="/saved-articles" className="flex items-center gap-2">
                              <Bookmark className="w-4 h-4" />
                              <span>Saved Articles</span>
                          </Link>
                        </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-500 focus:bg-red-500/10 focus:text-red-500">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild variant="default" size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                )
              )}
          </div>
        </div>
      </header>
      <main className="container flex-grow px-4 py-8 mx-auto sm:px-6 lg:px-8 pt-24">
        {children}
      </main>
       <footer className="py-6 md:px-8 md:py-0 bg-black/20 border-t border-white/20">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-gray-400 md:text-left">
            Built by activists, for activists. This is an open-source project.
            </p>
        </div>
      </footer>
    </div>
  );
}
