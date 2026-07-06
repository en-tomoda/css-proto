import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AppProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSAS - キャリアセレクタビリティシステム",
  description: "あなたのキャリアに、いつもそばで伴走するAIを。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <AppProvider>{children}</AppProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
