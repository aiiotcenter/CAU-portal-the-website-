const assert = require('assert');

async function testMultiTurn() {
  console.log('=== TESTING MULTI-TURN CONVERSATION WITH MULTI-MODEL CASCADE ===\n');
  const history = [];

  const questions = [
    'is there any football team',
    'what other sports can I join',
    'how much is tuition for bachelor programs',
    'can you teach me how to cook pasta'
  ];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`[Turn ${i + 1}] User asking: "${q}" (history turns: ${history.length})`);
    const res = await fetch('http://localhost:3000/api/trpc/assistant.ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        json: {
          question: q,
          history: history.slice(-6)
        }
      })
    });
    console.log('HTTP status:', res.status);
    const data = await res.json();
    const answer = data?.result?.data?.json?.answer || '';
    console.log('Assistant mode:', data?.result?.data?.json?.mode);
    console.log('Assistant Answer:\n', answer.slice(0, 220), '...\n');
    
    assert(answer.length > 20, 'Answer was empty or too short');
    if (i === 3) {
      assert(/cannot|specialize exclusively|only assist|dedicated exclusively/i.test(answer), 'Out-of-context query was not declined');
    }
    
    history.push({ role: 'user', content: q });
    history.push({ role: 'assistant', content: answer });
  }
  console.log('=== MULTI-TURN CONVERSATION TEST COMPLETED 100% SUCCESSFULLY! ===');
}

testMultiTurn().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
