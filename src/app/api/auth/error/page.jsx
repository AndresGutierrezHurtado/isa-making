import Link from "next/link";
import React from "react";

export default async function page({ searchParams }) {
    const { error } = await searchParams;
    return (
        <div className="hero bg-base-100 min-h-screen">
            <div className="hero-content text-center">
                <div className="max-w-md space-y-4">
                    <h1 className="text-5xl font-bold font-otomanopee uppercase">
                        <span className="text-red-500 italic">Error</span> al iniciar sesión
                    </h1>
                    <div className="text-xl text-pretty leadig-[1]">
                        <p>Ocurrió un error al iniciar sesión. Por favor, inténtelo de nuevo.</p>
                        <p className="text-red-500">{error}</p>
                    </div>
                    <Link href="/login">
                        <button className="btn btn-primary">Volver al Login</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
