
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
    {
        name: 'GATE',
        slug: 'gate',
        description: 'Comprehensive study material for Graduate Aptitude Test in Engineering',
        icon: 'GraduationCap',
        subcategories: [
            { name: 'Computer Science', slug: 'gate-cse' },
            { name: 'Electronics', slug: 'gate-ece' },
            { name: 'Electrical', slug: 'gate-ee' },
            { name: 'Mechanical', slug: 'gate-me' },
            { name: 'Civil', slug: 'gate-ce' },
        ],
    },
    {
        name: 'Engineering',
        slug: 'engineering',
        description: 'Semester notes for B.Tech/B.E students across all branches',
        icon: 'BookOpen',
        subcategories: [
            { name: 'First Year', slug: 'eng-first-year' },
            { name: 'CSE', slug: 'eng-cse' },
            { name: 'ECE', slug: 'eng-ece' },
            { name: 'ME', slug: 'eng-me' },
            { name: 'CE', slug: 'eng-ce' },
        ],
    },
    {
        name: 'Competitive Exams',
        slug: 'competitive-exams',
        description: 'Preparation material for SSC, Banking, Railways, and state exams',
        icon: 'Trophy',
        subcategories: [
            { name: 'SSC CGL', slug: 'ssc-cgl' },
            { name: 'Banking PO', slug: 'banking-po' },
            { name: 'Railways RRB', slug: 'railways-rrb' },
            { name: 'UPSC', slug: 'upsc' },
        ],
    },
    {
        name: 'Coding & Programming',
        slug: 'coding',
        description: 'Learn programming languages, data structures, and algorithms',
        icon: 'Code',
        subcategories: [
            { name: 'Python', slug: 'coding-python' },
            { name: 'Java', slug: 'coding-java' },
            { name: 'Web Development', slug: 'coding-web-dev' },
            { name: 'Data Structures', slug: 'coding-dsa' },
        ],
    },
];

async function main() {
    console.log('Start seeding...');

    // create admin user
    const adminPassword = await hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@notesbundle.com' },
        update: {},
        create: {
            email: 'admin@notesbundle.com',
            name: 'Admin User',
            role: 'ADMIN',
            password: adminPassword,
            interests: ['gate-cse', 'coding-python'],
        },
    });
    console.log(`Created admin user: ${admin.email}`);

    // create categories
    for (const category of categories) {
        const createdCategory = await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: {
                name: category.name,
                slug: category.slug,
                description: category.description,
                icon: category.icon,
            },
        });

        console.log(`Created category: ${createdCategory.name}`);

        for (const sub of category.subcategories) {
            await prisma.category.upsert({
                where: { slug: sub.slug },
                update: {},
                create: {
                    name: sub.name,
                    slug: sub.slug,
                    description: `${sub.name} notes`,
                    parentId: createdCategory.id,
                },
            });
        }
    }

    // get category ids for notes
    const gateCse = await prisma.category.findUnique({ where: { slug: 'gate-cse' } });
    const pyCoding = await prisma.category.findUnique({ where: { slug: 'coding-python' } });

    if (gateCse) {
        // create sample note
        await prisma.note.upsert({
            where: { slug: 'gate-cse-complete-notes-2024' },
            update: {},
            create: {
                title: 'Complete GATE CSE Notes 2024',
                slug: 'gate-cse-complete-notes-2024',
                description: 'Comprehensive notes covering all GATE CSE topics: Data Structures, Algorithms, OS, DBMS, CN, TOC, CD, Digital logic, COA, Math.',
                shortDescription: 'All-in-one GATE CSE study material',
                price: 499,
                discountPrice: 299,
                categoryId: gateCse.id,
                tags: ['gate', 'cse', 'computer science', '2024'],
                examType: 'GATE',
                branch: 'CSE',
                language: 'English',
                pages: 350,
                format: 'PDF',
                isFeatured: true,
                isPublished: true,
                averageRating: 4.8,
                totalReviews: 45,
            },
        });
    }

    if (pyCoding) {
        await prisma.note.upsert({
            where: { slug: 'python-programming-mastery' },
            update: {},
            create: {
                title: 'Python Programming Mastery',
                slug: 'python-programming-mastery',
                description: 'Learn Python from scratch to advanced level. Includes hands-on projects and exercises.',
                shortDescription: 'Master Python programming language',
                price: 199,
                discountPrice: 149,
                categoryId: pyCoding.id,
                tags: ['python', 'coding', 'programming', 'beginner'],
                language: 'English',
                pages: 120,
                format: 'PDF',
                isFeatured: true,
                isPublished: true,
                averageRating: 4.7,
                totalReviews: 28,
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
