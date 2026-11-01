const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Total Response Bytes:', data.length);
    console.log('Contains cau-search-trigger in header:', data.includes('cau-search-trigger'));
    console.log('Contains theme-switch in header:', data.includes('theme-switch'));
    
    const headerActionsMatch = data.match(/<div class="header-actions">[\s\S]*?<\/div>/);
    if (headerActionsMatch) {
      console.log('\n--- Actual Served Header Actions ---');
      console.log(headerActionsMatch[0]);
    }
  });
}).on('error', (err) => {
  console.error('Server error:', err.message);
});
