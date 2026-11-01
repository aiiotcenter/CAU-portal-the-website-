const fs = require('fs');
const path = require('path');

const filesToSync = [
  'cau-design-system.css',
  'cau-interactions.js',
  'index.html',
  'programs.html',
  'programs.css',
  'programs.js',
  'tuition.html',
  'tuition.css',
  'admission.html',
  'admission.css',
  'about.html',
  'about-cau.css',
  'international.html',
  'international.css',
  'about.html',
  'contact.html',
  'about.css',
  'about.js',
  'faq.html',
  'faq.css',
  'faq.js',
  '404.html',
  '404.css',
  'departments.html',
  'departments.css',
  'scholarships.html',
  'scholarships.css',
  'script.js',
  'shared-footer.js',
  'ai-chat.js',
  'cau-navigation-theme.css',
  'cau-responsive.css',
  'cau-hero-blend.css',
  'style.css',
  'news.html',
  'news.css',
  'program-details.html',
  'program-details.css',
  'news-details.html',
  'news-details.css',
  'news-details.js',
  'dashboard.html'
];

const sourceDir = path.resolve(__dirname, 'client');
const targetDirs = [
  path.resolve(__dirname, 'dist/public')
];

function copyDirRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Synced ${path.relative(__dirname, destPath)}`);
    }
  }
}

console.log('=== SYNCING CLIENT FILES & DIRECTORIES ===');
for (const file of filesToSync) {
  const srcPath = path.join(sourceDir, file);
  if (!fs.existsSync(srcPath)) {
    console.error(`Source file missing: ${srcPath}`);
    continue;
  }
  const content = fs.readFileSync(srcPath, 'utf8');

  for (const targetDir of targetDirs) {
    if (fs.existsSync(targetDir)) {
      const destPath = path.join(targetDir, file);
      fs.writeFileSync(destPath, content, 'utf8');
      console.log(`Synced ${file} -> ${path.relative(__dirname, destPath)}`);
    } else {
      console.warn(`Target dir does not exist: ${targetDir}`);
    }
  }
}

// Sync modular styles and scripts directories
const subDirsToSync = ['styles', 'scripts'];
for (const subDir of subDirsToSync) {
  const srcSubDir = path.join(sourceDir, subDir);
  if (fs.existsSync(srcSubDir)) {
    for (const targetDir of targetDirs) {
      if (fs.existsSync(targetDir)) {
        const destSubDir = path.join(targetDir, subDir);
        copyDirRecursiveSync(srcSubDir, destSubDir);
      }
    }
  }
}

console.log('\n=== AUDITING FOR TRANSPARENCY FILLS & DESIGN SYSTEM TOKENS ===');
let errors = 0;

// Audit CSS files for transparency fills, green colors, radius, and typography
const cssFiles = [
  'international.css',
  'about.css',
  'faq.css',
  '404.css',
  'programs.css',
  'tuition.css',
  'admission.css',
  'scholarships.css'
];

for (const cssFile of cssFiles) {
  const content = fs.readFileSync(path.join(sourceDir, cssFile), 'utf8');

  // Check for transparency / tint fills
  const transparencyMatches = content.match(/background.*(rgba\(240|#fdf2f0|#eff6ff|#fef2f2|#f8fafc|#f1f5f9|#e2e8f0)/gi);
  if (transparencyMatches) {
    console.error(`ERROR: ${cssFile} contains prohibited transparency fills:`, transparencyMatches);
    errors++;
  } else {
    console.log(`PASS: ${cssFile} has 0 transparency / tinted fill boxes.`);
  }

  // Check for green
  if (/#15803d|#16a34a|#22c55e|#10b981|#059669/i.test(content)) {
    console.error(`ERROR: ${cssFile} contains prohibited green color!`);
    errors++;
  } else {
    console.log(`PASS: ${cssFile} contains no prohibited green colors.`);
  }

  // Check for radius tokens
  if (content.includes('var(--radius') || content.includes('border-radius: 6px') || content.includes('border-radius: 4px')) {
    console.log(`PASS: ${cssFile} utilizes standardized radius tokens.`);
  } else {
    console.error(`ERROR: ${cssFile} does not use standardized radius!`);
    errors++;
  }
}

// Audit HTML files
const htmlFiles = ['international.html', 'about.html', 'contact.html', 'faq.html', '404.html', 'scholarships.html'];
for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(path.join(sourceDir, htmlFile), 'utf8');
  if (!content.includes('style.css')) {
    console.error(`ERROR: ${htmlFile} missing style.css link!`);
    errors++;
  } else {
    console.log(`PASS: ${htmlFile} includes style.css.`);
  }
}

console.log(`\nAudit complete with ${errors} critical errors.`);
process.exit(errors > 0 ? 1 : 0);
