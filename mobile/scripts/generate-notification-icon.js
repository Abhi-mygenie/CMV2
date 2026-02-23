const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
const size = 96;

// Simple notification icon (white on transparent)
const notificationIconSVG = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="${size * 0.6}" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">M</text>
</svg>
`;

async function generate() {
  await sharp(Buffer.from(notificationIconSVG))
    .resize(size, size)
    .png()
    .toFile(path.join(assetsDir, 'notification-icon.png'));
  console.log('✓ notification-icon.png created');
}

generate();
