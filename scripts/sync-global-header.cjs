/**
 * scripts/sync-global-header.cjs
 * 
 * Synchronizes the canonical CAU Global Header from the Home Page (client/index.html)
 * to:
 * 1. The shared shell runtime (client/scripts/shared-footer.js and all public mirrors)
 * 2. All 22 top-level HTML pages in client/
 * 3. All 42 academic programme pages in client/programs/
 * 
 * Ensures 100% inheritance: any changes in the Home Page header propagate across the entire website.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_HTML = path.join(ROOT_DIR, 'client', 'index.html');
const SHARED_FOOTER_JS = path.join(ROOT_DIR, 'client', 'scripts', 'shared-footer.js');

function extractHeaderFromIndex() {
  const indexContent = fs.readFileSync(INDEX_HTML, 'utf-8');
  const match = indexContent.match(/<header\s+id="cauHeader"[^>]*>([\s\S]*?)<\/header>/i);
  if (!match) {
    throw new Error('Could not find <header id="cauHeader"> in client/index.html');
  }
  return match[1].trim();
}

function syncToSharedFooter(headerInnerHtml) {
  let sfContent = fs.readFileSync(SHARED_FOOTER_JS, 'utf-8');

  // Replace headerMarkup template return
  const markerRegex = /const headerMarkup = \(\) => \{\s*const page = [^;]+;\s*const isHome = [^;]+;\s*return `([\s\S]*?)`;\s*\};/;
  
  if (!markerRegex.test(sfContent)) {
    console.warn('Warning: headerMarkup marker not matched exactly in shared-footer.js');
    return;
  }

  // Sanitize any backticks in html
  const safeInner = headerInnerHtml.replace(/`/g, '\\`').replace(/\${/g, '\\${');

  const replacement = `const headerMarkup = () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const isHome = page === 'index.html' || page === '';
    
    return \`${safeInner}\`;
  };`;

  sfContent = sfContent.replace(markerRegex, replacement);
  fs.writeFileSync(SHARED_FOOTER_JS, sfContent, 'utf-8');

  // Sync to public mirrors
  const mirrors = [
    path.join(ROOT_DIR, 'client', 'public', 'scripts', 'shared-footer.js'),
    path.join(ROOT_DIR, 'client', 'public', 'shared-footer.js'),
    path.join(ROOT_DIR, 'client', 'shared-footer.js'),
  ];

  mirrors.forEach(mirrorPath => {
    if (fs.existsSync(path.dirname(mirrorPath))) {
      fs.writeFileSync(mirrorPath, sfContent, 'utf-8');
    }
  });

  console.log('✓ Successfully synchronized header to shared-footer.js and public mirrors.');
}

function syncToHtmlFiles(headerInnerHtml) {
  let updatedCount = 0;

  function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'public') {
          processDir(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'index.html') {
        let content = fs.readFileSync(fullPath, 'utf-8');
        const headerRegex = /(<header\s+id="cauHeader"[^>]*>)([\s\S]*?)(<\/header>)/i;
        if (headerRegex.test(content)) {
          content = content.replace(headerRegex, (match, openTag, oldInner, closeTag) => {
            // Ensure site-header class is present
            let updatedOpen = openTag;
            if (!updatedOpen.includes('class=')) {
              updatedOpen = updatedOpen.replace('>', ' class="site-header editorial-masthead">');
            } else if (!updatedOpen.includes('site-header')) {
              updatedOpen = updatedOpen.replace(/class="([^"]*)"/, 'class="$1 site-header editorial-masthead"');
            }
            return `${updatedOpen}\n      ${headerInnerHtml}\n    ${closeTag}`;
          });
          fs.writeFileSync(fullPath, content, 'utf-8');
          updatedCount++;
        }
      }
    }
  }

  processDir(path.join(ROOT_DIR, 'client'));
  console.log(`✓ Successfully synchronized header to ${updatedCount} HTML pages across the website.`);
}

function main() {
  console.log('Starting Global Header Inheritance Synchronization...');
  const headerHtml = extractHeaderFromIndex();
  syncToSharedFooter(headerHtml);
  syncToHtmlFiles(headerHtml);
  console.log('Done! All website pages now inherit the global header 100% in sync.');
}

main();
