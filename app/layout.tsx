import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Loader from "@/components/Loader/loader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Point Sales Software",
  description: "Created by Jutech Devs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <Loader />
        {children}
      </body>
    </html>
  );
}
