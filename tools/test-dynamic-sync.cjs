const fs = require('fs');

console.log('Testing dynamic sync across public website...\n');

// 1. Check programs
const progs = JSON.parse(fs.readFileSync('client/public/program-catalog.json', 'utf8'));
const aiProg = progs.find(p => p['Program Name'] === 'AI');
console.log('1. AI program in catalog:', Boolean(aiProg), aiProg ? { name: aiProg['Program Name'], dept: aiProg.Department, status: aiProg.status } : null);

// 2. Check news
const news = JSON.parse(fs.readFileSync('client/public/news.json', 'utf8'));
const hNews = news.find(n => n.title === 'hhhhhhh');
console.log('2. hhhhhhh news in news.json:', Boolean(hNews), hNews ? { title: hNews.title, status: hNews.status, cat: hNews.category } : null);

// 3. Check programs.js has cache buster and AI priority
const progsJs = fs.readFileSync('client/public/programs.js', 'utf8');
console.log('3. programs.js has ?t= cache-buster:', progsJs.includes('program-catalog.json?t='));
console.log('   programs.js has AI priority:', progsJs.includes("n.includes('ai')"));

// 4. Check script.js has loadDynamicNews
const scriptJs = fs.readFileSync('client/public/script.js', 'utf8');
console.log('4. script.js has loadDynamicNews:', scriptJs.includes('loadDynamicNews'));
console.log('   script.js has news.json?t= fetch:', scriptJs.includes('news.json?t='));
console.log('   script.js has program-catalog.json?t= fetch:', scriptJs.includes('program-catalog.json?t='));
