const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLIENT_DIR = path.join(ROOT, 'client');

const htmlFiles = [
  '404.html',
  'about.html',
  'about.html',
  'admission.html',
  'contact.html',
  'faq.html',
  'index.html',
  'international.html',
  'news.html',
  'program-details.html',
  'programs.html',
  'scholarships.html',
  'tuition.html'
];

console.log('=== DECLUTTERING HEADER ACROSS ALL HTML PAGES ===');

const searchRegex = /\s*<button class="cau-search-trigger"[\s\S]*?<\/button>/g;
const themeRegex = /\s*<div class="theme-switch" role="group" aria-label="Color theme">[\s\S]*?<\/div>/g;

for (const filename of htmlFiles) {
  const filePath = path.join(CLIENT_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const originalLen = html.length;

  // Remove search trigger and theme switch
  html = html.replace(searchRegex, '');
  html = html.replace(themeRegex, '');

  if (html.length !== originalLen) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`[DECLUTTERED] ${filename}`);
  } else {
    console.log(`[UNCHANGED] ${filename} (patterns not found)`);
  }
}

console.log('\n=== DECLUTTERING SHARED-FOOTER.JS HEADER INJECTION ===');
const sharedFooterPath = path.join(CLIENT_DIR, 'shared-footer.js');
if (fs.existsSync(sharedFooterPath)) {
  let js = fs.readFileSync(sharedFooterPath, 'utf8');
  
  // Remove search trigger line from headerMarkup
  const searchJsPattern = /\s*<button class="cau-search-trigger" type="button" aria-label="Quick search \(\$\{searchKbd\}\)"[\s\S]*?<\/button>/;
  if (searchJsPattern.test(js)) {
    js = js.replace(searchJsPattern, '');
    console.log('[REMOVED] Search trigger from shared-footer.js headerMarkup');
  }

  // Remove theme switch line from headerMarkup
  const themeJsPattern = /\s*<div class="theme-switch" role="group" aria-label="Color theme"><button type="button" class="theme-mode"[\s\S]*?<\/div>/;
  if (themeJsPattern.test(js)) {
    js = js.replace(themeJsPattern, '');
    console.log('[REMOVED] Theme switch from shared-footer.js headerMarkup');
  }

  fs.writeFileSync(sharedFooterPath, js, 'utf8');
}

console.log('\n=== HEADER DECLUTTER SCRIPT COMPLETED ===');
