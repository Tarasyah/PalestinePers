// src/components/custom-theme-provider.tsx

"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useEffect } from "react";

// Fungsi untuk menangani animasi transisi
const onThemeChange = (
  theme: string,
  setTheme: (theme: string) => void,
  event?: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  const x = event?.clientX ?? window.innerWidth / 2;
  const y = event?.clientY ?? window.innerHeight / 2;

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  
  // Cek apakah browser mendukung View Transitions API
  // @ts-ignore
  if (!document.startViewTransition) {
    setTheme(theme);
    return;
  }

  // Mulai transisi
  // @ts-ignore
  const transition = document.startViewTransition(() => {
    setTheme(theme);
  });

  // Setelah transisi siap, jalankan animasi kustom
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: clipPath,
      },
      {
        duration: 1000, // Durasi animasi
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
};

// Konteks untuk menangani event click
const ThemeContext = ({ children }: { children: ReactNode }) => {
  const { setTheme: originalSetTheme, theme: currentTheme } = useTheme();

  useEffect(() => {
    if (currentTheme) {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(currentTheme);
    }
  }, [currentTheme]);

  return (
    <div
      onClick={(event) => {
        // Cari tombol toggle tema yang di-klik
        const target = event.target as HTMLElement;
        const button = target.closest("[data-theme-toggle]");
        if (button) {
          const newTheme = currentTheme === "dark" ? "light" : "dark";
          onThemeChange(newTheme, originalSetTheme, event);
        }
      }}
    >
      {children}
    </div>
  );
};

// Provider utama yang membungkus aplikasi
export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark" // Anda bisa ubah tema default
      enableSystem={false}
      disableTransitionOnChange // Penting untuk animasi kustom
    >
      <ThemeContext>{children}</ThemeContext>
    </NextThemesProvider>
  );
};
