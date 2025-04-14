import { NextResponse } from "next/server";
import { Order } from "@/database/models";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const orders = await Order.findAll({
            where: {
                user_id: id,
            },
            include: ["products", "shipping", "payment"],
        });

        return NextResponse.json({
            success: true,
            data: orders,
            message: "Ordenes obtenidas correctamente",
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Error al obtener las ordenes",
        }, { status: 500 });
    }
}
