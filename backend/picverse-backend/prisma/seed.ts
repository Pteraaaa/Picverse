import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DIRECT_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Seed Tags
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

    // 2. Seed Artists (Users)
    const mockPassword = "$2b$10$EPY9FUClq7F.sK.Uo.fPVu.a7p1.s3L7Qy1Yc2s9tGqK3J.VwW/zO"; // bcrypt for "password123"
    const artists = [
        { name: "Steve Simpson", email: "steve@picverse.com", profilePicture: "/uploads/profiles/Steve-Simpson-5.jpg" },
        { name: "MUTI", email: "muti@picverse.com", profilePicture: "/uploads/profiles/MUTI-5.jpg" },
        { name: "mbsjq", email: "mbsjq@picverse.com", profilePicture: "/uploads/profiles/mbsjq-1.jpg" },
        { name: "Ori Toor", email: "oritoor@picverse.com", profilePicture: "/uploads/profiles/Ori-Toor-4.jpg" },
        { name: "Matt Schu", email: "mattschu@picverse.com", profilePicture: "/uploads/profiles/Matt-Schu-5.jpg" },
        { name: "Zim & Zou", email: "zimzou@picverse.com", profilePicture: "/uploads/profiles/Zim-Zou.jpg" },
        { name: "David Sossella", email: "david@picverse.com", profilePicture: "/uploads/profiles/David-Sossella-5.jpg" },
        { name: "Romain Trystram", email: "romain@picverse.com", profilePicture: "/uploads/profiles/Romain-Trystram-5.jpg" },
        { name: "RULEBYART", email: "rulebyart@picverse.com", profilePicture: "/uploads/profiles/RULEBYART-5.jpg" }
    ];

    const artistMap = new Map<string, number>();

    for (const artist of artists) {
        const user = await prisma.user.upsert({
            where: { email: artist.email },
            update: {
                name: artist.name,
                profilePicture: artist.profilePicture
            },
            create: {
                email: artist.email,
                name: artist.name,
                password: mockPassword,
                profilePicture: artist.profilePicture
            }
        });
        artistMap.set(artist.name, user.id);
    }

    // 3. Seed Featured Artworks
    const artworks = [
        {
            title: "Let Your Dreams Fly",
            description: "Featured artwork by Steve Simpson",
            imageUrl: "/uploads/artworks/Steve-Simpson-1-1-750x498.jpg",
            likes: 263,
            artistName: "Steve Simpson"
        },
        {
            title: "The Reef",
            description: "Featured artwork by MUTI",
            imageUrl: "/uploads/artworks/MUTI-2-750x498.jpg",
            likes: 368,
            artistName: "MUTI"
        },
        {
            title: "Yours Truly",
            description: "Featured artwork by mbsjq",
            imageUrl: "/uploads/artworks/mbsjq-5-750x498.jpg",
            likes: 249,
            artistName: "mbsjq"
        },
        {
            title: "Gibberish Exploration",
            description: "Featured artwork by Ori Toor",
            imageUrl: "/uploads/artworks/Ori-Toor-1-750x498.jpg",
            likes: 305,
            artistName: "Ori Toor"
        },
        {
            title: "Vacant Lot",
            description: "Featured artwork by Matt Schu",
            imageUrl: "/uploads/artworks/Matt-Schu-1.jpg",
            likes: 344,
            artistName: "Matt Schu"
        },
        {
            title: "Forest Folks",
            description: "Featured artwork by Zim & Zou",
            imageUrl: "/uploads/artworks/Zim-Zou-1.jpg",
            likes: 344,
            artistName: "Zim & Zou"
        }
    ];

    for (const art of artworks) {
        const userId = artistMap.get(art.artistName);
        if (!userId) continue;

        const existing = await prisma.artwork.findFirst({
            where: { title: art.title }
        });

        if (!existing) {
            await prisma.artwork.create({
                data: {
                    title: art.title,
                    description: art.description,
                    imageUrl: art.imageUrl,
                    likes: art.likes,
                    isFeatured: true,
                    userId: userId
                }
            });
        } else {
            await prisma.artwork.update({
                where: { id: existing.id },
                data: {
                    imageUrl: art.imageUrl,
                    likes: art.likes,
                    isFeatured: true,
                    userId: userId
                }
            });
        }
    }

    // 4. Seed Banner Artworks
    const bannerArtworks = [
        {
            title: "David Sossella Art",
            description: "Banner artwork by David Sossella",
            imageUrl: "/uploads/artworks/David-Sossella-1-750x498.jpg",
            likes: 0,
            artistName: "David Sossella"
        },
        {
            title: "RULEBYART",
            description: "Banner artwork by RULEBYART",
            imageUrl: "/uploads/artworks/RULEBYART-2-750x498.jpg",
            likes: 0,
            artistName: "RULEBYART"
        },
        {
            title: "Romain Trystram Art",
            description: "Banner artwork by Romain Trystram",
            imageUrl: "/uploads/artworks/Romain-Trystram-3-750x498.jpg",
            likes: 0,
            artistName: "Romain Trystram"
        }
    ];

    for (const art of bannerArtworks) {
        const userId = artistMap.get(art.artistName);
        if (!userId) continue;

        const existing = await prisma.artwork.findFirst({
            where: { title: art.title }
        });

        if (!existing) {
            await prisma.artwork.create({
                data: {
                    title: art.title,
                    description: art.description,
                    imageUrl: art.imageUrl,
                    likes: art.likes,
                    isBanner: true,
                    userId: userId
                }
            });
        } else {
            await prisma.artwork.update({
                where: { id: existing.id },
                data: {
                    imageUrl: art.imageUrl,
                    likes: art.likes,
                    isBanner: true,
                    userId: userId
                }
            });
        }
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