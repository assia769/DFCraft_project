import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🦊 Building for Firefox...");

try {
  // Only build if dist is empty or only has chrome folder
  const distDir = path.join(__dirname, "..", "dist");
  const hasOnlyChrome =
    fs.existsSync(distDir) &&
    fs.readdirSync(distDir).every((item) => item === "chrome");

  if (!fs.existsSync(distDir) || hasOnlyChrome) {
    console.log("🔨 Running Vite build...");
    execSync("npm run build", { stdio: "inherit" });
  }

  // Create firefox directory
  const firefoxDir = path.join(distDir, "firefox");
  fs.ensureDirSync(firefoxDir);

  // Get all files from dist root FIRST (before using it)
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
    "src", // This folder contains popup.html and options.html
  ];

  // NOW we can filter using allItems
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
    const firefoxDestPath = path.join(firefoxDir, item);

    // Copy to Firefox folder
    if (fs.statSync(srcPath).isDirectory()) {
      fs.copySync(srcPath, firefoxDestPath);
    } else {
      fs.copyFileSync(srcPath, firefoxDestPath);
    }
  }

  // Copy browser-specific manifests
  console.log("📋 Copying manifests...");

  // Copy Firefox manifest
  const firefoxManifestPath = path.join(
    __dirname,
    "..",
    "firefox",
    "manifest.firefox.json",
  );
  if (!fs.existsSync(firefoxManifestPath)) {
    throw new Error(
      "Firefox manifest not found! Please create firefox/manifest.firefox.json",
    );
  }

  fs.copyFileSync(firefoxManifestPath, path.join(firefoxDir, "manifest.json"));

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "blocked.html"),
    path.join(firefoxDir, "staticPages", "blocked.html"),
  );

  fs.copySync(
      path.join(__dirname, "..", "public", "staticPages", "statist.html"),
      path.join(firefoxDir, "staticPages", "statist.html"),
  );

  // Copy icons and sounds
  console.log("🎨 Copying assets...");

  // Copy icons
  const iconsDir = path.join(__dirname, "..", "public", "icons");
  if (fs.existsSync(iconsDir)) {
    fs.copySync(iconsDir, path.join(firefoxDir, "icons"));
  }

  // Copy sounds
  const soundsDir = path.join(__dirname, "..", "public", "sounds");
  if (fs.existsSync(soundsDir)) {
    fs.copySync(soundsDir, path.join(firefoxDir, "sounds"));
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

  console.log("✅ Firefox build complete!");

  // List what's in the folder
  console.log("\n📂 Firefox folder contains:");
  fs.readdirSync(firefoxDir).forEach((file) => console.log(`   - ${file}`));

  console.log("📁 Firefox files ready in: dist/firefox/");
} catch (error) {
  console.error("❌ Firefox build failed:", error.message);
  throw error;
}
