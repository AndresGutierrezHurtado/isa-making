const { describe, test, expect } = require("@jest/globals");

let createdOrderId = "6139a36a-16cc-4483-8ccb-a45abb80b0ee";
let shippingId = "9025ede9-0485-421a-a838-ccc8f8beea9e";

describe("Endpoints /api/orders/[id]", () => {
    test("Should get an order by id", async () => {
        const response = await fetch(`http://localhost:3000/api/orders/${createdOrderId}`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.order_id).toBe(createdOrderId);
        expect(data.data.payment).toBeDefined();
        expect(data.data.shipping).toBeDefined();
        expect(data.data.products).toBeDefined();
        expect(Array.isArray(data.data.products)).toBe(true);
    });

    test("Should return 404 for non-existent order", async () => {
        const response = await fetch(`http://localhost:3000/api/orders/non-existent-id`);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe("Pedido no encontrado");
    });

    test("Should update shipping details and history", async () => {
        const response = await fetch(`http://localhost:3000/api/orders/${createdOrderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shippingDetail: {
                    shipping_address: "New Address 123",
                    shipping_city: "New City",
                    shipping_state: "New State",
                    shipping_zip: "12345",
                    shipping_phone: "1234567890",
                },
                shippingHistory: {
                    shipping_state: "in_transit",
                    shipping_description: "Package is in transit",
                    shipping_date: new Date().toISOString(),
                },
            }),
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe("Estado del pedido actualizado correctamente");
    });

    test("Should update order to completed when delivered", async () => {
        const response = await fetch(`http://localhost:3000/api/orders/${createdOrderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shippingHistory: {
                    shipping_id: shippingId,
                    shipping_state: "delivered",
                },
            }),
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe("Estado del pedido actualizado correctamente");

        // Verify order state was updated
        const getResponse = await fetch(`http://localhost:3000/api/orders/${createdOrderId}`);
        const orderData = await getResponse.json();
        expect(orderData.data.order_state).toBe("completed");
    });

    test("Should return 404 when updating non-existent shipping details", async () => {
        const response = await fetch(`http://localhost:3000/api/orders/non-existent-id`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shippingDetail: {
                    shipping_address: "Test Address",
                },
            }),
        });
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe("No se encontró el detalle de envío");
    });
});
