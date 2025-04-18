"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BsArrowLeft, BsArrowRight, BsPencil, BsPlus, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";

// Hooks
import { useDeleteData, useGetData, usePostData, usePutData } from "@/hooks/useClientData";
import useSetTitle from "@/hooks/useSetTitle";
import { useValidateForm } from "@/hooks/useValidateForm";

// Components
import LoadingComponent from "@/components/loading";
import MDEditor from "@uiw/react-md-editor";
import { useBase64 } from "@/hooks/useBase64";

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
    const { data: categories, loading: categoriesLoading } = useGetData("/categories");
    const { data: sizes, loading: sizesLoading } = useGetData("/sizes");
    const {
        data: paranoidProducts,
        loading: paranoidLoading,
        reload: paranoidReload,
    } = useGetData("/products/x/paranoid");

    useSetTitle("Productos | ISA Making");

    if (loading || paranoidLoading || status === "loading" || categoriesLoading || sizesLoading) {
        return <LoadingComponent />;
    }

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

    return (
        <>
            <section className="flex-1 w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-15 space-y-20">
                    <h1 className="text-3xl font-otomanopee">Productos</h1>
                    <div className="bg-base-200 border border-base-300 rounded-lg">
                        <div className="flex justify-between items-center p-5">
                            <input
                                type="text"
                                placeholder="Buscar producto"
                                className="w-full max-w-sm input input-bordered focus:outline-none focus:border-primary"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    document.getElementById("create-product-modal").showModal();
                                }}
                                className="btn btn-primary shadow-none"
                            >
                                <BsPlus size={16} />
                                <span>Nuevo producto</span>
                            </button>
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

            <dialog id="create-product-modal" className="modal">
                <div className="modal-box w-full max-w-xl max-h-[90vh] overflow-y-auto">
                    <h1 className="text-lg font-bold">Crear producto</h1>
                    <p className="py-4">Presiona ESC o click fuera para cerrar</p>
                    <ProductCreate categories={categories} sizes={sizes} reload={reload} />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {products.map((product) => (
                <dialog
                    key={product.product_id}
                    id={`edit-product-${product.product_id}`}
                    className="modal"
                >
                    <div className="modal-box w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <h1 className="text-lg font-bold">Editar producto</h1>
                        <p className="py-4">Presiona ESC o click fuera para cerrar</p>
                        <ProductUpdate
                            product={product}
                            categories={categories}
                            sizes={sizes}
                            reload={reload}
                        />
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            ))}
        </>
    );
}

