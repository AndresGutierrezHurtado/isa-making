import Link from "next/link";
import React from "react";

export default function Auth({ type = "unauthorized" }) {
    if (type === "forbidden") {
        return (
            <div className="flex-1 flex items-center justify-center flex-col py-10">
                <h1 className="text-9xl font-bold">403</h1>
                <p className="text-2xl font-bold">No estás autorizado para acceder a esta página</p>
                <Link
                    href="/"
                    className="btn btn-primary text-sm btn-wide shadow-none text-[18px] mt-4"
                >
                    Volver al inicio
                </Link>
            </div>
        );
    }

    if (type === "authorized") {
        return (
            <div className="flex-1 flex items-center justify-center flex-col py-10">
                <h1 className="text-9xl font-bold">401</h1>
                <p className="text-2xl font-bold">Ya estás autenticado</p>
                <Link
                    href="/"
                    className="btn btn-primary text-sm btn-wide shadow-none text-[18px] mt-4"
                >
                    Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center flex-col py-10">
            <h1 className="text-9xl font-bold">401</h1>
            <p className="text-2xl font-bold">No estás autenticado</p>
            <Link
                href="/login"
                className="btn btn-primary text-sm btn-wide shadow-none text-[18px] mt-4"
            >
                Iniciar sesión
            </Link>
        </div>
    );
}
