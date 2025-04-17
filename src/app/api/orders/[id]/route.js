import { Order, OrderProduct, Product, ShippingDetail } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const order = await Order.findByPk(id, {
            include: [
                "payment",
                { model: ShippingDetail, as: "shipping", include: ["histories"] },
                {
                    model: OrderProduct,
                    as: "products",
                    include: [{ model: Product, as: "product", include: ["categories"] }, "size"],
                },
            ],
        });

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Pedido no encontrado",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order,
            message: "Pedido encontrado correctamente",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: `Error al encontrar el pedido: ${error.message}`,
            },
            { status: 500 }
        );
    }
}
