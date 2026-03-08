require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL
        }
    }
});

async function main() {
    const notes = await prisma.note.findMany({
        where: {
            title: {
                contains: 'Complete GATE CSE Notes 2024'
            }
        }
    });

    if (notes.length > 0) {
        console.log(`Found ${notes.length} notes. Performing cascade deletion...`);
        for (const note of notes) {
            try {
                const id = note.id;
                console.log(`Deleting relations for Note ID: ${id}`);

                // 1. Delete Order Items
                await prisma.orderItem.deleteMany({ where: { noteId: id } });
                // 2. Delete Cart Items
                await prisma.cartItem.deleteMany({ where: { noteId: id } });
                // 3. Delete Wishlist Items
                await prisma.wishlistItem.deleteMany({ where: { noteId: id } });
                // 4. Delete Reviews
                await prisma.review.deleteMany({ where: { noteId: id } });

                // 5. Delete the Note itself
                await prisma.note.delete({ where: { id: id } });

                console.log(`✅ Successfully deleted Note: ${note.title} and all relations.`);
            } catch (e) {
                console.error(`Failed to delete ${note.id}:`, e);
            }
        }
    } else {
        console.log("No notes found matching that exact title fragment.");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
