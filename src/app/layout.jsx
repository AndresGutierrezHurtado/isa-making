import localFont from "next/font/local";
import { Afacad } from "next/font/google";
import { headers } from "next/headers";

// Layouts
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";

// Contexts
import AuthProvider from "@/layouts/sessionProvider";

import "./globals.css";

const otomanopeeOne = localFont({
    src: "../../public/fonts/OtomanopeeOne-Regular.ttf",
});

const afacad = Afacad({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

export const metadata = {
    title: "ISA Making",
    description: "Sistema de venta y gestión de prendas de vestir",
};

export default async function RootLayout({ children }) {
    const excludedPaths = ["/login", "/register", "/api"];

    const headersList = await headers();
    const pathname = headersList.get("x-next-pathname");

    const isExcludedPath = excludedPaths.some((path) => pathname.startsWith(path));

    return (
        <html lang="en">
            <body className="antialiased flex flex-col min-h-screen">
                <AuthProvider>
                    {isExcludedPath ? <></> : <Header />}
                    <main className="flex-grow">{children}</main>
                    {isExcludedPath ? <></> : <Footer />}
                </AuthProvider>
            </body>
        </html>
    );
}
