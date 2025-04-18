import { NextResponse } from "next/server";
import { Order, PaymentDetail, ShippingDetail, OrderProduct, Product } from "@/database/models";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || { [Op.ne]: null };

        const orders = await Order.findAll({
            where: {
                order_state: status,
            },
            include: [
                "payment",
                "products",
                "user",
                { model: ShippingDetail, as: "shipping", include: ["histories"] },
            ],
            order: [["createdAt", "DESC"]],
        });

        return NextResponse.json({
            success: true,
            data: orders,
            message: "Pedidos obtenidos correctamente",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener los pedidos: " + error.message,
            },
            { status: 500 }
        );
    }
}
