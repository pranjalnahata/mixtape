import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mixtape For You",
  description: "Create a soft, scrapbook-style digital mixtape and share it with someone you love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
