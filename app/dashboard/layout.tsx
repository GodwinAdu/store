
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Created by Jutech Devs",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <Sidebar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <Navbar />
            <main className="px-4">
             {children}
            </main>
          </div>
        </div>
    
  );
}
