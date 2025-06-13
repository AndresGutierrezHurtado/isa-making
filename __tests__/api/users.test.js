// JEST users Tests
const { describe, expect, test } = require("@jest/globals");

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
});
