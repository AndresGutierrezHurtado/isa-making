import { NextResponse } from "next/server";
import { Product } from "@/database/models";
import { uploadImage } from "@/hooks/useCloudinary";

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
    const transaction = await Product.sequelize.transaction();
    try {
        const { id } = await params;
        const { product: body } = await request.json();

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

        await product.update(body, { transaction });

        if (body.product_image) {
            const { data: imageUrl } = await uploadImage("/products", body.product_image, product.product_id);
            await product.update({ product_image: imageUrl }, { transaction });
        }

        await transaction.commit();

        return NextResponse.json(
            {
                success: true,
                data: product,
                message: "Producto actualizado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        await transaction.rollback();
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
