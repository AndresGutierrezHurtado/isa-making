"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import crypto from "crypto";

// Hooks
import { useGetData } from "@/hooks/useClientData";
import { useValidateForm } from "@/hooks/useValidateForm";
import useSetTitle from "@/hooks/useSetTitle";

export default function Page() {
    const { data: session, status } = useSession();
    const userSession = session?.user;

    useSetTitle("Checkout | ISA Making");

    const { data: cart, loading: cartLoading } = useGetData(`/users/${userSession?.user_id}/cart`);

    if (cartLoading || status === "loading") return <p>Cargando...</p>;

    const totalProducts = cart?.reduce((acc, product) => acc + product.product_quantity, 0);
    const totalPrice = cart?.reduce(
        (acc, product) => acc + product.size.ProductSize.product_price * product.product_quantity,
        0
    );

    const merchantId = process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID;
    const accountId = process.env.NEXT_PUBLIC_PAYU_ACCOUNT_ID;
    const apiKey = process.env.NEXT_PUBLIC_PAYU_API_KEY;
    const test = process.env.NEXT_PUBLIC_PAYU_TEST;
    const referenceCode = userSession?.user_id + new Date().getTime();
    const amount = totalPrice;
    const description = `Pago de ${cart.length} productos`;
    const currency = "COP";

    const signatureUncrypted = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`;
    const signature = crypto.createHash("md5").update(signatureUncrypted).digest("hex");

    const responseUrl = `${process.env.NEXT_PUBLIC_URL}/api/orders/callback`;

    const handleSubmit = () => {
        const $form = document.querySelector("form");
        const data = Object.fromEntries(new FormData($form));
        const validation = useValidateForm("checkout-form", data);

        if (!validation.success) return;

        $form.submit();
    };

    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-10">
                    <h1 className="text-2xl font-bold mb-4">Formulario de pago</h1>
                    <div className="bg-base-200 p-4 md:py-8 md:px-10 rounded">
                        <form
                            method="post"
                            action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
                            className="flex flex-col gap-2"
                        >
                            {/* Datos del pedido */}
                            <input name="merchantId" type="hidden" value={merchantId} />
                            <input name="accountId" type="hidden" value={accountId} />
                            <input name="referenceCode" type="hidden" value={referenceCode} />
                            <input name="signature" type="hidden" value={signature} />
                            <input name="test" type="hidden" value={test} />
                            <input name="currency" type="hidden" value={currency} />
                            <input name="description" type="hidden" value={description} />
                            <input name="amount" type="hidden" value={amount} />
                            <input name="tax" type="hidden" value="0" />

                            {/* Dirección de envío */}
                            <input name="shippingCity" type="hidden" value="Bogotá" />
                            <input name="shippingCountry" type="hidden" value="CO" />

                            {/* URLs de respuesta */}
                            <input name="responseUrl" type="hidden" value={responseUrl} />

                            <h2 className="text-2xl font-bold w-full mb-4">
                                Información de Facturación
                            </h2>

                            <fieldset className="fieldset w-full">
                                <label className="fieldset-label text-base-content/80 text-base">
                                    Nombre completo del pagador:
                                </label>
                                <input
                                    name="payerFullName"
                                    placeholder="Nombre completo del pagador"
                                    className="w-full input input-bordered focus:outline-none focus:border-primary"
                                    defaultValue={
                                        userSession.user_name + " " + userSession.user_lastname
                                    }
                                />
                            </fieldset>

                            <fieldset className="fieldset w-full">
                                <label className="fieldset-label text-base-content/80 text-base">
                                    Correo electrónico del pagador:
                                </label>
                                <input
                                    name="payerEmail"
                                    placeholder="Correo electrónico del pagador"
                                    className="w-full input input-bordered focus:outline-none focus:border-primary"
                                    defaultValue={userSession.user_email}
                                />
                            </fieldset>

                            <fieldset className="fieldset w-full">
                                <label className="fieldset-label text-base-content/80 text-base">
                                    Teléfono del pagador:
                                </label>
                                <input
                                    name="payerPhone"
                                    placeholder="Teléfono del pagador"
                                    className="w-full input input-bordered focus:outline-none focus:border-primary"
                                />
                            </fieldset>

                            <div className="flex flex-col md:flex-row w-full gap-10">
                                <fieldset className="fieldset flex-1">
                                    <label className="fieldset-label text-base-content/80 text-base">
                                        Tipo de documento:
                                    </label>
                                    <select
                                        name="payerDocumentType"
                                        className="w-full select select-bordered focus:outline-none focus:border-primary"
                                    >
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                        <option value="TI">Tarjeta de Identidad</option>
                                        <option value="PPN">Pasaporte</option>
                                        <option value="NIT">
                                            Número de Identificación Tributaria
                                        </option>
                                    </select>
                                </fieldset>

                                <fieldset className="fieldset flex-3">
                                    <label className="fieldset-label text-base-content/80 text-base">
                                        Número de documento:
                                    </label>
                                    <input
                                        name="payerDocument"
                                        placeholder="Número de documento"
                                        className="w-full input input-bordered focus:outline-none focus:border-primary"
                                    />
                                </fieldset>
                            </div>

                            <fieldset className="fieldset w-full">
                                <label className="fieldset-label text-base-content/80 text-base">
                                    Dirección:
                                </label>
                                <input
                                    name="shippingAddress"
                                    placeholder="Dirección de envío"
                                    className="w-full input input-bordered focus:outline-none focus:border-primary"
                                />
                            </fieldset>

                            <fieldset className="fieldset w-full">
                                <label className="fieldset-label text-base-content/80 text-base">
                                    Código postal:
                                </label>
                                <input
                                    name="shippingZipCode"
                                    placeholder="Código postal"
                                    className="w-full input input-bordered focus:outline-none focus:border-primary"
                                />
                            </fieldset>

                            <fieldset className="fieldset w-full mt-4">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="btn btn-success"
                                >
                                    Pagar con PayU
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
