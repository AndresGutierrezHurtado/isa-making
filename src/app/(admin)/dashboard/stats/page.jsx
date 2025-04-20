"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

// Components
import { DoughnutChart, LineChart } from "@/components/charts";
import LoadingComponent from "@/components/loading";

// Hooks
import { useGetData } from "@/hooks/useClientData";
import useSetTitle from "@/hooks/useSetTitle";

export default function page() {
    const { data: session, status } = useSession();
    const userSession = session?.user;

    useSetTitle("Dashboard | ISA Making");

    const { data: stats, loading } = useGetData("/stats");

    if (status === "loading" || loading) return <LoadingComponent />;

    const products = stats.products.map(({ orders, ...product }) => {
        const totalPrice = orders.reduce(
            (total, order) => total + order.product_price * order.product_quantity,
            0
        );
        const totalQuantity = orders.reduce((total, order) => total + order.product_quantity, 0);
        return {
            ...product,
            totalPrice,
            totalQuantity,
        };
    });

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
        <div className="flex-1 w-full px-5">
            <div className="w-full max-w-[1300px] mx-auto py-10 space-y-8">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-2xl leading-[1.2]">
                        Bienvenido de nuevo, <br />{" "}
                        <span className="font-otomanopee">{userSession.user_name}</span>
                    </h1>
                    <Link
                        href="/profile"
                        className="avatar tooltip tooltip-left"
                        data-tip="Ir al perfil"
                    >
                        <div className="w-12 rounded-full">
                            <Image
                                src="/user-profile.jpg"
                                width={50}
                                height={50}
                                alt="user-profile"
                                className="w-full h-full object-cover scale-150"
                            />
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-full lg:w-2/5 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 h-fit">
                        <div className="stats shadow bg-base-200 border border-base-300 w-full max-w-[250px] mx-auto">
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
                                                  (
                                                      (usersCurrentMonth - usersLastMonth) /
                                                      usersLastMonth
                                                  ).toFixed(2) * 100
                                              }%`}{" "}
                                        {usersCurrentMonth > usersLastMonth ? "mas" : "menos"}
                                    </p>
                                    <p className="text-sm text-base-content/60">
                                        que el mes pasado
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow bg-base-200 border border-base-300 w-full max-w-[250px] mx-auto">
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
                                                  (
                                                      (ordersCurrentMonth - ordersLastMonth) /
                                                      ordersLastMonth
                                                  ).toFixed(2) * 100
                                              }%`}{" "}
                                        {ordersCurrentMonth > ordersLastMonth ? "mas" : "menos"}
                                    </p>
                                    <p className="text-sm text-base-content/60">
                                        que el mes pasado
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow bg-base-200 border border-base-300 w-full max-w-[250px] mx-auto">
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
                                                  (
                                                      (earningsCurrentMonth - earningsLastMonth) /
                                                      earningsLastMonth
                                                  ).toFixed(2) * 100
                                              }%`}{" "}
                                        {earningsCurrentMonth > earningsLastMonth ? "mas" : "menos"}
                                    </p>
                                    <p className="text-sm text-base-content/60">
                                        que el mes pasado
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow bg-base-200 border border-base-300 w-full max-w-[250px] mx-auto">
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
                                                  (
                                                      (productsSoldCurrentMonth -
                                                          productsSoldLastMonth) /
                                                      productsSoldLastMonth
                                                  ).toFixed(2) * 100
                                              }%`}{" "}
                                        {productsSoldCurrentMonth > productsSoldLastMonth
                                            ? "mas"
                                            : "menos"}
                                    </p>
                                    <p className="text-sm text-base-content/60">
                                        que el mes pasado
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-3/5 bg-base-200 border border-base-300 rounded-lg p-5 space-y-5">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
                            <h1 className="text-2xl text-base-content/80 leading-[100%]">
                                Ventas semanales
                            </h1>
                            <div className="flex flex-col sm:flex-row items-center gap-5">
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
                        <LineChart
                            current={stats.currentMonth.ordersCurrentWeek}
                            last={stats.currentMonth.ordersLastWeek}
                        />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="w-full lg:w-5/7 bg-base-200 border border-base-300 rounded-lg p-5 space-y-5 flex flex-col">
                        <h1 className="text-2xl text-base-content/80 leading-[100%]">
                            Productos más vendidos
                        </h1>
                        <div className="grow overflow-auto">
                            <table className="table border border-base-300 rounded-lg">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => {
                                        const sizes = product.sizes.flatMap(
                                            (size) => size.ProductSize
                                        );
                                        const minPrice = Math.min(
                                            ...sizes.map((s) => parseInt(s.product_price))
                                        );
                                        return (
                                            <tr key={product.product_id}>
                                                <td>{product.product_name}</td>
                                                <td>{minPrice.toLocaleString("es-ES")} COP</td>
                                                <td>{product.totalQuantity}</td>
                                                <td>
                                                    {product.totalPrice.toLocaleString("es-ES")} COP
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {products.length === 0 && (
                                <div className="flex justify-center items-center py-10">
                                    <p className="text-base-content/60">
                                        No hay productos vendidos...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-2/7 bg-base-200 border border-base-300 rounded-lg p-5 space-y-5">
                        <h1 className="text-2xl text-base-content/80 leading-[100%]">
                            Categorías más vendidas
                        </h1>

                        {stats.categories.length === 0 && (
                            <div className="flex justify-center items-center py-10">
                                <p className="text-base-content/60">
                                    No hay categorías vendidas...
                                </p>
                            </div>
                        )}
                        {stats.categories.length > 0 && (
                            <DoughnutChart categories={stats.categories} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
