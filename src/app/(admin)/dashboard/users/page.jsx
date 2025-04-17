"use client";

import React, { useState } from "react";

// Hooks
import { useGetData } from "@/hooks/useClientData";
import useSetTitle from "@/hooks/useSetTitle";

// Components
import LoadingComponent from "@/components/loading";
import { BsArrowLeft, BsArrowRight, BsPencil, BsPlus, BsTrash } from "react-icons/bs";

export default function page() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(5);
    const [sort, setSort] = useState("createdAt:desc");
    const { data: users, loading, total } = useGetData(`/users?page=${page}&limit=${limit}&sort=${sort}&search=${search}`);

    useSetTitle("Usuarios | ISA Making");

    if (loading) return <LoadingComponent />;

    /**
        [
            {
                "user_id": "466a6548-4f56-4781-bd2f-80d6a1f1e717",
                "user_name": "Juan Esteban",
                "user_lastname": "Perez Salamanca",
                "user_email": "juan@gmail.com",
                "user_password": "$2a$10$qgoPKwk7M6UHRIEeXRrWDeYaV0LQweEt4qJWlDOF5tVioiyMjEuMO",
                "role_id": 1,
                "createdAt": "2025-04-13T10:00:00.000Z",
                "updatedAt": "2025-04-13T10:00:00.000Z",
                "deletedAt": null,
                "role": {
                "role_id": 1,
                "role_name": "cliente"
                }
            }
        ]
     */
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
                                        <th className="cursor-pointer" onClick={() => setSort("user_name:asc")}>Nombre</th>
                                        <th className="cursor-pointer" onClick={() => setSort("user_email:asc")}>Email</th>
                                        <th className="cursor-pointer" onClick={() => setSort("role_id:asc")}>Rol</th>
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
                                                    <button className="btn btn-outline btn-primary btn-sm">
                                                        <BsPencil size={16} />
                                                        <span>Editar</span>
                                                    </button>
                                                    <button className="btn btn-outline btn-error btn-sm">
                                                        <BsTrash size={16} />
                                                        <span>Eliminar</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between p-5">
                            <p className="text-sm text-base-content/80">
                                mostrando {limit * (page - 1) + 1} - {limit * (page - 1) + users.length} de{" "}
                                {total} usuarios
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
                </div>
            </section>
        </>
    );
}
