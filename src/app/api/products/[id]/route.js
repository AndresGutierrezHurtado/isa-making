import { NextResponse } from "next/server";
import { Op } from "sequelize";
import crypto from "crypto";

// Models
import { Media, Product, ProductCategory, ProductSize } from "@/database/models";

// Hooks
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
        const { product: body, categories, sizes, medias } = await request.json();

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

        categories.forEach(async (category) => {
            const [productCategory, created] = await ProductCategory.findOrCreate({
                where: {
                    product_id: product.product_id,
                    category_id: category,
                },
                defaults: {
                    product_id: product.product_id,
                    category_id: category,
                },
                transaction,
            });

            if (!created) {
                await productCategory.update(
                    {
                        category_id: category,
                    },
                    { transaction }
                );
            }
        });

        await ProductCategory.destroy({
            where: {
                product_id: product.product_id,
                category_id: { [Op.notIn]: categories },
            },
            transaction,
        });

        sizes.forEach(async (size) => {
            const [productSize, created] = await ProductSize.findOrCreate({
                where: {
                    product_id: product.product_id,
                    size_id: size.size_id,
                },
                defaults: {
                    product_id: product.product_id,
                    size_id: size.size_id,
                    product_price: size.product_price,
                },
                transaction,
            });

            if (!created) {
                await productSize.update(
                    {
                        product_price: size.product_price,
                    },
                    { transaction }
                );
            }
        });

        await ProductSize.destroy({
            where: {
                product_id: product.product_id,
                size_id: { [Op.notIn]: sizes.map((s) => s.size_id) },
            },
            transaction,
        });

        if (body.product_image) {
            const { data: imageUrl } = await uploadImage(
                "/products",
                body.product_image,
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
                message: "Error al actualizar el producto: " + error.message,
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
