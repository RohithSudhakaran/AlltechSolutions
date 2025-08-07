const fs = require('fs');
const path = require('path');

// Simple PNG dimension reader
function getPNGDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // Check if it's a PNG file
    if (buffer.toString('ascii', 1, 4) !== 'PNG') {
      return null;
    }
    
    // PNG dimensions are stored at bytes 16-23
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    
    return { width, height };
  } catch (error) {
    return null;
  }
}

const logosDir = './public/logos';
const files = fs.readdirSync(logosDir).filter(file => file.endsWith('.png'));

console.log('📐 LOGO DIMENSIONS ANALYSIS:\n');

const oldLogos = [];
const newLogos = [];

files.forEach(file => {
  const filePath = path.join(logosDir, file);
  const dimensions = getPNGDimensions(filePath);
  const stats = fs.statSync(filePath);
  const sizeKB = Math.round(stats.size / 1024 * 100) / 100;
  
  const logoInfo = {
    name: file,
    width: dimensions?.width || 'Unknown',
    height: dimensions?.height || 'Unknown',
    size: sizeKB
  };
  
  // Categorize as old or new based on file size (new ones are much smaller)
  if (sizeKB < 100) {
    newLogos.push(logoInfo);
  } else {
    oldLogos.push(logoInfo);
  }
  
  if (dimensions) {
    console.log(`${file}: ${dimensions.width} × ${dimensions.height} pixels (${sizeKB} KB)`);
  } else {
    console.log(`${file}: Could not read dimensions (${sizeKB} KB)`);
  }
});

console.log('\n🏢 OLD LOGOS (9):');
oldLogos.forEach(logo => {
  console.log(`  ${logo.name}: ${logo.width} × ${logo.height} pixels`);
});

console.log('\n✨ NEW LOGOS (3):');
newLogos.forEach(logo => {
  console.log(`  ${logo.name}: ${logo.width} × ${logo.height} pixels`);
});

console.log('\n📊 SUMMARY:');
console.log(`Old logos average size: ${Math.round(oldLogos.reduce((sum, logo) => sum + logo.size, 0) / oldLogos.length)} KB`);
console.log(`New logos average size: ${Math.round(newLogos.reduce((sum, logo) => sum + logo.size, 0) / newLogos.length)} KB`);
