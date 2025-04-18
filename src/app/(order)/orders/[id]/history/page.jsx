import { useGetData } from "@/hooks/useServerData";
import Link from "next/link";
import React from "react";

export const metadata = {
    title: "Historial de envío | ISA Making",
    description: "Historial de envío de ISA Making",
};

export default async function Page({ params }) {
    const { id } = await params;

    const {
        data: { shipping },
    } = await useGetData(`/orders/${id}`);
    const { histories } = shipping;
    const sortedHistories = histories.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    const firstHistory = sortedHistories[0];
    const lastHistory = sortedHistories[sortedHistories.length - 1];

    const getTitle = (state) => {
        switch (state) {
            case "pending":
                return "En camino";
            case "ready":
                return "Listo para ser enviado";
            case "recoding":
                return "Recogido";
            case "shipping":
                return "En camino";
            case "delivered":
                return "Entregado";
            default:
                return "Error";
        }
    };
    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-10">
                    <h1 className="text-4xl font-medium">Historial de envío</h1>
                    <p>
                        Ultima actualización: {new Date(lastHistory.createdAt).toLocaleDateString()}
                    </p>
                    <div className="w-full mt-10 bg-base-200 p-5 rounded-lg">
                        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                            {sortedHistories.map((history, idx) => (
                                <li key={idx}>
                                    {idx > 0 && <hr />}
                                    <div className="timeline-middle">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className={`${
                                            idx % 2 == 0
                                                ? "timeline-start md:text-end"
                                                : "timeline-end md:text-start"
                                        } mb-10`}
                                    >
                                        <time className="font-mono italic tracking-tight">
                                            {history.history_id === lastHistory.history_id
                                                ? "Estado actual de tu envío"
                                                : "Paso por"}
                                        </time>
                                        <div className="text-xl font-medium">
                                            {getTitle(history.shipping_state)}
                                        </div>
                                        <p>
                                            fecha:{" "}
                                            {new Date(history.createdAt).toLocaleDateString()}
                                        </p>
                                        {history.history_id === lastHistory.history_id && (
                                            <p>
                                                fecha estimada de entrega:{" "}
                                                {new Date(
                                                    new Date(firstHistory.createdAt).setDate(
                                                        new Date(firstHistory.createdAt).getDate() +
                                                            6
                                                    )
                                                ).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    {idx < sortedHistories.length - 1 && <hr />}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full mt-10">
                        <Link href={`/orders/${id}`} className="btn w-full text-lg font-normal">
                            Volver a la orden
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
