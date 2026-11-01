const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, '../client/public/programs.js');
let code = fs.readFileSync(srcPath, 'utf8');

// 1. Clean buildCard function: Remove index overlay and per-card WhatsApp / Ask AI action buttons
const oldBuildCardRegex = /const buildCard = \(program, index\) => \{[\s\S]*?return `\s*<article class="program-card">[\s\S]*?<\/article>\s*`;\s*\};/;

const newBuildCard = `const buildCard = (program, index) => {
    const img = imageFor(program);
    const slug = program.slug || program['Program Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tuition = getTuitionInfo(program);
    const ects = getEcts(program);
    const lang = getLanguageDisplay(program);
    const desc = cleanDescription(program);
    const link = \`/programs/\${encodeURIComponent(slug)}.html\`;

    return \`
<article class="program-card">
  <div class="program-card-visual">
    <img src="\${img.src}" alt="\${escapeHtml(img.alt)}" loading="lazy" />
    <span class="program-card-degree-badge">\${escapeHtml(program['Degree Level'])}</span>
  </div>

  <div class="program-card-body">
    <p class="program-card-faculty">\${escapeHtml(program.Department)}</p>
    <h3 class="program-card-title">
      <a href="\${link}">\${escapeHtml(program['Program Name'])}</a>
    </h3>
    <p class="program-card-desc">\${escapeHtml(desc)}</p>

    <div class="program-card-tags">
      <span class="program-tag"><i class="fa-solid fa-earth-americas"></i> \${lang}</span>
      <span class="program-tag"><i class="fa-solid fa-clock"></i> \${escapeHtml(program.Duration || '4 Years')}</span>
      <span class="program-tag"><i class="fa-solid fa-graduation-cap"></i> \${ects}</span>
    </div>

    <div class="program-card-tuition-box">
      <span class="tuition-amount">\${tuition.amount}</span>
      <span class="scholarship-badge">\${tuition.scholarship}</span>
    </div>
  </div>

  <div class="program-card-footer">
    <a href="\${link}" class="program-explore-link">
      <span>Explore Programme</span>
      <i class="fa-solid fa-arrow-right ms-2" aria-hidden="true"></i>
    </a>
  </div>
</article>
\`;
  };`;

if (!oldBuildCardRegex.test(code)) {
  console.error("Could not find buildCard regex in programs.js");
  process.exit(1);
}

code = code.replace(oldBuildCardRegex, newBuildCard);

// Ensure render always uses view-grid
code = code.replace(
  'list.className = `program-list view-${state.view}`;',
  'list.className = "program-list view-grid";'
);

const destPath = path.resolve(__dirname, '../client/programs.js');
fs.writeFileSync(destPath, code, 'utf8');
console.log('Successfully wrote client/programs.js');
