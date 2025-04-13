import localFont from "next/font/local";
import { Afacad } from "next/font/google";

// Layouts
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";

import "./globals.css";

const otomanopeeOne = localFont({
    src: "../../public/fonts/OtomanopeeOne-Regular.ttf",
});

const afacad = Afacad({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

export const metadata = {
    title: "LSA Making",
    description: "Sistema de venta y gestión de prendas de vestir",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
