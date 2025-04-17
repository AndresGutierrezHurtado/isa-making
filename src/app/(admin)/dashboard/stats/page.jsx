"use client";

import React from "react";
import { useSession } from "next-auth/react";

// Components
import { DoughnutChart, LineChart } from "@/components/charts";
import LoadingComponent from "@/components/loading";
import { useGetData } from "@/hooks/useClientData";

export default function page() {
    const { data: session, status } = useSession();
    const userSession = session?.user;

    const { data: stats, loading } = useGetData("/stats");

    if (status === "loading" || loading) return <LoadingComponent />;

    const usersCurrentMonth = stats.currentMonth.users.length;
    const usersLastMonth = stats.lastMonth.users.length;

    const ordersCurrentMonth = stats.currentMonth.orders.length;
    const ordersLastMonth = stats.lastMonth.orders.length;

    const earningsCurrentMonth = stats.currentMonth.orders.reduce(
        (acc, order) => acc + parseInt(order.payment.payment_amount),
        0
    );
    const earningsLastMonth = stats.lastMonth.orders.reduce(
        (acc, order) => acc + parseInt(order.payment.payment_amount),
        0
    );

    const productsSoldCurrentMonth = stats.currentMonth.orders
        .flatMap((order) => order.products)
        .reduce((acc, product) => acc + product.product_quantity, 0);

    const productsSoldLastMonth = stats.lastMonth.orders
        .flatMap((order) => order.products)
        .reduce((acc, product) => acc + product.product_quantity, 0);

    return (
        <div className="flex-1 w-full px-3">
            <div className="w-full max-w-[1300px] mx-auto py-10 space-y-8">
                <h1 className="text-2xl leading-[1.2]">
                    Bienvenido de nuevo, <br />{" "}
                    <span className="font-otomanopee">{userSession.user_name}</span>
                </h1>
                <div className="flex items-center gap-10">
                    <div className="w-full md:w-2/5 grid grid-cols-1 md:grid-cols-2 gap-5 h-fit">
                        <div className="stats shadow bg-base-200 border border-base-300 ">
                            <div className="stat space-y-2">
                                <div>
                                    <h3 className="text-xl text-base-content/80 leading-[100%]">
                                        Usuarios nuevos
                                    </h3>
                                    <h1 className="text-6xl font-bold leading-[100%]">
                                        {usersCurrentMonth}
                                    </h1>
                                </div>
                                <div className="leading-[100%]">
                                    <p className={`${true ? "text-green-500" : "text-red-500"}`}>
                                        {usersLastMonth === 0
                                            ? "100%"
                                            : `${
                                                  ((usersCurrentMonth - usersLastMonth) /
                                                      usersLastMonth) *
                                                  100
                                              }%`}{" "}
                                        {usersCurrentMonth > usersLastMonth ? "mas" : "menos"}
                                    </p>
                                    <p className="text-sm text-base-content/60">
                                        que el mes pasado
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow bg-base-200 border border-base-300 ">
                            <div className="stat space-y-2">
                                <div>
                                    <h3 className="text-xl text-base-content/80 leading-[100%]">
                                        Pedidos nuevos
                                    </h3>
                                    <h1 className="text-6xl font-bold leading-[100%]">
                                        {ordersCurrentMonth}
                                    </h1>
                                </div>
                                <div className="leading-[100%]">
                                    <p className={`${true ? "text-green-500" : "text-red-500"}`}>
                                        {ordersLastMonth === 0
                                            ? "100%"
                                            : `${
                                                  ((ordersCurrentMonth - ordersLastMonth) /
                                                      ordersLastMonth) *
                                                  100
                                              }%`}{" "}
                                        {ordersCurrentMonth > ordersLastMonth ? "mas" : "menos"}
                                    </p>
                                    <p className="text-sm text-base-content/60">
                                        que el mes pasado
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow bg-base-200 border border-base-300 ">
                            <div className="stat space-y-2">
                                <div>
                                    <h3 className="text-xl text-base-content/80 leading-[100%]">
                                        Ganancias
                                    </h3>
                                    <h1 className="text-6xl font-bold leading-[100%] tracking-tight">
                                        {earningsCurrentMonth.toLocaleString("es-ES")}
                                    </h1>
                                </div>
                                <div className="leading-[100%]">
                                    <p className={`${true ? "text-green-500" : "text-red-500"}`}>
                                        {earningsLastMonth === 0
                                            ? "100%"
                                            : `${
                                                  ((earningsCurrentMonth - earningsLastMonth) /
                                                      earningsLastMonth) *
                                                  100
                                              }%`}{" "}
                                        {earningsCurrentMonth > earningsLastMonth ? "mas" : "menos"}
                                    </p>
                                    <p className="text-sm text-base-content/60">
                                        que el mes pasado
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow bg-base-200 border border-base-300 ">
                            <div className="stat space-y-2">
                                <div>
                                    <h3 className="text-xl text-base-content/80 leading-[100%]">
                                        Productos vendidos
                                    </h3>
                                    <h1 className="text-6xl font-bold leading-[100%]">
                                        {productsSoldCurrentMonth}
                                    </h1>
                                </div>
                                <div className="leading-[100%]">
                                    <p className={`${true ? "text-green-500" : "text-red-500"}`}>
                                        {productsSoldLastMonth === 0
                                            ? "100%"
                                            : `${
                                                  ((productsSoldCurrentMonth - productsSoldLastMonth) /
                                                      productsSoldLastMonth) *
                                                  100
                                              }%`}{" "}
                                        {productsSoldCurrentMonth > productsSoldLastMonth ? "mas" : "menos"}
                                    </p>
                                    <p className="text-sm text-base-content/60">
                                        que el mes pasado
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-3/5 bg-base-200 border border-base-300 rounded-lg p-5 space-y-5">
                        <div className="flex justify-between items-center gap-5">
                            <h1 className="text-2xl text-base-content/80 leading-[100%]">
                                Ventas semanales
                            </h1>
                            <div className="flex items-center gap-5">
                                <div className="flex flex-col items-center">
                                    <p>Semana pasada</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-base-content"></div>
                                        <h1 className="text-xl font-medium">
                                            {stats.currentMonth.ordersLastWeek.length}
                                        </h1>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p>Semana actual</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                                        <h1 className="text-xl font-medium">
                                            {stats.currentMonth.ordersCurrentWeek.length}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <LineChart current={stats.currentMonth.ordersCurrentWeek} last={stats.currentMonth.ordersLastWeek} />
                    </div>
                </div>
                <div className="flex gap-10">
                    <div className="w-full md:w-5/7 bg-base-200 border border-base-300 rounded-lg p-5 space-y-5">
                        <h1 className="text-2xl text-base-content/80 leading-[100%]">
                            Productos más vendidos
                        </h1>
                        <table className="table table-xs border border-base-300 rounded-lg">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Dinero</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div className="w-full md:w-2/7 bg-base-200 border border-base-300 rounded-lg p-5 space-y-5">
                        <h1 className="text-2xl text-base-content/80 leading-[100%]">
                            Categorías más vendidas
                        </h1>
                        <DoughnutChart categories={stats.categories} />
                    </div>
                </div>
            </div>
        </div>
    );
}
