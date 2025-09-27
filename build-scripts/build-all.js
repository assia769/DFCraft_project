import fs from 'fs-extra';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Building for all browsers...');

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    fs.removeSync(distDir);
  }

  // Run Vite build once
  console.log('⚡ Running Vite build...');
  execSync('npm run build', { stdio: 'inherit' });

  // Create browser-specific directories
  const chromeDir = path.join(distDir, 'chrome');
  const firefoxDir = path.join(distDir, 'firefox');
  
  fs.ensureDirSync(chromeDir);
  fs.ensureDirSync(firefoxDir);

  // Define which files we actually need for the extension
  const neededFiles = [
    'background.js',
    'content.js', 
    'main.js',
    'main.css',
    'popup.css',
    'src'  // This folder contains popup.html and options.html
  ];

  // Get all files from dist root and filter only needed ones
  const allItems = fs.readdirSync(distDir).filter(item => 
    item !== 'chrome' && item !== 'firefox'
  );
  
  const neededItems = allItems.filter(item => neededFiles.includes(item));
  
  console.log('📁 All build files:', allItems);
  console.log('✅ Copying needed files:', neededItems);
  console.log('🗑️ Skipping unnecessary files:', allItems.filter(item => !neededFiles.includes(item)));

  // Copy only needed files to both browser folders
  for (const item of neededItems) {
    const srcPath = path.join(distDir, item);
    const chromeDestPath = path.join(chromeDir, item);
    const firefoxDestPath = path.join(firefoxDir, item);
    
    // Copy to both folders
    if (fs.statSync(srcPath).isDirectory()) {
      fs.copySync(srcPath, chromeDestPath);
      fs.copySync(srcPath, firefoxDestPath);
    } else {
      fs.copyFileSync(srcPath, chromeDestPath);
      fs.copyFileSync(srcPath, firefoxDestPath);
    }
  }

  // Copy browser-specific manifests
  console.log('📋 Copying manifests...');
  
  // Chrome manifest
  const chromeManifestSrc = path.join(__dirname, '..', 'public', 'manifest.chrome.json');
  const chromeManifestDest = path.join(chromeDir, 'manifest.json');
  fs.copyFileSync(chromeManifestSrc, chromeManifestDest);
  
  // Firefox manifest
  const firefoxManifestSrc = path.join(__dirname, '..', 'firefox', 'manifest.firefox.json');
  const firefoxManifestDest = path.join(firefoxDir, 'manifest.json');
  fs.copyFileSync(firefoxManifestSrc, firefoxManifestDest);

  // Copy icons and sounds to both
  console.log('🎨 Copying assets...');
  
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  const soundsDir = path.join(__dirname, '..', 'public', 'sounds');
  
  if (fs.existsSync(iconsDir)) {
    fs.copySync(iconsDir, path.join(chromeDir, 'icons'));
    fs.copySync(iconsDir, path.join(firefoxDir, 'icons'));
  }
  
  if (fs.existsSync(soundsDir)) {
    fs.copySync(soundsDir, path.join(chromeDir, 'sounds'));
    fs.copySync(soundsDir, path.join(firefoxDir, 'sounds'));
  }

  // Clean up root dist files (keep only browser folders)
  for (const item of allItems) {
    fs.removeSync(path.join(distDir, item));
  }

  console.log('\n🎉 All builds complete!');
  console.log('\n📁 Build output:');
  console.log('   Chrome:  dist/chrome/');
  console.log('   Firefox: dist/firefox/');
  
  // List what's in each folder
  console.log('\n📂 Chrome folder contains:');
  fs.readdirSync(chromeDir).forEach(file => console.log(`   - ${file}`));
  
  console.log('\n📂 Firefox folder contains:');
  fs.readdirSync(firefoxDir).forEach(file => console.log(`   - ${file}`));

} catch (error) {
  console.error('❌ Build failed:', error.message);
  throw error;
}