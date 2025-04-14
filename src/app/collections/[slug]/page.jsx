import { Category } from "@/database/models";
import Link from "next/link";
import React from "react";
import { useGetData } from "@/hooks/useServerData";

export default async function Page({ params }) {
    const { slug } = await params;

    const category = await Category.findOne({
        where: {
            category_slug: slug,
        },
    });

    const { data: products } = await useGetData(`/products?category=${category.category_id}`);

    return (
        <section className="w-full px-3">
            <div className="w-full max-w-[1300px] mx-auto py-10 space-y-10">
                <h1 className="text-6xl font-extrabold uppercase">Colecciones</h1>

                <div className="grid grid-cols-4 gap-15">
                    {products.map((product) => (
                            <div
                                key={product.product_id}
                                className="rounded-xl overflow-hidden bg-base-200"
                            >
                                <Link href={`/products/${product.product_id}`} className="block w-full group aspect-[9/10] overflow-hidden">
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
                                        ${Math.min(
                                            ...product.sizes.flatMap(
                                                (size) => size.ProductSize.product_price
                                            )
                                        ).toLocaleString("es-CO")}
                                    </p>
                                </div>
                            </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
