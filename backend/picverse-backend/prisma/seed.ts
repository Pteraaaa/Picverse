import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
            where: {name: tag},
            update: {},
            create: {name: tag},
        });
    }
}

main();