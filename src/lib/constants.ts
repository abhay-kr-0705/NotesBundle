// Category data for the application
export const CATEGORIES = [
    {
        name: 'GATE',
        slug: 'gate',
        icon: '🎓',
        description: 'GATE preparation notes for all branches',
        subcategories: [
            { name: 'Computer Science', slug: 'gate-cse' },
            { name: 'Electronics & Communication', slug: 'gate-ece' },
            { name: 'Electrical Engineering', slug: 'gate-ee' },
            { name: 'Mechanical Engineering', slug: 'gate-me' },
            { name: 'Civil Engineering', slug: 'gate-ce' },
            { name: 'Chemical Engineering', slug: 'gate-ch' },
        ],
    },
    {
        name: 'Engineering Semesters',
        slug: 'engineering',
        icon: '📚',
        description: 'Semester-wise notes for engineering students',
        subcategories: [
            { name: 'BEU Notes', slug: 'beu' },
            { name: '1st Semester', slug: 'sem-1' },
            { name: '2nd Semester', slug: 'sem-2' },
            { name: '3rd Semester', slug: 'sem-3' },
            { name: '4th Semester', slug: 'sem-4' },
            { name: '5th Semester', slug: 'sem-5' },
            { name: '6th Semester', slug: 'sem-6' },
            { name: '7th Semester', slug: 'sem-7' },
            { name: '8th Semester', slug: 'sem-8' },
        ],
    },
    {
        name: 'Government Exams',
        slug: 'competitive',
        icon: '🏆',
        description: 'Study materials for government job exams',
        subcategories: [
            { name: 'SSC', slug: 'ssc' },
            { name: 'Railway', slug: 'railway' },
            { name: 'Bihar Police', slug: 'bihar-police' },
            { name: 'UPSC', slug: 'upsc' },
            { name: 'BPSC', slug: 'bpsc' },
            { name: 'Banking', slug: 'banking' },
        ],
    },
    {
        name: 'Coding Notes',
        slug: 'coding',
        icon: '💻',
        description: 'Handwritten coding notes for all languages',
        subcategories: [
            { name: 'Python', slug: 'python' },
            { name: 'Java', slug: 'java' },
            { name: 'JavaScript', slug: 'javascript' },
            { name: 'C/C++', slug: 'cpp' },
            { name: 'DSA', slug: 'dsa' },
            { name: 'Web Development', slug: 'web-dev' },
        ],
    },
    {
        name: 'PYQs',
        slug: 'pyqs',
        icon: '📝',
        description: 'Previous Year Questions with solutions',
        subcategories: [
            { name: 'GATE PYQs', slug: 'gate-pyqs' },
            { name: 'University PYQs', slug: 'university-pyqs' },
            { name: 'SSC PYQs', slug: 'ssc-pyqs' },
            { name: 'Railway PYQs', slug: 'railway-pyqs' },
        ],
    },
    {
        name: 'Handbooks',
        slug: 'handbooks',
        icon: '📖',
        description: 'Quick reference handbooks and formula sheets',
        subcategories: [
            { name: 'Engineering Handbooks', slug: 'engineering-handbooks' },
            { name: 'Formula Sheets', slug: 'formula-sheets' },
            { name: 'Quick Revision', slug: 'quick-revision' },
        ],
    },
];

export const BRANCHES = [
    { name: 'Computer Science & Engineering', slug: 'cse' },
    { name: 'Electronics & Communication', slug: 'ece' },
    { name: 'Electrical Engineering', slug: 'ee' },
    { name: 'Mechanical Engineering', slug: 'me' },
    { name: 'Civil Engineering', slug: 'ce' },
    { name: 'Chemical Engineering', slug: 'ch' },
    { name: 'Information Technology', slug: 'it' },
];

export const EXAM_TYPES = [
    'GATE',
    'SSC CGL',
    'SSC CHSL',
    'Railway RRB',
    'Railway NTPC',
    'Bihar Police',
    'UPSC CSE',
    'BPSC',
    'Banking PO',
    'Banking Clerk',
];
