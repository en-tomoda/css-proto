import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CareerSelectabilityHeader } from "@/components/career-selectability-header";
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
  title: "キャリア自律コーチング プロトタイプ",
  description:
    "キャリア自律を支援するダッシュボードとAI相談チャットのプロトタイプ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CareerSelectabilityHeader />
        {children}
      </body>
    </html>
  );
}
