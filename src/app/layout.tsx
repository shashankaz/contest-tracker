import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Contest Tracker Hub",
    template: "%s | Contest Tracker Hub",
  },
  description:
    "Contest Tracker Hub helps you track upcoming programming contests on Codeforces, Codechef, and Leetcode. Stay updated with the latest coding competitions and challenges.",
  keywords: [
    "Contest Tracker",
    "programming contests",
    "Codeforces",
    "Codechef",
    "Leetcode",
    "competitive programming",
    "coding competitions",
    "online contests",
    "programming challenges",
    "coding events",
    "upcoming contests",
    "coding calendar",
  ],
  openGraph: {
    title: "Contest Tracker Hub",
    description:
      "Contest Tracker Hub helps you track upcoming programming contests on Codeforces, Codechef, and Leetcode. Stay updated with the latest coding competitions and challenges.",
    siteName: "Contest Tracker",
    url: "https://contest-tracker-hub.vercel.app",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Contest Tracker Hub",
  url: "https://contest-tracker-hub.vercel.app",
  description:
    "Contest Tracker Hub helps you track upcoming programming contests on Codeforces, Codechef, and Leetcode. Stay updated with the latest coding competitions and challenges.",
  sameAs: [
    "https://codeforces.com/",
    "https://www.codechef.com/",
    "https://leetcode.com/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </html>
  );
}
