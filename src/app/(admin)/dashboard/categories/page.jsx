"use client";
import React from "react";
import { BsPencil, BsPlus, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";

// Hooks
import { useBase64 } from "@/hooks/useBase64";
import { useGetData, usePostData, usePutData, useDeleteData } from "@/hooks/useClientData";
import { useValidateForm } from "@/hooks/useValidateForm";
import useSetTitle from "@/hooks/useSetTitle";

// Components
import LoadingComponent from "@/components/loading";

export const dynamic = "force-dynamic";

export default function Page() {
    const {
        data: categories,
        loading: categoriesLoading,
        reload: reloadCategories,
    } = useGetData("/categories");

    useSetTitle("Pedidos | ISA Making");

    if (categoriesLoading) return <LoadingComponent />;

    const handleCreate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        const validation = useValidateForm("category-form", data);

        if (!validation.success) return;

        const image = formData.get("category_image");
        const imageBase64 = await useBase64(image);
        data.category_image = imageBase64;

        const response = await usePostData("/categories", { category: data });

        if (!response.success) return;

        reloadCategories();
        const $form = document.getElementById("create-category-form");
        $form.close();
        e.target.reset();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        const validation = useValidateForm("category-form", data);

        if (!validation.success) return;

        const image = formData.get("category_image");
        const imageBase64 = await useBase64(image);
        data.category_image = imageBase64;

        const response = await usePutData(`/categories/${data.category_id}`, { category: data });

        if (!response.success) return;

        reloadCategories();
        const $form = document.getElementById(`update-category-form-${data.category_id}`);
        $form.close();
        e.target.reset();
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await useDeleteData(`/categories/${id}`);
                if (!response.success) return;
                reloadCategories();
            }
        });
    };

    return (
        <>
            <div className="flex-1 w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-15 space-y-10">
                    <h1 className="text-2xl font-otomanopee">Categorías</h1>

                    <div className="bg-base-200 border border-base-300 rounded-lg">
                        <div className="flex flex-col md:flex-row gap-5 justify-between items-center p-5">
                            <input
                                type="text"
                                placeholder="Buscar categoría"
                                className="w-full max-w-sm input input-bordered focus:outline-none focus:border-primary"
                            />
                            <button
                                onClick={() =>
                                    document.getElementById("create-category-form").show()
                                }
                                className="btn btn-primary btn-sm font-normal text-sm gap-2 shadow-none"
                            >
                                <BsPlus size={19} />
                                Nueva categoría
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table text-lg table-zebra">
                                <thead className="bg-base-100">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Slug</th>
                                        <th>Imagen</th>
                                        <th>Productos</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.category_id}>
                                            <td>{category.category_id}</td>
                                            <td>{category.category_name}</td>
                                            <td>{category.category_slug}</td>
                                            <td>{category.products.length}</td>
                                            <td>
                                                <img
                                                    src={category.category_image}
                                                    alt={category.category_name}
                                                    className="w-15 h-15 object-cover rounded"
                                                />
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    `update-category-form-${category.category_id}`
                                                                )
                                                                .show()
                                                        }
                                                        className="btn btn-sm font-normal text-sm btn-primary btn-outline"
                                                    >
                                                        <BsPencil />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(category.category_id)
                                                        }
                                                        className="btn btn-sm font-normal text-sm btn-error btn-outline"
                                                    >
                                                        <BsTrash />
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
            </div>

            {categories.map((category) => (
                <dialog
                    key={category.category_id}
                    id={`update-category-form-${category.category_id}`}
                    className="modal"
                >
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Editar categoría</h3>
                        <p className="py-4">Presiona ESC o da click fuera para cerrar</p>
                        <form onSubmit={handleUpdate}>
                            <input type="hidden" name="category_id" value={category.category_id} />
                            <fieldset className="fieldset">
                                <div className="fieldset-label">
                                    <span>Nombre</span>
                                </div>
                                <input
                                    className="w-full input input-bordered focus:outline-none focus:border-primary"
                                    name="category_name"
                                    placeholder="Nombre de la categoría"
                                    defaultValue={category.category_name}
                                />
                            </fieldset>
                            <fieldset className="fieldset">
                                <div className="fieldset-label">
                                    <span>Slug</span>
                                </div>
                                <input
                                    className="w-full input input-bordered focus:outline-none focus:border-primary"
                                    name="category_slug"
                                    placeholder="Slug de la categoría (no debe contener espacios)"
                                    defaultValue={category.category_slug}
                                />
                            </fieldset>
                            <fieldset className="fieldset">
                                <div className="fieldset-label">
                                    <span>Imagen</span>
                                </div>
                                <input
                                    className="w-full file-input focus:outline-none focus:border-primary"
                                    name="category_image"
                                    type="file"
                                    accept="image/*"
                                />
                            </fieldset>
                            <fieldset className="fieldset mt-6">
                                <button type="submit" className="btn btn-primary">
                                    Editar categoría
                                </button>
                            </fieldset>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            ))}

            <dialog id="create-category-form" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Crear categoría</h3>
                    <p className="py-4">Presiona ESC o da click fuera para cerrar</p>
                    <form onSubmit={handleCreate}>
                        <fieldset className="fieldset">
                            <div className="fieldset-label">
                                <span>Nombre</span>
                            </div>
                            <input
                                className="w-full input input-bordered focus:outline-none focus:border-primary"
                                name="category_name"
                                placeholder="Nombre de la categoría"
                            />
                        </fieldset>
                        <fieldset className="fieldset">
                            <div className="fieldset-label">
                                <span>Slug</span>
                            </div>
                            <input
                                className="w-full input input-bordered focus:outline-none focus:border-primary"
                                name="category_slug"
                                placeholder="Slug de la categoría (no debe contener espacios)"
                            />
                        </fieldset>
                        <fieldset className="fieldset">
                            <div className="fieldset-label">
                                <span>Imagen</span>
                            </div>
                            <input
                                className="w-full file-input focus:outline-none focus:border-primary"
                                name="category_image"
                                type="file"
                                accept="image/*"
                            />
                        </fieldset>
                        <fieldset className="fieldset mt-6">
                            <button type="submit" className="btn btn-primary">
                                Crear categoría
                            </button>
                        </fieldset>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
