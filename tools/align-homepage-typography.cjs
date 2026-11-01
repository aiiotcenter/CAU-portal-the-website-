const fs = require('fs');
const path = require('path');

const stylePath = path.resolve(__dirname, '../client/style.css');
let css = fs.readFileSync(stylePath, 'utf8');

// 1. Truncate Phase 1 enhancements from line index of "PHASE 1 HOMEPAGE ENHANCEMENTS"
const p1Marker = '/* ==============================================================================\n   PHASE 1 HOMEPAGE ENHANCEMENTS: INTAKE BANNER & HOW TO APPLY ROADMAP';
const altP1Marker = 'PHASE 1 HOMEPAGE ENHANCEMENTS';

let cutIndex = css.indexOf(p1Marker);
if (cutIndex === -1) {
  cutIndex = css.indexOf(altP1Marker);
  if (cutIndex !== -1) {
    // Find the start of the comment block
    const commentStart = css.lastIndexOf('/*', cutIndex);
    if (commentStart !== -1) cutIndex = commentStart;
  }
}

if (cutIndex !== -1) {
  css = css.substring(0, cutIndex).trimEnd();
  console.log('Successfully pruned dead Phase 1 & AI inquiry CSS from style.css');
} else {
  console.warn('Could not find Phase 1 marker in style.css');
}

// 2. Align testimonial stage typography within lines 1160-1550
// Update .testimonial-rail .section-kicker
css = css.replace(
  /\.testimonial-rail \.section-kicker\s*\{[^}]+\}/,
  `.testimonial-rail .section-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-family-display);
  font-size: var(--font-kicker);
  font-weight: 700;
  letter-spacing: var(--font-kicker-ls);
  text-transform: uppercase;
  color: var(--cau-coral);
}`
);

// Update .testimonial-heading
css = css.replace(
  /\.testimonial-heading\s*\{[^}]+\}/,
  `.testimonial-heading {
  font-family: var(--font-family-display);
  font-size: var(--font-h2);
  font-weight: 700;
  line-height: var(--font-h2-lh);
  letter-spacing: var(--font-h2-ls);
  text-transform: uppercase;
  color: var(--ink);
  margin: 0;
}`
);

// Update .testimonial-rail-stat .stat-num
css = css.replace(
  /\.testimonial-rail-stat \.stat-num\s*\{[^}]+\}/,
  `.testimonial-rail-stat .stat-num {
  font-family: var(--font-family-display);
  font-size: clamp(1.8rem, 2.4vw, 2.5rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--cau-coral);
}`
);

// Update .testimonial-rail-stat .stat-lbl
css = css.replace(
  /\.testimonial-rail-stat \.stat-lbl\s*\{[^}]+\}/,
  `.testimonial-rail-stat .stat-lbl {
  font-size: var(--font-kicker);
  font-weight: 700;
  line-height: 1.2;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: var(--font-kicker-ls);
}`
);

// Update .testimonial-rail-link
css = css.replace(
  /\.testimonial-rail-link\s*\{[^}]+\}/,
  `.testimonial-rail-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-caption);
  font-weight: 600;
  line-height: var(--font-caption-lh);
  letter-spacing: 0.02em;
  color: var(--ink);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease);
  margin-top: 4px;
}`
);

// Update .testimonial-program-tag
css = css.replace(
  /\.testimonial-program-tag\s*\{[^}]+\}/,
  `.testimonial-program-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: var(--font-kicker);
  font-weight: 700;
  letter-spacing: var(--font-kicker-ls);
  text-transform: uppercase;
  color: var(--cau-coral);
  border: 1px solid var(--cau-coral);
  border-radius: var(--radius-sm);
  background: transparent;
  line-height: 1.2;
}`
);

// Update .testimonial-faculty-tag
css = css.replace(
  /\.testimonial-faculty-tag\s*\{[^}]+\}/,
  `.testimonial-faculty-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: var(--font-kicker);
  font-weight: 600;
  letter-spacing: var(--font-kicker-ls);
  color: var(--muted);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: transparent;
  line-height: 1.2;
}`
);

