import HydrateTeams from "@/components/teams/HydrateTeams";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/core/theme/theme.provider";
import { prisma } from "@/lib/prisma";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Team } from '@prisma/client';
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Metadata } from "next";

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
  title: {
    default: 'Esc Form',
    template: '%s • Esc Form',
  },
}

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
      if (teams.length === 0) {
        const newTeam = await prisma.team.create({
          data: {
            name: "Personal Team",
            ownerId: userId,
          },
        });
        teams = [newTeam];
      }
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
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
