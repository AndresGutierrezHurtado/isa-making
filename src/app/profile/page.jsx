"use client";
import React from "react";

// Icons
import { TrashIcon } from "@/components/icons";
import { IoLogOutOutline } from "react-icons/io5";

// Hooks
import { useDeleteData, useGetData, usePutData } from "@/hooks/useClientData";
import { signOut, useSession } from "next-auth/react";
import { useValidateForm } from "@/hooks/useValidateForm";

// Utilities
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Profile() {
    const router = useRouter();
    const { data: session, status, update: updateSession } = useSession();
    const userSession = session?.user;

    const { data: orders, loading } = useGetData(`/users/${userSession?.user_id}/orders`);

    const handleDeleteAccount = async () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción es irreversible",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-primary)",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await useDeleteData(`/users/${userSession?.user_id}`);

                if (response.success) {
                    signOut();
                    router.push("/");
                }
            }
        });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const validation = useValidateForm("update-user-form", data);

        if (!validation.success) return;

        if (data.user_password === "") delete data.user_password;

        const response = await usePutData(`/users/${userSession?.user_id}`, { user: data });

        if (response.success) {
            updateSession();
        }
    };

    if (loading || status === "loading") return <div>Loading...</div>;
    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-10">
                    <div className="flex gap-10 w-full">
                        <article className="card w-full max-w-xl bg-base-200 border border-base-300 h-fit">
                            <div className="card-body">
                                <div className="space-y-2">
                                    <div className="avatar mb-5">
                                        <div className="w-16 rounded-full">
                                            <Image
                                                src="/user-profile.jpg"
                                                alt="Profile"
                                                width={100}
                                                height={100}
                                                className="w-full h-full scale-160"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {userSession.user_name} {userSession.user_lastname}
                                        </h2>
                                        <p className="text-sm">{userSession.user_email}</p>
                                    </div>
                                    <p className="text-sm">
                                        <span className="badge cursor-default capitalize">
                                            {userSession.role.role_name}
                                        </span>
                                    </p>
                                    <button
                                        className="btn btn-sm btn-outline btn-error"
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                    >
                                        <IoLogOutOutline size={20} />
                                        Cerrar sesión
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleUpdateUser}
                                    className="mt-5 flex flex-col gap-2"
                                >
                                    <hr className="mb-2 border-base-content/50" />

                                    <div className="flex">
                                        <fieldset className="w-full space-y-2">
                                            <div className="flex w-full">
                                                <label className="w-1/3">Nombre completo</label>

                                                <div className="flex gap-2 w-2/3">
                                                    <input
                                                        className="input input-bordered bg-transparent focus:outline-none focus:border-primary w-full"
                                                        defaultValue={userSession.user_name}
                                                        name="user_name"
                                                    />
                                                    <input
                                                        className="input input-bordered bg-transparent focus:outline-none focus:border-primary w-full"
                                                        defaultValue={userSession.user_lastname}
                                                        name="user_lastname"
                                                    />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <hr className="my-2 border-base-content/50" />

                                    <div className="flex">
                                        <fieldset className="w-full space-y-2">
                                            <div className="flex w-full">
                                                <label className="w-1/3">Correo electrónico</label>

                                                <div className="flex gap-2 w-2/3">
                                                    <input
                                                        className="input input-bordered bg-transparent focus:outline-none focus:border-primary w-full"
                                                        defaultValue={userSession.user_email}
                                                        name="user_email"
                                                    />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <hr className="my-2 border-base-content/50" />

                                    <div className="flex">
                                        <fieldset className="w-full space-y-2">
                                            <div className="flex w-full">
                                                <label className="w-1/3">Contraseña</label>

                                                <div className="flex gap-2 w-2/3">
                                                    <input
                                                        type="password"
                                                        className="input input-bordered bg-transparent focus:outline-none focus:border-primary w-full"
                                                        name="user_password"
                                                    />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <hr className="my-2 border-base-content/50" />

                                    <div className="flex justify-between">
                                        <button
                                            type="button"
                                            className="btn btn-error btn-outline"
                                            onClick={handleDeleteAccount}
                                        >
                                            <TrashIcon size={20} />
                                            Eliminar cuenta
                                        </button>
                                        <div className="flex gap-2">
                                            <button className="btn btn-outline" type="reset">
                                                Cancelar
                                            </button>
                                            <button
                                                className="btn btn-primary shadow-none"
                                                type="submit"
                                            >
                                                Guardar cambios
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </article>
                        <article className="card w-full bg-base-200 border border-base-300 h-fit">
                            <div className="card-body [&_p]:grow-0">
                                <h2 className="text-xl font-bold">Mis pedidos</h2>
                                <div className="flex flex-col gap-2">
                                    {orders.length === 0 && (
                                        <p className="text-center text-lg text-base-content/80">
                                            No has realizado ningún pedido
                                        </p>
                                    )}
                                    {orders.map((order) => (
                                        <div
                                            key={order.order_id}
                                            className="border border-base-300 p-5 rounded-lg w-full"
                                        >
                                            <div className="flex justify-between w-full">
                                                <p>Pedido #1234567890</p>
                                                <p>15/04/2025</p>
                                            </div>
                                            <div>
                                                <p>Numero de pedido: 1234567890</p>
                                                <div className="flex justify-between">
                                                    <p>Cantidad: 1</p>
                                                    <p>Total: 100</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <button className="btn btn-outline">
                                                    Ver detalles
                                                </button>
                                                <p>Pendiente</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}
