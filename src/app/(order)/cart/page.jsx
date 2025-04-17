"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Hooks
import { useGetData, usePutData } from "@/hooks/useClientData";
import useSetTitle from "@/hooks/useSetTitle";

// Components
import LoadingComponent from "@/components/loading";

export default function Page() {
    const { data: session, status } = useSession();
    const userSession = session?.user;

    useSetTitle("Carrito de compras | ISA Making");

    const {
        data: cart,
        loading: cartLoading,
        reload,
    } = useGetData(`/users/${userSession?.user_id}/cart`);

    if (cartLoading || status === "loading") return <LoadingComponent />;

    const totalProducts = cart?.reduce((acc, product) => acc + product.product_quantity, 0);
    const totalPrice = cart?.reduce(
        (acc, product) => acc + product.size.ProductSize.product_price * product.product_quantity,
        0
    );

    const handleUpdateCart = async (productId, sizeId, action = "increment") => {
        const response = await usePutData(`/users/${userSession?.user_id}/cart`, {
            product_id: productId,
            size_id: sizeId,
            action,
        });

        if (response.success) {
            reload();
        }
    };

    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-10">
                    <div className="w-full flex flex-col md:flex-row gap-15">
                        <div className="w-full md:w-2/3 space-y-10">
                            <div className="w-full flex items-center justify-between">
                                <h1 className="text-2xl font-bold">Carrito de compras</h1>
                                <Link href="/collections" className="text-primary hover:underline">
                                    <p>Continuar comprando</p>
                                </Link>
                            </div>
                            <div className="w-full flex flex-col gap-7">
                                {cart?.map(({ product, size, ...cart }) => (
                                    <article
                                        key={product.product_id + size.size_id}
                                        className="w-full flex flex-col md:flex-row items-center gap-5"
                                    >
                                        <div className="flex grow gap-5">
                                            <Link
                                                href={"/products/" + product.product_id}
                                                className="w-[150px] aspect-[10/12] rounded overflow-hidden"
                                            >
                                                <img
                                                    src={product.product_image}
                                                    alt={product.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </Link>
                                            <div className="grow">
                                                <div className="flex flex-col gap-3">
                                                    <div className="grow">
                                                        <h2 className="text-xl uppercase font-medium">
                                                            {product.product_name}
                                                        </h2>
                                                        <div className="flex flex-row flex-wrap gap-3 my-2">
                                                            {product.categories.map((category) => (
                                                                <div
                                                                    className="badge badge-primary badge-soft border-[1px_solid_var(--primary)_!important]"
                                                                    key={category.category_id}
                                                                >
                                                                    <p>{category.category_name}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="text-base-content/80">
                                                        <p>Color: {product.product_color}</p>
                                                        <p>Talla: {size.size_slug}</p>
                                                        <p>Cantidad: {cart.product_quantity}</p>
                                                        <p>
                                                            Precio: $
                                                            {size.ProductSize.product_price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex  flex-row md:flex-col items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    handleUpdateCart(
                                                        product.product_id,
                                                        size.size_id,
                                                        "increment"
                                                    )
                                                }
                                                className="btn btn-primary"
                                            >
                                                <p>Aumentar</p>
                                            </button>
                                            <input
                                                type="text"
                                                className="input input-bordered w-15 focus:outline-none focus:border-primary"
                                                value={cart.product_quantity}
                                                readOnly
                                            />
                                            <button
                                                onClick={() =>
                                                    handleUpdateCart(
                                                        product.product_id,
                                                        size.size_id,
                                                        "decrement"
                                                    )
                                                }
                                                className="btn btn-primary"
                                            >
                                                <p>Disminuir</p>
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 space-y-5">
                            <div className="w-full bg-base-200">
                                <div className="w-full p-4 bg-base-300">
                                    <button
                                        className="btn w-full text-lg"
                                        disabled={cart?.length === 0}
                                    >
                                        <Link href={cart?.length > 0 ? "/checkout" : "/"}>
                                            <p>Continuar con la compra</p>
                                        </Link>
                                    </button>
                                </div>
                                <div className="w-full p-3 ">
                                    <div className="w-full flex flex-col gap-3">
                                        <h1 className="text-2xl font-bold">Resumen</h1>
                                        <div className="bg-base-300 w-full p-5 space-y-3">
                                            <p>{totalProducts} Productos</p>
                                            <hr className="border-white/50" />
                                            <p>Subtotal: ${totalPrice}</p>
                                            <hr className="border-white/50" />
                                            <p>Envio: $0</p>
                                            <hr className="border-white/50" />
                                            <p>Total: ${totalPrice + 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl uppercase font-medium">
                                    Metodos de pago aceptados
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        {
                                            id: 1,
                                            name: "Tarjetas de crédito",
                                            methods: [
                                                "Visa",
                                                "Mastercard",
                                                "American Express (Amex)",
                                                "Diners Club",
                                            ],
                                        },
                                        {
                                            id: 2,
                                            name: "Tarjetas débito y transferencias bancarias (PSE)",
                                            methods: [
                                                "Pagos directos desde cuentas bancarias",
                                                "Disponibilidad en la mayoría de bancos colombianos",
                                            ],
                                        },
                                        {
                                            id: 3,
                                            name: "Pagos en efectivo (cupones generados en línea)",
                                            methods: [
                                                "Bancolombia",
                                                "Banco de Bogotá",
                                                "Davivienda",
                                            ],
                                        },
                                        {
                                            id: 4,
                                            name: "Pagos internacionales",
                                            methods: [
                                                "Tarjetas de crédito internacionales (Visa, Mastercard, Amex, etc.)",
                                            ],
                                        },
                                    ].map(({ id, name, methods }) => (
                                        <li key={id}>
                                            <h4 className="text-lg font-medium">{name}:</h4>
                                            <div className="flex flex-row flex-wrap gap-2">
                                                {methods.map((method, index) => (
                                                    <div className="badge">
                                                        <p key={index}>{method}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
