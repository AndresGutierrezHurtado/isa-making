"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { BsArrowLeft, BsArrowRight, BsPencil, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";

// Hooks
import { useDeleteData, useGetData, usePutData } from "@/hooks/useClientData";
import useSetTitle from "@/hooks/useSetTitle";
import { useValidateForm } from "@/hooks/useValidateForm";

// Components
import LoadingComponent from "@/components/loading";

export default function page() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(5);
    const [sort, setSort] = useState("createdAt:desc");

    const { data: session, status } = useSession();
    const userSession = session?.user;

    const {
        data: users,
        loading,
        total,
        reload,
    } = useGetData(`/users?page=${page}&limit=${limit}&sort=${sort}&search=${search}`);
    const {
        data: paranoidUsers,
        loading: paranoidLoading,
        reload: paranoidReload,
    } = useGetData("/users/x/paranoid");

    useSetTitle("Usuarios | ISA Making");

    if (loading || paranoidLoading || status === "loading") return <LoadingComponent />;

    const handleDelete = async (id, permanent = false) => {
        if (id === userSession.user_id) {
            Swal.fire({
                title: "¡Ups!",
                text: "No puedes eliminar tu propio usuario",
                icon: "error",
            });
            return;
        }
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const endpoint = permanent ? `/users/${id}/paranoid` : `/users/${id}`;
                const response = await useDeleteData(endpoint);
                if (response.success) {
                    setPage(1);
                    setSearch("");
                    setLimit(5);
                    setSort("createdAt:desc");
                    reload();
                    paranoidReload();
                }
            }
        });
    };

    const handleRestore = async (id) => {
        const response = await usePutData(`/users/${id}/paranoid`);
        if (response.success) {
            setPage(1);
            setSearch("");
            setLimit(5);
            setSort("createdAt:desc");
            reload();
            paranoidReload();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target));
        const validation = useValidateForm("update-user-form", data);

        if (validation.success) {
            delete data.user_password;

            const response = await usePutData(`/users/${data.user_id}`, { user: data });
            if (response.success) {
                setPage(1);
                setSearch("");
                setLimit(5);
                setSort("createdAt:desc");
                reload();
                e.target.reset();
                const $dialog = document.getElementById(`user-edit-${data.user_id}`);
                $dialog.close();
            }
        }
    };

    return (
        <>
            <section className="flex-1 w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-15 space-y-20">
                    <h1 className="text-3xl font-otomanopee">Usuarios</h1>
                    <div className="bg-base-200 border border-base-300 rounded-lg">
                        <div className="p-5">
                            <input
                                type="text"
                                placeholder="Buscar usuario"
                                className="w-full max-w-sm input input-bordered focus:outline-none focus:border-primary"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead className="bg-base-100">
                                    <tr>
                                        <th
                                            className="cursor-pointer"
                                            onClick={() => setSort("user_name:asc")}
                                        >
                                            Nombre
                                        </th>
                                        <th
                                            className="cursor-pointer"
                                            onClick={() => setSort("user_email:asc")}
                                        >
                                            Email
                                        </th>
                                        <th
                                            className="cursor-pointer"
                                            onClick={() => setSort("role_id:asc")}
                                        >
                                            Rol
                                        </th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.user_id}>
                                            <td>
                                                {user.user_name} {user.user_lastname}
                                            </td>
                                            <td>{user.user_email}</td>
                                            <td className="capitalize">{user.role.role_name}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    `user-edit-${user.user_id}`
                                                                )
                                                                .show()
                                                        }
                                                        className="btn btn-outline btn-primary btn-sm"
                                                    >
                                                        <BsPencil size={16} />
                                                        <span>Editar</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.user_id)}
                                                        className="btn btn-outline btn-error btn-sm"
                                                    >
                                                        <BsTrash size={16} />
                                                        <span>Desactivar</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-5 items-center justify-between p-5">
                            <p className="text-sm text-base-content/80">
                                mostrando {limit * (page - 1) + 1} -{" "}
                                {limit * (page - 1) + users.length} de {total} usuarios
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    className="btn shadow-none"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    <BsArrowLeft size={16} />
                                    <span>Anterior</span>
                                </button>
                                <button
                                    className="btn shadow-none"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === Math.ceil(total / limit)}
                                >
                                    <BsArrowRight size={16} />
                                    <span>Siguiente</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {paranoidUsers.length > 0 && (
                        <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
                            <input type="checkbox" />
                            <div className="collapse-title font-semibold">Usuarios eliminados</div>
                            <div className="collapse-content text-sm">
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        <thead className="bg-base-100">
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Rol</th>
                                                <th>Fecha de eliminación</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paranoidUsers.map((user) => (
                                                <tr key={user.user_id}>
                                                    <td>
                                                        {user.user_name} {user.user_lastname}
                                                    </td>
                                                    <td>{user.user_email}</td>
                                                    <td className="capitalize">
                                                        {user.role.role_name}
                                                    </td>
                                                    <td>
                                                        {new Date(user.deletedAt).toLocaleString()}
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleRestore(user.user_id)
                                                                }
                                                                className="btn btn-outline btn-success btn-sm"
                                                            >
                                                                Restaurar
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(user.user_id, true)
                                                                }
                                                                className="btn btn-outline btn-error btn-sm"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {users.map((user) => (
                <dialog key={user.user_id} id={`user-edit-${user.user_id}`} className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Editar usuario</h3>
                        <p className="py-4">Presiona ESC o click fuera para cerrar</p>
                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="user_id" value={user.user_id} />
                            <input type="hidden" name="user_password" value="" />
                            <fieldset className="fieldset">
                                <label className="fieldset-label">
                                    <span>Nombre</span>
                                </label>
                                <input
                                    className="input input-bordered w-full focus:outline-none focus:border-primary"
                                    defaultValue={user.user_name}
                                    name="user_name"
                                />
                            </fieldset>
                            <fieldset className="fieldset">
                                <label className="fieldset-label">
                                    <span>Apellido</span>
                                </label>
                                <input
                                    className="input input-bordered w-full focus:outline-none focus:border-primary"
                                    defaultValue={user.user_lastname}
                                    name="user_lastname"
                                />
                            </fieldset>
                            <fieldset className="fieldset">
                                <label className="fieldset-label">
                                    <span>Email</span>
                                </label>
                                <input
                                    className="input input-bordered w-full focus:outline-none focus:border-primary"
                                    defaultValue={user.user_email}
                                    name="user_email"
                                />
                            </fieldset>
                            <fieldset className="fieldset">
                                <label className="fieldset-label">
                                    <span>Rol</span>
                                </label>
                                <select
                                    className="select select-bordered w-full focus:outline-none focus:border-primary"
                                    defaultValue={user.role_id}
                                    name="role_id"
                                >
                                    <option value="1">Cliente</option>
                                    <option value="2">Administrador</option>
                                </select>
                            </fieldset>
                            <fieldset className="fieldset mt-5">
                                <button type="submit" className="btn btn-primary">
                                    Guardar
                                </button>
                            </fieldset>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            ))}
        </>
    );
}
