import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DriftSpike - Ultra-Fast Email API",
  description: "Send emails at scale with our high-performance API. Built with Firebase, optimized for speed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