// Update .testimonial-quote-mark
css = css.replace(
  /\.testimonial-quote-mark\s*\{[^}]+\}/,
  `.testimonial-quote-mark {
  position: absolute;
  left: -4px;
  top: -14px;
  font-family: var(--font-family-display);
  font-size: clamp(2.6rem, 3.8vw, 3.4rem);
  font-weight: 700;
  line-height: 1;
  color: var(--cau-coral);
  opacity: 0.35;
  user-select: none;
  pointer-events: none;
}`
);

// Update .testimonial-quote-text
css = css.replace(
  /\.testimonial-quote-text\s*\{[^}]+\}/,
  `.testimonial-quote-text {
  font-family: var(--font-family-display);
  font-size: clamp(15px, 1.35vw, 19px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin: 0;
}`
);

// Update .testimonial-name
css = css.replace(
  /\.testimonial-name\s*\{[^}]+\}/,
  `.testimonial-name {
  font-family: var(--font-family-display);
  font-size: var(--font-h3);
  font-weight: 700;
  line-height: var(--font-h3-lh);
  letter-spacing: var(--font-h3-ls);
  color: var(--ink);
  margin: 0;
}`
);

// Update .testimonial-student-meta
css = css.replace(
  /\.testimonial-student-meta\s*\{[^}]+\}/,
  `.testimonial-student-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: var(--font-caption);
  line-height: var(--font-caption-lh);
  color: var(--muted);
  margin-top: 4px;
}`
);

// Update .testimonial-highlight-pill
css = css.replace(
  /\.testimonial-highlight-pill\s*\{[^}]+\}/,
  `.testimonial-highlight-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  font-size: var(--font-caption);
  font-weight: 600;
  color: var(--ink);
  padding: 5px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--soft);
}`
);

// Update .testimonial-media-badge
css = css.replace(
  /\.testimonial-media-badge\s*\{[^}]+\}/,
  `.testimonial-media-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: var(--font-kicker);
  font-weight: 600;
  letter-spacing: var(--font-kicker-ls);
  color: #fff;
  background: rgba(19, 19, 19, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-sm);
}`
);

// Update .testimonial-indicator .indicator-label
css = css.replace(
  /\.testimonial-indicator \.indicator-label\s*\{[^}]+\}/,
  `.testimonial-indicator .indicator-label {
  font-family: var(--font-family-display);
  font-size: var(--font-kicker);
  font-weight: 600;
  letter-spacing: var(--font-kicker-ls);
  color: var(--muted);
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease);
}`
);

