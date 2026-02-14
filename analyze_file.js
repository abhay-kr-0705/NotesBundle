const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, 'src/app/admin/notes/create/page.tsx'), 'utf-8');
const lines = content.split('\n');

const output = [];
let braces = 0;
let parens = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const ch of line) {
        if (ch === '{') braces++;
        if (ch === '}') braces--;
        if (ch === '(') parens++;
        if (ch === ')') parens--;
    }
    // Log around the return statement
    if (i >= 148 && i <= 160) {
        output.push(`Line ${i + 1}: braces=${braces} parens=${parens} | ${line.trim().substring(0, 60)}`);
    }
}

output.push('');
output.push(`Final state: braces=${braces} parens=${parens}`);
output.push(`Total lines: ${lines.length}`);

// Also check for the specific issues
const hasNbsp = content.includes('&nbsp;');
const hasAsStringArr = content.includes('as string[]');
const unusedX = content.includes("import") && content.includes("X") && !content.includes('<X ') && !content.includes('<X/>');

output.push(`Contains &nbsp;: ${hasNbsp}`);
output.push(`Contains 'as string[]': ${hasAsStringArr}`);
output.push(`Potentially unused X import: ${unusedX}`);

fs.writeFileSync(path.resolve(__dirname, 'analysis_result.txt'), output.join('\n'), 'utf-8');
