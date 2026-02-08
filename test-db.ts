
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Testing database connection...');
    try {
        await prisma.$connect();
        console.log('Successfully connected to database!');
        const userCount = await prisma.user.count();
        console.log(`User count: ${userCount}`);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
