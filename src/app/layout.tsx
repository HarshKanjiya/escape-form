import HydrateTeams from "@/components/teams/HydrateTeams";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/core/theme/theme.provider";
import { Team } from '@/generated/prisma';
import { prisma } from "@/lib/prisma";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  // Fetch teams for logged-in users
  let teams: Team[] = [];
  const { userId } = await auth();

  if (userId) {
    try {
      teams = await prisma.team.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching teams:', error);
      teams = [];
    }
  }

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
              <HydrateTeams teams={teams}>
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
