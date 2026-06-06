"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const connectionString = process.env.DIRECT_URL;
const pool = new pg_1.default.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const tags = [
        "Digitalart",
        "Portrait",
        "Anime",
        "Fantasy",
        "Cyberpunk",
        "AIart",
        "Nature",
        "Photography",
        "Abstract",
        "Pixelart",
        "Character"
    ];
    for (const tag of tags) {
        await prisma.tag.upsert({
            where: { name: tag },
            update: {},
            create: { name: tag },
        });
    }
}
main()
    .then(async () => {
    await prisma.$disconnect();
    await pool.end();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map