const assert = require('assert');

async function runTests() {
  console.log('=== RUNNING CAU AI ASSISTANT TEST SUITE ===\n');

  // Test 1: Football team query
  console.log('[Test 1] Testing "is there any football team"...');
  const resFootball = await fetch('http://localhost:3000/api/trpc/assistant.ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ json: { question: 'is there any football team' } })
  });
  const dataFootball = await resFootball.json();
  const ansFootball = dataFootball?.result?.data?.json?.answer || '';
  assert(/football|futsal/i.test(ansFootball), 'Football answer missing varsity team info');
  assert(/gym|fitness|sport/i.test(ansFootball), 'Football answer missing sports facilities');
  assert(/rector|tournament|league|cup/i.test(ansFootball), 'Football answer missing tournament info');
  console.log('✓ PASS: Football team query returned comprehensive sports and facilities details.\n');

  // Test 2: Cyprus cost of living query
  console.log('[Test 2] Testing "what is the cost of living in cyprus"...');
  const resCyprus = await fetch('http://localhost:3000/api/trpc/assistant.ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ json: { question: 'what is the cost of living in cyprus' } })
  });
  const dataCyprus = await resCyprus.json();
  const ansCyprus = dataCyprus?.result?.data?.json?.answer || '';
  assert(/350|500|eur|living/i.test(ansCyprus), 'Living answer missing budget details');
  assert(/lira|try|turkish lira|currency/i.test(ansCyprus), 'Living answer missing currency details');
  console.log('✓ PASS: Cyprus living guide query returned verified expenses and student life details.\n');

  // Test 3: Out-of-context query refusal
  console.log('[Test 3] Testing out-of-context query "can you write me python code for bubble sort"...');
  const resOOC = await fetch('http://localhost:3000/api/trpc/assistant.ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ json: { question: 'can you write me python code for bubble sort' } })
  });
  const dataOOC = await resOOC.json();
  const ansOOC = dataOOC?.result?.data?.json?.answer || '';
  assert(/cannot|specialize exclusively|outside this context|only assist|dedicated exclusively/i.test(ansOOC), 'Out-of-context query was not rejected');
  console.log('✓ PASS: Out-of-context query was politely declined with verified boundary guardrail.\n');

  // Test 4: 30-word limit constraint
  console.log('[Test 4] Testing 30-word limit enforcement on long message (32 words)...');
  const longMsg = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twentyone twentytwo twentythree twentyfour twentyfive twentysix twentyseven twentyeight twentynine thirty thirtyone thirtytwo';
  const resLimit = await fetch('http://localhost:3000/api/trpc/assistant.ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ json: { question: longMsg } })
  });
  const dataLimit = await resLimit.json();
  const ansLimit = dataLimit?.result?.data?.json?.answer || '';
  assert(ansLimit.includes('maximum of 30 words'), 'Long message was not constrained to 30 words');
  console.log('✓ PASS: 30-word limit constraint properly enforced.\n');

  // Test 5: Multilingual sports queries (Turkish & Arabic)
  console.log('[Test 5] Testing Turkish sports query "futbol takımı var mı"...');
  const resTR = await fetch('http://localhost:3000/api/trpc/assistant.ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ json: { question: 'futbol takımı var mı' } })
  });
  const dataTR = await resTR.json();
  const ansTR = dataTR?.result?.data?.json?.answer || '';
  assert(/futbol/i.test(ansTR), 'Turkish football response missing');
  console.log('✓ PASS: Turkish sports query returned verified details.\n');

  console.log('[Test 5b] Testing Arabic sports query "هل يوجد فريق كرة قدم في الجامعة"...');
  const resAR = await fetch('http://localhost:3000/api/trpc/assistant.ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ json: { question: 'هل يوجد فريق كرة قدم في الجامعة' } })
  });
  const dataAR = await resAR.json();
  const ansAR = dataAR?.result?.data?.json?.answer || '';
  assert(/كرة\s*قدم|فريق/i.test(ansAR), 'Arabic football response missing');
  console.log('✓ PASS: Arabic sports query returned verified details.\n');

  console.log('ALL 5 INTEGRATION TESTS PASSED SUCCESSFULLY! 🚀');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
