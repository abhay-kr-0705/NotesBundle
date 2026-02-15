
const fs = require('fs');
const path = require('path');

const logoPath = path.join(process.cwd(), 'public/images/logo.jpg');
const svgPath = path.join(process.cwd(), 'public/images/favicon.svg');

try {
    const logoBuffer = fs.readFileSync(logoPath);
    const base64Image = logoBuffer.toString('base64');

    // Create SVG with embedded base64 image and rounded clip path
    const svgContent = `<svg width="512" height="512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="rounded">
      <rect x="0" y="0" width="512" height="512" rx="100" ry="100" />
    </clipPath>
  </defs>
  <image href="data:image/jpeg;base64,${base64Image}" x="0" y="0" width="512" height="512" clip-path="url(#rounded)" />
</svg>`;

    fs.writeFileSync(svgPath, svgContent);
    console.log('Favicon SVG generated successfully at:', svgPath);
} catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
}
