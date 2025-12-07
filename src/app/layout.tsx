import HydrateTeams from "@/components/teams/HydrateTeams";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/core/theme/theme.provider";
import { Team } from '@/generated/prisma';
import { prisma } from "@/lib/prisma";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/constants/site.config";

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.siteName}`,
    template: `%s · ${SITE_CONFIG.siteName}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.siteName,
  keywords: SITE_CONFIG.keywords,
  creator: SITE_CONFIG.creator,
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
  publisher: SITE_CONFIG.author.name,
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: SITE_CONFIG.siteName,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.siteName,
    type: "website",
    images: [{ url: SITE_CONFIG.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.siteName,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  themeColor: "#ffffff",

};


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
