import { NextResponse } from "next/server";
import { Category } from "@/database/models";

// Hooks
import { deleteFile, uploadImage } from "@/hooks/useCloudinary";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const category = await Category.findByPk(id);

        return NextResponse.json(
            {
                success: true,
                data: category,
                message: "Categoría obtenida correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener la categoría",
            },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    const transaction = await Category.sequelize.transaction();
    try {
        const { id } = await params;
        const { category: body } = await req.json();

        if (!body) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Faltan datos",
                },
                { status: 400 }
            );
        }

        const category = await Category.findByPk(id);

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Categoría no encontrada",
                },
                { status: 404 }
            );
        }

        await Category.update(
            {
                category_name: body.category_name,
                category_slug: body.category_slug,
            },
            { where: { category_id: id }, transaction }
        );

        if (body.category_image) {
            const { data: imageUrl } = await uploadImage(
                "/categories",
                body.category_image,
                category.category_id
            );

            await category.update(
                {
                    category_image: imageUrl,
                },
                { transaction }
            );
        }

        await transaction.commit();

        return NextResponse.json(
            {
                success: true,
                message: "Categoría actualizada correctamente",
                data: category,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return NextResponse.json(
            {
                success: false,
                message: "Error al actualizar la categoría: " + error.message,
            },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    const transaction = await Category.sequelize.transaction();
    try {
        const { id } = await params;
        const category = await Category.findByPk(id);

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Categoría no encontrada",
                },
                { status: 404 }
            );
        }

        const result = await deleteFile("/categories/" + category.category_id);

        if (!result.success) {
            throw new Error(result.message);
        }

        await category.destroy({ transaction });

        await transaction.commit();

        return NextResponse.json(
            {
                success: true,
                message: "Categoría eliminada correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return NextResponse.json(
            {
                success: false,
                message: "Error al eliminar la categoría: " + error.message,
            },
            { status: 500 }
        );
    }
}
