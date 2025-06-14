const { describe, test, expect } = require("@jest/globals");

describe("Endpoints /api/users/[id]/cart", () => {
    test("Should add a product to the cart", async () => {
        const response = await fetch(
            `http://localhost:3000/api/users/ba6ec110-f2dd-4d75-8b19-b2bcfd96db8f/cart`,
            {
                method: "POST",
                body: JSON.stringify({
                    product_id: "f7babb7f-d10e-4d86-a120-eb2fe01fcfd4",
                    size_id: "1",
                }),
            }
        );
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
    });

    test("Should increment the quantity of a product in the cart", async () => {
        const response = await fetch(
            `http://localhost:3000/api/users/ba6ec110-f2dd-4d75-8b19-b2bcfd96db8f/cart`,
            {
                method: "PUT",
                body: JSON.stringify({
                    action: "increment",
                    product_id: "f7babb7f-d10e-4d86-a120-eb2fe01fcfd4",
                    size_id: "1",
                }),
            }
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.product_quantity).toBe(2);
    });

    test("Should increment the quantity of a product in the cart to the max stock", async () => {
        await fetch(`http://localhost:3000/api/users/ba6ec110-f2dd-4d75-8b19-b2bcfd96db8f/cart`, {
            method: "PUT",
            body: JSON.stringify({
                action: "increment",
                product_id: "f7babb7f-d10e-4d86-a120-eb2fe01fcfd4",
                size_id: "1",
            }),
        });

        await fetch(`http://localhost:3000/api/users/ba6ec110-f2dd-4d75-8b19-b2bcfd96db8f/cart`, {
            method: "PUT",
            body: JSON.stringify({
                action: "increment",
                product_id: "f7babb7f-d10e-4d86-a120-eb2fe01fcfd4",
                size_id: "1",
            }),
        });

        const response = await fetch(
            `http://localhost:3000/api/users/ba6ec110-f2dd-4d75-8b19-b2bcfd96db8f/cart`,
            {
                method: "PUT",
                body: JSON.stringify({
                    action: "increment",
                    product_id: "f7babb7f-d10e-4d86-a120-eb2fe01fcfd4",
                    size_id: "1",
                }),
            }
        );
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.message).toBe("No hay stock suficiente");
    });

    test("Should decrement the quantity of a product in the cart", async () => {
        const response = await fetch(
            `http://localhost:3000/api/users/ba6ec110-f2dd-4d75-8b19-b2bcfd96db8f/cart`,
            {
                method: "PUT",
                body: JSON.stringify({
                    action: "decrement",
                    product_id: "f7babb7f-d10e-4d86-a120-eb2fe01fcfd4",
                    size_id: "1",
                }),
            }
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.product_quantity).toBe(3);
    });

    test("Should update an unexistent product in the cart", async () => {
        const response = await fetch(
            `http://localhost:3000/api/users/ba6ec110-f2dd-4d75-8b19-b2bcfd96db8f/cart`,
            {
                method: "PUT",
                body: JSON.stringify({
                    action: "increment",
                    product_id: "undefined",
                    size_id: "1",
                }),
            }
        );
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe("El producto no está en el carrito");
    });

    test("Should remove a product from the cart", async () => {
        const response = await fetch(
            `http://localhost:3000/api/users/ba6ec110-f2dd-4d75-8b19-b2bcfd96db8f/cart`,
            {
                method: "POST",
                body: JSON.stringify({
                    product_id: "ecb7a623-6bde-4de9-90fd-9984dcd7e9a2",
                    size_id: "1",
                }),
            }
        );
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();

        const response2 = await fetch(
            `http://localhost:3000/api/users/ba6ec110-f2dd-4d75-8b19-b2bcfd96db8f/cart`,
            {
                method: "DELETE",
                body: JSON.stringify({
                    product_id: "ecb7a623-6bde-4de9-90fd-9984dcd7e9a2",
                    size_id: "1",
                }),
            }
        );
        const data2 = await response2.json();

        expect(response2.status).toBe(200);
        expect(data2.success).toBe(true);
        expect(data2.message).toBe("Producto eliminado del carrito");
    });

    test("Should return 404 if the product is not in the cart", async () => {
        const response = await fetch(
            `http://localhost:3000/api/users/ba6ec110-f2dd-4d75-8b19-b2bcfd96db8f/cart`,
            {
                method: "DELETE",
                body: JSON.stringify({
                    product_id: "undefined",
                    size_id: "1",
                }),
            }
        );
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe("El producto no está en el carrito");
    });
});
