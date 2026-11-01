/* Program details renderer: fills the page from the CAU program catalog using the
   `?program=` query parameter. The static HTML remains the no-JS fallback. */
(function () {
  'use strict';

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const cleanText = (value) =>
    String(value || '')
      .replace(/404\s*-\s*this page couldn't be found\.?/gi, '')
      .replace(/oops! we're sorry, this page couldn't be found!?/gi, '')
      .replace(/search for:?/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

  const studentFacingSummary = (program) => {
    const source = cleanText(program.summary || program['Program Details / Information']);
    const hasCmsNoise = /academic calendar|cau360|stu mail|information system|department message|department overview/i.test(source);
    if (!source || hasCmsNoise) return `${program['Program Name']} is designed for students who want a focused academic route in ${program.Department || 'their chosen field'}, supported by clear programme information and admissions guidance.`;
    return source.length > 360 ? `${source.slice(0, 357).trim()}…` : source;
  };

  const imagePool = {
    'English Preparatory School': '/assets/unsplash-3.jpg',
    Engineering: '/assets/unsplash-2.jpg',
    Health: '/assets/unsplash-9.jpg',
    Business: '/assets/unsplash-1.jpg',
    default: '/assets/unsplash-5.jpg',
  };

  const imageFor = (program) => {
    const dept = String(program.Department || '');
    const match = Object.keys(imagePool).find((key) => key !== 'default' && dept.includes(key));
    return imagePool[match || 'default'];
  };

  const detailsRow = (heading, paragraphs) => {
    const content = paragraphs
      .filter((text) => text && text.length > 1)
      .map((text) => `<p>${escapeHtml(text)}</p>`)
      .join('');
    return `<article class="details-row"><h3>${heading}</h3><div>${content}</div></article>`;
  };

  const render = (program) => {
    const titleEl = document.querySelector('.details-title h1');
    const indexEl = document.querySelector('.details-title .section-index');
    const heroImg = document.querySelector('.details-hero img');
    const heroTitle = document.querySelector('.details-hero h2');
    const rows = document.querySelector('.details-rows');

    const summary = studentFacingSummary(program);
    const tuition = [program.publishedTuition, program.billingBasis && `(${program.billingBasis})`, program.tuitionNotes].filter(Boolean);

    if (titleEl) titleEl.textContent = 'Program details';
    if (indexEl) indexEl.textContent = `${program.category || program.Department || 'PROGRAMME DISCOVERY'} / CAU`;
    if (heroImg) {
      heroImg.src = imageFor(program);
      heroImg.alt = `${program['Program Name']} programme`;
    }
    if (heroTitle) heroTitle.textContent = program['Program Name'];
    if (rows) {
      rows.innerHTML = [
        detailsRow('General<br />information', [
          summary || `${program['Program Name']} is offered by the ${program.Department || 'relevant'} department of Cyprus Aydin University.`,
          `Degree level: ${program['Degree Level']} · ${program.category || 'Programme'}.`,
        ]),
        detailsRow('Program<br />facts', [
          `Duration: ${program.Duration || 'See the university for current duration.'}`,
          `Language of instruction: ${program.Language || 'Not specified on the source page.'}`,
          ...(tuition.length ? [`Tuition: ${tuition.join(' ')}`] : []),
        ]),
        detailsRow('Department', [
          `${program.Department || 'Cyprus Aydin University'}.`,
          'For department-specific academic questions, contact CAU Admissions before applying.',
        ]),
      ].join('');
    }

    const pageTitle = `${program['Program Name']} | Cyprus Aydin University`;
    document.title = pageTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', `${pageTitle} — programme details, tuition and admission information.`);
  };

  const renderNotFound = () => {
    const rows = document.querySelector('.details-rows');
    if (rows) {
      rows.innerHTML = `<article class="details-row"><h3>Not<br />found</h3><div><p>We could not find that programme in the current catalogue. Browse the full programme list to find the right fit.</p></div></article>`;
    }
    const heroTitle = document.querySelector('.details-hero h2');
    if (heroTitle) heroTitle.textContent = 'Programme not found';
  };

  const init = () => {
    const catalog = Array.isArray(window.CAU_PROGRAM_CATALOG) ? window.CAU_PROGRAM_CATALOG : [];
    if (!catalog.length) return;
    const requested = new URLSearchParams(window.location.search).get('program');
    if (!requested) {
      const fallback = catalog.find((program) => program['Program Name'] === 'Software Engineering') || catalog[0];
      if (fallback) render(fallback);
      return;
    }
    const query = decodeURIComponent(requested).trim();
    const program = catalog.find((item) => item['Program Name'] === query || item.slug === query);
    if (program) render(program);
    else renderNotFound();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
