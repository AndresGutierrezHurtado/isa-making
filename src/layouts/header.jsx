"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Components
import { UserIcon, SearchIcon, ShoppingCartIcon, MenuIcon } from "@/components/icons";
import { useSession } from "next-auth/react";

export default function Header() {
    const router = useRouter();
    const { data: session } = useSession();

    const [search, setSearch] = useState("");

    return (
        <>
            <header className="w-full bg-base-content text-base-100 px-3 sticky top-0 z-50 shadow">
                <div className="w-full max-w-[1300px] mx-auto py-2">
                    <nav className="w-full navbar p-0">
                        <div className="navbar-start">
                            <Link
                                href="/"
                                className="text-lg text-nowrap md:text-3xl font-bold uppercase font-otomanopee hover:text-base-300 duration-100"
                            >
                                ISA Making
                            </Link>
                        </div>
                        <div className="navbar-center">
                            <div className="dropdown dropdown-center">
                                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                    <MenuIcon size={22} />
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu dropdown-content bg-base-100 text-base-content rounded-box z-1 mt-3 w-52 p-2 shadow"
                                >
                                    <li>
                                        <Link href="/collections">Colleciones</Link>
                                    </li>
                                    <li>
                                        <Link href="/about">Nosotros</Link>
                                    </li>
                                    <li>
                                        <a>Generos</a>
                                        <ul className="p-2">
                                            <li>
                                                <Link href="/collections/man">Hombre</Link>
                                            </li>
                                            <li>
                                                <Link href="/collections/woman">Mujer</Link>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <ul className="menu menu-horizontal text-xl font-medium gap-2 hidden md:flex">
                                <li>
                                    <Link href="/collections" className="hover-underline-animation">
                                        Colleciones
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/collections/man"
                                        className="hover-underline-animation"
                                    >
                                        Hombre
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/collections/woman"
                                        className="hover-underline-animation"
                                    >
                                        Mujer
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover-underline-animation">
                                        Nosotros
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="navbar-end gap-1 md:gap-3">
                            <Link
                                href={!session ? "/login" : "/profile"}
                                className="btn btn-ghost btn-circle"
                            >
                                <button className="btn btn-ghost btn-circle">
                                    <UserIcon size={22} />
                                </button>
                            </Link>
                            <button
                                className="btn btn-ghost btn-circle"
                                onClick={() => document.getElementById("search-modal").showModal()}
                            >
                                <SearchIcon size={22} />
                            </button>
                            <Link href="/cart" className="btn btn-ghost btn-circle">
                                <button className="btn btn-ghost btn-circle">
                                    <ShoppingCartIcon size={22} />
                                </button>
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>
            <dialog id="search-modal" className="modal">
                <div className="modal-box bg-transparent border-none shadow-none">
                    <div className="bg-black/80 py-3 px-6 rounded backdrop-blur-sm">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.push(`/products?search=${search}`);
                                document.getElementById("search-modal").close();
                                setSearch("");
                            }}
                            className="flex gap-3"
                        >
                            <input
                                type="text"
                                placeholder="Buscar productos"
                                className="input input-bordered w-full max-w-md border-base-300 focus:outline-none focus:border-primary"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn bg-base-100 border border-base-300"
                            >
                                <SearchIcon size={22} />
                            </button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
