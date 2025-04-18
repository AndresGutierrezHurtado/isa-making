import { NextResponse } from "next/server";
import { Category, Media, Product, ProductCategory, ProductSize } from "@/database/models";
import { Op } from "sequelize";
import crypto from "crypto";
import { uploadImage } from "@/hooks/useCloudinary";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const category = parseInt(searchParams.get("category")) || null;
        const search = searchParams.get("search") || "";
        const offset = (page - 1) * limit;

        const { rows: data } = await Product.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        product_name: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        product_description: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            },
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

        const total = await Product.count({
            where: {
                [Op.or]: [
                    {
                        product_name: { [Op.like]: `%${search}%` },
                    },
                    {
                        product_description: { [Op.like]: `%${search}%` },
                    },
                ],
            },
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
    const transaction = await Product.sequelize.transaction();
    try {
        const { product: body, categories, sizes, medias } = await request.json();

        const { product_image, ...productData } = body;
        const product = await Product.create(
            { ...productData, product_image: "/default.jpg" },
            { transaction }
        );

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Error al crear el producto",
                },
                { status: 500 }
            );
        }

        categories.forEach(async (category) => {
            await ProductCategory.create(
                {
                    product_id: product.product_id,
                    category_id: category,
                },
                { transaction }
            );
        });

        sizes.forEach(async (size) => {
            await ProductSize.create(
                {
                    product_id: product.product_id,
                    size_id: size.size_id,
                    product_price: size.product_price,
                },
                { transaction }
            );
        });

        if (product_image) {
            const { data: imageUrl } = await uploadImage(
                "/products",
                product_image,
                product.product_id
            );
            await product.update({ product_image: imageUrl }, { transaction });
        }

        if (medias.length > 0) {
            await Promise.all(
                medias.map(async (media) => {
                    const mediaId = crypto.randomUUID();
                    const { data: imageUrl } = await uploadImage("/medias", media, mediaId);

                    await Media.create(
                        {
                            media_id: mediaId,
                            media_image: imageUrl,
                            product_id: product.product_id,
                        },
                        { transaction }
                    );
                })
            );
        }

        await transaction.commit();

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
        await transaction.rollback();
        return NextResponse.json(
            {
                success: false,
                message: "Error al crear el producto",
            },
            { status: 500 }
        );
    }
}
