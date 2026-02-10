
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@notesbundle.com';

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { email: true, role: true }
        });

        if (!user) {
            console.log(`User ${email} not found.`);
        } else {
            console.log(`User: ${user.email}, Role: ${user.role}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
