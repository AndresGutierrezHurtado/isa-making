import { NextResponse } from "next/server";
import { Cart, Product } from "@/database/models";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const carts = await Cart.findAll({
            where: {
                user_id: id,
            },
            include: [{ model: Product, as: "product", include: ["sizes", "categories"] }, "size"],
        });

        const cartsJSON = carts.map((cart) => cart.toJSON());

        const cart = cartsJSON.map(({ product, ...cart }) => {
            const { sizes, ...fproduct } = product;
            return {
                ...cart,
                product: fproduct,
                size: sizes.find((size) => size.size_id === cart.size_id),
            };
        });

        return NextResponse.json(
            {
                success: true,
                data: cart,
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

        const product = await Product.findOne({
            where: {
                product_id,
            },
        });

        if (!product) {
            return NextResponse.json({
                success: false,
                message: "El producto no existe",
            });
        }

        const carts = await Cart.findAll({
            where: {
                product_id,
            },
        });
        const cartsQuantity = carts.reduce((acc, cart) => acc + cart.product_quantity, 0);

        if (cartsQuantity >= product.product_stock) {
            return NextResponse.json({
                success: false,
                message: "No hay stock suficiente",
            });
        }

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
            if (cartsQuantity + 1 >= product.product_stock) {
                return NextResponse.json({
                    success: false,
                    message: "No hay stock suficiente",
                });
            }

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
                message: "Error al crear el carrito: " + error.message,
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
            include: ["product"],
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

        if (action === "increment" && cart.product_quantity >= cart.product.product_stock) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No hay stock suficiente",
                },
                { status: 400 }
            );
        }

        if (action === "increment") {
            await cart.increment("product_quantity", { by: 1 });
        } else if (action === "decrement" && cart.product_quantity > 1) {
            await cart.decrement("product_quantity", { by: 1 });
        } else if (action === "decrement" && cart.product_quantity === 1) {
            await cart.destroy();
        }

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
