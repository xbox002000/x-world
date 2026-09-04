import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "X WORLD — Know Your Next Move",
  description:
    "Interactive X Growth World concept prototype. MockProvider only — no OAuth, no X API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen bg-void font-sans text-frost antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
