"use client";

import React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

// Hooks
import { useValidateForm } from "@/hooks/useValidateForm";

export default function Page() {
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const validation = useValidateForm("login-form", data);

        if (!validation.success) return;

        signIn("credentials", data);
    };

    return (
        <div className="hero bg-base-100 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-[1000px] mx-auto p-0 justify-center gap-15">
                <div className="text-center lg:text-left w-full max-w-md">
                    <h1 className="text-5xl font-otomanopee uppercase">¿No tienes una cuenta?</h1>
                    <p className="py-6 text-2xl leading-[1]">
                        Puedes crear tu cuenta en la siguiente página.{" "}
                        <Link href="/register" className="text-primary hover:underline">
                            click aquí
                        </Link>
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-md border border-base-300 shrink-0 shadow-[0_0_40px_-10px_var(--tw-shadow-color)] shadow-base-300">
                    <div className="card-body p-13 space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-4xl font-otomanopee uppercase text-center">
                                Inicia Sesión
                            </h2>
                            <p className="text-center text-xl text-pretty leading-[1]">
                                Ingresa tus credenciales para tener acceso a la plataforma y a tus
                                compras.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <fieldset className="fieldset">
                                <label className="fieldset-label text-base">
                                    Correo electrónico:
                                </label>
                                <input
                                    placeholder="ejemplo@gmail.com"
                                    name="user_email"
                                    className="input w-full focus:outline-none focus:border-primary"
                                />
                            </fieldset>
                            <fieldset className="fieldset">
                                <label className="fieldset-label text-base">Contraseña:</label>
                                <input
                                    type="password"
                                    placeholder="******"
                                    name="user_password"
                                    className="input w-full focus:outline-none focus:border-primary"
                                />
                            </fieldset>
                            <fieldset className="fieldset mt-5">
                                <button className="btn btn-primary w-full text-base font-medium shadow-none">
                                    Iniciar sesión
                                </button>
                            </fieldset>
                            <div className="divider">O</div>
                            <fieldset className="fieldset">
                                <button
                                    type="button"
                                    onClick={() => signIn("google")}
                                    className="btn bg-gray-100 text-primary-content text-base"
                                >
                                    <svg
                                        aria-label="Google logo"
                                        width="18"
                                        height="18"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <g>
                                            <path
                                                fill="#34a853"
                                                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                                            ></path>
                                            <path
                                                fill="#4285f4"
                                                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                                            ></path>
                                            <path
                                                fill="#fbbc02"
                                                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                                            ></path>
                                            <path
                                                fill="#ea4335"
                                                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                                            ></path>
                                        </g>
                                    </svg>
                                    Iniciar sesión con Google
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
