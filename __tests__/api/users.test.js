// JEST users Tests
const { describe, expect, test } = require("@jest/globals");

let createdUserId;

describe("GET /api/users", () => {
    test("Should return a list of users", async () => {
        const response = await fetch(`http://localhost:3000/api/users`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toBeDefined();
        expect(data.data.length).toBeGreaterThan(0);
        expect(data.data[0].user_name).toBeDefined();
        expect(data.data[0].user_email).toBeDefined();
        expect(data.data[0].user_password).toBeDefined();
        expect(data.data[0].role_id).toBeDefined();
        expect(data.data[0].createdAt).toBeDefined();
        expect(data.data[0].updatedAt).toBeDefined();
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
