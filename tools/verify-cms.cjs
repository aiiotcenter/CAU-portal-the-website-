const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });
    req.on('error', (err) => reject(err));
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

// Wrap payload in superjson envelope for tRPC
function trpcPost(data) {
  return JSON.stringify({ json: data });
}

async function runVerification() {
  console.log('🚀 Starting CAU CMS Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? '- ' + details : ''}`);
      failed++;
    }
  }

  try {
    // 1. Check /dashboard route
    console.log('--- 1. Testing Route Interception ---');
    const dashRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/dashboard',
      method: 'GET',
    });
    assert(
      'GET /dashboard returns HTTP 200',
      dashRes.statusCode === 200,
      `Received ${dashRes.statusCode}`
    );
    assert(
      'GET /dashboard contains #root element',
      dashRes.body.includes('id="root"'),
      'Missing #root container'
    );
    assert(
      'GET /dashboard includes Space Grotesk font',
      dashRes.body.includes('Space+Grotesk'),
      'Missing font link'
    );

    // 2. Check tRPC cms.stats
    console.log('\n--- 2. Testing tRPC cms.stats ---');
    const statsRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/trpc/cms.stats',
      method: 'GET',
    });
    assert(
      'GET /api/trpc/cms.stats returns HTTP 200',
      statsRes.statusCode === 200,
      `Received ${statsRes.statusCode}`
    );
    const statsJson = JSON.parse(statsRes.body);
    const statsData = statsJson.result?.data?.json || statsJson.result?.data;
    assert(
      'Stats has totalPrograms > 40',
      statsData?.totalPrograms >= 40,
      `Total programs: ${statsData?.totalPrograms}`
    );
    assert(
      'Stats has totalFaculties === 7',
      statsData?.totalFaculties === 7,
      `Faculties: ${statsData?.totalFaculties}`
    );
    assert(
      'Stats has degree breakdown',
      statsData?.degreeCounts && statsData.degreeCounts.Bachelor > 0,
      JSON.stringify(statsData?.degreeCounts)
    );

    // 3. Check tRPC cms.programs.list
    console.log('\n--- 3. Testing tRPC cms.programs.list ---');
    const progRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/trpc/cms.programs.list',
      method: 'GET',
    });
    assert(
      'GET /api/trpc/cms.programs.list returns HTTP 200',
      progRes.statusCode === 200,
      `Received ${progRes.statusCode}`
    );
    const progJson = JSON.parse(progRes.body);
    const progList = progJson.result?.data?.json || progJson.result?.data;
    assert(
      'Programmes array has items',
      Array.isArray(progList) && progList.length >= 40,
      `Count: ${progList?.length}`
    );

    // Check dentistry exists
    const dent = progList.find((p) => p.slug?.includes('dent') || p['Program Name']?.toLowerCase().includes('dentistry'));
    assert('Dentistry program exists in catalog', Boolean(dent), dent ? dent['Program Name'] : 'Not found');

    // 4. Check tRPC cms.faculties.list
    console.log('\n--- 4. Testing tRPC cms.faculties.list ---');
    const facRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/trpc/cms.faculties.list',
      method: 'GET',
    });
    assert(
      'GET /api/trpc/cms.faculties.list returns HTTP 200',
      facRes.statusCode === 200,
      `Received ${facRes.statusCode}`
    );
    const facJson = JSON.parse(facRes.body);
    const facList = facJson.result?.data?.json || facJson.result?.data;
    assert('Faculties list returns 7 faculties', facList?.length === 7, `Count: ${facList?.length}`);

    // 5. Check tRPC cms.news.list
    console.log('\n--- 5. Testing tRPC cms.news.list ---');
    const newsRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/trpc/cms.news.list',
      method: 'GET',
    });
    assert(
      'GET /api/trpc/cms.news.list returns HTTP 200',
      newsRes.statusCode === 200,
      `Received ${newsRes.statusCode}`
    );
    const newsJson = JSON.parse(newsRes.body);
    const newsList = newsJson.result?.data?.json || newsJson.result?.data;
    assert('News list returns articles', Array.isArray(newsList) && newsList.length > 0, `Count: ${newsList?.length}`);

    // 6. Check tRPC cms.leads.list
    console.log('\n--- 6. Testing tRPC cms.leads.list ---');
    const leadsRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/trpc/cms.leads.list',
      method: 'GET',
    });
    assert(
      'GET /api/trpc/cms.leads.list returns HTTP 200',
      leadsRes.statusCode === 200,
      `Received ${leadsRes.statusCode}`
    );
    const leadsJson = JSON.parse(leadsRes.body);
    const leadsList = leadsJson.result?.data?.json || leadsJson.result?.data;
    assert('Leads list returns entries', Array.isArray(leadsList) && leadsList.length > 0, `Count: ${leadsList?.length}`);

    // 7. Check tRPC cms.settings.get
    console.log('\n--- 7. Testing tRPC cms.settings.get ---');
    const setRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/trpc/cms.settings.get',
      method: 'GET',
    });
    assert(
      'GET /api/trpc/cms.settings.get returns HTTP 200',
      setRes.statusCode === 200,
      `Received ${setRes.statusCode}`
    );
    const setJson = JSON.parse(setRes.body);
    const setData = setJson.result?.data?.json || setJson.result?.data;
    assert('Settings has official WhatsApp number', Boolean(setData?.contact?.officialWhatsApp), setData?.contact?.officialWhatsApp);
    assert('Settings has announcement banner', typeof setData?.announcementBanner?.enabled === 'boolean', setData?.announcementBanner?.text);

    // 8. Test Auth Mutation with superjson payload
    console.log('\n--- 8. Testing tRPC cms.auth.login ---');
    const authData = trpcPost({ passkey: 'cau-admin-2026' });
    const authRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/trpc/cms.auth.login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(authData),
        },
      },
      authData
    );
    assert(
      'POST /api/trpc/cms.auth.login returns HTTP 200',
      authRes.statusCode === 200,
      `Received ${authRes.statusCode}: ${authRes.body}`
    );
    const authJson = JSON.parse(authRes.body);
    const authResult = authJson.result?.data?.json || authJson.result?.data;
    assert('Login with cau-admin-2026 succeeds', authResult?.success === true, JSON.stringify(authResult));

    // 9. Test Program Upsert & Delete CRUD Cycle
    console.log('\n--- 9. Testing Programme CRUD Lifecycle ---');
    const testProgram = {
      'Program Name': 'Test Artificial Intelligence BSc',
      Department: 'Faculty of Engineering',
      'Degree Level': 'Bachelor',
      Duration: '4 Years',
      'Price / Tuition': '$3,500 / Year',
      Language: 'English',
      slug: 'test-ai-bsc',
      summary: 'Experimental AI curriculum for verification',
      category: 'undergraduate',
      status: 'draft',
    };
    const upsertData = trpcPost(testProgram);
    const upsertRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/trpc/cms.programs.upsert',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(upsertData),
        },
      },
      upsertData
    );
    assert(
      'POST /api/trpc/cms.programs.upsert returns HTTP 200',
      upsertRes.statusCode === 200,
      `Received ${upsertRes.statusCode}: ${upsertRes.body}`
    );

    // Clean up test program
    const deleteData = trpcPost({ slug: 'test-ai-bsc' });
    const deleteRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/trpc/cms.programs.delete',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(deleteData),
        },
      },
      deleteData
    );
    assert(
      'POST /api/trpc/cms.programs.delete returns HTTP 200',
      deleteRes.statusCode === 200,
      `Received ${deleteRes.statusCode}: ${deleteRes.body}`
    );

    console.log(`\n========================================`);
    console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runVerification();
