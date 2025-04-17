import { useGetData } from "@/hooks/useServerData";
import Link from "next/link";
import React from "react";

export const metadata = {
    title: "Pedido | ISA Making",
    description: "Pedido de ISA Making",
};

export default async function Page({ params }) {
    const { id } = await params;

    const { data: order } = await useGetData(`/orders/${id}`);
    const { products, shipping, payment } = order;

    const totalProducts = products.reduce((acc, product) => acc + product.product_quantity, 0);
    const totalPrice = products.reduce((acc, product) => acc + product.product_price, 0);

    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-20 space-y-10">
                    <div className="flex gap-12">
                        <div className="w-3/5 space-y-8">
                            {/* Encabezado */}
                            <header className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-4xl">
                                        Pedido #{order.order_id.split("-")[0]}
                                    </p>
                                    <p className="text-lg text-right">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg">
                                        Numero de pedido:{" "}
                                        <span>{order.shipping.shipping_guide || "Pendiente"}</span>
                                    </p>
                                    {order.order_state == "completed" ? (
                                        <div className="text-sm text-success font-semibold">
                                            Entregado
                                        </div>
                                    ) : (
                                        <div className="text-sm text-warning font-semibold">
                                            Pendiente
                                        </div>
                                    )}
                                </div>
                                <p>{totalProducts} productos</p>
                            </header>

                            {/* Productos */}
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-10">
                                {products.map(({ product, ...orderProduct }, idx) => (
                                    <div
                                        key={idx}
                                        className="flex rounded overflow-hidden bg-base-200 border border-base-300"
                                    >
                                        <div className="avatar">
                                            <figure className="w-30 aspect-[10/12] overflow-hidden">
                                                <img
                                                    src={product.product_image}
                                                    alt={product.product_name}
                                                />
                                            </figure>
                                        </div>
                                        <div className="p-5 space-y-2">
                                            <p className="text-xl font-medium">
                                                {product.product_name}
                                            </p>
                                            <div className="text-base-content/60">
                                                <div className="flex items-center gap-1">
                                                    <p className="text-lg">Color:</p>
                                                    <div
                                                        className="h-5 w-5 rounded-full border-2 border-base-content/80"
                                                        style={{
                                                            backgroundColor: product.product_color,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-lg leading-tight">
                                                    Talla: {orderProduct.size.size_slug}
                                                </p>
                                                <p className="text-lg leading-tight">
                                                    Cantidad: {orderProduct.product_quantity}
                                                </p>
                                            </div>
                                            <p className="text-xl font-semibold text-base-content/90">
                                                $
                                                {parseFloat(
                                                    orderProduct.product_price
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-2/5 space-y-8">
                            {/* Información del pedido */}
                            <div>
                                <h3 className="text-2xl font-medium mb-2">Envío</h3>
                                <ul className="leading-[1] space-y-2">
                                    <li>
                                        <span className="font-medium">Courier:</span>{" "}
                                        {shipping.shipping_courier || "No disponible"}
                                    </li>
                                    <li>
                                        <span className="font-medium">Guía:</span>{" "}
                                        {shipping.shipping_guide || "No registrada"}
                                    </li>
                                    <li>
                                        <span className="font-medium">URL de rastreo:</span>{" "}
                                        {shipping.tracking_url || "No disponible"}
                                    </li>
                                    <li>
                                        <span className="font-medium">Fecha del pedido:</span>{" "}
                                        {new Date(shipping.createdAt).toLocaleDateString()}
                                    </li>
                                    <li>
                                        <span className="font-medium">ID de envío:</span>{" "}
                                        {shipping.shipping_id}
                                    </li>
                                    <li>
                                        <span className="font-medium">ID del pedido:</span>{" "}
                                        {shipping.order_id}
                                    </li>
                                </ul>
                            </div>

                            {/* Datos de pago */}
                            <div>
                                <h3 className="text-2xl font-medium mb-2">Pago</h3>
                                <ul className="leading-[1] space-y-2">
                                    <li>
                                        <span className="font-medium">Método de pago:</span>{" "}
                                        {payment.payment_method}
                                    </li>
                                    <li>
                                        <span className="font-medium">Valor:</span> $
                                        {Number(payment.payment_amount).toLocaleString("es-CO")}
                                    </li>
                                    <li>
                                        <span className="font-medium">Comprador:</span>{" "}
                                        {payment.buyer_name}
                                    </li>
                                    <li>
                                        <span className="font-medium">Email:</span>{" "}
                                        {payment.buyer_email}
                                    </li>
                                    <li>
                                        <span className="font-medium">Documento:</span>{" "}
                                        {payment.buyer_document_type}{" "}
                                        {payment.buyer_document_number}
                                    </li>
                                    <li>
                                        <span className="font-medium">Fecha del pago:</span>{" "}
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4">
                        <Link href="/profile" className="w-1/2 btn text-lg font-normal">
                            Volver al perfil
                        </Link>
                        <Link
                            href={`/orders/${order.order_id}/history`}
                            className="w-1/2 btn text-lg font-normal"
                        >
                            Ver historial de envío
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
