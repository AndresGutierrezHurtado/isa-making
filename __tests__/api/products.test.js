// JEST products Tests
const { describe, expect, test } = require("@jest/globals");

let createdProductId;

describe("Endpoints /api/products", () => {
    test("Should return a list of products", async () => {
        const response = await fetch(`http://localhost:3000/api/products`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(Array.isArray(data.data)).toBe(true);

        if (data.data.length > 0) {
            expect(data.data[0].product_id).toBeDefined();
            expect(data.data[0].product_name).toBeDefined();
            expect(data.data[0].product_description).toBeDefined();
            expect(data.data[0].product_stock).toBeDefined();
            expect(data.data[0].product_image).toBeDefined();
            expect(data.data[0].createdAt).toBeDefined();
            expect(data.data[0].updatedAt).toBeDefined();
        }
    });

    test("Should create a new product", async () => {
        const response = await fetch(`http://localhost:3000/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product: {
                    product_name: "Test Product",
                    product_description: "This is a test product",
                    product_stock: 100,
                    product_color: "#000000",
                },
            }),
        });
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.product_name).toBe("Test Product");
        expect(data.data.product_description).toBe("This is a test product");
        expect(data.data.product_stock).toBe(100);
        expect(data.data.product_color).toBe("#000000");

        createdProductId = data.data.product_id;
    });
});
