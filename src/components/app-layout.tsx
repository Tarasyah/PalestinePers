"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, BarChart, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "News Feed", icon: Newspaper },
  { href: "/dashboard", label: "Statistics", icon: BarChart },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card">
        <div className="container flex items-center h-16 px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Palestine Perspectives</h1>
              <p className="text-sm text-muted-foreground">
                Independent news aggregation
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-2 ml-auto">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Link href={item.href}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>
      <main className="container flex-grow px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
