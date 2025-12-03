import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Storage Marketplace - Rent Storage Units",
  description: "Find and rent storage units for boats, vehicles, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

