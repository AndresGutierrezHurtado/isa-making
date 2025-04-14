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
                        <div className="w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8 h-fit">
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
                                <p>Item: {product.product_id.split("-")[0]}</p>
                                <h1 className="text-4xl uppercase font-medium">
                                    {product.product_name}
                                </h1>
                                <p className="text-xl">
                                    $
                                    {parseInt(
                                        product.sizes[0].ProductSize.product_price
                                    ).toLocaleString("es-CO")}
                                </p>
                                <hr className="border-base-content/50 my-5" />
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="font-medium">Talla</p>
                                        <div className="join">
                                            {product.sizes.map((s) => (
                                                <button
                                                    key={s.size_id}
                                                    className={`join-item btn shadow-none ${
                                                        currentSize === s.size_slug
                                                            ? "bg-base-200"
                                                            : "bg-base-300"
                                                    }`}
                                                    onClick={() => setCurrentSize(s.size_slug)}
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
        // <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        //     {/* Imágenes */}
        //     <div className="flex flex-col gap-4 items-center">
        //         <Image
        //             src="/buzo-espalda.png" // reemplaza con tu ruta real
        //             alt="Buzo espalda"
        //             width={500}
        //             height={600}
        //             className="rounded-xl"
        //         />
        //         <Image
        //             src="/buzo-frente.png" // reemplaza con tu ruta real
        //             alt="Buzo frente"
        //             width={500}
        //             height={600}
        //             className="rounded-xl"
        //         />
        //     </div>

        //     {/* Info del producto */}
        //     <div className="space-y-6 bg-base-300">
        //         <div>
        //             <h2 className="text-2xl font-semibold">BUZO HOODIE ROJO TEXTO</h2>
        //             <p className="text-xl text-red-600 font-bold">$179.000</p>
        //         </div>

        //         {/* Selección de talla */}
        //         <div className="space-y-2">
        //             <p className="font-medium">Talla</p>
        //             <div className="join">
        //                 {sizes.map((s) => (
        //                     <button
        //                         key={s}
        //                         className={`join-item btn ${
        //                             size === s ? "btn-neutral" : "btn-outline"
        //                         }`}
        //                         onClick={() => setSize(s)}
        //                     >
        //                         {s}
        //                     </button>
        //                 ))}
        //             </div>
        //         </div>

        //         <button className="btn btn-wide btn-neutral mt-4">Agregar a la bolsa</button>

        //         {/* Info adicional */}
        //         <ul className="text-sm list-disc list-inside space-y-1 text-gray-600">
        //             <li>Envíos gratis para ropa sin descuento.</li>
        //             <li>Entrega en 6 días hábiles.</li>
        //             <li>Devoluciones gratis.</li>
        //             <li>Métodos de pago: tarjeta, contraentrega y ADDI.</li>
        //         </ul>

        //         {/* Descripción */}
        //         <div className="mt-6">
        //             <h3 className="text-lg font-semibold">Sobre el producto</h3>
        //             <p className="text-sm text-gray-700 mt-2">
        //                 Buzo Regular fit confeccionado en una Burda Premium de alto gramaje de 370gr
        //                 de peso, con puños y fajón en rib. Tiene estampación en frente y espalda,
        //                 ambos en alta densidad, lo cual le da relieve al texto. La espalda va
        //                 completa con mangas.
        //             </p>
        //         </div>

        //         {/* Especificaciones */}
        //         <div>
        //             <h4 className="font-semibold mt-4">Especificaciones</h4>
        //             <ul className="list-disc list-inside text-sm text-gray-700">
        //                 <li>Texto</li>
        //                 <li>100% Algodón</li>
        //                 <li>Alto Gramaje</li>
        //                 <li>Tela Premium</li>
        //                 <li>Fit Regular</li>
        //             </ul>
        //         </div>
        //     </div>
        // </div>
    );
}
