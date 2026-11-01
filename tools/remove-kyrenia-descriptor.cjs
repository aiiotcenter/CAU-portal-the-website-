const fs = require('fs');
const path = require('path');

const CLIENT_DIR = path.resolve(__dirname, '../client');
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

const descriptorRegex = /\s*<p class="header-descriptor">KYRENIA, TRNC<\/p>/g;

console.log('=== REMOVING KYRENIA, TRNC FROM HEADERS ===');

for (const f of htmlFiles) {
  const filePath = path.join(CLIENT_DIR, f);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');
  if (descriptorRegex.test(html)) {
    html = html.replace(descriptorRegex, '');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`[REMOVED] KYRENIA, TRNC from ${f}`);
  } else {
    console.log(`[NOT FOUND / CLEAN] ${f}`);
  }
}

console.log('=== REMOVAL COMPLETED ===');
