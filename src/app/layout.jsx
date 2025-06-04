"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

import { Afacad } from "next/font/google";
import localFont from "next/font/local";

// Layouts
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";

import "./globals.css";
import WhatsappButton from "@/components/whatsappButton";

const afacad = Afacad({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

const otomanopeeOne = localFont({
    src: "../../public/fonts/OtomanopeeOne-Regular.ttf",
});

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const excludedPaths = ["/login", "/register", "/api", "/dashboard"];

    const isExcludedPath = excludedPaths.some((path) => pathname.startsWith(path));
    return (
        <html lang="es">
            <body className={`${otomanopeeOne.className} ${afacad.className} font-afacad flex flex-col min-h-screen`}>
                <SessionProvider>
                    {!isExcludedPath && <Header />}
                    <main className="flex-grow flex flex-col">{children}</main>
                    {!isExcludedPath && <Footer />}
                    {!isExcludedPath && <WhatsappButton />}
                </SessionProvider>
            </body>
        </html>
    );
}
