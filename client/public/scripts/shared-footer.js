/* Shared CAU shell: theme system, shared stylesheets, masthead + footer mounting. */
(() => {
  if (!document.querySelector('link[data-cau-navigation-theme]') && !document.querySelector('link[href*="cau-navigation-theme.css"]')) {
    const navigationTheme = document.createElement('link');
    navigationTheme.rel = 'stylesheet';
    navigationTheme.href = '/styles/cau-navigation-theme.css';
    navigationTheme.dataset.cauNavigationTheme = 'true';
    document.head.appendChild(navigationTheme);
  }
  if (!document.querySelector('link[data-cau-responsive]') && !document.querySelector('link[href*="cau-responsive.css"]')) {
    const responsive = document.createElement('link');
    responsive.rel = 'stylesheet';
    responsive.href = '/styles/cau-responsive.css';
    responsive.dataset.cauResponsive = 'true';
    document.head.appendChild(responsive);
  }
  if (!document.querySelector('link[data-cau-footer-css]')) {
    const footerTheme = document.createElement('link');
    footerTheme.rel = 'stylesheet';
    footerTheme.href = '/styles/footer.css';
    footerTheme.dataset.cauFooterCss = 'true';
    document.head.appendChild(footerTheme);
  }
  if (!document.querySelector('link[data-cau-hero-css]') && !document.querySelector('link[href*="cau-awwwards-hero.css"]')) {
    const heroTheme = document.createElement('link');
    heroTheme.rel = 'stylesheet';
    heroTheme.href = '/styles/cau-awwwards-hero.css';
    heroTheme.dataset.cauHeroCss = 'true';
    document.head.appendChild(heroTheme);
  }


  const themeStorageKey = 'cau-theme';
  const normaliseTheme = (value) => value === 'dark' ? 'dark' : 'light';
  const applyTheme = (value, persist = true) => {
    const theme = normaliseTheme(value);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if (persist) {
      try {
        localStorage.setItem(themeStorageKey, theme);
      } catch { /* Storage can be unavailable in strict privacy contexts. */ }
    }
    document.querySelectorAll('[data-theme-mode]').forEach((button) => {
      const active = button.dataset.themeMode === theme;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    window.dispatchEvent(new CustomEvent('cau-theme-change', { detail: { theme } }));
  };
  window.CAU_SET_THEME = applyTheme;
  try {
    applyTheme(localStorage.getItem(themeStorageKey), false);
  } catch {
    applyTheme('light', false);
  }

  const socialLinks = [
    ['Facebook', 'https://www.facebook.com/CAUint'],
    ['X', 'https://x.com/caucampus'],
    ['YouTube', 'https://www.youtube.com/@CyprusAydinUniversity'],
    ['LinkedIn', 'https://www.linkedin.com/school/cyprusaydinuniversity/posts/'],
    ['Instagram', 'https://www.instagram.com/cauint/'],
  ];
  const socialIconsMarkup = socialLinks.map(([label, url]) =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer" class="social-pill" aria-label="${label}">${label}</a>`
  ).join('');
  const socialPillsMarkup = socialIconsMarkup;

  const isMac = typeof navigator !== 'undefined' && (/Mac|iPod|iPhone|iPad/.test(navigator.platform) || /Macintosh|MacIntel/.test(navigator.userAgent));
  const searchKbd = isMac ? '⌘K' : 'Ctrl+K';

  const languagePickerMarkup = `<label class="language-picker"><span class="visually-hidden">Language</span><select class="language-select" aria-label="Select language"><option value="en">EN</option><option value="ar">العربية</option><option value="ru">RU</option><option value="fr">FR</option><option value="fa">فارسی</option></select></label>`;

  const headerMarkup = () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const isHome = page === 'index.html' || page === '';
    
    return `<div class="cau-header-inner">
      <div class="cau-header-container">
        <!-- Site Brand Logo (Official CAU Seal & Wordmark) -->
        <a href="/" class="cau-header-logo" aria-label="Cyprus Aydin University">
          <img src="/assets/cau-official-logo.png" class="brand-full-logo" alt="Cyprus Aydin University" decoding="async">
        </a>

        <nav class="cau-header-nav" aria-label="Main menu">
          <ul class="cau-header-nav__list">
            <li class="cau-header-nav__item has-dropdown">
              <span class="cau-header-nav__link" id="exploreTrigger" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">
                Explore <i class="fa-solid fa-chevron-down ms-1" aria-hidden="true"></i>
              </span>

              <!-- Explore Mega Dropdown Menu -->
              <div class="cau-mega-dropdown" role="region" aria-label="Explore menu">
                <div class="cau-mega-grid">
                  <ul class="cau-mega-menu">
                    <li class="cau-mega-menu__item is-active" data-tab="tab-degrees">
                      <i class="fa-solid fa-layer-group" aria-hidden="true"></i> Degree Levels
                    </li>
                    <li class="cau-mega-menu__item" data-tab="tab-faculties">
                      <i class="fa-solid fa-building-columns" aria-hidden="true"></i> Faculties
                    </li>
                    <li class="cau-mega-menu__item" data-tab="tab-admissions">
                      <i class="fa-solid fa-passport" aria-hidden="true"></i> Admissions
                    </li>
                    <li class="cau-mega-menu__item" data-tab="tab-campus">
                      <i class="fa-solid fa-compass" aria-hidden="true"></i> Campus &amp; Life
                    </li>
                  </ul>

                  <div class="cau-mega-content">
                    <!-- Tab: Degree Levels -->
                    <div class="cau-mega-panel is-active" id="tab-degrees">
                      <a class="cau-mega-panel__item" href="/programs.html?degree=Bachelor">
                        <span>Bachelor Degrees</span>
                        <span class="cau-badge-counter cau-badge--coral">24</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html?degree=Master">
                        <span>Master's Programs</span>
                        <span class="cau-badge-counter">13</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html?degree=Ph.D.">
                        <span>Ph.D. Doctorates</span>
                        <span class="cau-badge-counter">5</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html?degree=Associate">
                        <span>Associate Degrees</span>
                        <span class="cau-badge-counter">5</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html?degree=Preparatory">
                        <span>English Preparatory School</span>
                        <span class="cau-badge-counter">1</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/placement-test.html">
                        <span>English Level Diagnostic</span>
                        <span class="cau-badge-counter cau-badge--coral">Official Test</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/english-quest.html">
                        <span>CAU English Arena</span>
                        <span class="cau-badge-counter">Practice Game</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/scholarships.html">
                        <span>Scholarship Schemes</span>
                        <span class="cau-badge-counter cau-badge--coral">Up to 50%</span>
                      </a>
                    </div>

                    <!-- Tab: Faculties -->
                    <div class="cau-mega-panel" id="tab-faculties">
                      <a class="cau-mega-panel__item" href="/programs.html?faculty=Faculty+of+Dentistry">
                        <span>Faculty of Dentistry</span>
                        <span class="cau-badge-counter">1</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html?faculty=Faculty+of+Engineering+and+Architecture">
                        <span>Engineering &amp; Architecture</span>
                        <span class="cau-badge-counter">8</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html?faculty=Faculty+of+Applied+Sciences">
                        <span>Applied Sciences</span>
                        <span class="cau-badge-counter">2</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html?faculty=Faculty+of+Health+Sciences">
                        <span>Health Sciences</span>
                        <span class="cau-badge-counter">3</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html?faculty=Faculty+of+Humanities+and+Social+Sciences">
                        <span>Humanities &amp; Social Sciences</span>
                        <span class="cau-badge-counter">5</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html?faculty=Faculty+of+Law">
                        <span>Faculty of Law</span>
                        <span class="cau-badge-counter">2</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html?faculty=Faculty+of+Tourism">
                        <span>Tourism &amp; Hotel Management</span>
                        <span class="cau-badge-counter">3</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/programs.html">
                        <span>All 48 Programmes <i class="system-arrow ms-1" aria-hidden="true"></i></span>
                        <span class="cau-badge-counter cau-badge--coral">Full List</span>
                      </a>
                    </div>

                    <!-- Tab: Admissions -->
                    <div class="cau-mega-panel" id="tab-admissions">
                      <a class="cau-mega-panel__item" href="/admission.html">
                        <span>How to Apply</span>
                        <span class="cau-badge-counter">Guide</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/tuition.html">
                        <span>Tuition &amp; Fees</span>
                        <span class="cau-badge-counter">2026/27</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/scholarships.html">
                        <span>Scholarships &amp; Aid</span>
                        <span class="cau-badge-counter cau-badge--coral">50%</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/international.html">
                        <span>International Students</span>
                        <span class="cau-badge-counter">Global</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/faq.html">
                        <span>Admissions FAQ</span>
                        <span class="cau-badge-counter">Answers</span>
                      </a>
                      <a class="cau-mega-panel__item" href="https://apply.cau.edu.tr/" target="_blank" rel="noopener">
                        <span>Online Application Portal</span>
                        <span class="cau-badge-counter cau-badge--coral">Open</span>
                      </a>
                    </div>

                    <!-- Tab: Campus & Life -->
                    <div class="cau-mega-panel" id="tab-campus">
                      <a class="cau-mega-panel__item" href="/about.html">
                        <span>About CAU</span>
                        <span class="cau-badge-counter">Overview</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/about.html#campus">
                        <span>Kyrenia Campus Life</span>
                        <span class="cau-badge-counter">TRNC</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/clubs.html">
                        <span>Student Clubs &amp; Societies</span>
                        <span class="cau-badge-counter cau-badge--coral">15 Clubs</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/placement-test.html">
                        <span>English Level Diagnostic</span>
                        <span class="cau-badge-counter">Official Test</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/english-quest.html">
                        <span>CAU English Arena</span>
                        <span class="cau-badge-counter cau-badge--coral">Practice Game</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/news.html">
                        <span>Campus News &amp; Events</span>
                        <span class="cau-badge-counter">Live</span>
                      </a>
                      <a class="cau-mega-panel__item" href="/contact.html">
                        <span>Contact &amp; Campus Visit</span>
                        <span class="cau-badge-counter">Map</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li class="cau-header-nav__item">
              <a class="cau-header-nav__link" href="/programs.html">Programs</a>
            </li>
            <li class="cau-header-nav__item">
              <a class="cau-header-nav__link" href="/admission.html">Admissions</a>
            </li>
            <li class="cau-header-nav__item">
              <a class="cau-header-nav__link" href="/scholarships.html">Scholarships</a>
            </li>
          </ul>
        </nav>

        <!-- Central Header Search with Explore-Style Floating Popover -->
        <div class="header-main__search">
          <form class="search-form" id="cauHeaderSearchForm" action="/programs.html" method="get" autocomplete="off">
            <div class="search-form__field">
              <svg class="ico-svg" viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M13 13l4 4" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input type="text" name="search" id="cauHeaderSearchInput" class="search-form__input" placeholder="Search programmes, faculties, admissions..." aria-label="Search programmes, faculties, admissions" autocomplete="off" />
              <kbd class="cau-search-kbd d-none d-lg-inline-flex" title="Press / to search">/</kbd>
              <button type="button" class="cau-search-clear" id="cauSearchClearBtn" aria-label="Clear search" hidden>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </form>

          <!-- Search Suggestions Popover (Explore-Style Floating Card) -->
          <div class="cau-search-drawer" id="cauSearchDrawer" role="region" aria-label="Search suggestions" aria-hidden="true">
            <div class="cau-search-drawer__body">
              <!-- Left Navigation Tabs -->
              <div class="cau-search-drawer__sidebar" role="tablist" aria-label="Search categories">
                <button type="button" class="cau-search-tab is-active" role="tab" aria-selected="true" data-search-tab="popular" id="tabBtn-popular">
                  <i class="fa-solid fa-fire-flame-curved" aria-hidden="true"></i>
                  <span>Popular</span>
                </button>
                <button type="button" class="cau-search-tab" role="tab" aria-selected="false" data-search-tab="faculties" id="tabBtn-faculties">
                  <i class="fa-solid fa-building-columns" aria-hidden="true"></i>
                  <span>Faculties</span>
                </button>
                <button type="button" class="cau-search-tab" role="tab" aria-selected="false" data-search-tab="degrees" id="tabBtn-degrees">
                  <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
                  <span>Degrees</span>
                </button>
                <button type="button" class="cau-search-tab" role="tab" aria-selected="false" data-search-tab="admissions" id="tabBtn-admissions">
                  <i class="fa-solid fa-passport" aria-hidden="true"></i>
                  <span>Admissions</span>
                </button>
                <button type="button" class="cau-search-tab" role="tab" aria-selected="false" data-search-tab="campus" id="tabBtn-campus">
                  <i class="fa-solid fa-compass" aria-hidden="true"></i>
                  <span>Campus &amp; Life</span>
                </button>
              </div>

              <!-- Right Content Panels -->
              <div class="cau-search-drawer__content">
                <!-- Panel 1: Popular Academic Programmes -->
                <div class="cau-search-panel is-active" id="searchPanel-popular" role="tabpanel" aria-labelledby="tabBtn-popular">
                  <div class="cau-search-panel__grid">
                    <a href="/programs.html?search=Computer+Engineering" class="cau-search-item">
                      <span class="cau-search-item__title">Computer Engineering</span>
                      <span class="cau-badge-counter">4 Years • B.Sc.</span>
                    </a>
                    <a href="/programs.html?faculty=Faculty+of+Dentistry" class="cau-search-item">
                      <span class="cau-search-item__title">Faculty of Dentistry (D.D.S.)</span>
                      <span class="cau-badge-counter cau-badge--coral">5 Years</span>
                    </a>
                    <a href="/programs.html?search=Architecture" class="cau-search-item">
                      <span class="cau-search-item__title">Architecture &amp; Interior Design</span>
                      <span class="cau-badge-counter">Studios</span>
                    </a>
                    <a href="/programs.html?faculty=Faculty+of+Health+Sciences" class="cau-search-item">
                      <span class="cau-search-item__title">Medicine &amp; Health Sciences</span>
                      <span class="cau-badge-counter">Clinical</span>
                    </a>
                    <a href="/programs.html?search=Software+Engineering" class="cau-search-item">
                      <span class="cau-search-item__title">Software Engineering</span>
                      <span class="cau-badge-counter">English</span>
                    </a>
                    <a href="/scholarships.html" class="cau-search-item">
                      <span class="cau-search-item__title">50% International Scholarships</span>
                      <span class="cau-badge-counter cau-badge--coral">Available</span>
                    </a>
                    <a href="/programs.html?faculty=Faculty+of+Law" class="cau-search-item">
                      <span class="cau-search-item__title">Faculty of Law</span>
                      <span class="cau-badge-counter">LL.B.</span>
                    </a>
                    <a href="/programs.html?search=Aviation" class="cau-search-item">
                      <span class="cau-search-item__title">Aviation Management &amp; Pilotage</span>
                      <span class="cau-badge-counter">Applied</span>
                    </a>
                    <a href="/programs.html?degree=Preparatory" class="cau-search-item">
                      <span class="cau-search-item__title">English Preparatory School</span>
                      <span class="cau-badge-counter">1 Year</span>
                    </a>
                    <a href="/placement-test.html" class="cau-search-item">
                      <span class="cau-search-item__title">English Level Diagnostic</span>
                      <span class="cau-badge-counter cau-badge--coral">Official Test</span>
                    </a>
                    <a href="/english-quest.html" class="cau-search-item">
                      <span class="cau-search-item__title">CAU English Arena</span>
                      <span class="cau-badge-counter">Practice Game</span>
                    </a>
                    <a href="/programs.html" class="cau-search-item">
                      <span class="cau-search-item__title">Explore All 48 Programmes</span>
                      <span class="cau-badge-counter cau-badge--coral">Full Catalogue</span>
                    </a>
                  </div>
                </div>

                <!-- Panel 2: Faculties -->
                <div class="cau-search-panel" id="searchPanel-faculties" role="tabpanel" aria-labelledby="tabBtn-faculties">
                  <div class="cau-search-panel__grid">
                    <a href="/programs.html?faculty=Faculty+of+Engineering+and+Architecture" class="cau-search-item">
                      <span class="cau-search-item__title">Faculty of Engineering &amp; Architecture</span>
                      <span class="cau-badge-counter">8</span>
                    </a>
                    <a href="/programs.html?faculty=Faculty+of+Dentistry" class="cau-search-item">
                      <span class="cau-search-item__title">Faculty of Dentistry</span>
                      <span class="cau-badge-counter">1</span>
                    </a>
                    <a href="/programs.html?faculty=Faculty+of+Health+Sciences" class="cau-search-item">
                      <span class="cau-search-item__title">Faculty of Health Sciences</span>
                      <span class="cau-badge-counter">3</span>
                    </a>
                    <a href="/programs.html?faculty=Faculty+of+Applied+Sciences" class="cau-search-item">
                      <span class="cau-search-item__title">Faculty of Applied Sciences</span>
                      <span class="cau-badge-counter">2</span>
                    </a>
                    <a href="/programs.html?faculty=Faculty+of+Humanities+and+Social+Sciences" class="cau-search-item">
                      <span class="cau-search-item__title">Faculty of Humanities &amp; Social Sciences</span>
                      <span class="cau-badge-counter">5</span>
                    </a>
                    <a href="/programs.html?faculty=Faculty+of+Law" class="cau-search-item">
                      <span class="cau-search-item__title">Faculty of Law</span>
                      <span class="cau-badge-counter">2</span>
                    </a>
                    <a href="/programs.html?faculty=Faculty+of+Tourism" class="cau-search-item">
                      <span class="cau-search-item__title">Faculty of Tourism &amp; Hotel Management</span>
                      <span class="cau-badge-counter">3</span>
                    </a>
                    <a href="/programs.html?degree=Associate" class="cau-search-item">
                      <span class="cau-search-item__title">Vocational School of Higher Education</span>
                      <span class="cau-badge-counter">5</span>
                    </a>
                    <a href="/programs.html?degree=Master" class="cau-search-item">
                      <span class="cau-search-item__title">Institute of Graduate Studies &amp; Research</span>
                      <span class="cau-badge-counter">18</span>
                    </a>
                  </div>
                </div>

                <!-- Panel 3: Degree Levels -->
                <div class="cau-search-panel" id="searchPanel-degrees" role="tabpanel" aria-labelledby="tabBtn-degrees">
                  <div class="cau-search-panel__grid">
                    <a href="/programs.html?degree=Bachelor" class="cau-search-item">
                      <span class="cau-search-item__title">Undergraduate Bachelor Degrees</span>
                      <span class="cau-badge-counter cau-badge--coral">24</span>
                    </a>
                    <a href="/programs.html?degree=Master" class="cau-search-item">
                      <span class="cau-search-item__title">Postgraduate Master's Degrees</span>
                      <span class="cau-badge-counter">13</span>
                    </a>
                    <a href="/programs.html?degree=Ph.D." class="cau-search-item">
                      <span class="cau-search-item__title">Doctorate (Ph.D.) Degrees</span>
                      <span class="cau-badge-counter">5</span>
                    </a>
                    <a href="/programs.html?degree=Associate" class="cau-search-item">
                      <span class="cau-search-item__title">Associate Degrees (2-Year Vocational)</span>
                      <span class="cau-badge-counter">5</span>
                    </a>
                    <a href="/programs.html?degree=Preparatory" class="cau-search-item">
                      <span class="cau-search-item__title">English Preparatory School</span>
                      <span class="cau-badge-counter">1</span>
                    </a>
                    <a href="/international.html" class="cau-search-item">
                      <span class="cau-search-item__title">Dual Diploma &amp; Global Exchange Pathways</span>
                      <span class="cau-badge-counter">ECTS</span>
                    </a>
                  </div>
                </div>

                <!-- Panel 4: Admissions & Aid -->
                <div class="cau-search-panel" id="searchPanel-admissions" role="tabpanel" aria-labelledby="tabBtn-admissions">
                  <div class="cau-search-panel__grid">
                    <a href="/admission.html" class="cau-search-item">
                      <span class="cau-search-item__title">How to Apply — Step-by-Step Guide</span>
                      <span class="cau-badge-counter">Guide</span>
                    </a>
                    <a href="/tuition.html" class="cau-search-item">
                      <span class="cau-search-item__title">Tuition &amp; Fee Schedule 2026/2027</span>
                      <span class="cau-badge-counter">2026/27</span>
                    </a>
                    <a href="/scholarships.html" class="cau-search-item">
                      <span class="cau-search-item__title">International Merit Scholarships (Up to 50%)</span>
                      <span class="cau-badge-counter cau-badge--coral">50% Aid</span>
                    </a>
                    <a href="https://apply.cau.edu.tr/" target="_blank" rel="noopener" class="cau-search-item">
                      <span class="cau-search-item__title">Online Application Portal</span>
                      <span class="cau-badge-counter cau-badge--coral">Apply Now</span>
                    </a>
                    <a href="/international.html" class="cau-search-item">
                      <span class="cau-search-item__title">International Student Visas &amp; Requirements</span>
                      <span class="cau-badge-counter">Global</span>
                    </a>
                    <a href="/faq.html" class="cau-search-item">
                      <span class="cau-search-item__title">Frequently Asked Questions (Admissions FAQ)</span>
                      <span class="cau-badge-counter">Answers</span>
                    </a>
                  </div>
                </div>

                <!-- Panel 5: Campus & Life -->
                <div class="cau-search-panel" id="searchPanel-campus" role="tabpanel" aria-labelledby="tabBtn-campus">
                  <div class="cau-search-panel__grid">
                    <a href="/about.html" class="cau-search-item">
                      <span class="cau-search-item__title">About Cyprus Aydın University</span>
                      <span class="cau-badge-counter">Overview</span>
                    </a>
                    <a href="/about.html#campus" class="cau-search-item">
                      <span class="cau-search-item__title">Kyrenia Mediterranean Campus Life</span>
                      <span class="cau-badge-counter">TRNC</span>
                    </a>
                    <a href="/about.html#dormitories" class="cau-search-item">
                      <span class="cau-search-item__title">Student Dormitories &amp; On-Campus Housing</span>
                      <span class="cau-badge-counter">Dorms</span>
                    </a>
                    <a href="/news.html" class="cau-search-item">
                      <span class="cau-search-item__title">Campus News &amp; Academic Events</span>
                      <span class="cau-badge-counter">Live</span>
                    </a>
                    <a href="/placement-test.html" class="cau-search-item">
                      <span class="cau-search-item__title">English Level Diagnostic</span>
                      <span class="cau-badge-counter cau-badge--coral">Official Test</span>
                    </a>
                    <a href="/english-quest.html" class="cau-search-item">
                      <span class="cau-search-item__title">CAU English Arena</span>
                      <span class="cau-badge-counter">Practice Game</span>
                    </a>
                    <a href="/contact.html" class="cau-search-item">
                      <span class="cau-search-item__title">Contact &amp; Kyrenia Campus Map</span>
                      <span class="cau-badge-counter">Visit</span>
                    </a>
                  </div>
                </div>

                <!-- Live Dynamic Filter Panel (Shown when typing) -->
                <div class="cau-search-panel cau-search-panel--dynamic" id="searchPanel-dynamic" style="display: none;">
                  <div class="cau-search-dynamic__header">
                    <span class="cau-search-dynamic__label">Matching Programmes &amp; Topics</span>
                    <span class="cau-search-dynamic__count" id="searchDynamicCount">0 results</span>
                  </div>
                  <div class="cau-search-panel__grid" id="searchDynamicList"></div>
                  <div class="cau-search-dynamic__footer" id="searchDynamicFooter">
                    <button type="submit" form="cauHeaderSearchForm" class="cau-search-view-all-btn">
                      <span>View all results for "<strong id="searchQueryEcho"></strong>" in catalogue</span>
                      <i class="system-arrow ms-1" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Status Bar -->
            <div class="cau-search-drawer__footer-bar">
              <span>Cyprus Aydın University • Admissions 2026/2027 Open</span>
              <span>Press <kbd style="background: var(--sys-surface-2); padding: 2px var(--space-1, 4px); border-radius: 2px; border: 1px solid var(--sys-line); font-size: var(--font-caption, 0.75rem);">ESC</kbd> to close</span>
            </div>
          </div>
        </div>

        <!-- Header Actions: Language picker & Apply CTA (No hamburger on homepage) -->
        <div class="header-actions">
          <label class="language-picker">
            <span class="visually-hidden">Language</span>
            <select class="language-select" aria-label="Select language">
              <option value="en">EN</option>
              <option value="ar">العربية</option>
              <option value="ru">RU</option>
              <option value="fr">FR</option>
              <option value="fa">فارسی</option>
            </select>
          </label>
          <a class="btn btn-coral apply-btn" href="https://apply.cau.edu.tr/" target="_blank" rel="noopener noreferrer">
            Apply Now! <i class="system-arrow ms-1" aria-hidden="true"></i>
          </a>
          <button type="button" class="cau-menu-toggle" aria-controls="cauNavOverlay" aria-expanded="false" aria-label="Open mobile navigation">
            <i class="fa-solid fa-bars" aria-hidden="true"></i>
            <span class="cau-menu-toggle__label d-none d-sm-inline ms-1">Menu</span>
          </button>
        </div>
      </div>
    </div>`;
  };

  
  // --- INJECT GLOBAL ZERO-EFFECTS CSS ---
  if (!document.getElementById('cau-zero-effects-override')) {
    const zeroEffectsStyle = document.createElement('style');
    zeroEffectsStyle.id = 'cau-zero-effects-override';
    zeroEffectsStyle.textContent = `
      /* Absolute ZERO STROKE, ZERO GLOW, ZERO BORDER CHANGE ON HOVER/FOCUS globally */
      .form-control:focus, .form-select:focus, .cau-input:focus, .cau-select:focus, input:focus,
      .cau-palette-input:focus, .cau-palette-input:hover,
      .search-form:focus-within, .search-form:hover, .search-form.is-active,
      .shared-footer .footer-nl-row:focus-within, .shared-footer .footer-nl-row:hover,
      .shared-footer .footer-form input:focus,
      .language-picker:focus-within, .language-picker:hover,
      .cau-menu-search-box:focus-within, .cau-menu-search-box:hover,
      .cau-palette-header:focus-within, .cau-palette-header:hover,
      a:focus-visible, button:focus-visible, .btn:focus-visible {
        outline: none !important;
        box-shadow: none !important;
      }
      
      .form-control:focus, .form-select:focus, .cau-input:focus, .cau-select:focus, input:focus {
        border-color: #dcd8cf !important; /* Lock to default border color */
      }
      
      .cau-palette-input:focus, .cau-palette-input:hover,
      .search-form:focus-within, .search-form:hover, .search-form.is-active,
      .shared-footer .footer-nl-row:focus-within, .shared-footer .footer-nl-row:hover,
      .shared-footer .footer-form input:focus {
        border-color: transparent !important;
      }
      
      .cau-menu-search-box:focus-within, .cau-menu-search-box:hover,
      .cau-palette-header:focus-within, .cau-palette-header:hover {
        border-color: transparent !important;
      }
      
      .language-picker:focus-within, .language-picker:hover {
        border-color: rgba(255, 255, 255, 0.24) !important;
      }
      
      /* Global Anti-Overlap & Strict Mega Menu Flex Alignment */
      .cau-mega-panel__item {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 0 12px !important;
        min-width: 0 !important;
        overflow: hidden !important;
      }
      .cau-mega-panel__item > span:first-child {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      .cau-badge-counter {
        flex-shrink: 0 !important;
        margin-left: auto !important;
        white-space: nowrap !important;
        padding: 2px 8px !important;
        font-size: 11px !important;
        line-height: 1 !important;
        border-radius: 9999px !important;
      }
    `;
    document.head.appendChild(zeroEffectsStyle);
  }
  const mountSharedHeader = () => {
    document.querySelectorAll('#cauHeader, header.site-header').forEach((header) => {
      if (header.dataset.headerMounted === 'true') return;

      if (header.classList.contains('site-header') || header.id === 'cauHeader') {
        header.innerHTML = headerMarkup();
        if (header.id === 'cauHeader') header.classList.add('site-header');
      }
      header.id = 'cauHeader';
      header.className = 'site-header editorial-masthead';
      header.setAttribute('aria-label', 'Primary site navigation');
      if (!document.getElementById('cauSearchBackdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'cau-search-backdrop';
        backdrop.id = 'cauSearchBackdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        header.insertAdjacentElement('afterend', backdrop);
      }

      // 1. Ensure mobile menu toggle button exists in header-actions
      const actions = header.querySelector('.header-actions');
      if (actions && !actions.querySelector('.cau-menu-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'cau-menu-toggle';
        toggleBtn.type = 'button';
        toggleBtn.setAttribute('aria-controls', 'cauNavOverlay');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Open mobile navigation');
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i><span class="cau-menu-toggle__label d-none d-sm-inline ms-1">Menu</span>';
        actions.appendChild(toggleBtn);
      }

      // 2. Ensure mobile navigation overlay drawer exists in document.body
      let overlay = document.getElementById('cauNavOverlay');
      if (!overlay) {
        const temp = document.createElement('div');
        temp.innerHTML = `<aside class="cau-nav-overlay" id="cauNavOverlay" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
  <div class="cau-nav-overlay__inner">
    <div class="cau-mobile-nav-top d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
      <a href="/" class="d-flex align-items-center gap-2 text-decoration-none" aria-label="CAU Home">
        <img src="/assets/cau-official-logo.png" alt="Cyprus Aydin University" style="height: 36px; width: auto;" />
      </a>
      <button type="button" class="btn btn-outline-secondary btn-sm cau-mobile-nav-close" id="cauNavCloseBtn" aria-label="Close navigation menu" style="padding: 6px 14px; border-radius: var(--radius-normal, 8px); font-weight: 700; font-size: 13px;">
        <i class="fa-solid fa-xmark me-1" aria-hidden="true"></i> Close
      </button>
    </div>

    <div class="cau-mobile-nav-search mb-3">
      <form action="/programs.html" method="get" class="d-flex align-items-center px-3 py-2 border rounded-3 bg-light">
        <i class="fa-solid fa-magnifying-glass text-muted me-2" aria-hidden="true"></i>
        <input type="text" name="search" placeholder="Search programmes, faculties..." aria-label="Search programmes" style="border: 0; background: transparent; width: 100%; outline: none; font-size: 14px;" />
      </form>
    </div>

    <div class="cau-mobile-nav-links d-flex flex-column gap-1">
      <a href="/" class="cau-mob-link"><i class="fa-solid fa-house me-2"></i>Home</a>
      <a href="/programs.html" class="cau-mob-link"><i class="fa-solid fa-graduation-cap me-2"></i>Academic Programmes <span class="badge bg-danger ms-auto">48</span></a>
      <a href="/departments.html" class="cau-mob-link"><i class="fa-solid fa-building-columns me-2"></i>Faculties &amp; Departments</a>
      <a href="/admission.html" class="cau-mob-link"><i class="fa-solid fa-passport me-2"></i>Admissions &amp; How to Apply</a>
      <a href="/scholarships.html" class="cau-mob-link"><i class="fa-solid fa-award me-2"></i>Scholarships &amp; Aid <span class="badge bg-danger ms-auto">50%</span></a>
      <a href="/tuition.html" class="cau-mob-link"><i class="fa-solid fa-receipt me-2"></i>Tuition &amp; Fees</a>
      <a href="/clubs.html" class="cau-mob-link"><i class="fa-solid fa-users me-2"></i>Student Life &amp; Clubs</a>
      <a href="/shuttle.html" class="cau-mob-link"><i class="fa-solid fa-bus me-2"></i>Campus Shuttle Tracker</a>
      <a href="/placement-test.html" class="cau-mob-link"><i class="fa-solid fa-spell-check me-2"></i>English Placement Test</a>
      <a href="/english-quest.html" class="cau-mob-link"><i class="fa-solid fa-users me-2"></i>CAU English Club & Arena</a>
      <a href="/about.html" class="cau-mob-link"><i class="fa-solid fa-landmark me-2"></i>About CAU Kyrenia Campus</a>
      <a href="/international.html" class="cau-mob-link"><i class="fa-solid fa-globe me-2"></i>International Students</a>
      <a href="/news.html" class="cau-mob-link"><i class="fa-solid fa-newspaper me-2"></i>News &amp; Events</a>
      <a href="/contact.html" class="cau-mob-link"><i class="fa-solid fa-location-dot me-2"></i>Contact Us</a>
    </div>

    <div class="cau-mobile-nav-bottom mt-4 pt-3 border-top">
      <a class="btn btn-coral w-100 py-3 d-flex align-items-center justify-content-center gap-2 font-weight-bold" href="https://apply.cau.edu.tr/" target="_blank" rel="noopener noreferrer" style="font-size: 15px;">
        Apply Online Now <i class="system-arrow ms-1" aria-hidden="true"></i>
      </a>
    </div>
  </div>
</aside>`;
        overlay = temp.firstElementChild;
        document.body.appendChild(overlay);
      }

      // 3. Bind mobile drawer toggle interactions
      const setDrawerOpen = (open) => {
        if (!overlay) return;
        overlay.classList.toggle('is-open', open);
        overlay.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('cau-nav-open', open);
        if (open) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
        header.querySelectorAll('.cau-menu-toggle').forEach((btn) => {
          btn.setAttribute('aria-expanded', String(open));
          const label = btn.querySelector('.cau-menu-toggle__label');
          if (label) label.textContent = open ? 'Close' : 'Menu';
        });
      };

      header.querySelectorAll('.cau-menu-toggle').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = overlay?.classList.contains('is-open');
          setDrawerOpen(!isOpen);
        });
      });

      if (overlay && !overlay.dataset.cauEventsBound) {
        overlay.dataset.cauEventsBound = 'true';
        overlay.querySelectorAll('#cauNavCloseBtn, .cau-mobile-nav-close, .cau-nav-overlay__close').forEach((closeBtn) => {
          closeBtn.addEventListener('click', () => setDrawerOpen(false));
        });
        overlay.querySelectorAll('.cau-mob-link, a').forEach((link) => {
          link.addEventListener('click', () => setDrawerOpen(false));
        });
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            setDrawerOpen(false);
          }
        });
      }

      header.dataset.headerMounted = 'true';
      const page = window.location.pathname.split('/').pop() || 'index.html';
      const isDept = window.location.pathname.includes('/departments') || page === 'departments.html' || page.startsWith('faculty-');
      const isProg = window.location.pathname.includes('/programs') || page === 'programs.html' || page === 'program-details.html';
      const activeByPage = {
        'about.html': 'About CAU',
        'about.html': 'About CAU',
        'programs.html': 'Programmes',
        'program-details.html': 'Programmes',
        'departments.html': 'Faculties & Departments',
        'scholarships.html': 'Scholarships',
        'tuition.html': 'Tuition & Fees',
        'admission.html': 'Admissions',
        'international.html': 'International Office',
        'news.html': 'News & Events',
        'clubs.html': 'Student Life & Clubs',
        'shuttle.html': 'Campus Shuttle Tracker',
      };
      const current = isDept ? 'Departments' : (isProg ? 'Programs' : activeByPage[page]);
      if (current) {
        header.querySelectorAll('.editorial-nav a, .cau-nav-link').forEach((link) => {
          const label = link.querySelector('.cau-link-label')?.textContent?.trim() || link.textContent?.trim();
          if (label === current || (current === 'About Us' && (label === 'About Us' || label === 'About CAU')) || (current === 'Programs' && label === 'Programmes') || (current === 'Tuition & Fees' && label.includes('Tuition')) || (current === 'Admissions' && label === 'Admission')) {
            link.classList.add('active-nav');
            link.setAttribute('aria-current', 'page');
          }
        });
        const facultiesAccordion = header.querySelector('#cauFacultiesTrigger');
        if (isDept && facultiesAccordion) {
          facultiesAccordion.classList.add('active-nav');
        }
      }
      // Video modal audio stop listener bug fix
      const videoModal = document.getElementById('videoModal');
      if (videoModal && !videoModal.dataset.cauAudioStopAttached) {
        videoModal.dataset.cauAudioStopAttached = 'true';
        videoModal.addEventListener('hidden.bs.modal', () => {
          const iframe = videoModal.querySelector('iframe');
          if (iframe) {
            const currentSrc = iframe.src;
            iframe.src = '';
            iframe.src = currentSrc;
          }
        });
      }
    });
  };

  const getEditorialFooterMarkup = () => `<footer class="shared-footer shared-footer--editorial" aria-label="CAU site footer">
    <div class="footer-shell">

      <!-- ── 1. TOP BAND: Wordmark (left 50%) + Tagline & Email Link (right 50%) ── -->
      <div class="footer-top">
        <div class="footer-wordmark-col">
          <a href="/" class="footer-wordmark" aria-label="Cyprus Aydin University – home">CAU</a>
        </div>
        <div class="footer-tagline-col">
          <h3 class="footer-tagline">Cyprus Aydin University<br />is an international university<br />in Kyrenia, shaping futures in thought<br />and in action:</h3>
          <a href="mailto:info@cau.edu.tr" class="footer-email-cta">info@cau.edu.tr</a>
        </div>
      </div>

      <!-- ── 2. MIDDLE BAND: Horizontal Hairline Divider + 4-Column Grid ── -->
      <div class="footer-mid">
        <div class="footer-grid">

          <!-- Col 1: Newsletter Form -->
          <div class="footer-grid__col footer-grid__col--newsletter">
            <p class="footer-col-label">Newsletter</p>
            <form class="footer-nl-form" id="newsletterForm" data-cau-form data-cau-success="Thank you! You have successfully subscribed to the CAU Newsletter." novalidate>
              <div class="footer-nl-row">
                <label for="newsletterEmail" class="visually-hidden">Your email address</label>
                <input id="newsletterEmail" name="email" type="email" class="footer-nl-input" placeholder="Your email address" required />
                <button type="submit" class="footer-nl-btn" aria-label="Subscribe to newsletter">
                  <i class="system-arrow ms-1" aria-hidden="true"></i>
                </button>
              </div>
              <p class="footer-nl-consent">By subscribing you agree with our <a href="/about.html" class="link link--underline">Privacy Policy</a></p>
              <div class="form-feedback cau-form-feedback" id="newsletterFeedback" role="status"></div>
            </form>
          </div>

          <!-- Group of Link Columns (Starts flush with .footer-tagline-col on the right half) -->
          <div class="footer-links-group">
            <!-- Col 2: Socials -->
            <div class="footer-grid__col">
              <p class="footer-col-label">Socials</p>
              <nav class="footer-link-col" aria-label="CAU on social media">
                <a href="https://www.linkedin.com/school/cyprusaydinuniversity/posts/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://www.instagram.com/cauint/" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://www.facebook.com/CAUint" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://x.com/caucampus" target="_blank" rel="noopener noreferrer">X</a>
                <a href="https://www.youtube.com/@CyprusAydinUniversity" target="_blank" rel="noopener noreferrer">YouTube</a>
              </nav>
            </div>

            <!-- Col 3: University Navigation -->
            <div class="footer-grid__col">
              <p class="footer-col-label">University</p>
              <nav class="footer-link-col" aria-label="University navigation">
                <a href="/about.html">About CAU</a>
                <a href="/scholarships.html">Scholarships</a>
                <a href="/admission.html">Admissions</a>
                <a href="/international.html">International Office</a>
                <a href="/placement-test.html">English Level Diagnostic (CEFR)</a>
                <a href="/english-quest.html">CAU English Club & Arena</a>
                <a href="/faq.html">Help &amp; FAQ</a>
                <a href="/contact.html">Contact Us</a>
              </nav>
            </div>

            <!-- Col 4: Contact / Offices -->
            <div class="footer-grid__col">
              <p class="footer-col-label">Offices</p>
              <div class="footer-link-col" aria-label="Contact and campus information">
                <a href="tel:+905488357171">+90 548 835 7171</a>
                <a href="https://wa.me/905488357171" target="_blank" rel="noopener noreferrer">WhatsApp Desk</a>
                <a href="mailto:info@cau.edu.tr">info@cau.edu.tr</a>
                <span class="footer-link-plain">Girne Campus</span>
                <span class="footer-link-plain">Girne, TRNC</span>
                <a href="https://apply.cau.edu.tr/" target="_blank" rel="noopener noreferrer" class="footer-apply-now">Apply Now <i class="system-arrow ms-1" aria-hidden="true"></i></a>
              </div>
            </div>
          </div>

        </div>
      </div>

            <!-- ── 3. BOTTOM BAND: Copyright + Campus Live Time + Legal Links ── -->
      <div class="footer-bottom">
        <p class="footer-copyright">&copy; 2026 Cyprus Aydin University. All rights reserved.</p>
        <div class="footer-clock-chip" id="cauCampusClockChip" aria-label="Campus Local Time" data-component="local-time">
          <span class="clock-live-indicator" aria-hidden="true"></span>
          <span class="footer-clock-city">NICOSIA</span>
          <span class="footer-clock-sep" aria-hidden="true">•</span>
          <span id="cauLiveClock" class="clock-live-digits">--:--:--</span>
          <span class="footer-clock-sep" aria-hidden="true">•</span>
          <span class="footer-clock-tz">EEST (UTC+3)</span>
        </div>
        <div class="footer-legal-links">
          <a href="/admission.html">Terms</a>,
          <a href="/about.html">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>`;

  const getInquiryFooterMarkup = () => `<footer class="shared-footer shared-footer--inquiry" aria-label="CAU contact and footer">
    <div class="footer-shell">
      <section id="contact" class="footer-cta">
        <h2 class="footer-cta__headline">CAN'T FIND WHAT<br>YOU ARE LOOKING FOR?</h2>
        <div class="footer-cta__right">
          <p class="footer-cta__text">Try our extensive database of <a href="/faq.html" class="highlight">FAQs</a> or submit your inquiry directly to admissions.</p>
          <form class="footer-form" id="contactForm" data-cau-form="" data-cau-success="Thank you! Your inquiry has been sent to our admissions team." novalidate="">
            <div class="footer-form-group">
              <label for="contactName">Full Name</label>
              <input id="contactName" name="name" type="text" placeholder="e.g. Alex Morgan" required="">
            </div>
            <div class="footer-form-group">
              <label for="contactPhone">Phone / WhatsApp</label>
              <input id="contactPhone" name="phone" type="tel" placeholder="+90 ..." required="">
            </div>
            <div class="footer-form-group">
              <label for="contactEmail">Email Address</label>
              <input id="contactEmail" name="email" type="email" placeholder="name@domain.com" required="">
            </div>
            <button class="footer-send" type="submit">
              <span>Send Inquiry</span>
              <i class="system-arrow ms-1" aria-hidden="true"></i>
            </button>
            <div class="form-feedback cau-form-feedback" id="contactFeedback" role="status"></div>
          </form>
        </div>
      </section>

      <section class="footer-community">
        <h3 class="footer-community__title">Join Our Community</h3>
        <div class="social-list">
          <a href="https://www.facebook.com/CAUint" target="_blank" rel="noopener noreferrer" class="social-pill" aria-label="Facebook">Facebook</a>
          <a href="https://x.com/caucampus" target="_blank" rel="noopener noreferrer" class="social-pill" aria-label="X">X</a>
          <a href="https://www.youtube.com/@CyprusAydinUniversity" target="_blank" rel="noopener noreferrer" class="social-pill" aria-label="YouTube">YouTube</a>
          <a href="https://www.linkedin.com/school/cyprusaydinuniversity/posts/" target="_blank" rel="noopener noreferrer" class="social-pill" aria-label="LinkedIn">LinkedIn</a>
          <a href="https://www.instagram.com/cauint/" target="_blank" rel="noopener noreferrer" class="social-pill" aria-label="Instagram">Instagram</a>
        </div>
      </section>

      <div class="footer-columns">
        <nav aria-label="Useful links" class="footer-nav-col">
          <h3 class="col-title">Useful Links</h3>
          <ul class="link-list">
            <li><a href="/">Home</a></li>
            <li><a href="https://apply.cau.edu.tr/" target="_blank" rel="noopener noreferrer">Apply for Admission</a></li>
            <li><a href="/scholarships.html">Scholarships &amp; Grants</a></li>
            <li><a href="/international.html">International Office</a></li>
            <li><a href="/contact.html">Contact Us</a></li>
          </ul>
        </nav>
        <div class="more-info footer-nav-col">
          <h3 class="col-title">Campus Desk</h3>
          <p class="desk-sub">Free student advisory &amp; call-back service</p>
          <p><a href="tel:+905488357171" class="footer-phone-link"><i class="fa-solid fa-phone me-2 text-coral" aria-hidden="true"></i>+90 548 835 7171</a></p>
          <p><a href="https://wa.me/905488357171" target="_blank" rel="noopener" class="footer-wa-link"><i class="fa-brands fa-whatsapp me-2 text-coral" aria-hidden="true"></i>WhatsApp 24/7 Desk</a></p>
          <p class="contact-line"><a href="mailto:info@cau.edu.tr" class="footer-email-link"><i class="fa-solid fa-envelope me-2 text-coral" aria-hidden="true"></i>info@cau.edu.tr</a></p>
          <p class="campus-address"><i class="fa-solid fa-location-dot me-2 text-coral" aria-hidden="true"></i>Girne Campus, Girne, TRNC</p>
        </div>
        <section class="newsletter footer-nav-col">
          <h3 class="col-title">Newsletter</h3>
          <p class="small-text">Subscribe to receive official monthly newsletters with academic announcements and campus updates.</p>
          <form class="newsletter-form" id="newsletterForm" data-cau-form="" data-cau-success="Thank you! You have successfully subscribed to the CAU Newsletter." novalidate="">
            <label for="newsletterEmail" class="visually-hidden">Your Email Address</label>
            <input id="newsletterEmail" name="email" type="email" placeholder="Your Email Address" required="">
            <button type="submit" class="newsletter-submit-btn" aria-label="Subscribe to newsletter"><i class="system-arrow ms-1" aria-hidden="true"></i></button>
            <div id="newsletterFeedback" class="form-feedback cau-form-feedback" role="status"></div>
          </form>
        </section>
      </div>

            <div class="footer-bottom">
        <p class="copyright">&copy; 2026 Cyprus Aydin University. All rights reserved.</p>
        <div class="footer-clock-chip footer-clock-chip--dark" id="cauCampusClockChipInquiry" aria-label="Campus Local Time" data-component="local-time">
          <span class="clock-live-indicator" aria-hidden="true"></span>
          <span class="footer-clock-city">NICOSIA</span>
          <span class="footer-clock-sep" aria-hidden="true">•</span>
          <span class="clock-live-digits">--:--:--</span>
          <span class="footer-clock-sep" aria-hidden="true">•</span>
          <span class="footer-clock-tz">EEST (UTC+3)</span>
        </div>
        <div class="footer-legal-links">
          <a href="/about.html">About CAU</a>
          <span class="sep">&bull;</span>
          <a href="/admission.html">Admissions Policy</a>
          <span class="sep">&bull;</span>
          <a href="/contact.html">Campus Directory</a>
          <span class="sep">&bull;</span>
          <a href="/faq.html">Help &amp; FAQ</a>
        </div>
      </div>
    </div>
  </footer>`;

  const footerMarkup = getEditorialFooterMarkup();

  const mountSharedFooter = () => {
    document.querySelectorAll('[data-shared-footer]').forEach((mount) => {
      if (mount.dataset.footerMounted === 'true') return;
      const variant = mount.dataset.footerVariant || 'editorial';
      mount.innerHTML = variant === 'inquiry' ? getInquiryFooterMarkup() : getEditorialFooterMarkup();
      mount.dataset.footerMounted = 'true';
    });

    // Handle newsletter submission (present in both variants)
    const nlForm = document.getElementById('newsletterForm');
    if (nlForm) {
      nlForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = document.getElementById('newsletterFeedback');
        if (!feedback) return;
        const email = document.getElementById('newsletterEmail');
        if (!email || !email.value) return;

        feedback.textContent = 'Subscribing...';
        feedback.className = 'form-feedback cau-form-feedback loading';

        setTimeout(() => {
          feedback.textContent = nlForm.dataset.cauSuccess || 'Thank you! You have successfully subscribed to the CAU Newsletter.';
          feedback.className = 'form-feedback cau-form-feedback success';
          nlForm.reset();
        }, 1000);
      });
    }

    // Handle contact inquiry form submission (present in inquiry variant)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = document.getElementById('contactFeedback');
        if (!feedback) return;
        const name = document.getElementById('contactName');
        const phone = document.getElementById('contactPhone');
        const email = document.getElementById('contactEmail');

        if (!name || !name.value || !phone || !phone.value || !email || !email.value) {
          feedback.textContent = 'Please complete all required fields.';
          feedback.className = 'form-feedback cau-form-feedback';
          feedback.style.color = '#e63b2e';
          return;
        }

        feedback.textContent = 'Submitting inquiry...';
        feedback.className = 'form-feedback cau-form-feedback loading';
        feedback.style.color = '';

        setTimeout(() => {
          feedback.textContent = contactForm.dataset.cauSuccess || 'Thank you! Your inquiry has been sent to our admissions team.';
          feedback.className = 'form-feedback cau-form-feedback success';
          feedback.style.color = '#1b8a5a';
          contactForm.reset();
        }, 1000);
      });
    }

    // Live Campus Clock updater for footer
    const initFooterClock = () => {
      const clockDigits = document.querySelectorAll('.clock-live-digits, #cauLiveClock');
      if (!clockDigits.length) return;
      const updateDigits = () => {
        try {
          const now = new Date();
          const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Nicosia',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
          const timeStr = formatter.format(now);
          clockDigits.forEach(el => { el.textContent = timeStr; });
        } catch {
          const now = new Date();
          const hours = String((now.getUTCHours() + 3) % 24).padStart(2, '0');
          const mins = String(now.getUTCMinutes()).padStart(2, '0');
          const secs = String(now.getUTCSeconds()).padStart(2, '0');
          clockDigits.forEach(el => { el.textContent = `${hours}:${mins}:${secs}`; });
        }
      };
      updateDigits();
      setInterval(updateDigits, 1000);
    };
    initFooterClock();

  };


  /**
   * Universal InternalHero helper for dynamic generation or standard declarative mounting
   */
  window.renderPageHero = (target, props = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    const {
      title = '',
      description = '',
      imageSrc = '',
      imageAlt = title,
      badge = '',
      badgeVariant = 'coral',
      breadcrumb = '',
      backHref = '/',
      backLabel = 'Back to home',
      actionsMarkup = '',
    } = props;

    const badgeMarkup = badge
      ? `<span class="cau-internal-hero__badge ${badgeVariant === 'navy' ? 'cau-internal-hero__badge--navy' : (badgeVariant === 'emerald' ? 'cau-internal-hero__badge--emerald' : '')}">${badge}</span>`
      : '';
    const breadcrumbMarkup = breadcrumb
      ? `<div class="cau-internal-hero__breadcrumb"><span>${breadcrumb}</span></div>`
      : '';
    const backMarkup = backHref
      ? `<a class="cau-internal-hero__back" href="${backHref}"><i class="fa-solid fa-arrow-left me-2" aria-hidden="true"></i>${backLabel}</a>`
      : '';
    const imageMarkup = imageSrc
      ? `<div class="cau-internal-hero__media"><img src="${imageSrc}" alt="${imageAlt}" class="cau-internal-hero__image" loading="lazy" /></div>`
      : '';

    el.innerHTML = `
      <div class="cau-internal-hero__inner">
        <div class="cau-internal-hero__top">
          <div class="cau-internal-hero__meta">${breadcrumbMarkup}${badgeMarkup}</div>
          <div class="cau-internal-hero__actions">${backMarkup}${actionsMarkup}</div>
        </div>
        <div class="cau-internal-hero__content">
          <h1 class="cau-internal-hero__title">${title}</h1>
          ${description ? `<p class="cau-internal-hero__description">${description}</p>` : ''}
        </div>
        ${imageMarkup}
      </div>
    `;
    el.classList.add('cau-internal-hero');
    return el;
  };

  /* --------------------------------------------------------------------------
     CAU INTERACTION SNIPPETS
     1. Scroll progress line at top of viewport
     2. Logo click replay rotation
     3. Directional header with requestAnimationFrame & mobile menu awareness
     -------------------------------------------------------------------------- */
  /* --------------------------------------------------------------------------
     CAU ADVANCED INTERACTIONS
     1. Scroll progress line at top of viewport
     2. Logo click replay rotation
     3. Directional header with requestAnimationFrame & mobile menu awareness
     4. Circular Scroll-To-Top button with SVG dynamic progress ring
     5. Global Quick Search Command Palette (Ctrl+K / ⌘K)
     6. Interactive 3D Card Tilt with Specular Geometry
     7. Luminous Button Ripple Effect
     8. Smooth Anchor Scrolling with Header Offset Compensation
     9. Testimonial Carousel Auto-Rotation & Touch Swipe
     -------------------------------------------------------------------------- */
  const PALETTE_ITEMS = [
    { group: 'Quick Actions', title: 'Apply for Admission', sub: 'Online application portal for 2026-2027', icon: 'fa-user-graduate', url: 'https://apply.cau.edu.tr/' },
    { group: 'Quick Actions', title: 'Explore All Programs', sub: 'Undergraduate, Master & PhD catalogue', icon: 'fa-book-open', url: '/programs.html' },
    { group: 'Quick Actions', title: 'Scholarships & 50-75% Grants', sub: 'Merit-based and international fee discounts', icon: 'fa-award', url: '/scholarships.html' },
    { group: 'Quick Actions', title: 'Tuition Fees & Annual Rates', sub: 'Official fee schedules by faculty', icon: 'fa-receipt', url: '/tuition.html' },
    { group: 'Quick Actions', title: 'International Student Office', sub: 'Visa support, accommodation & arrival services', icon: 'fa-globe', url: '/international.html' },
    { group: 'Quick Actions', title: 'Campus FAQ Database', sub: 'Answers on housing, language prep & credits', icon: 'fa-circle-question', url: '/faq.html' },
    { group: 'Quick Actions', title: 'About Cyprus Aydin University', sub: 'History, leadership, deans & accreditation', icon: 'fa-landmark', url: '/about.html' },
    { group: 'Quick Actions', title: 'Ask CAU AI Assistant', sub: 'Instant answers in Arabic, Turkish, English', icon: 'fa-robot', action: 'open-chat' },
    { group: 'Faculties & Programs', title: 'Faculty of Medicine (MD)', sub: '6-year Doctor of Medicine (English)', icon: 'fa-heart-pulse', url: '/programs.html?faculty=medicine' },
    { group: 'Faculties & Programs', title: 'Faculty of Dentistry (BDS)', sub: '5-year Dental Surgery degree (English/Turkish)', icon: 'fa-tooth', url: '/programs.html?faculty=dentistry' },
    { group: 'Faculties & Programs', title: 'Software Engineering (BSc)', sub: 'Faculty of Engineering & Architecture', icon: 'fa-laptop-code', url: '/programs.html?faculty=engineering' },
    { group: 'Faculties & Programs', title: 'Computer Engineering (BSc)', sub: 'Faculty of Engineering & Architecture', icon: 'fa-microchip', url: '/programs.html?faculty=engineering' },
    { group: 'Faculties & Programs', title: 'Architecture (BArch)', sub: 'Faculty of Engineering & Architecture', icon: 'fa-compass-drafting', url: '/programs.html?faculty=engineering' },
    { group: 'Faculties & Programs', title: 'Business Administration (BBA)', sub: 'Faculty of Economics & Administrative Sciences', icon: 'fa-briefcase', url: '/programs.html?faculty=business' },
    { group: 'Faculties & Programs', title: 'Pharmacy (PharmD)', sub: 'Faculty of Pharmacy', icon: 'fa-pills', url: '/programs.html?faculty=pharmacy' },
    { group: 'Faculties & Programs', title: 'Nursing (BSc)', sub: 'Faculty of Health Sciences', icon: 'fa-user-nurse', url: '/programs.html?faculty=health' },
    { group: 'Faculties & Programs', title: 'MBA & Graduate Studies', sub: 'Master of Business Administration & MSc degrees', icon: 'fa-graduation-cap', url: '/programs.html?faculty=graduate' }
  ];

  let cauPaletteBackdropInstance = null;
  let cauOpenPaletteFn = null;
  let cauClosePaletteFn = null;

  const initCAUPalette = () => {
    if (cauPaletteBackdropInstance && document.body.contains(cauPaletteBackdropInstance)) {
      return;
    }

    let paletteBackdrop = document.getElementById('cauPaletteBackdrop');
    if (!paletteBackdrop) {
      paletteBackdrop = document.createElement('div');
      paletteBackdrop.id = 'cauPaletteBackdrop';
      paletteBackdrop.className = 'cau-palette-backdrop';
      paletteBackdrop.setAttribute('aria-hidden', 'true');
      paletteBackdrop.innerHTML = `
        <div class="cau-palette-dialog" role="dialog" aria-modal="true" aria-label="Search CAU">
          <div class="cau-palette-header">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input class="cau-palette-input" id="cauPaletteInput" type="text" placeholder="Search programs, faculties, admissions, tuition..." autocomplete="off" spellcheck="false" />
            <span class="cau-palette-badge">ESC</span>
          </div>
          <div class="cau-palette-results" id="cauPaletteResults"></div>
          <div class="cau-palette-footer">
            <div class="cau-palette-keys">
              <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> navigate</span>
              <span><kbd>&crarr; Enter</kbd> select</span>
              <span><kbd>ESC</kbd> close</span>
            </div>
            <span>Cyprus Aydin University</span>
          </div>
        </div>
      `;
      document.body.appendChild(paletteBackdrop);
    }
    cauPaletteBackdropInstance = paletteBackdrop;

    const paletteInput = paletteBackdrop.querySelector('#cauPaletteInput');
    const paletteResults = paletteBackdrop.querySelector('#cauPaletteResults');
    let selectedIndex = 0;
    let currentFiltered = [];

    const renderResults = (query = '') => {
      const q = query.trim().toLowerCase();
      currentFiltered = PALETTE_ITEMS.filter((item) =>
        !q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)
      );

      if (currentFiltered.length === 0) {
        paletteResults.innerHTML = `
          <div style="padding: 32px 16px; text-align: center; color: var(--muted);">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 24px; margin-bottom: 8px; opacity: .5;"></i>
            <p style="margin: 0; font-size: 14px;">No matching results for "${query}"</p>
            <p style="margin: 4px 0 0; font-size: 12px;">Try searching for "Medicine", "Engineering", "Tuition", or "Scholarships".</p>
          </div>
        `;
        return;
      }

      selectedIndex = Math.min(selectedIndex, currentFiltered.length - 1);
      let html = '';
      let lastGroup = '';

      currentFiltered.forEach((item, index) => {
        if (item.group !== lastGroup) {
          html += `<div class="cau-palette-group-title">${item.group}</div>`;
          lastGroup = item.group;
        }
        const isSelected = index === selectedIndex;
        html += `
          <a class="cau-palette-item ${isSelected ? 'is-selected' : ''}" data-index="${index}" href="${item.url || '#'}" ${item.action ? `data-palette-action="${item.action}"` : ''}>
            <div class="cau-palette-item-left">
              <div class="cau-palette-item-icon"><i class="fa-solid ${item.icon}" aria-hidden="true"></i></div>
              <div class="cau-palette-item-text">
                <div class="cau-palette-item-title">${item.title}</div>
                <div class="cau-palette-item-sub">${item.sub}</div>
              </div>
            </div>
            <div class="cau-palette-item-enter"><i class="fa-solid fa-arrow-turn-down fa-rotate-90"></i></div>
          </a>
        `;
      });
      paletteResults.innerHTML = html;
    };

    const openPalette = () => {
      paletteBackdrop.classList.add('is-open');
      paletteBackdrop.setAttribute('aria-hidden', 'false');
      paletteInput.value = '';
      selectedIndex = 0;
      renderResults();
      window.setTimeout(() => paletteInput.focus(), 50);
    };

    const closePalette = () => {
      paletteBackdrop.classList.remove('is-open');
      paletteBackdrop.setAttribute('aria-hidden', 'true');
    };

    cauOpenPaletteFn = openPalette;
    cauClosePaletteFn = closePalette;
    window.CAU_OPEN_PALETTE = openPalette;
    window.CAU_CLOSE_PALETTE = closePalette;

    const executeItem = (item) => {
      if (!item) return;
      closePalette();
      if (item.action === 'open-chat') {
        const chatBtn = document.querySelector('.cau-chat-pill') || document.querySelector('[data-cau-chat-trigger]');
        if (chatBtn) chatBtn.click();
        else if (window.CAU_OPEN_ASSISTANT) window.CAU_OPEN_ASSISTANT();
      } else if (item.url) {
        window.location.href = item.url;
      }
    };

    paletteInput?.addEventListener('input', (e) => {
      selectedIndex = 0;
      renderResults(e.target.value);
    });

    paletteInput?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentFiltered.length > 0) {
          selectedIndex = (selectedIndex + 1) % currentFiltered.length;
          renderResults(paletteInput.value);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentFiltered.length > 0) {
          selectedIndex = (selectedIndex - 1 + currentFiltered.length) % currentFiltered.length;
          renderResults(paletteInput.value);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeItem(currentFiltered[selectedIndex]);
      } else if (e.key === 'Escape') {
        closePalette();
      }
    });

    paletteBackdrop.addEventListener('click', (e) => {
      if (e.target === paletteBackdrop) closePalette();
      const clickedItem = e.target.closest('.cau-palette-item');
      if (clickedItem) {
        e.preventDefault();
        const idx = Number(clickedItem.dataset.index);
        executeItem(currentFiltered[idx]);
      }
    });

    // Global hotkeys & click delegation
    document.addEventListener('keydown', (e) => {
      const isEditing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (paletteBackdrop.classList.contains('is-open')) closePalette();
        else openPalette();
      } else if (e.key === '/' && !isEditing) {
        e.preventDefault();
        openPalette();
      } else if (e.key === 'Escape' && paletteBackdrop.classList.contains('is-open')) {
        closePalette();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-open-palette], .cau-search-trigger')) {
        e.preventDefault();
        openPalette();
      }
    });
  };

  const initCAUInteractions = () => {
    if (window.CAU_INTERACTIONS_INITIALIZED) return;
    window.CAU_INTERACTIONS_INITIALIZED = true;

    // 1. Scroll progress line
    let progress = document.querySelector('.scroll-progress');
    if (!progress) {
      progress = document.createElement('div');
      progress.className = 'scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progress);
    }

    // Scroll-To-Top Button — disabled
    let scrollTopBtn = null;
    let scrollTopRing = null;

    const getHeader = () => document.querySelector('.site-header');
    let lastHeaderScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    let headerFrame = 0;

    const updateScrollAndHeader = () => {
      const currentY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
      const delta = currentY - lastHeaderScrollY;
      const header = getHeader();

      // Update progress bar
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = max > 0 ? Math.min(100, Math.max(0, (currentY / max) * 100)) : 0;
      if (progress) {
        progress.style.width = `${scrollPercent}%`;
      }

      // Directional header behavior
      if (header) {
        header.classList.toggle('is-scrolled', currentY > 8);

        const isNavOpen = document.body.classList.contains('cau-nav-open');
        if (isNavOpen) {
          header.classList.remove('is-hidden');
          return;
        }

        const hasFocus = header.contains(document.activeElement);

        if (currentY <= 140 || hasFocus || delta < -6) {
          header.classList.remove('is-hidden');
        } else if (currentY > 140 && delta > 6) {
          header.classList.add('is-hidden');
        }
      }

      lastHeaderScrollY = currentY;
      headerFrame = 0;
    };

    window.addEventListener('scroll', () => {
      if (!headerFrame) {
        headerFrame = window.requestAnimationFrame(updateScrollAndHeader);
      }
    }, { passive: true });

    window.addEventListener('resize', updateScrollAndHeader, { passive: true });
    updateScrollAndHeader();

    // 3. Logo click rotation & menu toggle interaction
    document.addEventListener('click', (event) => {
      const brand = event.target.closest('.site-header .navbar-brand');
      if (brand) {
        const mark = brand.querySelector('.brand-mark');
        if (mark) {
          mark.classList.remove('is-click-rotating');
          void mark.offsetWidth; // Force reflow to restart animation
          mark.classList.add('is-click-rotating');
        }
      }

      if (event.target.closest('.cau-menu-toggle')) {
        const header = getHeader();
        header?.classList.remove('is-hidden');
      }
    });

    // 4. Quick Search Command Palette (Ctrl+K / ⌘K)
    initCAUPalette();

    // 5. 3D Card Tilt with Specular Geometry
    const init3DCardTilt = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      const cards = document.querySelectorAll('.degree-card, .news-card, .video-card');
      cards.forEach((card) => {
        if (card.dataset.cauTiltAttached === 'true') return;
        card.dataset.cauTiltAttached = 'true';
        let tiltFrame = 0;

        card.addEventListener('pointermove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const normX = (x / rect.width - 0.5) * 2;
          const normY = (y / rect.height - 0.5) * 2;

          if (!tiltFrame) {
            tiltFrame = requestAnimationFrame(() => {
              const rotX = (-normY * 5.5).toFixed(2);
              const rotY = (normX * 5.5).toFixed(2);
              card.style.transform = `perspective(850px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
              tiltFrame = 0;
            });
          }
        }, { passive: true });

        card.addEventListener('pointerleave', () => {
          if (tiltFrame) { cancelAnimationFrame(tiltFrame); tiltFrame = 0; }
          card.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
      });
    };
    init3DCardTilt();

    // 6. Luminous Button Ripple Effect
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn, .btn-coral, .hero-video-action, .apply-btn, .social-pill, .cau-scroll-top, .cau-search-trigger');
      if (!btn) return;
      btn.classList.add('cau-ripple-container');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'cau-ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });

    // 7. Smooth Anchor Scrolling with Header Offset Compensation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#!')) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const header = getHeader();
      const offset = header ? header.offsetHeight + 18 : 24;
      const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
      if (history.pushState) history.pushState(null, '', href);
    });

    // 8. Testimonial Carousel Auto-Rotation & Touch Swipe
    const stage = document.querySelector('[data-testimonial-carousel]');
    if (stage && !stage.dataset.cauAutoRotateReady) {
      stage.dataset.cauAutoRotateReady = 'true';
      let autoTimer = null;
      const startAuto = () => {
        stopAuto();
        autoTimer = setInterval(() => {
          stage.querySelector('.testimonial-next')?.click();
        }, 6500);
      };
      const stopAuto = () => {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      };

      stage.addEventListener('mouseenter', stopAuto);
      stage.addEventListener('mouseleave', startAuto);
      stage.addEventListener('focusin', stopAuto);
      stage.addEventListener('focusout', startAuto);
      startAuto();

      let touchStartX = 0;
      stage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      stage.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) stage.querySelector('.testimonial-prev')?.click();
          else stage.querySelector('.testimonial-next')?.click();
        }
      }, { passive: true });
    }
  };

  const mountSharedShell = () => {
    mountSharedHeader();
    mountSharedFooter();
    try { applyTheme(localStorage.getItem(themeStorageKey), false); } catch { applyTheme('light', false); }
    initCAUPalette();
    initCAUInteractions();
  };
  window.CAU_MOUNT_SHARED_HEADER = mountSharedHeader;
  window.CAU_MOUNT_SHARED_FOOTER = mountSharedFooter;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountSharedShell, { once: true });
  else mountSharedShell();

  document.addEventListener('click', (event) => {
    const themeButton = event.target.closest('[data-theme-mode]');
    if (themeButton) applyTheme(themeButton.dataset.themeMode);
  });

    if (!document.querySelector('script[data-cau-interactions-loader]') && !document.querySelector('script[src*="cau-interactions.js"]')) {
    const interScript = document.createElement('script');
    interScript.src = '/scripts/cau-interactions.js';
    interScript.defer = true;
    interScript.dataset.cauInteractionsLoader = 'true';
    document.body.appendChild(interScript);
  }
if (!document.querySelector('script[data-cau-chat-loader]') && !document.querySelector('script[src*="ai-chat.js"]')) {
    const chatScript = document.createElement('script');
    chatScript.src = '/scripts/ai-chat.js';
    chatScript.defer = true;
    chatScript.dataset.cauChatLoader = 'true';
    document.head.appendChild(chatScript);
  }
})();