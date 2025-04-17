"use client";

import React from "react";
import { useSession } from "next-auth/react";

// Components
import Auth from "@/components/auth";
import LoadingComponent from "@/components/loading";
import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
    const { status, data: session } = useSession();
    const pahtname = usePathname();

    if (status === "loading") return <LoadingComponent />;
    if (status === "unauthenticated") return <Auth />;
    if (session.user.role_id !== 2) return <Auth type="forbidden" />;

    return (
        <>
            <div className="drawer drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-center justify-center">
                    {children}
                </div>
                <div className="drawer-side">
                    <label
                        htmlFor="my-drawer-2"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <ul className="menu bg-base-200 text-base-content text-lg min-h-full w-80 p-4 justify-between">
                        <div className="flex justify-center">
                            <Link
                                href="/"
                                className="text-2xl font-otomanopee hover:text-base-content/60 duration-300"
                            >
                                ISA MAKING
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <li>
                                <Link href="/dashboard/stats" className={`${pahtname === "/dashboard/stats" ? "text-primary" : ""}`}>
                                    Estadísticas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/products"
                                    className={`${pahtname === "/dashboard/products" ? "text-primary" : ""}`}
                                >
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/users" className={`${pahtname === "/dashboard/users" ? "text-primary" : ""}`}>
                                    Usuarios
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/orders"
                                    className={`${pahtname === "/dashboard/orders" ? "text-primary" : ""}`}
                                >
                                    Pedidos
                                </Link>
                            </li>
                        </div>
                        <div>
                            <button className="btn w-full text-lg font-normal btn-outline btn-error">
                                <IoLogOutOutline size={20} />
                                Cerrar sesión
                            </button>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    );
}
