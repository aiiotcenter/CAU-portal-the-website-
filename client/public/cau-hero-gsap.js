/* GSAP micro-interactions: overlay nav button cards and action buttons */
(() => {
  const init = () => {
    if (typeof gsap === 'undefined') return;

    // Overlay nav button cards: smooth horizontal slide
    const navBtns = document.querySelectorAll('.cau-nav-btn');
    navBtns.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { x: 6, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
      });
    });

    // Action buttons: subtle elevation
    const buttons = document.querySelectorAll('.site-header .apply-btn, .hero-video-action, .cau-menu-toggle');
    buttons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { y: -2, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { y: 0, duration: 0.24, ease: 'power2.out', overwrite: 'auto' });
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
