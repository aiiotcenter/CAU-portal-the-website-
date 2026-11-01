const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../client/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Normalize line breaks
html = html.replace(/\r\n/g, '\n');

// 1. Remove .cau-intake-banner
const bannerRegex = /\s*<!-- Live Intake & Scholarship Countdown Banner -->[\s\S]*?<\/div>\s*<\/div>/;
if (bannerRegex.test(html)) {
  html = html.replace(bannerRegex, '');
  console.log('1. Removed .cau-intake-banner (duplicate header)');
} else {
  console.warn('Banner pattern not matched via regex');
}

// 2. Remove third AI button from hero actions
const heroAiBtn = `<button class="hero-video-action hero-video-action--ai" type="button" data-open-cau-chat="true"
            data-prompt="What undergraduate programs and scholarships are available for international students?">
            Ask CAU AI <i class="fa-solid fa-wand-magic-sparkles ms-1" aria-hidden="true"></i>
          </button>`;
if (html.includes(heroAiBtn)) {
  html = html.replace(heroAiBtn, '');
  console.log('2. Removed hero AI button (restored clean 2-button hero)');
} else {
  console.warn('heroAiBtn not found');
}

// 3. Remove .cau-ai-inquiry-strip from Why section
const whyAiRegex = /\s*<div class="cau-ai-inquiry-strip" role="region" aria-label="AI admissions advisory">[\s\S]*?<\/div>\s*<\/div>/;
if (whyAiRegex.test(html)) {
  html = html.replace(whyAiRegex, '');
  console.log('3. Removed .cau-ai-inquiry-strip from Why section');
} else {
  console.warn('.cau-ai-inquiry-strip not found');
}

// 4. Remove #how-to-apply section
const howToApplyRegex = /\s*<!-- How to Apply in 3 Steps Section -->[\s\S]*?<\/section>\s*(?=<section class="split-section section-rule-top testimonial-stage")/;
if (howToApplyRegex.test(html)) {
  html = html.replace(howToApplyRegex, '\n\n    ');
  console.log('4. Removed #how-to-apply section (uncrowded homepage)');
} else {
  console.warn('#how-to-apply regex not matched');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('SUCCESS: client/index.html decluttered successfully!');
