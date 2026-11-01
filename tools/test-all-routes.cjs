const http = require('http');

const routes = [
  '/',
  '/tuition.html',
  '/programs.html',
  '/scholarships.html',
  '/about.html',
  '/admission.html',
  '/news.html',
  '/contact.html',
  '/faq.html'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasSearch = data.includes('cau-search-trigger');
        const hasTheme = data.includes('theme-switch');
        console.log(`Route [${route.padEnd(20)}] -> Status: ${res.statusCode} | Search: ${hasSearch ? 'FOUND' : 'CLEAN'} | Theme: ${hasTheme ? 'FOUND' : 'CLEAN'}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Route [${route}] failed:`, err.message);
      resolve();
    });
  });
}

(async () => {
  for (const r of routes) {
    await checkRoute(r);
  }
})();
