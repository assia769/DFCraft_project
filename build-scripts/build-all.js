import fs from "fs-extra";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔨 Building for all browsers...");

try {
  const distDir = path.join(__dirname, "..", "dist");
  const chromeDir = path.join(distDir, "chrome");
  const firefoxDir = path.join(distDir, "firefox");
  const backgroundDistDir = path.join(distDir, "background");

  // 1️⃣ Clean dist
  console.log("🧹 Cleaning previous builds...");
  fs.removeSync(distDir);
  fs.ensureDirSync(distDir);

  // 2️⃣ Main Vite build
  console.log("⚡ Running main Vite build...");
  execSync("npm run build", { stdio: "inherit" });

  // 3️⃣ Create browser folders
  fs.ensureDirSync(chromeDir);
  fs.ensureDirSync(firefoxDir);

  // 4️⃣ Files needed from main build
  const neededFiles = [
    "background.js",
    "content.js",
    "main.js",
    "main.css",
    "popup.css",
    "offscreen.html",
    "offscreen.js",
    "statist.js",
    "statist.html",
    "src",
  ];

  const allItems = fs
    .readdirSync(distDir)
    .filter((item) => !["chrome", "firefox", "background"].includes(item));

  const neededItems = allItems.filter((item) => neededFiles.includes(item));

  console.log("✅ Copying base files:", neededItems);

  for (const item of neededItems) {
    const src = path.join(distDir, item);
    const chromeDest = path.join(chromeDir, item);
    const firefoxDest = path.join(firefoxDir, item);

    if (fs.statSync(src).isDirectory()) {
      fs.copySync(src, chromeDest);
      fs.copySync(src, firefoxDest);
    } else {
      fs.copyFileSync(src, chromeDest);
      fs.copyFileSync(src, firefoxDest);
    }
  }

  // 5️⃣ Build background (bundle unique)
  console.log("⚙️ Building background...");
  execSync("npm run build:background", { stdio: "inherit" });

  const backgroundFile = path.join(backgroundDistDir, "background.js");

  if (!fs.existsSync(backgroundFile)) {
    throw new Error("background.js not found after background build");
  }

  // 6️⃣ Copy background.js to both browsers
  fs.copyFileSync(backgroundFile, path.join(chromeDir, "background.js"));
  fs.copyFileSync(backgroundFile, path.join(firefoxDir, "background.js"));

  // 7️⃣ Copy manifests
  console.log("📋 Copying manifests...");
  fs.copyFileSync(
    path.join(__dirname, "..", "public", "manifest.chrome.json"),
    path.join(chromeDir, "manifest.json"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "blocked.html"),
    path.join(chromeDir, "staticPages", "blocked.html"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "Statist", "statist.html"),
    path.join(chromeDir, "staticPages", "statist.html"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "Statist", "Script.js"),
    path.join(chromeDir, "staticPages", "Script.js"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "Statist", "Style.css"),
    path.join(chromeDir, "staticPages", "Style.css"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "Statist", "translation.js"),
    path.join(chromeDir, "staticPages", "translation.js"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "vendor", "echarts.min.js"),
    path.join(chromeDir, "vendor", "echarts.min.js"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "blocked.html"),
    path.join(firefoxDir, "staticPages", "blocked.html"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "Statist", "statist.html"),
    path.join(firefoxDir, "staticPages", "statist.html"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "Statist", "Script.js"),
    path.join(firefoxDir, "staticPages", "Script.js"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "Statist", "Style.css"),
    path.join(firefoxDir, "staticPages", "Style.css"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "staticPages", "Statist", "translation.js"),
    path.join(firefoxDir, "staticPages", "translation.js"),
  );

  fs.copySync(
    path.join(__dirname, "..", "public", "vendor", "echarts.min.js"),
    path.join(firefoxDir, "vendor", "echarts.min.js"),
  );

  fs.copyFileSync(
    path.join(__dirname, "..", "firefox", "manifest.firefox.json"),
    path.join(firefoxDir, "manifest.json"),
  );

  // 8️⃣ Copy assets
  console.log("🎨 Copying assets...");
  const iconsDir = path.join(__dirname, "..", "public", "icons");
  const soundsDir = path.join(__dirname, "..", "public", "sounds");
  const fontsDir = path.join(__dirname, "..", "public", "fonts");

  if (fs.existsSync(fontsDir)) {
    fs.copySync(fontsDir, path.join(chromeDir, "fonts"));
    fs.copySync(fontsDir, path.join(firefoxDir, "fonts"));
  }

  if (fs.existsSync(iconsDir)) {
    fs.copySync(iconsDir, path.join(chromeDir, "icons"));
    fs.copySync(iconsDir, path.join(firefoxDir, "icons"));
  }

  if (fs.existsSync(soundsDir)) {
    fs.copySync(soundsDir, path.join(chromeDir, "sounds"));
    fs.copySync(soundsDir, path.join(firefoxDir, "sounds"));
  }

  // 9️⃣ Cleanup temporary folders
  console.log("🧽 Cleaning temporary build artifacts...");
  fs.removeSync(backgroundDistDir);

  for (const item of allItems) {
    fs.removeSync(path.join(distDir, item));
  }

  console.log("\n🎉 Build complete!");
  console.log("📁 dist/chrome");
  console.log("📁 dist/firefox");

  // List what's in each folder
  console.log("\n📂 Chrome folder contains:");
  fs.readdirSync(chromeDir).forEach((file) => console.log(`   - ${file}`));

  console.log("\n📂 Firefox folder contains:");
  fs.readdirSync(firefoxDir).forEach((file) => console.log(`   - ${file}`));
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
