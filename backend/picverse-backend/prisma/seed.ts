import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DIRECT_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

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