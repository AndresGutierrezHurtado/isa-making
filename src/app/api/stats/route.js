import { NextResponse } from "next/server";

import { User, Product, Category, Order, PaymentDetail, OrderProduct } from "@/database/models";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        // usuarios creades en este mes
        const users = await User.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
            },
        });

        // usuarios creados el mes pasado
        const usersLastMonth = await User.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 2)),
                    [Op.lte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
            },
        });

        // ventas de el ultimo mes
        const orders = await Order.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
            },
            include: ["payment", "products"],
        });

        // ventas del mes pasado
        const ordersLastMonth = await Order.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 2)),
                    [Op.lte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
            },
            include: ["payment", "products"],
        });

        // ventas de la semana actual
        const ordersCurrentWeek = await Order.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            },
            include: ["payment"],
        });

        // ventas de la semana pasada
        const ordersLastWeek = await Order.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 14)),
                    [Op.lte]: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            },
            include: ["payment"],
        });

        // categorias mas vendidas
        const categories = await Category.findAll({
            include: [
                {
                    model: Product,
                    as: "products",
                    required: true,
                    include: [
                        {
                            model: OrderProduct,
                            as: "orders",
                            required: true,
                        },
                    ],
                },
            ],
        });

        // productos mas vendidos
        const products = await Product.findAll({
            include: [{ model: OrderProduct, as: "orders", required: true }, "sizes"],
        });

        return NextResponse.json({
            success: true,
            data: {
                categories,
                products,
                currentMonth: { users, orders, ordersCurrentWeek, ordersLastWeek },
                lastMonth: { users: usersLastMonth, orders: ordersLastMonth },
            },
            message: "Estadísticas obtenidas correctamente",
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error al obtener la información: " + error.message,
        });
    }
}
