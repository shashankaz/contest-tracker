import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/userContest";
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
    "Contest Tracker Hub helps you track upcoming programming contests on Codeforces, Codechef, Leetcode, AtCoder, and GeeksforGeeks. Stay updated with the latest coding competitions and challenges.",
  keywords: [
    "Contest Tracker",
    "programming contests",
    "Codeforces",
    "Codechef",
    "Leetcode",
    "AtCoder",
    "GeeksforGeeks",
    "competitive programming",
    "coding competitions",
    "online contests",
    "programming challenges",
    "coding events",
    "upcoming contests",
    "coding calendar",
    "contest reminders",
    "coding notifications",
    "real-time updates",
    "hackathons",
    "coding marathons",
    "developer challenges",
    "programming events",
    "coding practice",
    "algorithm contests",
    "data structure challenges",
    "online coding platforms",
    "coding preparation",
    "programming skills",
    "coding schedules",
    "contest alerts",
    "coding tools",
  ],
  openGraph: {
    title: "Contest Tracker Hub",
    description:
      "Contest Tracker Hub helps you track upcoming programming contests on Codeforces, Codechef, Leetcode, AtCoder, and GeeksforGeeks. Stay updated with the latest coding competitions and challenges.",
    siteName: "Contest Tracker",
    url: "https://contest-tracker-hub.vercel.app",
    type: "website",
    images: [
      {
        url: "/cover.png",
        width: 1200,
        height: 630,
        alt: "Contest Tracker Hub Cover",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Contest Tracker Hub",
  url: "https://contest-tracker-hub.vercel.app",
  description:
    "Contest Tracker Hub helps you track upcoming programming contests on Codeforces, Codechef, Leetcode, AtCoder, and GeeksforGeeks. Stay updated with the latest coding competitions and challenges.",
  sameAs: [
    "https://codeforces.com/",
    "https://www.codechef.com/",
    "https://leetcode.com/",
    "https://atcoder.jp/",
    "https://practice.geeksforgeeks.org/",
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
          <UserProvider>{children}</UserProvider>
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
