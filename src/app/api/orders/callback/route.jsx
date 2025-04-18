import { NextResponse } from "next/server";

// Models
import {
    Cart,
    Product,
    Order,
    OrderProduct,
    ShippingHistory,
    PaymentDetail,
    ShippingDetail,
} from "@/database/models";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function GET(request) {
    const transaction = await Order.sequelize.transaction();
    const { user } = await getServerSession(authOptions);
    try {
        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams);

        const payuResponse = await fetch(process.env.PAYU_TRANSACTION_REQUEST_URI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                test: process.env.NEXT_PUBLIC_PAYU_TEST == 1,
                language: "en",
                command: "ORDER_DETAIL_BY_REFERENCE_CODE",
                merchant: {
                    apiLogin: process.env.NEXT_PUBLIC_PAYU_API_LOGIN,
                    apiKey: process.env.NEXT_PUBLIC_PAYU_API_KEY,
                },
                details: {
                    referenceCode: params.referenceCode,
                },
            }),
        });
        const payuResponseData = await payuResponse.json();

        if (payuResponseData.code !== "SUCCESS")
            throw new Error(payuResponseData.error || JSON.stringify(payuResponseData));

        const payuOrder = payuResponseData.result.payload[0];
        const lastTransaction = payuOrder.transactions[payuOrder.transactions.length - 1];

        if (lastTransaction.transactionResponse.state !== "APPROVED") {
            throw new Error("Transaction de payu no ha sido aprobada");
        }

        const order = await Order.create(
            {
                user_id: user.user_id,
            },
            { transaction }
        );

        const paymentDetail = await PaymentDetail.create(
            {
                order_id: order.order_id,
                payu_reference: payuOrder.referenceCode,
                payment_method: lastTransaction.paymentMethod,
                payment_amount: lastTransaction.additionalValues.PM_PAYER_TOTAL_AMOUNT.value,
                buyer_name: lastTransaction.payer.fullName,
                buyer_email: lastTransaction.payer.emailAddress,
                buyer_document_type: lastTransaction.payer.dniType,
                buyer_document_number: lastTransaction.payer.dniNumber,
            },
            { transaction }
        );

        const shippingDetail = await ShippingDetail.create(
            {
                order_id: order.order_id,
                shipping_guide: null,
                shipping_courier: "interrapidisimo",
                tracking_url: null,
                shipping_estimated: null,
            },
            { transaction }
        );

        const shippingHistory = await ShippingHistory.create(
            {
                shipping_id: shippingDetail.shipping_id,
                shipping_state: "pending",
            },
            { transaction }
        );

        const carts = await Cart.findAll({
            where: {
                user_id: user.user_id,
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

        const cartItems = cart.map((crt) => {
            return {
                order_id: order.order_id,
                product_id: crt.product_id,
                size_id: crt.size_id,
                product_quantity: crt.product_quantity,
                product_price: crt.size.ProductSize.product_price,
            };
        });

        await OrderProduct.bulkCreate(cartItems, { transaction });

        await Promise.all(
            cart.map(async (crt) => {
                await Product.decrement("product_stock", {
                    by: crt.product_quantity,
                    where: { product_id: crt.product_id },
                    transaction,
                });
            })
        );

        await Cart.destroy({
            where: {
                user_id: user.user_id,
            },
            transaction,
        });

        await transaction.commit();

        const finalOrder = await Order.findOne({
            where: {
                order_id: order.order_id,
            },
            include: ["products", "shipping", "payment"],
        });

        return NextResponse.redirect(process.env.NEXT_PUBLIC_URL + "/orders/" + order.order_id);
    } catch (error) {
        await transaction.rollback();
        return NextResponse.json(
            {
                sucess: false,
                message: "Error al recibir y almacenar la orden: " + error.message,
            },
            { status: 500 }
        );
    }
}
