const fs = require('fs');
const path = require('path');

const output = [];

// Check create page features
const createPath = path.resolve(__dirname, 'src/app/admin/notes/create/page.tsx');
const createContent = fs.readFileSync(createPath, 'utf-8');

output.push('=== CREATE PAGE (create/page.tsx) ===');
output.push(`Upload/External toggle: ${createContent.includes("fileMode") && createContent.includes("'upload' | 'external'")}`);
output.push(`External URL input: ${createContent.includes('externalUrl')}`);
output.push(`File upload: ${createContent.includes('handleFileUpload')}`);
output.push(`Thumbnail upload: ${createContent.includes('thumbnailUrl')}`);
output.push(`Category dropdown: ${createContent.includes('categoryId')}`);
output.push(`Pricing fields: ${createContent.includes('price') && createContent.includes('discountPrice')}`);
output.push(`Preview pages: ${createContent.includes('previewPages')}`);
output.push(`MultiImageUpload: ${createContent.includes('MultiImageUpload')}`);
output.push(`Publish/Featured checkboxes: ${createContent.includes('isPublished') && createContent.includes('isFeatured')}`);
output.push(`BRANCHES import: ${createContent.includes('BRANCHES')}`);
output.push(`Submit handler: ${createContent.includes('handleSubmit')}`);
output.push(`University field: ${createContent.includes('university')}`);
output.push(`Semester field: ${createContent.includes('semester')}`);
output.push(`Branch field: ${createContent.includes('branch')}`);
output.push(`Subject field: ${createContent.includes('subject')}`);
output.push(`Tags field: ${createContent.includes('tags')}`);
output.push(`Language field: ${createContent.includes('language')}`);

// Check edit page features
const editPath = path.resolve(__dirname, 'src/app/admin/notes/[id]/page.tsx');
const editContent = fs.readFileSync(editPath, 'utf-8');

output.push('');
output.push('=== EDIT PAGE ([id]/page.tsx) ===');
output.push(`Upload/External toggle: ${editContent.includes("fileMode") && editContent.includes("'upload' | 'external'")}`);
output.push(`External URL input: ${editContent.includes('externalUrl')}`);
output.push(`Fetch existing note: ${editContent.includes('params.id')}`);
output.push(`PUT method: ${editContent.includes("method: 'PUT'")}`);
output.push(`Category dropdown: ${editContent.includes('categoryId')}`);
output.push(`Pricing fields: ${editContent.includes('price') && editContent.includes('discountPrice')}`);
output.push(`Preview pages: ${editContent.includes('previewPages')}`);
output.push(`MultiImageUpload: ${editContent.includes('MultiImageUpload')}`);
output.push(`Publish/Featured checkboxes: ${editContent.includes('isPublished') && editContent.includes('isFeatured')}`);
output.push(`File upload: ${editContent.includes('handleFileUpload')}`);
output.push(`Thumbnail upload: ${editContent.includes('thumbnailUrl')}`);
output.push(`Submit handler: ${editContent.includes('handleSubmit')}`);

// Check other implementation plan items
output.push('');
output.push('=== OTHER IMPLEMENTATION PLAN ITEMS ===');

// Schema
const schemaPath = path.resolve(__dirname, 'prisma/schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
output.push(`Schema externalUrl: ${schemaContent.includes('externalUrl')}`);

// API routes
const apiNotesPath = path.resolve(__dirname, 'src/app/api/notes/route.ts');
if (fs.existsSync(apiNotesPath)) {
    const apiContent = fs.readFileSync(apiNotesPath, 'utf-8');
    output.push(`API POST handles externalUrl: ${apiContent.includes('externalUrl')}`);
}

const apiNotesIdPath = path.resolve(__dirname, 'src/app/api/notes/[id]/route.ts');
if (fs.existsSync(apiNotesIdPath)) {
    const apiIdContent = fs.readFileSync(apiNotesIdPath, 'utf-8');
    output.push(`API PUT handles externalUrl: ${apiIdContent.includes('externalUrl')}`);
}

// My Notes page
const myNotesPath = path.resolve(__dirname, 'src/app/my-notes/page.tsx');
output.push(`My Notes page exists: ${fs.existsSync(myNotesPath)}`);

// NoteClient externalUrl
const noteClientPath = path.resolve(__dirname, 'src/app/notes/[slug]/NoteClient.tsx');
if (fs.existsSync(noteClientPath)) {
    const noteClient = fs.readFileSync(noteClientPath, 'utf-8');
    output.push(`NoteClient handles externalUrl: ${noteClient.includes('externalUrl')}`);
}

// Navbar My Notes link
const navbarPath = path.resolve(__dirname, 'src/components/layout/Navbar.tsx');
if (fs.existsSync(navbarPath)) {
    const navbar = fs.readFileSync(navbarPath, 'utf-8');
    output.push(`Navbar has My Notes: ${navbar.includes('my-notes') || navbar.includes('My Notes')}`);
    output.push(`Navbar has mobile accordion: ${navbar.includes('accordion') || navbar.includes('collapse') || navbar.includes('Accordion')}`);
}

// Homepage
const homePage = path.resolve(__dirname, 'src/app/page.tsx');
if (fs.existsSync(homePage)) {
    const homeContent = fs.readFileSync(homePage, 'utf-8');
    output.push(`Homepage has Government Exam: ${homeContent.includes('Government')}`);
}

// Constants
const constantsPath = path.resolve(__dirname, 'src/lib/constants.ts');
if (fs.existsSync(constantsPath)) {
    const constants = fs.readFileSync(constantsPath, 'utf-8');
    output.push(`Constants has Government Exams: ${constants.includes('Government Exams')}`);
}

fs.writeFileSync(path.resolve(__dirname, 'feature_audit.txt'), output.join('\n'), 'utf-8');
