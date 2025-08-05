import { getUserTeams } from "@/actions/team";
import HydrateTeams from "@/components/teams/HydrateTeams";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/core/guards/authGuard";
import { ThemeProvider } from "@/core/theme/theme.provider";
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Add this to force dynamic rendering
export const dynamic = 'force-dynamic'

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

  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect('/sign-in');
    return null;
  }

  const res = await getUserTeams();
  const teams = res.success ? res.data || [] : [];

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
            <HydrateTeams teams={teams} />
            <AuthGuard>
              {children}
            </AuthGuard>
            <Toaster position="top-right" duration={3000} closeButton dir="rtl" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
