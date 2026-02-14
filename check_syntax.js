
const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const fileName = 'src/app/admin/notes/[id]/page.tsx';
const filePath = path.resolve(process.cwd(), fileName);

const log = (msg) => fs.appendFileSync('syntax_check_output.txt', msg + '\n');

try {
    if (fs.existsSync('syntax_check_output.txt')) fs.unlinkSync('syntax_check_output.txt');

    const fileContent = fs.readFileSync(filePath, 'utf8');
    log(`Read file content, length: ${fileContent.length} chars, lines: ${fileContent.split('\n').length}`);
    const sourceFile = ts.createSourceFile(
        fileName,
        fileContent,
        ts.ScriptTarget.Latest,
        true // setParentNodes
    );

    const diagnostics = [];

    // Check for parse errors
    if (sourceFile.parseDiagnostics && sourceFile.parseDiagnostics.length > 0) {
        diagnostics.push(...sourceFile.parseDiagnostics);
    }

    if (diagnostics.length > 0) {
        log('Found syntax errors:');
        diagnostics.forEach(diagnostic => {
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            log(`${fileName} (${line + 1},${character + 1}): ${message}`);
        });
    } else {
        log('No syntax errors found by TypeScript parser.');
    }

} catch (e) {
    log('Error reading or parsing file: ' + e);
}
