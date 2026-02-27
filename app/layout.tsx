import type React from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner"

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "RoktoBindu - Blood Donation Platform",
  description: "Find blood donors and save lives with RoktoBindu",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthSessionProvider>{children}
          <Toaster position="top-right" />
        </AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
