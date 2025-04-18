import { NextResponse } from "next/server";
import { Op } from "sequelize";
import { Product } from "@/database/models";

export async function GET(request, { params }) {
    try {
        const products = await Product.findAll({
            paranoid: false,
            where: {
                deletedAt: {
                    [Op.not]: null,
                },
            },
            include: ["sizes"],
        });

        return NextResponse.json(
            {
                success: true,
                data: products,
                message: "Productos obtenidos correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener los productos",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;

        const product = await Product.findByPk(id, { paranoid: false });

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Producto no encontrado",
                },
                { status: 404 }
            );
        }

        await product.restore();

        return NextResponse.json(
            {
                success: true,
                message: "Producto restaurado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al restaurar el producto",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const product = await Product.findByPk(id, { paranoid: false });

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Producto no encontrado",
                },
                { status: 404 }
            );
        }

        await product.destroy({ force: true });

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
