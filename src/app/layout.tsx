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
      </head>
      <body className="font-sans antialiased">
        <CustomThemeProvider>
          {children}
          <Analytics />
          <Toaster />
        </CustomThemeProvider>
      </body>
    </html>
  );
}
