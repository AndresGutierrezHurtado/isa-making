module.exports = {
    development: {
        username: "root",
        password: "",
        database: "isa_making",
        host: "localhost",
        port: 3306,
        dialect: "mysql",
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
        dialect: "mysql",
        port: 3306,
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
