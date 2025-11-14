import Home from "@/components/base/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Escape Form",
  description: "Welcome to Escape Form, your ultimate solution for creating, managing, and analyzing online forms with ease. Sign in to access your dashboard and start building powerful forms today.",
  applicationName: "Esacape Form",
  keywords: "escape form, esc form, esc form sign in, escape form sign in, form builder, online forms, form management, data collection, surveys, team collaboration",
  creator: "Escape Form",
  authors: [{ name: "Escape Form", url: "https://escform.com" }],
  publisher: "Escape Form",
  openGraph: {
    title: "Home - Escape Form",
    description: "Welcome to Escape Form, your ultimate solution for creating, managing, and analyzing online forms with ease. Sign in to access your dashboard and start building powerful forms today.",
    url: "https://dashboard.escform.com/",
    siteName: "Escape Form",
    type: "website",
  }
}

export default function Page() {
  return (
    <Home />
  );
}