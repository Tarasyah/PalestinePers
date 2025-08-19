"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, BarChart, Newspaper, User, LogIn, LogOut, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navItems = [
  { href: "/", label: "News Feed", icon: Newspaper },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/media", label: "Media", icon: ImageIcon },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-black/30 backdrop-blur-lg">
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
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="flex items-center gap-2"
              >
                <Link href={item.href}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
           <div className="flex items-center gap-2 ml-4">
              {!loading && (
                user ? (
                  <>
                    <Button variant="ghost" size="icon" disabled>
                      <User className="w-5 h-5" />
                      <span className="sr-only">Profile</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
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
      <main className="container flex-grow px-4 py-8 mx-auto sm:px-6 lg:px-8">
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
