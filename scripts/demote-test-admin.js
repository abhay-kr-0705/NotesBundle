
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@notesbundle.com';
    let log = '';

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            log += `User ${email} not found.\n`;
        } else {
            log += `Found user ${email}. Current Role: ${user.role}\n`;

            const updatedUser = await prisma.user.update({
                where: { email },
                data: { role: 'USER' },
            });

            log += `Successfully demoted ${email} to ${updatedUser.role}.\n`;
        }
    } catch (e) {
        log += `Error: ${e.message}\n`;
    } finally {
        await prisma.$disconnect();
        fs.writeFileSync('demotion_log.txt', log);
        console.log(log);
    }
}

main();
