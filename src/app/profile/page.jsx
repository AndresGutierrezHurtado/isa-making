"use client";

import React from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Hooks
import { useDeleteData, useGetData, usePutData } from "@/hooks/useClientData";
import { signOut, useSession } from "next-auth/react";
import { useValidateForm } from "@/hooks/useValidateForm";

// Components
import Auth from "@/components/auth";
import { TrashIcon } from "@/components/icons";
import { IoLogOutOutline } from "react-icons/io5";
import useSetTitle from "@/hooks/useSetTitle";
import LoadingComponent from "@/components/loading";

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

    useSetTitle("Perfil | ISA Making");

    if (loading || status === "loading") return <LoadingComponent />;
    if (status === "unauthenticated") return <Auth />;
    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-10">
                    <div className="flex flex-col md:flex-row gap-10 w-full">
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

                                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                                        <button
                                            type="button"
                                            className="btn btn-error btn-outline w-fit"
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
                                    {orders.map(({ products, payment, shipping, ...order }) => {
                                        const totalProducts = products.reduce(
                                            (total, p) => total + p.product_quantity,
                                            0
                                        );
                                        return (
                                            <div
                                                key={order.order_id}
                                                className="border border-base-300 p-5 rounded-lg w-full space-y-3"
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <p className="text-xl">
                                                        Pedido {order.order_id.split("-")[0]}
                                                    </p>
                                                    <p>
                                                        {new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    {shipping.shipping_guide ? (
                                                        <Link
                                                            href={`https://www.interrapidisimo.com/tracking/${shipping.shipping_guide}`}
                                                            target="_blank"
                                                        >
                                                            <p>
                                                                Numero de envio:{" "}
                                                                {shipping.shipping_guide}
                                                            </p>
                                                        </Link>
                                                    ) : (
                                                        <p>Numero de envio: pendiente</p>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <p>Cantidad: {totalProducts}</p>
                                                        <p>
                                                            Total:{" "}
                                                            {parseInt(
                                                                payment.payment_amount
                                                            ).toLocaleString("es-CO")}{" "}
                                                            COP
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Link href={`/orders/${order.order_id}`}>
                                                        <button className="btn btn-sm btn-primary btn-outline text-base font-normal">
                                                            Ver detalles
                                                        </button>
                                                    </Link>
                                                    {order.order_state == "completed" ? (
                                                        <div className="badge badge-success badge-soft border-[1px_solid_var(--color-success)_!important]">
                                                            Completado
                                                        </div>
                                                    ) : (
                                                        <div className="badge badge-warning badge-soft border-[1px_solid_var(--color-warning)_!important]">
                                                            Pendiente
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}
