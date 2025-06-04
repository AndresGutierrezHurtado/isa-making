"use client";

import Link from "next/link";
import React from "react";

// Hooks
import { useGetData } from "@/hooks/useClientData";
import useSetTitle from "@/hooks/useSetTitle";

// Components
import LoadingComponent from "@/components/loading";

export const dynamic = "force-dynamic";

export default function Page() {
    const { data: collections, loading: collecitonsLoading } = useGetData("/collections");

    useSetTitle("Colecciones | ISA Making");

    if (collecitonsLoading) return <LoadingComponent />;

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