// 3. Append Master Canonical Homepage Typography & Spacing Scale Enforcement
const canonicalHomepageBlock = `

/* ==============================================================================
   MASTER HOMEPAGE TYPOGRAPHY SCALE & BREATHING ROOM ENFORCEMENT
   Architecture: Swiss Editorial Design System (cau-design-system.css)
   ============================================================================== */

/* 1. Global Section Eyebrows, Kickers & Indexes */
.homepage .section-kicker,
.homepage .hero-video-kicker,
.homepage .section-index {
  font-family: var(--font-family-display) !important;
  font-size: var(--font-kicker) !important;
  font-weight: 700 !important;
  letter-spacing: var(--font-kicker-ls) !important;
  text-transform: uppercase !important;
}

/* 2. Hero Stage Typography */
.homepage .hero-video-title {
  font-family: var(--font-family-display) !important;
  font-size: var(--font-h1) !important;
  font-weight: 700 !important;
  line-height: var(--font-h1-lh) !important;
  letter-spacing: var(--font-h1-ls) !important;
  text-transform: uppercase !important;
}
.homepage .hero-video-copy {
  font-family: var(--font-family-body) !important;
  font-size: var(--font-body) !important;
  line-height: var(--font-body-lh) !important;
  max-width: 510px !important;
}
.homepage .hero-video-action {
  font-family: var(--font-family-display) !important;
  font-size: var(--font-caption) !important;
  line-height: var(--font-caption-lh) !important;
  font-weight: 700 !important;
  border-radius: var(--radius-sm) !important;
}

/* 3. Section Primary Headings (Split Rails) */
.homepage .split-rail h2,
.homepage #whyTitle,
.homepage #program-directory .program-directory-rail h2,
.homepage #testimonialsTitle,
.homepage #news .split-rail h2 {
  font-family: var(--font-family-display) !important;
  font-size: var(--font-h2) !important;
  line-height: var(--font-h2-lh) !important;
  letter-spacing: var(--font-h2-ls) !important;
  text-transform: uppercase !important;
  font-weight: 700 !important;
  margin: 0 0 20px !important;
}

/* 4. Subsection Headings & Card Titles */
.homepage .why-metrics h3,
.homepage #program-directory .program-directory-card h3,
.homepage .testimonial-name,
.homepage .news-card h3 {
  font-family: var(--font-family-display) !important;
  font-size: var(--font-h3) !important;
  line-height: var(--font-h3-lh) !important;
  letter-spacing: var(--font-h3-ls) !important;
  font-weight: 700 !important;
}

/* 5. Editorial Body Copy, Leads & Rail Summaries */
.homepage .lead-copy {
  font-family: var(--font-family-body) !important;
  font-size: var(--font-body) !important;
  line-height: var(--font-body-lh) !important;
  max-width: 700px !important;
  margin-bottom: 28px !important;
}
.homepage .rail-copy {
  font-family: var(--font-family-body) !important;
  font-size: var(--font-body) !important;
  line-height: var(--font-body-lh) !important;
  color: var(--muted) !important;
}

/* 6. Metadata, Labels, Micro-copy */
.homepage .micro-copy,
.homepage #program-directory .program-directory-meta,
.homepage #program-directory .program-directory-status,
.homepage .testimonial-student-meta,
.homepage .news-meta,
.homepage .news-card time {
  font-family: var(--font-family-body) !important;
  font-size: var(--font-caption) !important;
  line-height: var(--font-caption-lh) !important;
}

/* 7. Numbers & Key Metric Callouts */
.homepage .why-metrics-grid strong {
  font-family: var(--font-family-display) !important;
  font-size: clamp(1.8rem, 2.4vw, 2.5rem) !important;
  line-height: 1 !important;
  letter-spacing: -0.04em !important;
}
.homepage .why-metrics-grid span {
  font-family: var(--font-family-display) !important;
  font-size: var(--font-kicker) !important;
  letter-spacing: var(--font-kicker-ls) !important;
  line-height: 1.2 !important;
}

/* 8. Controls, Links & Buttons */
.homepage #program-directory .program-directory-submit,
.homepage #program-directory .program-directory-card a.program-directory-link,
.homepage .testimonial-rail-link {
  font-family: var(--font-family-display) !important;
  font-size: var(--font-caption) !important;
  line-height: var(--font-caption-lh) !important;
}
.homepage .testimonial-count {
  font-family: var(--font-family-display) !important;
  font-size: var(--font-caption) !important;
}

/* 9. Breathing Room & Balanced Stage Spacing */
.homepage .split-section {
  padding-top: clamp(48px, 6vh, 80px) !important;
  padding-bottom: clamp(48px, 6vh, 80px) !important;
}
.homepage .split-rail {
  padding-top: 0 !important;
}
.homepage .split-content {
  padding-top: 0 !important;
}

/* Responsive adjustments for mobile viewports */
@media (max-width: 767.98px) {
  .homepage .hero-video-title {
    font-size: clamp(2.2rem, 8.5vw, 3.2rem) !important;
  }
  .homepage .split-rail h2,
  .homepage #whyTitle,
  .homepage #program-directory .program-directory-rail h2,
  .homepage #testimonialsTitle,
  .homepage #news .split-rail h2 {
    font-size: clamp(1.8rem, 6.5vw, 2.4rem) !important;
  }
  .homepage .split-section {
    padding-top: 40px !important;
    padding-bottom: 40px !important;
  }
}
`;

css += canonicalHomepageBlock;

fs.writeFileSync(stylePath, css, 'utf8');
console.log('Successfully written updated style.css');
