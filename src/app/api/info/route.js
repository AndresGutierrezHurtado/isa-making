import { NextResponse } from "next/server";
import {
    User,
    Product,
    Media,
    Category,
    Size,
    Role,
    Order,
    OrderProduct,
    ShippingHistory,
    PaymentDetail,
    ShippingDetail,
    ProductCategory,
    ProductSize,
    Cart,
} from "@/database/models";

export async function GET(request) {
    const users = await User.findAll({ paranoid: false });
    const roles = await Role.findAll();
    const products = await Product.findAll({ paranoid: false });
    const medias = await Media.findAll();
    const categories = await Category.findAll();
    const sizes = await Size.findAll();
    const productSizes = await ProductSize.findAll();
    const productCategories = await ProductCategory.findAll();
    const carts = await Cart.findAll();
    const orders = await Order.findAll();
    const orderProducts = await OrderProduct.findAll();
    const paymentDetails = await PaymentDetail.findAll();
    const shippingDetails = await ShippingDetail.findAll();
    const shippingHistories = await ShippingHistory.findAll();

    return NextResponse.json(
        {
            users,
            roles,
            products,
            medias,
            sizes,
            categories,
            productCategories,
            productSizes,
            carts,
            orders,
            orderProducts,
            paymentDetails,
            shippingDetails,
            shippingHistories,
        },
        { status: 200 }
    );
}
