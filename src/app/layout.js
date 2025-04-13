import "./globals.css";
import localFont from "next/font/local";
import { Afacad } from "next/font/google";

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
            <body className="antialiased">{children}</body>
        </html>
    );
}
