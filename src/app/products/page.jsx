"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Hooks
import { useGetData } from "@/hooks/useClientData";
import { useSearchParams } from "next/navigation";

// Components
import LoadingComponent from "@/components/loading";

export default function Page() {
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(8);
    const searchParams = useSearchParams();

    const {
        data: products,
        loading: loadingProducts,
        total,
    } = useGetData(`/products?search=${search}&limit=${limit}`);

    useEffect(() => {
        const search = searchParams.get("search");
        if (search) {
            setSearch(search);
        }
    }, [searchParams, products]);

    if (loadingProducts) return <LoadingComponent />;
    return (
        <section className="w-full px-3">
            <div className="w-full max-w-[1300px] mx-auto py-10 space-y-10">
                <h1 className="text-6xl font-extrabold uppercase">Busqueda {search}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15">
                    {products.map((product) => (
                        <div
                            key={product.product_id}
                            className="rounded-xl overflow-hidden bg-base-200"
                        >
                            <Link
                                href={`/products/${product.product_id}`}
                                className="block w-full group aspect-[9/10] overflow-hidden"
                            >
                                <img
                                    src={product.product_image}
                                    alt={product.product_name}
                                    className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
                                />
                            </Link>
                            <div className="p-4">
                                <h3 className="text-2xl  w-full text-center leading-tight">
                                    {product.product_name}
                                </h3>
                                <p className="text-3xl font-bold w-full text-center leading-tight">
                                    $
                                    {Math.min(
                                        ...product.sizes.flatMap(
                                            (size) => size.ProductSize.product_price
                                        )
                                    ).toLocaleString("es-CO")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length < total && products.length > 0 && (
                    <div className="flex justify-center">
                        <button
                            className="btn btn-primary"
                            onClick={() => setLimit((prev) => prev + 2)}
                            disabled={products.length >= total}
                        >
                            Ver más
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
