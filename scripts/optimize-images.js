import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directories
const publicDir = path.join(__dirname, '../public');
const assetsDir = path.join(publicDir, 'assets');

// Configuration
const THUMBNAIL_WIDTH = 400;
const WEBP_QUALITY = 80;
const PROFILE_SIZES = [
  { name: 'large', width: 600 },
  { name: 'medium', width: 400 },
  { name: 'small', width: 200 },
  { name: 'thumbnail', width: 100 }
];

// Directories to process for WebP conversion
const DIRS_TO_PROCESS = [
  assetsDir, // Main assets directory
  path.join(assetsDir, 'certificates'),
      path.join(assetsDir, 'portfolio'), // Keep folder name for asset organization
  path.join(assetsDir, 'profile'),
  path.join(assetsDir, 'logos'),
  path.join(assetsDir, 'company-icon')
];

// Statistics tracking
let stats = {
  profileOptimized: 0,
  webpConverted: 0,
  thumbnailsCreated: 0,
  filesDeleted: 0,
  totalSavings: 0,
  errors: 0
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask user questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 1. Optimize Profile Images
async function optimizeProfileImages() {
  console.log('\n🖼️  === STEP 1: Optimizing Profile Images ===');
  
  // Look for profile images in the assets directory
  const profileImages = ['photo.png', 'photo.jpg', 'Panday.png', 'Panday.jpg', 'Panday.jpeg'];
  let foundProfileImage = null;
  
  for (const imageName of profileImages) {
    const imagePath = path.join(assetsDir, imageName);
    if (fs.existsSync(imagePath)) {
      foundProfileImage = imagePath;
      break;
    }
  }
  
  if (!foundProfileImage) {
    console.log('⚠️  No profile image found. Skipping profile optimization.');
    return [];
  }
  
  console.log(`📸 Found profile image: ${path.basename(foundProfileImage)}`);
  
  // Create profile directory
  const profileDir = path.join(assetsDir, 'profile');
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
    console.log(`📁 Created directory: ${profileDir}`);
  }
  
  const createdFiles = [];
  
  try {
    const originalStats = fs.statSync(foundProfileImage);
    const originalSizeKB = Math.round(originalStats.size / 1024);
    console.log(`📊 Original image size: ${originalSizeKB}KB`);
    
    for (const size of PROFILE_SIZES) {
      // WebP version
      const webpOutput = path.join(profileDir, `profile-${size.name}.webp`);
      await sharp(foundProfileImage)
        .resize(size.width, null, { fit: 'contain' })
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpOutput);
      
      // PNG version as fallback
      const pngOutput = path.join(profileDir, `profile-${size.name}.png`);
      await sharp(foundProfileImage)
        .resize(size.width, null, { fit: 'contain' })
        .png({ quality: 80 })
        .toFile(pngOutput);
      
      const webpStats = fs.statSync(webpOutput);
      const pngStats = fs.statSync(pngOutput);
      
      console.log(`✅ Created ${size.name} (${size.width}px):`);
      console.log(`   📦 WebP: ${Math.round(webpStats.size / 1024)}KB`);
      console.log(`   📦 PNG: ${Math.round(pngStats.size / 1024)}KB`);
      
      createdFiles.push(webpOutput, pngOutput);
      stats.profileOptimized += 2;
      stats.totalSavings += (originalStats.size - webpStats.size) + (originalStats.size - pngStats.size);
    }
    
    return [foundProfileImage];
  } catch (error) {
    console.error(`❌ Error optimizing profile image: ${error.message}`);
    stats.errors++;
    return [];
  }
}

