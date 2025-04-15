"use client";

import { useState } from "react";
import { useGetData } from "@/hooks/useClientData";
import { useParams } from "next/navigation";
import { BoxIcon, ClockIcon, ArrowLeftRightIcon, CreditCardIcon } from "@/components/icons";
import Markdown from "react-markdown";

export default function Page() {
    const { id } = useParams();
    const [currentSize, setCurrentSize] = useState(null);
    const { data: product, loading: productLoading } = useGetData(`/products/${id}`);

    if (productLoading) return <div>Loading...</div>;

    const images = [
        {
            id: product.product_id,
            src: product.product_image,
            alt: product.product_name,
        },
        ...product.medias.map((media, index) => ({
            id: media.media_id,
            src: media.media_image,
            alt: product.product_name + " " + index,
        })),
    ];

    return (
        <>
            <section className="w-full px-3 py-12">
                <div className="w-full max-w-[1300px] mx-auto">
                    <div className="w-full flex gap-10">
                        <div
                            className={`w-1/2 grid grid-cols-1 ${
                                images.length > 1 && "md:grid-cols-2"
                            } gap-8 h-fit`}
                        >
                            {images.map((image) => (
                                <img
                                    key={image.id}
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover rounded"
                                />
                            ))}
                        </div>
                        <div className="w-1/2 bg-base-300 h-fit">
                            <nav className="w-full bg-base-200 p-4 flex divide-x divide-base-content/20">
                                <strong className="pr-4">TELA PREMIUM</strong>
                                <p className="pl-4">Una vez la tocas, notarás la diferencia</p>
                            </nav>
                            <div className="p-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-base-content/80">
                                        Item: {product.product_id.split("-")[0]}
                                    </p>
                                    <div>
                                        <h1 className="text-4xl uppercase font-medium">
                                            {product.product_name}
                                        </h1>
                                        <p className="text-xl">
                                            $
                                            {parseInt(
                                                product.sizes[
                                                    product.sizes.findIndex(
                                                        (s) => s.size_id === currentSize
                                                    ) || 0
                                                ]?.ProductSize.product_price ||
                                                    product.sizes[0].ProductSize.product_price
                                            ).toLocaleString("es-CO")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p>Color</p>
                                        <div
                                            className="w-5 h-5 rounded-full border-2 border-base-content tooltip tooltip-bottom"
                                            style={{ backgroundColor: product.product_color }}
                                            data-tip={product.product_color}
                                        ></div>
                                    </div>
                                </div>
                                <hr className="border-base-content/50 my-5" />
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="font-medium">Talla</p>
                                        <div className="join">
                                            {product.sizes.map((s) => (
                                                <button
                                                    key={s.size_id}
                                                    className={`join-item btn shadow-none ${
                                                        currentSize === s.size_id
                                                            ? "bg-base-200"
                                                            : "bg-base-300"
                                                    }`}
                                                    onClick={() => setCurrentSize(s.size_id)}
                                                >
                                                    {s.size_slug}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="btn w-full btn-primary text-lg">
                                        Agregar al carrito
                                    </button>

                                    <ul className="space-y-2 leading-[1]">
                                        <li>
                                            <div className="flex gap-4 items-center">
                                                <BoxIcon size={20} />
                                                <div>
                                                    <h4 className="text-base uppercase font-medium">
                                                        Envíos gratis
                                                    </h4>
                                                    <p className="text-sm">
                                                        Aplica para ropa sin descuento.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex gap-4 items-center">
                                                <ClockIcon size={20} />
                                                <div>
                                                    <h4 className="text-base uppercase font-medium">
                                                        Te llega en 6 días
                                                    </h4>
                                                    <p className="text-sm">
                                                        Solo 6 días hábiles para ciudades
                                                        principales.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex gap-4 items-center">
                                                <ArrowLeftRightIcon size={20} />
                                                <div>
                                                    <h4 className="text-base uppercase font-medium">
                                                        Devoluciones gratis
                                                    </h4>
                                                    <p className="text-sm">
                                                        Aplica para ropa sin descuento.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex gap-4 items-center">
                                                <CreditCardIcon size={20} />
                                                <div>
                                                    <h4 className="text-base uppercase font-medium">
                                                        Métodos de pago
                                                    </h4>
                                                    <p className="text-sm">
                                                        Tarjeta de crédito, débito.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <hr className="border-base-content/50 my-5" />
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Sobre el producto</h3>

                                    <div className="markdown">
                                        <Markdown>{product.product_description}</Markdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
