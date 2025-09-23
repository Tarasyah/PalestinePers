import { Analytics } from '@vercel/analytics/next';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { CustomThemeProvider } from '@/components/custom-theme-provider';

export const metadata: Metadata = {
  title: 'Genocide Watch',
  description: 'Independent news and data aggregation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <meta name="view-transition" content="same-origin" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CustomThemeProvider>
          {children}
          <Analytics />
          <Toaster />
        </CustomThemeProvider>
      </body>
    </html>
  );
}
