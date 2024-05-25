import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SocketProvider } from "@/providers/socket-provider";

export const metadata: Metadata = {
  title: "phanes",
  description: "a personalized, seemless web journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
