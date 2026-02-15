import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories
const publicDir = path.join(__dirname, '../public');
const assetsDir = path.join(publicDir, 'assets');
const profileDir = path.join(assetsDir, 'profile');

// Open Graph image dimensions (recommended by Facebook/LinkedIn)
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const OG_IMAGE_QUALITY = 90;

console.log('\n🎨 === Creating Open Graph Images for Social Media ===\n');

async function createOGImages() {
  try {
    // Find source photo (WebP version)
    const sourcePhotoWebP = path.join(assetsDir, 'photo.webp');
    const sourceProfileLarge = path.join(profileDir, 'profile-large.webp');

    let sourceImage = null;
    if (fs.existsSync(sourcePhotoWebP)) {
      sourceImage = sourcePhotoWebP;
    } else if (fs.existsSync(sourceProfileLarge)) {
      sourceImage = sourceProfileLarge;
    } else {
      console.error('❌ No source image found!');
      process.exit(1);
    }

    console.log(`📸 Using source image: ${path.basename(sourceImage)}`);

    // Get image metadata
    const metadata = await sharp(sourceImage).metadata();
    console.log(`   Original size: ${metadata.width}x${metadata.height}`);

    // Background color matching the site's theme (dark primary color)
    const bgColor = { r: 28, g: 28, b: 34, alpha: 1 }; // #1c1c22

    // Create og-image.png (1200x630) - Standard Open Graph size
    const ogImagePath = path.join(publicDir, 'og-image.png');
    await sharp(sourceImage)
      .resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, {
        fit: 'contain',
        background: bgColor
      })
      .png({ quality: OG_IMAGE_QUALITY, compressionLevel: 6 })
      .toFile(ogImagePath);

    const ogStats = fs.statSync(ogImagePath);
    console.log(`✅ Created: og-image.png (${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT}) - ${formatBytes(ogStats.size)}`);

    // Create PNG versions of profile images for social media compatibility
    const sizes = [
      { name: 'profile-large.png', width: 1200, height: 630 },
      { name: 'profile-medium.png', width: 800, height: 600 },
      { name: 'profile-small.png', width: 400, height: 400 }
    ];

    for (const size of sizes) {
      const outputPath = path.join(profileDir, size.name);
      await sharp(sourceImage)
        .resize(size.width, size.height, {
          fit: 'contain',
          background: bgColor
        })
        .png({ quality: OG_IMAGE_QUALITY, compressionLevel: 6 })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      console.log(`✅ Created: ${size.name} (${size.width}x${size.height}) - ${formatBytes(stats.size)}`);
    }

    // Create twitter-image.png (for Twitter Card)
    const twitterImagePath = path.join(publicDir, 'twitter-image.png');
    await sharp(sourceImage)
      .resize(1200, 600, {
        fit: 'contain',
        background: bgColor
      })
      .png({ quality: OG_IMAGE_QUALITY, compressionLevel: 6 })
      .toFile(twitterImagePath);

    const twitterStats = fs.statSync(twitterImagePath);
    console.log(`✅ Created: twitter-image.png (1200x600) - ${formatBytes(twitterStats.size)}`);

    console.log('\n🎉 === Open Graph Images Created Successfully! ===\n');
    console.log('📝 Next steps:');
    console.log('   1. Update app/layout.tsx to use PNG images instead of WebP');
    console.log('   2. Deploy the changes');
    console.log('   3. Clear LinkedIn/Facebook cache:');
    console.log('      - LinkedIn: https://www.linkedin.com/post-inspector/');
    console.log('      - Facebook: https://developers.facebook.com/tools/debug/\n');

  } catch (error) {
    console.error('❌ Error creating OG images:', error);
    process.exit(1);
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Run the script
createOGImages();
