import { NextResponse } from "next/server";
import { Category, Product } from "@/database/models";
import { uploadImage } from "@/hooks/useCloudinary";

export async function GET(req) {
    try {
        const categories = await Category.findAll({
            include: [{ model: Product, as: "products" }],
        });

        return NextResponse.json(
            {
                success: true,
                data: categories,
                message: "Categorías obtenidas correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener las categorías",
            },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    const transaction = await Category.sequelize.transaction();
    try {
        const { category } = await req.json();

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Faltan datos",
                },
                { status: 400 }
            );
        }

        const newCategory = await Category.create(
            {
                category_name: category.category_name,
                category_slug: category.category_slug,
                category_image: "/public/pending.png",
            },
            { transaction }
        );

        const { data: imageUrl } = await uploadImage("/categories", category.category_image, newCategory.category_id);

        await newCategory.update(
            {
                category_image: imageUrl,
            },
            { transaction }
        );

        await transaction.commit();

        return NextResponse.json(
            {
                success: true,
                message: "Categoría creada correctamente",
                data: newCategory,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return NextResponse.json(
            {
                success: false,
                message: "Error al crear la categoría: " + error.message,
            },
            { status: 500 }
        );
    }
}
