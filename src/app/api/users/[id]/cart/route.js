import { NextResponse } from "next/server";
import { Cart, Product } from "@/database/models";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const carts = await Cart.findAll({
            where: {
                user_id: id,
            },
            include: [{ model: Product, as: "product", include: ["sizes"] }, "size"],
        });

        return NextResponse.json(
            {
                success: true,
                data: carts,
                message: "Carrito obtenido correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener el carrito",
            },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const { product_id, size_id } = await request.json();

        const [cart, created] = await Cart.findOrCreate({
            where: {
                user_id: id,
                product_id,
                size_id,
            },
            defaults: {
                user_id: id,
                product_id,
                size_id,
                product_quantity: 1,
            },
        });

        if (!created) {
            await cart.increment("product_quantity", { by: 1 });

            return NextResponse.json(
                {
                    success: true,
                    data: cart,
                    message: "Carrito actualizado correctamente",
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: cart,
                message: "Carrito creado correctamente",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al crear el carrito",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { product_id, size_id, action = "increment" } = await request.json();

        const cart = await Cart.findOne({
            where: {
                user_id: id,
                product_id,
                size_id,
            },
        });

        if (!cart) {
            return NextResponse.json(
                {
                    success: false,
                    message: "El producto no está en el carrito",
                },
                { status: 404 }
            );
        }

        await cart.update({
            product_quantity:
                action === "increment" ? cart.product_quantity + 1 : cart.product_quantity - 1,
        });

        return NextResponse.json(
            {
                success: true,
                data: cart,
                message: "Carrito actualizado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al actualizar el carrito",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const { product_id, size_id } = await request.json();

        const cart = await Cart.findOne({
            where: {
                user_id: id,
                product_id,
                size_id,
            },
        });

        if (!cart) {
            return NextResponse.json(
                {
                    success: false,
                    message: "El producto no está en el carrito",
                },
                { status: 404 }
            );
        }

        await cart.destroy();

        return NextResponse.json(
            {
                success: true,
                message: "Producto eliminado del carrito",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al eliminar el producto del carrito",
            },
            { status: 500 }
        );
    }
}
