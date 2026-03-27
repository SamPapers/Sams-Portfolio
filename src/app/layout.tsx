import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sam Trotman • Creative Director",
  description:
    "Curiosity in motion. Creative direction, brand, and marketing portfolio.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0c0a08" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a08" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
