// jest.setup.js

const { execSync } = require("child_process");

module.exports = async () => {
    console.log("Setting up database before tests.");
    execSync("npm run test:reset", { stdio: "inherit" });
};
