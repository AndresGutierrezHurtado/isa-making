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
        data: products,
        loading,
        total,
        reload,
    } = useGetData(`/products?page=${page}&limit=${limit}&sort=${sort}&search=${search}`);
    const {
        data: paranoidProducts,
        loading: paranoidLoading,
        reload: paranoidReload,
    } = useGetData("/products/x/paranoid");

    useSetTitle("Productos | ISA Making");

    if (loading || paranoidLoading || status === "loading") return <LoadingComponent />;

    const handleDelete = async (id, permanent = false) => {
        if (id === userSession.user_id) {
            Swal.fire({
                title: "¡Ups!",
                text: "No puedes eliminar tu propio usuario",
                icon: "error",
                confirmButtonText: "Cerrar",
            });
            return;
        }

        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción es irreversible",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const endpoint = permanent ? `/products/${id}/paranoid` : `/products/${id}`;
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
        const response = await usePutData(`/products/${id}/paranoid`);
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
    };

    return (
        <>
            <section className="flex-1 w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-15 space-y-20">
                    <h1 className="text-3xl font-otomanopee">Productos</h1>
                    <div className="bg-base-200 border border-base-300 rounded-lg">
                        <div className="p-5">
                            <input
                                type="text"
                                placeholder="Buscar producto"
                                className="w-full max-w-sm input input-bordered focus:outline-none focus:border-primary"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead className="bg-base-100">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.product_id}>
                                            <td>{product.product_id.split("-")[0]}</td>
                                            <td>{product.product_name}</td>
                                            <td>
                                                {parseInt(
                                                    product.sizes[0].ProductSize.product_price
                                                ).toLocaleString("es-CO")}
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    `edit-product-${product.product_id}`
                                                                )
                                                                .show()
                                                        }
                                                        className="btn btn-outline btn-primary btn-sm"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(product.product_id)
                                                        }
                                                        className="btn btn-outline btn-error btn-sm"
                                                    >
                                                        Desactivar
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
                                mostrando {limit * (page - 1) + 1} -{" "}
                                {limit * (page - 1) + products.length} de {total} productos
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

                    {paranoidProducts.length > 0 && (
                        <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
                            <input type="checkbox" />
                            <div className="collapse-title font-semibold">Productos eliminados</div>
                            <div className="collapse-content text-sm">
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        <thead className="bg-base-100">
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Precio</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paranoidProducts.map((product) => (
                                                <tr key={product.product_id}>
                                                    <td>{product.product_id.split("-")[0]}</td>
                                                    <td>{product.product_name}</td>
                                                    <td>{product.product_price}</td>
                                                    <td>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleRestore(
                                                                        product.product_id
                                                                    )
                                                                }
                                                                className="btn btn-outline btn-success btn-sm"
                                                            >
                                                                Restaurar
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        product.product_id,
                                                                        true
                                                                    )
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
            {products.map((product) => (
                <dialog
                    key={product.product_id}
                    id={`edit-product-${product.product_id}`}
                    className="modal"
                >
                    <div className="modal-box">
                        <h1 className="text-lg font-bold">Editar producto</h1>
                        <p className="py-4">Presiona ESC o click fuera para cerrar</p>
                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="product_id" value={product.product_id} />
                            <fieldset className="fieldset">
                                <label className="fieldset-label">
                                    <span>Nombre</span>
                                </label>
                                <input
                                    type="text"
                                    name="product_name"
                                    className="input input-bordered w-full focus:outline-none focus:border-primary"
                                    defaultValue={product.product_name}
                                />
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
