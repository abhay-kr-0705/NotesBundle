
const fs = require('fs');
const path = require('path');

const base64Path = path.join(process.cwd(), 'logo_base64.txt');
let base64 = fs.readFileSync(base64Path, 'utf8'); // It might be utf16le, let's try reading as buffer first to be safe, or just utf16le if we know it is.
// transform-tobase64 in powershell usually outputs with newlines.
// fs.readFileSync with encoding might be tricky with PS output.
// distinct safe way:
const buffer = fs.readFileSync(base64Path);
// PS adds a BOM and uses UTF-16LE.
// We can strip BOM and decode.
// Simple hack: read as string, remove all non-base64 chars.
const content = buffer.toString('utf16le'); // Try utf16le
const cleanBase64 = content.replace(/[\r\n\s]/g, '');

const html = `
<!DOCTYPE html>
<html>
<body>
    <img id="source" src="data:image/jpeg;base64,${cleanBase64}" style="display:none;">
    <canvas id="canvas" width="512" height="512"></canvas>
    <div id="output"></div>
    <script>
        const img = document.getElementById('source');
        img.onload = () => {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            
            // Draw rounded rect
            const radius = 100; // Adjust for corner roundness
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(512 - radius, 0);
            ctx.quadraticCurveTo(512, 0, 512, radius);
            ctx.lineTo(512, 512 - radius);
            ctx.quadraticCurveTo(512, 512, 512 - radius, 512);
            ctx.lineTo(radius, 512);
            ctx.quadraticCurveTo(0, 512, 0, 512 - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
            ctx.clip();
            
            ctx.drawImage(img, 0, 0, 512, 512);
            
            const dataUrl = canvas.toDataURL('image/png');
            document.getElementById('output').innerText = dataUrl;
        };
    </script>
</body>
</html>
`;

fs.writeFileSync('generate_favicon.html', html);
console.log('HTML generated');
