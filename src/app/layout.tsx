import HydrateTeams from "@/components/teams/HydrateTeams";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/core/theme/theme.provider";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  adjustFontFallback: false
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  adjustFontFallback: false
});

export const metadata: Metadata = {
  title: "EscapeForm - Advanced Form Builder",
  description: "Create beautiful forms with team collaboration and advanced analytics",
};


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#6336f7' } }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-50`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SignedIn>
              <HydrateTeams>
                {children}
              </HydrateTeams>
            </SignedIn>
            <SignedOut>
              {children}
            </SignedOut>
            <Toaster position="top-right" duration={3000} closeButton dir="rtl" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
