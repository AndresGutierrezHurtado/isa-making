import Link from "next/link";
import React from "react";

export default function Header() {
    return (
        <header className="w-full bg-base-content text-base-100 px-3">
            <div className="w-full max-w-[1300px] mx-auto py-2">
                <nav className="w-full navbar p-0">
                    <div className="navbar-start">
                        <Link
                            href="/"
                            className="text-3xl font-bold uppercase font-otomanopee hover:text-base-300 duration-100"
                        >
                            LSA Making
                        </Link>
                    </div>
                    <div className="navbar-center">
                        <ul className="menu menu-horizontal text-xl font-medium">
                            <li>
                                <Link href="/collections" className="hover-underline-animation">Colleciones</Link>
                            </li>
                            <li>
                                <Link href="/collections/man" className="hover-underline-animation">Hombre</Link>
                            </li>
                            <li>
                                <Link href="/collections/woman" className="hover-underline-animation">Mujer</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover-underline-animation">Nosotros</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <button className="btn btn-ghost"></button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
