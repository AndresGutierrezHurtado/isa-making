import { NextResponse } from "next/server";
import { Category, Product } from "@/database/models";
import { Op } from "sequelize";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const category = parseInt(searchParams.get("category")) || null;
        const offset = (page - 1) * limit;

        const { rows: data, count: total } = await Product.findAndCountAll({
            include: [
                {
                    model: Category,
                    as: "categories",
                    where: {
                        category_id: category ? category : { [Op.ne]: null },
                    },
                    required: true,
                },
                "sizes",
                "medias",
            ],
            offset,
            limit,
        });

        return NextResponse.json(
            {
                success: true,
                data,
                total,
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

export async function POST(request) {
    try {
        const { product: productJSON } = await request.json();

        const product = await Product.create(productJSON);

        return NextResponse.json(
            {
                success: true,
                data: product,
                message: "Producto creado correctamente",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al crear el producto",
            },
            { status: 500 }
        );
    }
}
