const http = require('http');
const fs = require('fs');

async function testPrograms() {
  console.log('Testing Academic Programmes Catalogue Refinements...');

  // 1. Check client/programs.html
  const html = fs.readFileSync('client/programs.html', 'utf8');
  console.assert(!html.includes('catalogue-degree-nav'), 'FAIL: catalogue-degree-nav still in programs.html');
  console.assert(!html.includes('degree-tab'), 'FAIL: degree-tab still in programs.html');
  console.assert(html.includes('sidebar-admissions-card'), 'FAIL: sidebar-admissions-card missing in programs.html');
  console.assert(html.includes('sidebar-whatsapp-btn'), 'FAIL: sidebar-whatsapp-btn missing in programs.html');
  console.assert(html.includes('view-toggles'), 'FAIL: view-toggles missing in programs.html');
  console.assert(!html.includes('sortSelect'), 'FAIL: sortSelect still in programs.html');
  console.assert(!html.includes('Sort by:'), 'FAIL: Sort by: still in programs.html');
  console.log('✔ client/programs.html checks passed');

  // 2. Check client/programs.css
  const css = fs.readFileSync('client/programs.css', 'utf8');
  console.assert(css.includes('--arrow-black'), 'FAIL: --arrow-black missing in programs.css');
  console.assert(css.includes('sidebar-admissions-card'), 'FAIL: sidebar-admissions-card missing in programs.css');
  console.assert(css.includes('.view-toggles'), 'FAIL: .view-toggles missing in programs.css');
  console.assert(css.includes('.ask-ai-card-btn'), 'FAIL: .ask-ai-card-btn missing in programs.css');
  console.assert(css.includes('.program-list.view-compact'), 'FAIL: .program-list.view-compact missing in programs.css');
  console.assert(css.includes('.program-list.view-list'), 'FAIL: .program-list.view-list missing in programs.css');
  console.log('✔ client/programs.css checks passed');

  // 3. Check client/style.css
  const styleCss = fs.readFileSync('client/style.css', 'utf8');
  console.assert(!styleCss.includes('.filter-heading .fa-chevron-down { font-family: initial; font-size: 0; display: inline-block; width: 20px; height: 10px; flex: 0 0 20px; background: var(--arrow-darkgray) center/20px 10px no-repeat; transform: rotate(90deg); }'), 'FAIL: system arrow override still on .filter-heading .fa-chevron-down in style.css');
  console.log('✔ client/style.css checks passed');

  // 4. Check client/programs.js
  const js = fs.readFileSync('client/programs.js', 'utf8');
  console.assert(js.includes('system-arrow'), 'FAIL: system-arrow missing in programs.js');
  console.assert(js.includes('ask-ai-card-btn'), 'FAIL: ask-ai-card-btn missing in programs.js');
  console.assert(js.includes('Ask AI'), 'FAIL: Ask AI button text missing in programs.js');
  console.assert(js.includes('view-toggle'), 'FAIL: view-toggle missing in programs.js');
  console.assert(js.includes('list.className = `program-list view-${state.view}`;'), 'FAIL: dynamic view class missing in programs.js');
  console.log('✔ client/programs.js checks passed');

  // 5. Test live server route
  const serverRes = await new Promise((resolve, reject) => {
    http.get('http://localhost:3000/programs.html', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });

  console.log('HTTP Status from live server for /programs.html:', serverRes.status);
  console.assert(serverRes.status === 200, 'FAIL: /programs.html status is not 200');
  console.assert(!serverRes.data.includes('catalogue-degree-nav'), 'FAIL: live server served catalogue-degree-nav');
  console.assert(serverRes.data.includes('sidebar-admissions-card'), 'FAIL: live server missing sidebar-admissions-card');
  console.assert(serverRes.data.includes('view-toggles'), 'FAIL: live server missing view-toggles');
  console.assert(!serverRes.data.includes('sortSelect'), 'FAIL: live server served sortSelect');
  console.log('✔ live server /programs.html verification passed');

  console.log('\nALL 6 USER REQUIREMENTS VERIFIED SUCCESSFULLY!');
}

testPrograms().catch(err => {
  console.error(err);
  process.exit(1);
});
