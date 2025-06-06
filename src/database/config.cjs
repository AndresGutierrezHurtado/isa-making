module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        pool: {
            max: 3,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    test: {
        username: "root",
        password: "",
        database: "isa_making_test",
        host: "localhost",
        dialect: "postgres",
        port: 5432,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        pool: {
            max: 3,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
};
