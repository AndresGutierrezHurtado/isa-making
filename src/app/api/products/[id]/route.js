import { NextResponse } from "next/server";
import { Product } from "@/database/models";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const product = await Product.findByPk(id, {
            include: ["categories", "sizes", "medias"],
        });

        return NextResponse.json(
            {
                success: true,
                data: product,
                message: "Producto obtenido correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener el producto",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { product: productJSON } = await request.json();

        const product = await Product.findByPk(id);

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Producto no encontrado",
                },
                { status: 404 }
            );
        }

        await product.update(productJSON);

        return NextResponse.json(
            {
                success: true,
                data: product,
                message: "Producto actualizado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al actualizar el producto",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const product = await Product.findByPk(id);

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Producto no encontrado",
                },
                { status: 404 }
            );
        }

        await product.destroy();

        return NextResponse.json(
            {
                success: true,
                message: "Producto eliminado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al eliminar el producto",
            },
            { status: 500 }
        );
    }
}
