/**
 * Cyprus Aydin University (CAU) — FAQ Page Interactions
 * Category Filtering & Live Search Engine (Accordions handled by CAU Engine)
 */

document.addEventListener('DOMContentLoaded', () => {
  const items = [...document.querySelectorAll('.faq-item')];
  const searchInput = document.getElementById('faqSearchInput');
  const searchClear = document.getElementById('faqSearchClear');
  const catPills = [...document.querySelectorAll('.cat-pill')];
  const toggleAllBtn = document.getElementById('toggleAllFaq');
  const noResults = document.getElementById('faqNoResults');
  const resetBtn = document.getElementById('resetFaqSearch');

  if (!items.length) return;

  let activeCategory = 'all';
  let activeSearchQuery = '';
  let allExpanded = false;

  // Filter items based on activeCategory and activeSearchQuery
  const applyFilters = () => {
    let visibleCount = 0;
    const query = activeSearchQuery.trim().toLowerCase();

    items.forEach((item) => {
      const cat = item.dataset.category || '';
      const matchesCategory = activeCategory === 'all' || cat === activeCategory;

      const questionText = item.querySelector('.question-text')?.textContent.toLowerCase() || '';
      const answerText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
      const matchesQuery = !query || questionText.includes(query) || answerText.includes(query);

      if (matchesCategory && matchesQuery) {
        item.style.display = 'block';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  // Category selection
  catPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      catPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      activeCategory = pill.dataset.category || 'all';
      applyFilters();
    });
  });

  // Live Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value;
      if (searchClear) {
        searchClear.style.display = activeSearchQuery ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  // Clear search button
  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      activeSearchQuery = '';
      searchClear.style.display = 'none';
      applyFilters();
      searchInput.focus();
    });
  }

  // Reset search & category button in no-results state
  if (resetBtn && searchInput) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      activeSearchQuery = '';
      if (searchClear) searchClear.style.display = 'none';
      activeCategory = 'all';
      catPills.forEach((p) => p.classList.toggle('is-active', p.dataset.category === 'all'));
      applyFilters();
    });
  }

  // Expand / Collapse All
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      items.forEach((item) => {
        const btn = item.querySelector('.faq-question');
        if (allExpanded) {
          item.classList.add('open', 'is-open');
          btn?.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('open', 'is-open');
          btn?.setAttribute('aria-expanded', 'false');
        }
      });
      toggleAllBtn.innerHTML = allExpanded
        ? '<i class="fa-solid fa-compress me-1" aria-hidden="true"></i> Collapse All'
        : '<i class="fa-solid fa-arrows-up-down me-1" aria-hidden="true"></i> Expand All';
    });
  }
});
