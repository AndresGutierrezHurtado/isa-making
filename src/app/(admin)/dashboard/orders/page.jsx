"use client";

import React from "react";

// Hooks
import { useGetData, usePutData } from "@/hooks/useClientData";

// Components
import LoadingComponent from "@/components/loading";
import Link from "next/link";
import { useValidateForm } from "@/hooks/useValidateForm";
import Swal from "sweetalert2";

export default function Page() {
    const {
        data: pendingOrders,
        loading: pendingOrdersLoading,
        reload: pendingOrdersReload,
    } = useGetData("/orders?status=pending");
    const {
        data: completedOrders,
        loading: completedOrdersLoading,
        reload: completedOrdersReload,
    } = useGetData("/orders?status=completed");

    if (pendingOrdersLoading || completedOrdersLoading) return <LoadingComponent />;
    return (
        <>
            <div className="flex-1 w-full px-3">
                <div className="w-full max-w-[1300px] mx-auto py-10 space-y-8">
                    <div className="w-full flex items-center justify-between">
                        <h1 className="text-2xl font-otomanopee">Pedidos</h1>
                    </div>
                    {/* Pending Orders */}
                    <div className="w-full bg-base-200 border border-base-300 rounded-lg">
                        <div className="p-5">
                            <h2 className="text-2xl font-medium">Pedidos pendientes</h2>
                        </div>
                        <table className="table">
                            <thead className="bg-base-100">
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Productos</th>
                                    <th>Cliente</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingOrders.map((order) => {
                                    const lastHistory =
                                        order.shipping.histories[
                                            order.shipping.histories.length - 1
                                        ];

                                    let state = "";
                                    switch (lastHistory.shipping_state) {
                                        case "pending":
                                            state = "Pendiente";
                                            break;
                                        case "ready":
                                            state = "Listo para ser recogido";
                                            break;
                                        case "recoding":
                                            state = "Recogido";
                                            break;
                                        case "shipping":
                                            state = "En tránsito";
                                            break;
                                        case "delivered":
                                            state = "Entregado";
                                            break;
                                    }

                                    return (
                                        <tr key={order.order_id}>
                                            <td>{order.order_id}</td>
                                            <td>{order.createdAt}</td>
                                            <td>{order.products.length}</td>
                                            <td>
                                                {order.user.user_name} {order.user.user_lastname}
                                            </td>
                                            <td>{state}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <Link href={`/orders/${order.order_id}`}>
                                                        <button className="btn btn-primary btn-sm btn-outline text-sm font-normal">
                                                            Ver
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    `update-order-${order.order_id}`
                                                                )
                                                                .showModal()
                                                        }
                                                        className="btn btn-success btn-sm btn-outline text-sm font-normal"
                                                    >
                                                        Actualizar estado
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {pendingOrders.length === 0 && (
                            <div className="flex justify-center items-center py-10">
                                <p className="text-lg">No hay pedidos pendientes</p>
                            </div>
                        )}
                    </div>
                    {/* Completed Orders */}
                    {completedOrders.length > 0 && (
                        <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
                            <input type="checkbox" />
                            <div className="collapse-title font-semibold">Pedidos completados</div>
                            <div className="collapse-content text-sm">
                                <table className="table">
                                    <thead className="bg-base-100">
                                        <tr>
                                            <th>ID</th>
                                            <th>Fecha</th>
                                            <th>Productos</th>
                                            <th>Cliente</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {completedOrders.map((order) => (
                                            <tr key={order.order_id}>
                                                <td>{order.order_id}</td>
                                                <td>{order.createdAt}</td>
                                                <td>{order.products.length}</td>
                                                <td>
                                                    {order.user.user_name}{" "}
                                                    {order.user.user_lastname}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {pendingOrders.map((order) => (
                <dialog
                    className="modal"
                    id={`update-order-${order.order_id}`}
                    key={order.order_id}
                >
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Actualizar estado del pedido</h3>
                        <p className="py-4">Presiona ESC o da click fuera para cerrar</p>
                        <UpdateOrderState
                            order={order}
                            reload={() => {
                                pendingOrdersReload();
                                completedOrdersReload();
                            }}
                        />
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>Cerrar</button>
                    </form>
                </dialog>
            ))}
        </>
    );
}

function UpdateOrderState({ order, reload }) {
    const { shipping } = order;
    const { histories } = shipping;
    const lastHistory = histories[histories.length - 1];

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const validation = useValidateForm("update-order", data);

        if (!validation.success) return;

        const $modal = document.getElementById(`update-order-${order.order_id}`);
        $modal.close();

        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, actualizar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const fetchData = {
                    shippingDetail: {
                        shipping_courier: data.shipping_courier,
                        shipping_guide: data.shipping_guide,
                        tracking_url: data.tracking_url,
                    },
                    shippingHistory: {
                        shipping_id: shipping.shipping_id,
                        shipping_state: data.shipping_state,
                    },
                };

                const response = await usePutData(`/orders/${order.order_id}`, fetchData);

                if (!response.success) return;

                reload();
            }
        });
    };
    return (
        <form onSubmit={handleSubmit}>
            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span className="fieldset-label-text">Empresa mensajera</span>
                </label>
                <select
                    name="shipping_courier"
                    className="w-full select focus:outline-0 focus:border-primary"
                    defaultValue={shipping.shipping_courier}
                >
                    <option value="interrapidisimo">Interrapidisimo</option>
                    <option value="fedex">Fedex</option>
                </select>
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span className="fieldset-label-text">Guía de envío</span>
                </label>
                <input
                    name="shipping_guide"
                    placeholder="Guía de envío"
                    className="w-full input input-bordered focus:outline-0 focus:border-primary"
                    defaultValue={shipping.shipping_guide}
                />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span className="fieldset-label-text">URL de seguimiento</span>
                </label>
                <input
                    name="tracking_url"
                    placeholder="URL de seguimiento"
                    className="w-full input input-bordered focus:outline-0 focus:border-primary"
                    defaultValue={shipping.tracking_url}
                />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label">
                    <span className="fieldset-label-text">Estado</span>
                </label>
                <select
                    name="shipping_state"
                    className="w-full select focus:outline-0 focus:border-primary"
                    defaultValue={lastHistory.shipping_state}
                >
                    <option
                        value="pending"
                        disabled={histories.some((history) => history.shipping_state === "pending")}
                    >
                        Pendiente
                    </option>
                    <option
                        value="ready"
                        disabled={histories.some((history) => history.shipping_state === "ready")}
                    >
                        Listo para ser recogido
                    </option>
                    <option
                        value="recoding"
                        disabled={histories.some(
                            (history) => history.shipping_state === "recoding"
                        )}
                    >
                        Recogido
                    </option>
                    <option
                        value="shipping"
                        disabled={histories.some(
                            (history) => history.shipping_state === "shipping"
                        )}
                    >
                        En tránsito
                    </option>
                    <option
                        value="delivered"
                        disabled={histories.some(
                            (history) => history.shipping_state === "delivered"
                        )}
                    >
                        Entregado
                    </option>
                </select>
            </fieldset>
            <fieldset className="fieldset mt-5">
                <button type="submit" className="btn btn-primary">
                    Actualizar
                </button>
            </fieldset>
        </form>
    );
}
