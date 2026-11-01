/**
 * CAU Clean-Space & Scroll Progressive Disclosure Engine
 * 1. Smart Directional Header (Hides on scroll down, shows on scroll up)
 * 2. Bidirectional Viewport Spotlight (Sections fade/scale in when in view, recede when scrolled past)
 * 3. Desktop Scrollytelling Pinned Stage
 */
(function initCauCleanSpaceEngine() {
  const header = document.querySelector('.cau-header, header, .site-header');
  const sections = document.querySelectorAll('.cau-scroll-section, main > section, section.split-section, section.cau-content-header');

  let lastScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  let ticking = false;

  // 1. Assign Stagger Indices to Child Cards automatically
  sections.forEach((section) => {
    section.classList.add('cau-scroll-section');
    const items = section.querySelectorAll('.cau-card, .program-directory-card, .testimonial-story-card, .student-life-card, .news-card, .cau-scroll-item');
    items.forEach((item, idx) => {
      item.classList.add('cau-scroll-item');
      item.style.setProperty('--stagger-index', idx % 6);
    });
  });

  // Ensure initial hero is visible immediately
  const hero = document.getElementById('creator') || sections[0];
  if (hero) hero.classList.add('is-in-view');

  // 2. Bidirectional Section Spotlight Observer
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
          } else {
            // Bidirectional clean-space: recede section when scrolled out of active zone
            // (Keep hero visible when near top)
            if (entry.target.id === 'creator' && window.scrollY < 200) {
              entry.target.classList.add('is-in-view');
            } else {
              entry.target.classList.remove('is-in-view');
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-8% 0px -8% 0px',
        threshold: 0.06
      }
    );

    sections.forEach((sec) => sectionObserver.observe(sec));
  } else {
    sections.forEach((sec) => sec.classList.add('is-in-view'));
  }

  // 3. 60fps Scroll Direction Loop for Smart Header
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
          const scrollDelta = currentScrollY - lastScrollY;

          // Smart Header Hide/Reveal
          if (header) {
            header.classList.toggle('is-scrolled', currentScrollY > 40);

            const isSearchOpen = header.classList.contains('has-search-open');
            const isNavOpen = document.body.classList.contains('cau-nav-open');
            const hasFocus = header.contains(document.activeElement);

            if (isSearchOpen || isNavOpen || hasFocus) {
              header.classList.remove('is-hidden');
            } else if (currentScrollY > 140 && scrollDelta > 6) {
              header.classList.add('is-hidden'); // Scrolling down -> hide header for clean space
            } else if (scrollDelta < -6 || currentScrollY <= 140) {
              header.classList.remove('is-hidden'); // Scrolling up -> show header immediately
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  console.log('CAU Clean-Space & Progressive Disclosure Engine active (Card curtain disclosure undone).');
})();
