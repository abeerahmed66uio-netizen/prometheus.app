import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "منصة بروميثوس",
  description: "منصة بروميثوس التعليمية والشبابية لتطوير المهارات والأثر المستدام",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={${geistSans.variable} ${geistMono.variable} h-full antialiased}
    >
      <head>
        <meta name="theme-color" content="#070b19" />
      </head>
      <body className="min-h-full flex flex-col bg-[#070b19] text-white">
        {children}
      </body>
    </html>
  );
}
