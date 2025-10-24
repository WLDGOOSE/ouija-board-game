const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SVG_PATH = path.join(__dirname, '../public/icons/icon-512x512.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('Generating PWA icons...');
  
  // Ensure the output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Read the SVG file
  const svgBuffer = fs.readFileSync(SVG_PATH);
  
  // Generate icons for each size
  for (const size of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated: ${outputPath}`);
    } catch (error) {
      console.error(`Error generating icon size ${size}:`, error);
    }
  }
  
  console.log('Icon generation complete!');
}

generateIcons().catch(console.error);