// 2. Convert Images to WebP
async function convertToWebP() {
  console.log('\n🔄 === STEP 2: Converting Images to WebP ===');
  
  const sourceFiles = [];
  
  for (const dir of DIRS_TO_PROCESS) {
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️  Directory doesn't exist: ${dir}`);
      continue;
    }
    
    const dirName = path.relative(assetsDir, dir) || 'assets';
    console.log(`\n📁 Processing directory: ${dirName}`);
    
    // Create webp subdirectory for non-root directories
    let webpDir;
    if (dir === assetsDir) {
      webpDir = dir; // Same directory for main assets
    } else {
      webpDir = path.join(dir, 'webp');
      if (!fs.existsSync(webpDir)) {
        fs.mkdirSync(webpDir, { recursive: true });
        console.log(`📁 Created directory: ${webpDir}`);
      }
    }
    
    const files = fs.readdirSync(dir);
    const imageFiles = files.filter(file => {
      const filePath = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();
      return (
        fs.statSync(filePath).isFile() && 
        ['.jpg', '.jpeg', '.png'].includes(ext) &&
        !file.includes('.webp') &&
        !path.dirname(filePath).includes('webp') &&
        !path.dirname(filePath).includes('thumbnails')
      );
    });
    
    console.log(`📋 Found ${imageFiles.length} images to convert`);
    
    for (const file of imageFiles) {
      const inputPath = path.join(dir, file);
      const fileNameWithoutExt = path.parse(file).name;
      const outputPath = path.join(webpDir, `${fileNameWithoutExt}.webp`);
      
      // Skip if WebP version already exists and is newer
      if (fs.existsSync(outputPath)) {
        const originalStats = fs.statSync(inputPath);
        const webpStats = fs.statSync(outputPath);
        
        if (webpStats.mtime > originalStats.mtime) {
          console.log(`⏭️  Skipping ${file} (WebP version is up to date)`);
          continue;
        }
      }
      
      try {
        const originalStats = fs.statSync(inputPath);
        const originalSize = originalStats.size;
        
        // Dynamic quality based on file size
        let quality = WEBP_QUALITY;
        if (originalSize > 500 * 1024) quality = 75;
        else if (originalSize > 100 * 1024) quality = 80;
        else quality = 85;
        
        await sharp(inputPath)
          .webp({ quality, effort: 6 })
          .toFile(outputPath);
        
        const webpStats = fs.statSync(outputPath);
        const savingsPercent = Math.round(((originalSize - webpStats.size) / originalSize) * 100);
        
        console.log(`✅ ${file} → ${fileNameWithoutExt}.webp (${savingsPercent}% smaller)`);
        
        stats.webpConverted++;
        stats.totalSavings += (originalSize - webpStats.size);
        sourceFiles.push(inputPath);
      } catch (error) {
        console.error(`❌ Error converting ${file}: ${error.message}`);
        stats.errors++;
      }
    }
  }
  
  return sourceFiles;
}

// 3. Generate Thumbnails
async function generateThumbnails() {
  console.log('\n🖼️  === STEP 3: Generating Thumbnails ===');
  
  const sourceFiles = [];
  const dirsWithThumbnails = [];
  
  // Find directories that should have thumbnails
  for (const dir of DIRS_TO_PROCESS) {
    if (!fs.existsSync(dir) || dir === assetsDir) continue;
    
    const thumbnailsDir = path.join(dir, 'thumbnails');
    const hasImages = fs.readdirSync(dir).some(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
    
    if (hasImages) {
      dirsWithThumbnails.push({ sourceDir: dir, thumbnailsDir });
    }
  }
  
  console.log(`📁 Found ${dirsWithThumbnails.length} directories that need thumbnails`);
  
  for (const { sourceDir, thumbnailsDir } of dirsWithThumbnails) {
    const dirName = path.relative(assetsDir, sourceDir);
    console.log(`\n📁 Processing ${dirName} thumbnails...`);
    
    // Create thumbnails directory
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
      console.log(`📁 Created directory: ${thumbnailsDir}`);
    }
    
    const files = fs.readdirSync(sourceDir);
    const imageFiles = files.filter(file => {
      const filePath = path.join(sourceDir, file);
      const ext = path.extname(file).toLowerCase();
      return (
        fs.statSync(filePath).isFile() && 
        ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) &&
        !file.includes('thumbnail')
      );
    });
    
    console.log(`📋 Found ${imageFiles.length} images for thumbnail generation`);
    
    for (const file of imageFiles) {
      const inputPath = path.join(sourceDir, file);
      const fileNameWithoutExt = path.parse(file).name;
      const thumbnailPath = path.join(thumbnailsDir, `${fileNameWithoutExt}.webp`);
      
      try {
        await sharp(inputPath)
          .resize(THUMBNAIL_WIDTH, null, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .webp({ quality: WEBP_QUALITY })
          .toFile(thumbnailPath);
        
        console.log(`✅ Created thumbnail: ${fileNameWithoutExt}.webp`);
        stats.thumbnailsCreated++;
        
        // Don't add to sourceFiles for deletion since we want to keep originals for thumbnails
      } catch (error) {
        console.error(`❌ Error creating thumbnail for ${file}: ${error.message}`);
        stats.errors++;
      }
    }
  }
  
  return sourceFiles;
}

