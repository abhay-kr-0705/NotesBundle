
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@notesbundle.com';

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log(`User ${email} not found.`);
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: 'USER' },
        });

        console.log(`Successfully demoted ${email} to ${updatedUser.role}.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
