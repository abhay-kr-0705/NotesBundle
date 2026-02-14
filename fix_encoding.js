const fs = require('fs');
const path = require('path');

const output = [];

const files = [
    'src/app/admin/notes/create/page.tsx',
    'src/app/admin/notes/[id]/page.tsx',
];

files.forEach(f => {
    const filePath = path.resolve(__dirname, f);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check for BOM
    const hasBOM = content.charCodeAt(0) === 0xFEFF;
    const cleanContent = hasBOM ? content.slice(1) : content;

    // Count CRLF vs LF
    const crlfCount = (cleanContent.match(/\r\n/g) || []).length;
    const lfOnly = (cleanContent.replace(/\r\n/g, '').match(/\n/g) || []).length;

    // Normalize to LF
    const lfContent = cleanContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Write back with explicit LF
    const buf = Buffer.from(lfContent, 'utf-8');
    fs.writeFileSync(filePath, buf);

    output.push(`${f}:`);
    output.push(`  Had BOM: ${hasBOM}`);
    output.push(`  CRLF count: ${crlfCount}`);
    output.push(`  LF-only count: ${lfOnly}`);
    output.push(`  Size after fix: ${buf.length} bytes`);
    output.push(`  Lines: ${lfContent.split('\n').length}`);
});

output.push('');
output.push('Done! Files normalized to LF UTF-8 without BOM.');

fs.writeFileSync(path.resolve(__dirname, 'encoding_result.txt'), output.join('\n'), 'utf-8');
