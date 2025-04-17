import { Category } from "@/database/models";
import Link from "next/link";
import React from "react";

export const metadata = {
    title: "Colecciones | ISA Making",
    description: "Colecciones de ISA Making",
};

export default async function Page() {
    const collections = await Category.findAll();

    return (
        <section className="w-full px-3">
            <div className="w-full max-w-[1300px] mx-auto py-10 space-y-10">
                <h1 className="text-6xl font-extrabold uppercase">Colecciones</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15">
                    {collections.map((category) => (
                        <Link
                            key={category.category_id}
                            href={`/collections/${category.category_slug}`}
                            className="w-full space-y-3"
                        >
                            <div className="w-full aspect-square group overflow-hidden rounded-xs">
                                <img
                                    src={category.category_image}
                                    alt={category.category_name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                />
                            </div>
                            <h3 className="text-2xl font-medium w-full text-center">
                                {category.category_name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
