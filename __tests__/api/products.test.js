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
                categories: [1],
                sizes: [
                    {
                        size_id: 1,
                        product_price: 99.99
                    }
                ],
                medias: []
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
    }, 10000); // Increased timeout for image upload
});

describe("Endpoints /api/products/[id]", () => {
    test("Should return a product by id", async () => {
        const response = await fetch(`http://localhost:3000/api/products/${createdProductId}`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.product_id).toBe(createdProductId);
        expect(data.data.product_name).toBe("Test Product");
        expect(data.data.product_description).toBe("This is a test product");
        expect(data.data.product_stock).toBe(100);
        expect(data.data.product_color).toBe("#000000");
    });

    test("Should return 404 for non-existent product", async () => {
        const response = await fetch(`http://localhost:3000/api/products/undefined`);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe("Producto no encontrado");
    });

    test("Should update a product", async () => {
        const response = await fetch(`http://localhost:3000/api/products/${createdProductId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product: {
                    product_name: "Updated Product",
                    product_description: "This is an updated product",
                    product_stock: 50,
                    product_color: "#000000",
                },
                categories: [1],
                sizes: [
                    {
                        size_id: 1,
                        product_price: 149.99
                    }
                ],
                medias: []
            }),
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.product_name).toBe("Updated Product");
        expect(data.data.product_description).toBe("This is an updated product");
        expect(data.data.product_stock).toBe(50);
        expect(data.data.product_color).toBe("#000000");
    }, 10000); // Increased timeout for image upload

    test("Should soft delete a product", async () => {
        const response = await fetch(`http://localhost:3000/api/products/${createdProductId}`, {
            method: "DELETE",
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe("Producto eliminado correctamente");
    });
});

describe("Endpoints /api/products/[id]/paranoid", () => {
    test("Should restore a soft deleted product", async () => {
        const response = await fetch(`http://localhost:3000/api/products/${createdProductId}/paranoid`, {
            method: "PUT",
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe("Producto restaurado correctamente");
    });

    test("Should hard delete a product", async () => {
        const response = await fetch(`http://localhost:3000/api/products/${createdProductId}/paranoid`, {
            method: "DELETE",
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe("Producto eliminado correctamente");
    });

    test("Should return 404 when trying to restore non-existent product", async () => {
        const response = await fetch(`http://localhost:3000/api/products/undefined/paranoid`, {
            method: "PUT",
        });
        const data = await response.json();
        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe("Producto no encontrado");
    });

    test("Should return 404 when trying to hard delete non-existent product", async () => {
        const response = await fetch(`http://localhost:3000/api/products/undefined/paranoid`, {
            method: "DELETE",
        });
        const data = await response.json();
        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe("Producto no encontrado");
    });
});
