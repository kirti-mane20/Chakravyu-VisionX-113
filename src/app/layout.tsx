import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/nova/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ENTC NOVA — Smart ENTC Learning & Innovation Platform",
  description:
    "Understand Electronics. Experiment Freely. Innovate Intelligently. Interactive lessons, a virtual electronics lab, AI-assisted explanations, circuit troubleshooting, challenges and real-world simulations for Electronics & Telecommunication Engineering.",
  keywords: [
    "ENTC",
    "electronics",
    "telecommunication",
    "learning",
    "circuit simulator",
    "logic gates",
    "Arduino",
    "IoT",
    "signal processing",
  ],
  authors: [{ name: "ENTC NOVA" }],
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
    { media: "(prefers-color-scheme: light)", color: "#fafbfc" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