// 4. Ask for deletion permission and delete source files
async function handleSourceFileDeletion(sourceFiles) {
  if (sourceFiles.length === 0) {
    console.log('\n📝 No source files to delete.');
    return;
  }
  
  console.log('\n🗑️  === STEP 4: Source File Cleanup ===');
  console.log(`📋 Found ${sourceFiles.length} source files that can be deleted:`);
  
  // Remove duplicates
  const uniqueFiles = [...new Set(sourceFiles)];
  
  // Show files to be deleted
  uniqueFiles.forEach((file, index) => {
    const relativePath = path.relative(publicDir, file);
    const stats = fs.statSync(file);
    console.log(`   ${index + 1}. ${relativePath} (${formatBytes(stats.size)})`);
  });
  
  const answer = await askQuestion('\n❓ Do you want to delete these source files? (Y/N): ');
  
  if (answer === 'y' || answer === 'yes') {
    console.log('\n🗑️  Deleting source files...');
    
    for (const file of uniqueFiles) {
      try {
        const stats = fs.statSync(file);
        fs.unlinkSync(file);
        console.log(`✅ Deleted: ${path.relative(publicDir, file)}`);
        stats.filesDeleted++;
        stats.totalSavings += stats.size;
      } catch (error) {
        console.error(`❌ Error deleting ${file}: ${error.message}`);
        stats.errors++;
      }
    }
  } else {
    console.log('📝 Source files kept. You can delete them manually later if needed.');
  }
}

// Main optimization function
async function optimizeImages() {
  console.log('🚀 === IMAGE OPTIMIZATION STARTED ===');
  console.log('This script will:');
  console.log('1. 🖼️  Optimize profile images');
  console.log('2. 🔄 Convert all images to WebP format');
  console.log('3. 📸 Generate thumbnails for directories with thumbnail folders');
  console.log('4. 🗑️  Ask permission to delete source files');
  console.log('');
  
  try {
    // Step 1: Optimize profile images
    const profileSourceFiles = await optimizeProfileImages();
    
    // Step 2: Convert to WebP
    const webpSourceFiles = await convertToWebP();
    
    // Step 3: Generate thumbnails
    const thumbnailSourceFiles = await generateThumbnails();
    
    // Step 4: Handle source file deletion
    const allSourceFiles = [...profileSourceFiles, ...webpSourceFiles, ...thumbnailSourceFiles];
    await handleSourceFileDeletion(allSourceFiles);
    
    // Print final summary
    console.log('\n🎉 === OPTIMIZATION COMPLETE ===');
    console.log(`📊 Summary:`);
    console.log(`   🖼️  Profile images optimized: ${stats.profileOptimized}`);
    console.log(`   🔄 Images converted to WebP: ${stats.webpConverted}`);
    console.log(`   📸 Thumbnails created: ${stats.thumbnailsCreated}`);
    console.log(`   🗑️  Source files deleted: ${stats.filesDeleted}`);
    console.log(`   💾 Total space saved: ${formatBytes(stats.totalSavings)}`);
    if (stats.errors > 0) {
      console.log(`   ❌ Errors encountered: ${stats.errors}`);
    }
    
    console.log('\n🚀 Next steps:');
    console.log('1. Test your website to ensure all images load correctly');
    console.log('2. Update your components to use the optimized images');
    console.log('3. Deploy your changes to see the performance improvements');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the optimization
optimizeImages(); 