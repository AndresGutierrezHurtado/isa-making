import { Order, OrderProduct, Product, ShippingDetail, ShippingHistory } from "@/database/models";
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

export async function PUT(request, { params }) {
    const { id } = await params;
    const { shippingDetail: shippingDetailBody, shippingHistory: shippingHistoryBody } =
        await request.json();

    try {
        const shippingDetails = await ShippingDetail.findOne({
            where: { order_id: id },
        });

        if (!shippingDetails) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No se encontró el detalle de envío",
                },
                { status: 404 }
            );
        }

        await shippingDetails.update(shippingDetailBody);

        if (shippingHistoryBody) {
            await ShippingHistory.findOrCreate({
                where: {
                    shipping_id: shippingDetails.shipping_id,
                    shipping_state: shippingHistoryBody.shipping_state,
                },
                defaults: shippingHistoryBody,
            });
            if (shippingHistoryBody.shipping_state === "delivered") {
                await Order.update({ order_state: "completed" }, { where: { order_id: id } });
            }
        }

        return NextResponse.json({
            success: true,
            message: "Estado del pedido actualizado correctamente",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: `Error al actualizar el estado del pedido: ${error.message}`,
            },
            { status: 500 }
        );
    }
}
