import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Badagini Boy",
  description: "Retro idle clicker — rub the doggo, earn treats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black">{children}</body>
    </html>
  );
}
