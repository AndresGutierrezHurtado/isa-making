// JEST users Tests
const { describe, expect, test } = require("@jest/globals");

let createdUserId;

describe("Endpoints /api/users", () => {
    test("Should return a list of users", async () => {
        const response = await fetch(`http://localhost:3000/api/users`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(Array.isArray(data.data)).toBe(true);

        if (data.data.length > 0) {
            expect(data.data[0].user_name).toBeDefined();
            expect(data.data[0].user_email).toBeDefined();
            expect(data.data[0].user_password).toBeDefined();
            expect(data.data[0].role_id).toBeDefined();
            expect(data.data[0].createdAt).toBeDefined();
            expect(data.data[0].updatedAt).toBeDefined();
        }
    });

    test("Should register a new user with all required fields", async () => {
        const response = await fetch(`http://localhost:3000/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: {
                    user_name: "John",
                    user_lastname: "Doe",
                    user_email: "john.doe@example.com",
                    user_password: "111Aa@",
                    role_id: 1,
                },
            }),
        });
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.user_name).toBe("John");
        expect(data.data.user_lastname).toBe("Doe");
        expect(data.data.user_email).toBe("john.doe@example.com");
        expect(data.data.user_password).not.toBe("111Aa@");
        expect(data.data.role_id).toBe(1);

        createdUserId = data.data.user_id;
    });
});

describe("Endpoints /api/users/[id]", () => {
    test("Should return a user by id", async () => {
        const response = await fetch(`http://localhost:3000/api/users/${createdUserId}`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.user_id).toBe(createdUserId);
        expect(data.data.user_name).toBe("John");
        expect(data.data.user_lastname).toBe("Doe");
        expect(data.data.user_email).toBe("john.doe@example.com");
        expect(data.data.user_password).not.toBe("111Aa@");
        expect(data.data.role_id).toBe(1);
        expect(data.data.createdAt).toBeDefined();
    });

    test("Should return 404 for non-existent user", async () => {
        const response = await fetch(`http://localhost:3000/api/users/undefined`);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe("Usuario no encontrado");
    });

    test("Should update a user", async () => {
        const response = await fetch(`http://localhost:3000/api/users/${createdUserId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: {
                    user_name: "Camilo",
                    user_lastname: "García",
                    user_email: "camilo.garcia@gmail.com",
                    user_password: "111Aa@",
                    role_id: 1,
                },
            }),
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.user_name).toBe("Camilo");
        expect(data.data.user_lastname).toBe("García");
        expect(data.data.user_email).toBe("camilo.garcia@gmail.com");
        expect(data.data.user_password).not.toBe("111Aa@");
        expect(data.data.role_id).toBe(1);
    });

    test("Should soft delete a user", async () => {
        const response = await fetch(`http://localhost:3000/api/users/${createdUserId}`, {
            method: "DELETE",
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
    });
});

describe("Endpoints /api/users/:id/paranoid", () => {
    test("Should restore a soft deleted user", async () => {
        const response = await fetch(`http://localhost:3000/api/users/${createdUserId}/paranoid`, {
            method: "PUT",
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe("Usuario restaurado correctamente");
    });

    test("Should hard delete a user", async () => {
        const response = await fetch(`http://localhost:3000/api/users/${createdUserId}/paranoid`, {
            method: "DELETE",
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe("Usuario eliminado correctamente");
    });

    test("Should return 404 when trying to restore non-existent user", async () => {
        const response = await fetch(`http://localhost:3000/api/users/${createdUserId}/paranoid`, {
            method: "PUT",
        });
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe("Usuario no encontrado");
    });

    test("Should return 404 when trying to hard delete non-existent user", async () => {
        const response = await fetch(`http://localhost:3000/api/users/${createdUserId}/paranoid`, {
            method: "DELETE",
        });
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe("Usuario no encontrado");
    });
});
