require("dotenv/config");
const { defineConfig } = require("@prisma/config");

module.exports = defineConfig({
  migrations: {
    seed: 'npx ts-node ./prisma/seed.ts',
  },
  datasource: {
    url: process.env.DIRECT_URL,
  },
});