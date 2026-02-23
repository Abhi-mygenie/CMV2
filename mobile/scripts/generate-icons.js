const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

// MyGenie brand colors
const primaryColor = '#f97316'; // Orange
const secondaryColor = '#22c55e'; // Green
const white = '#ffffff';

// Create SVG for the main icon (M letter with genie style)
const createIconSVG = (size, bgColor = secondaryColor) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${secondaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16a34a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.2}"/>
  <text x="50%" y="58%" font-family="Arial, sans-serif" font-size="${size * 0.5}" font-weight="bold" fill="${white}" text-anchor="middle" dominant-baseline="middle">M</text>
  <circle cx="${size * 0.72}" cy="${size * 0.22}" r="${size * 0.08}" fill="${primaryColor}"/>
</svg>
`;

// Create SVG for adaptive icon (foreground only, transparent bg)
const createAdaptiveIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="${white}" text-anchor="middle" dominant-baseline="middle">M</text>
  <circle cx="${size * 0.68}" cy="${size * 0.28}" r="${size * 0.06}" fill="${primaryColor}"/>
</svg>
`;

// Create SVG for splash icon
const createSplashSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size * 0.5}" cy="${size * 0.4}" r="${size * 0.25}" fill="${white}"/>
  <text x="50%" y="43%" font-family="Arial, sans-serif" font-size="${size * 0.25}" font-weight="bold" fill="${secondaryColor}" text-anchor="middle" dominant-baseline="middle">M</text>
  <circle cx="${size * 0.62}" cy="${size * 0.22}" r="${size * 0.04}" fill="${primaryColor}"/>
  <text x="50%" y="78%" font-family="Arial, sans-serif" font-size="${size * 0.08}" font-weight="bold" text-anchor="middle">
    <tspan fill="${white}">my</tspan><tspan fill="${primaryColor}">genie</tspan>
  </text>
</svg>
`;

// Create favicon SVG
const createFaviconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${secondaryColor}" rx="${size * 0.15}"/>
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="${size * 0.6}" font-weight="bold" fill="${white}" text-anchor="middle" dominant-baseline="middle">M</text>
</svg>
`;

async function generateIcons() {
  console.log('Generating app icons...');

  try {
    // Main app icon (1024x1024)
    await sharp(Buffer.from(createIconSVG(1024)))
      .resize(1024, 1024)
      .png()
      .toFile(path.join(assetsDir, 'icon.png'));
    console.log('✓ icon.png created');

    // Adaptive icon for Android (1024x1024)
    await sharp(Buffer.from(createAdaptiveIconSVG(1024)))
      .resize(1024, 1024)
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log('✓ adaptive-icon.png created');

    // Splash icon (200x200)
    await sharp(Buffer.from(createSplashSVG(400)))
      .resize(400, 400)
      .png()
      .toFile(path.join(assetsDir, 'splash-icon.png'));
    console.log('✓ splash-icon.png created');

    // Favicon (48x48)
    await sharp(Buffer.from(createFaviconSVG(48)))
      .resize(48, 48)
      .png()
      .toFile(path.join(assetsDir, 'favicon.png'));
    console.log('✓ favicon.png created');

    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
