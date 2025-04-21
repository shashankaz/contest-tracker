import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

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
    template: "%s | Contest Tracker",
    default: "Contest Tracker",
  },
  description: "Track upcoming contests on Codeforces, Codechef, and Leetcode",
  keywords:
    "programming contests, Codeforces, Codechef, Leetcode, competitive programming, coding competitions, hackathons, online contests, programming challenges, coding events",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="description"
          content="Track upcoming contests on Codeforces, Codechef, and Leetcode"
        />
        <meta
          name="keywords"
          content="programming contests, Codeforces, Codechef, Leetcode, competitive programming, coding competitions, hackathons, online contests, programming challenges, coding events"
        />
        <meta name="author" content="Contest Tracker Team" />
        <meta name="robots" content="index, follow" />
      </head>
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
    </html>
  );
}
