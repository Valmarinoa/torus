import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cumbre",
  description: "Shader experiment by Valentina Marino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#FFD726]">{children}</body>
    </html>
  );
}
