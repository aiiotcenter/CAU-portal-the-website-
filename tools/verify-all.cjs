const http = require('http');
const fs = require('fs');

async function testAll() {
  console.log('Running final verification...');

  // 1. Verify index.html content
  const indexHtml = fs.readFileSync('client/index.html', 'utf8');
  console.assert(!indexHtml.includes('Explore programs'), 'FAIL: Explore programs still in hero');
  console.assert(!indexHtml.includes('CAU FILM / 01'), 'FAIL: CAU FILM / 01 still in hero');
  console.assert(!indexHtml.includes('Discover CAU'), 'FAIL: Discover CAU still in hero');
  console.assert(!indexHtml.includes('KYRENIA, TRNC'), 'FAIL: KYRENIA, TRNC still in index.html');
  console.assert(indexHtml.includes('why-film-action'), 'FAIL: why-film-action missing in Why section');
  console.assert(indexHtml.includes('Watch CAU film'), 'FAIL: Watch CAU film missing');

  // 2. Verify ai-chat.js
  const aiChat = fs.readFileSync('client/ai-chat.js', 'utf8');
  console.assert(aiChat.includes('border-radius: var(--radius, 4px) !important;'), 'FAIL: chat toggle radius');
  console.assert(aiChat.includes('background: #22c55e !important;'), 'FAIL: chat pulse green');

  // 3. Verify style.css
  const styleCss = fs.readFileSync('client/style.css', 'utf8');
  console.assert(styleCss.includes('--phi: 1.618;'), 'FAIL: --phi missing');
  console.assert(styleCss.includes('--phi-2xl: 68px;'), 'FAIL: --phi-2xl missing');
  console.assert(styleCss.includes('min-height: 100vh;'), 'FAIL: min-height 100vh missing');
  console.assert(styleCss.includes('margin: 0 0 var(--phi-xs) 0;'), 'FAIL: hero title spacing');

  // 4. Verify shared-footer.js
  const footerJs = fs.readFileSync('client/shared-footer.js', 'utf8');
  console.assert(footerJs.includes('cau-overlay-search-btn'), 'FAIL: overlay search button missing');
  console.assert(!footerJs.includes('delta < -1'), 'FAIL: scroll up reveal still present in footer');

  // 5. Verify live server response
  const responseData = await new Promise((resolve, reject) => {
    http.get('http://localhost:3000/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });

  console.log('HTTP Status from live server:', responseData.status);
  console.assert(responseData.status === 200, 'FAIL: server status');
  console.assert(!responseData.data.includes('KYRENIA, TRNC'), 'FAIL: KYRENIA, TRNC served');
  console.assert(!responseData.data.includes('Explore programs'), 'FAIL: Explore programs served');
  console.assert(responseData.data.includes('Watch CAU film'), 'FAIL: Watch CAU film served');

  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

testAll().catch(err => {
  console.error(err);
  process.exit(1);
});
