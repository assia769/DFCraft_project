import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Building for Chrome...");

try {
  // Run Vite build
  execSync("npm run build", { stdio: "inherit" });

  // Create chrome directory
  const chromeDir = path.join(__dirname, "..", "dist", "chrome");
  const distDir = path.join(__dirname, "..", "dist");

  // Ensure chrome directory exists
  fs.ensureDirSync(chromeDir);

  // Get all files from dist root and filter only needed ones
  const allItems = fs
    .readdirSync(distDir)
    .filter((item) => item !== "chrome" && item !== "firefox");
  // Define which files we actually need for the extension
  const neededFiles = [
    "background.js",
    "content.js",
    "main.js",
    "main.css",
    "popup.css",
    "offscreen.html", // Add this
    "offscreen.js",
    "src",
  ];

  const neededItems = allItems.filter((item) => neededFiles.includes(item));

  console.log("📁 All build files:", allItems);
  console.log("✅ Copying needed files:", neededItems);
  console.log(
    "🗑️ Skipping unnecessary files:",
    allItems.filter((item) => !neededFiles.includes(item)),
  );

  // Copy built files (but avoid copying browser-specific folders)
  for (const item of neededItems) {
    const srcPath = path.join(distDir, item);
    const chromeDestPath = path.join(chromeDir, item);

    // Copy to both folders
    if (fs.statSync(srcPath).isDirectory()) {
      fs.copySync(srcPath, chromeDestPath);
    } else {
      fs.copyFileSync(srcPath, chromeDestPath);
    }
  }

  // Copy browser-specific manifests
  console.log("📋 Copying manifests...");

  // Copy Chrome manifest
  const chromeManifestPath = path.join(
    __dirname,
    "..",
    "public",
    "manifest.chrome.json",
  );
  if (!fs.existsSync(chromeManifestPath)) {
    throw new Error(
      "Chrome manifest not found! Please create public/manifest.chrome.json",
    );
  }

  fs.copyFileSync(chromeManifestPath, path.join(chromeDir, "manifest.json"));

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "blocked.html"),
    path.join(chromeDir, "staticPages", "blocked.html"),
  );

  fs.copySync(
      path.join(__dirname, "..", "public", "staticPages", "statist.html"),
      path.join(chromeDir, "staticPages", "statist.html"),
  );

  // Copy icons and sounds to both
  console.log("🎨 Copying assets...");

  // Copy icons
  const iconsDir = path.join(__dirname, "..", "public", "icons");
  if (fs.existsSync(iconsDir)) {
    fs.copySync(iconsDir, path.join(chromeDir, "icons"));
  }
  // Copy sounds
  const soundsDir = path.join(__dirname, "..", "public", "sounds");
  if (fs.existsSync(soundsDir)) {
    fs.copySync(soundsDir, path.join(chromeDir, "sounds"));
  }

  const fontsDir = path.join(__dirname, "..", "public", "fonts");
  if (fs.existsSync(fontsDir)) {
    fs.copySync(fontsDir, path.join(chromeDir, "fonts"));
    fs.copySync(fontsDir, path.join(firefoxDir, "fonts"));
  }

  // Clean up root dist files (keep only browser folders)
  for (const item of allItems) {
    fs.removeSync(path.join(distDir, item));
  }

  console.log("✅ Chrome build complete!");
  // List what's in each folder
  console.log("\n📂 Chrome folder contains:");
  fs.readdirSync(chromeDir).forEach((file) => console.log(`   - ${file}`));

  console.log("📁 Chrome files ready in: dist/chrome/");
} catch (error) {
  console.error("❌ Chrome build failed:", error.message);
  throw error;
}
