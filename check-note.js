
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const note = await prisma.note.findUnique({
            where: { slug: 'rrb-ntpc-12th-level-2026' },
            select: { id: true, title: true, previewUrl: true, fileUrl: true }
        });
        console.log('Note Data:', JSON.stringify(note, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