const ProductUpdate = ({ product, categories, sizes, reload }) => {
    const [description, setDescription] = useState("");
    const [mediaFiles, setMediaFiles] = useState([]);
    const [productSizes, setProductSizes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        setDescription(product.product_description);
        setProductSizes(
            product.sizes.map((s) => ({
                size_id: s.size_id,
                size_slug: s.size_slug,
                product_price: s.ProductSize.product_price,
            }))
        );
        setSelectedCategories(product.categories.map((c) => c.category_id));
    }, [product]);

    const handleAddSize = () => {
        const available = sizes.find((s) => !productSizes.some((ps) => ps.size_id === s.size_id));
        if (available) {
            setProductSizes([
                ...productSizes,
                {
                    size_id: available.size_id,
                    size_slug: available.size_slug,
                    product_price: 0,
                },
            ]);
        }
    };

    const handleRemoveSize = (index) => {
        const updated = [...productSizes];
        updated.splice(index, 1);
        setProductSizes(updated);
    };

    const handleSizeChange = (index, key, value) => {
        const updated = [...productSizes];
        updated[index][key] = value;
        setProductSizes(updated);
    };

    const handleCategoryChange = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        );
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.product_description = description;

        const mainImage = formData.get("product_image");
        if (mainImage && mainImage.size > 0) {
            data.product_image = await useBase64(mainImage);
        } else {
            delete data.product_image;
        }

        if (mediaFiles.length > 0) {
            const mediaBase64 = await Promise.all(
                Array.from(mediaFiles).map((file) => useBase64(file))
            );
            data.product_medias = mediaBase64;
        } else {
            delete data.product_medias;
        }

        data.sizes = productSizes;
        data.categories = selectedCategories;

        const validation = useValidateForm("edit-product-form", data);
        if (!validation.success) return;

        const fetchData = {
            product: data,
            categories: selectedCategories,
            sizes: productSizes,
            medias: data.product_medias || [],
        };

        if (fetchData.sizes.length === 0) return alert("Debes agregar al menos una talla");
        if (fetchData.categories.length === 0)
            return alert("Debes seleccionar al menos una categoría");

        const response = await usePutData(`/products/${data.product_id}`, fetchData);
        if (!response.success) return;

        reload();
        const $form = document.getElementById(`edit-product-${data.product_id}`);
        $form.close();
        e.target.reset();
    };

    const handleDeleteMedia = async (mediaId) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción es irreversible",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await useDeleteData(`/medias/${mediaId}`);
                if (!response.success) return;
                reload();
            }
        });
    };

    return (
        <form onSubmit={handleEdit}>
            <input type="hidden" name="product_id" value={product.product_id} />

            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Nombre</span>
                </label>
                <input
                    type="text"
                    name="product_name"
                    defaultValue={product.product_name}
                    className="input input-bordered w-full"
                />
            </fieldset>
            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Descripción</span>
                </label>
                <MDEditor value={description} onChange={setDescription} />
            </fieldset>
            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Imagen principal</span>
                </label>
                <input
                    type="file"
                    name="product_image"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                />
            </fieldset>

            {/* Medias */}
            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Imágenes adicionales</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                    {product.medias.length === 0 ? (
                        <span className="text-sm text-base-content/80">No hay imágenes</span>
                    ) : (
                        product.medias.map((media) => (
                            <figure key={media.media_id} className="w-16 h-16 relative group">
                                <img
                                    key={media.media_id}
                                    src={media.media_image}
                                    alt={`Imagen ${media.media_id}`}
                                    className="w-full h-full object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    className="btn btn-error btn-xs absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    onClick={() => handleDeleteMedia(media.media_id)}
                                >
                                    ✕
                                </button>
                            </figure>
                        ))
                    )}
                </div>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setMediaFiles(e.target.files)}
                    className="file-input file-input-bordered w-full mt-2"
                />
            </fieldset>
            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Color</span>
                </label>
                <input
                    type="color"
                    name="product_color"
                    defaultValue={product.product_color}
                    className="input input-bordered w-full"
                />
            </fieldset>
            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Unidades Disponibles</span>
                </label>
                <input
                    type="number"
                    name="product_stock"
                    defaultValue={product.product_stock}
                    className="input input-bordered w-full"
                />
            </fieldset>

            {/* Tallas */}
            <fieldset className="fieldset">
                <label className="fieldset-label flex justify-between items-center">
                    <span>Tallas</span>
                    <button
                        type="button"
                        onClick={handleAddSize}
                        className="btn btn-sm btn-outline"
                    >
                        + Agregar talla
                    </button>
                </label>
                <div className="space-y-2">
                    {productSizes.map((size, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <select
                                className="select select-bordered w-1/2"
                                value={size.size_id}
                                onChange={(e) => {
                                    const selected = sizes.find(
                                        (s) => s.size_id === parseInt(e.target.value)
                                    );
                                    handleSizeChange(index, "size_id", selected.size_id);
                                    handleSizeChange(index, "size_slug", selected.size_slug);
                                }}
                            >
                                <option value={size.size_id}>{size.size_slug}</option>
                                {sizes
                                    .filter(
                                        (s) => !productSizes.some((ps) => ps.size_id === s.size_id)
                                    )
                                    .map((s) => (
                                        <option key={s.size_id} value={s.size_id}>
                                            {s.size_slug}
                                        </option>
                                    ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Precio"
                                className="input input-bordered w-full"
                                value={size.product_price}
                                onChange={(e) =>
                                    handleSizeChange(
                                        index,
                                        "product_price",
                                        parseFloat(e.target.value)
                                    )
                                }
                            />
                            <button
                                type="button"
                                className="btn btn-error btn-sm"
                                onClick={() => handleRemoveSize(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </fieldset>

            {/* Categorías */}
            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Categorías</span>
                </label>
                <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                        <label key={cat.category_id} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                value={cat.category_id}
                                checked={selectedCategories.includes(cat.category_id)}
                                onChange={() => handleCategoryChange(cat.category_id)}
                            />
                            {cat.category_name}
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className="fieldset mt-6">
                <button type="submit" className="btn btn-primary w-full">
                    Actualizar
                </button>
            </fieldset>
        </form>
    );
};

const ProductCreate = ({ categories, sizes, reload }) => {
    const [description, setDescription] = useState("");
    const [mediaFiles, setMediaFiles] = useState([]);
    const [productSizes, setProductSizes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleAddSize = () => {
        const available = sizes.find((s) => !productSizes.some((ps) => ps.size_id === s.size_id));
        if (available) {
            setProductSizes([
                ...productSizes,
                {
                    size_id: available.size_id,
                    size_slug: available.size_slug,
                    product_price: 0,
                },
            ]);
        }
    };

    const handleRemoveSize = (index) => {
        const updated = [...productSizes];
        updated.splice(index, 1);
        setProductSizes(updated);
    };

    const handleSizeChange = (index, key, value) => {
        const updated = [...productSizes];
        updated[index][key] = value;
        setProductSizes(updated);
    };

    const handleCategoryChange = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        );
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.product_description = description;

        const mainImage = formData.get("product_image");
        if (mainImage && mainImage.size > 0) {
            data.product_image = await useBase64(mainImage);
        }

        if (mediaFiles.length > 0) {
            const mediaBase64 = await Promise.all(
                Array.from(mediaFiles).map((file) => useBase64(file))
            );
            data.product_medias = mediaBase64;
        }

        data.sizes = productSizes;
        data.categories = selectedCategories;

        const validation = useValidateForm("edit-product-form", data);
        if (!validation.success) return;

        const fetchData = {
            product: data,
            categories: selectedCategories,
            sizes: productSizes,
            medias: data.product_medias || [],
        };

        if (fetchData.sizes.length === 0) return alert("Debes agregar al menos una talla");
        if (fetchData.categories.length === 0)
            return alert("Debes seleccionar al menos una categoría");

        console.log(fetchData);
        const response = await usePostData("/products", fetchData);
        if (!response.success) return;

        reload();
        e.target.reset();
        setDescription("");
        setMediaFiles([]);
        setProductSizes([]);
        setSelectedCategories([]);
        const $form = document.getElementById("create-product-modal");
        $form.close();
    };

    return (
        <form onSubmit={handleCreate} id="create-product-form">
            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Nombre</span>
                </label>
                <input type="text" name="product_name" className="input input-bordered w-full" />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Descripción</span>
                </label>
                <MDEditor value={description} onChange={setDescription} />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Imagen principal</span>
                </label>
                <input
                    type="file"
                    name="product_image"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Imágenes adicionales</span>
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setMediaFiles(e.target.files)}
                    className="file-input file-input-bordered w-full"
                />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Color</span>
                </label>
                <input type="color" name="product_color" className="input input-bordered w-full" />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Unidades Disponibles</span>
                </label>
                <input type="number" name="product_stock" className="input input-bordered w-full" />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label flex justify-between items-center">
                    <span>Tallas</span>
                    <button
                        type="button"
                        onClick={handleAddSize}
                        className="btn btn-sm btn-outline"
                    >
                        + Agregar talla
                    </button>
                </label>
                <div className="space-y-2">
                    {productSizes.map((size, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <select
                                className="select select-bordered w-1/2"
                                value={size.size_id}
                                onChange={(e) => {
                                    const selected = sizes.find(
                                        (s) => s.size_id === parseInt(e.target.value)
                                    );
                                    handleSizeChange(index, "size_id", selected.size_id);
                                    handleSizeChange(index, "size_slug", selected.size_slug);
                                }}
                            >
                                <option value={size.size_id}>{size.size_slug}</option>
                                {sizes
                                    .filter(
                                        (s) => !productSizes.some((ps) => ps.size_id === s.size_id)
                                    )
                                    .map((s) => (
                                        <option key={s.size_id} value={s.size_id}>
                                            {s.size_slug}
                                        </option>
                                    ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Precio"
                                className="input input-bordered w-full"
                                value={size.product_price}
                                onChange={(e) =>
                                    handleSizeChange(
                                        index,
                                        "product_price",
                                        parseFloat(e.target.value)
                                    )
                                }
                            />
                            <button
                                type="button"
                                className="btn btn-error btn-sm"
                                onClick={() => handleRemoveSize(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span>Categorías</span>
                </label>
                <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                        <label key={cat.category_id} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                value={cat.category_id}
                                checked={selectedCategories.includes(cat.category_id)}
                                onChange={() => handleCategoryChange(cat.category_id)}
                            />
                            {cat.category_name}
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className="fieldset mt-6">
                <button type="submit" className="btn btn-primary w-full">
                    Crear producto
                </button>
            </fieldset>
        </form>
    );
};
