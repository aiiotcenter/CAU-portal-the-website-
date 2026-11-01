/* Cyprus Aydın University — Article Detail Dynamic Loader
   Fetches full press release and article content from CMS news.json */

(() => {
  const escapeHtml = (value) =>
    String(value || '').replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }[char]));

  const formatArticleDate = (isoStr) => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const calculateReadTime = (text) => {
    const wordCount = (text || '').trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${Math.max(1, minutes)} min read`;
  };

  const initArticle = async () => {
    const params = new URLSearchParams(window.location.search);
    const slugQuery = params.get('slug') || params.get('id') || window.location.hash.replace('#', '').trim();

    try {
      const res = await fetch(`/news.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const newsList = await res.json();
      if (!Array.isArray(newsList) || !newsList.length) {
        showError('No articles currently available.');
        return;
      }

      // Match target article
      let article = null;
      if (slugQuery) {
        const q = decodeURIComponent(slugQuery).toLowerCase();
        article = newsList.find(
          (n) =>
            (n.slug && n.slug.toLowerCase() === q) ||
            (n.id && n.id.toLowerCase() === q) ||
            n.title.toLowerCase() === q ||
            n.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === q
        );
      }

      // Default to first published story
      if (!article) {
        article = newsList.find((n) => n.status === 'published') || newsList[0];
      }

      renderArticle(article, newsList);
    } catch (err) {
      console.error('[Article] Failed to load news article:', err);
      showError('Unable to load the requested article. Please check your internet connection.');
    }
  };

  const renderArticle = (article, allNews) => {
    // 1. Meta & Title
    document.title = `${article.title} | Cyprus Aydın University`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && article.summary) metaDesc.setAttribute('content', article.summary);

    // 2. Breadcrumbs & Badges
    const catBadge = document.querySelector('#articleCategoryBadge');
    const catBreadcrumb = document.querySelector('#articleCategoryBreadcrumb');
    const displayCategory = article.category || 'Academic';
    if (catBadge) catBadge.textContent = displayCategory;
    if (catBreadcrumb) catBreadcrumb.textContent = displayCategory.toUpperCase();

    // 3. Headline
    const headlineEl = document.querySelector('#articleHeadline');
    if (headlineEl) headlineEl.textContent = article.title;

    // 4. Author & Date
    const authorEl = document.querySelector('#articleAuthor');
    const dateEl = document.querySelector('#articleDate');
    const readTimeEl = document.querySelector('#articleReadTime');
    if (authorEl) authorEl.textContent = article.author || 'CAU Media Relations';
    if (dateEl) dateEl.textContent = formatArticleDate(article.publishedAt);
    if (readTimeEl) {
      const fullText = `${article.summary || ''} ${article.content || ''}`;
      readTimeEl.textContent = calculateReadTime(fullText);
    }

    // 5. Featured Hero Image
    const heroImg = document.querySelector('#articleHeroImg');
    const heroCaption = document.querySelector('#articleHeroCaption');
    const imageSrc = article.image || '/assets/untitled2-13-24f9b4bd8b_652e8d35.jpg';
    if (heroImg) {
      heroImg.src = imageSrc;
      heroImg.alt = article.title;
    }
    if (heroCaption) {
      heroCaption.textContent = article.title;
    }

    // 6. Lead & Body Text
    const leadEl = document.querySelector('#articleLead');
    const bodyEl = document.querySelector('#articleBodyText');

    if (leadEl) {
      if (article.summary) {
        leadEl.textContent = article.summary;
        leadEl.hidden = false;
      } else {
        leadEl.hidden = true;
      }
    }

    if (bodyEl) {
      const textToRender = article.content || article.summary || '';
      // Split paragraphs by newline
      const paragraphs = textToRender
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (paragraphs.length) {
        bodyEl.innerHTML = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
      } else {
        bodyEl.innerHTML = `<p>${escapeHtml(article.title)}</p>`;
      }
    }

    // 7. Share Links
    const currentUrl = window.location.href;
    const shareTitle = article.title;

    const shareWa = document.querySelector('#shareWhatsApp');
    const shareTw = document.querySelector('#shareTwitter');
    const shareLi = document.querySelector('#shareLinkedIn');
    const shareCopy = document.querySelector('#shareCopy');

    if (shareWa) {
      shareWa.href = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' — ' + currentUrl)}`;
    }
    if (shareTw) {
      shareTw.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`;
    }
    if (shareLi) {
      shareLi.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    }
    if (shareCopy) {
      shareCopy.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(currentUrl);
          const origText = shareCopy.title;
          shareCopy.style.background = '#10b981';
          shareCopy.style.borderColor = '#10b981';
          shareCopy.style.color = '#ffffff';
          setTimeout(() => {
            shareCopy.style.background = '';
            shareCopy.style.borderColor = '';
            shareCopy.style.color = '';
          }, 2000);
        } catch {
          // Fallback alert
          prompt('Copy article URL:', currentUrl);
        }
      });
    }

    // 8. Related Stories Sidebar
    const relatedContainer = document.querySelector('#relatedStoriesList');
    if (relatedContainer) {
      const others = allNews.filter((n) => n.id !== article.id && n.status === 'published').slice(0, 3);
      if (others.length) {
        relatedContainer.innerHTML = others
          .map((item) => {
            const thumb = item.image || '/assets/untitled2-12-b26e7632db_5e13efc2.jpg';
            const url = `/news-details.html?slug=${encodeURIComponent(item.slug || item.id)}`;
            return `
            <a href="${url}" class="related-story-item">
              <img src="${escapeHtml(thumb)}" alt="${escapeHtml(item.title)}" class="related-story-thumb" loading="lazy" />
              <div class="related-story-info">
                <h5>${escapeHtml(item.title)}</h5>
                <span class="related-story-date">${escapeHtml(formatArticleDate(item.publishedAt))}</span>
              </div>
            </a>
          `;
          })
          .join('');
      } else {
        relatedContainer.innerHTML = '<p style="font-size:12px;color:var(--muted);">No additional stories found.</p>';
      }
    }
  };

  const showError = (message) => {
    const headline = document.querySelector('#articleHeadline');
    if (headline) headline.textContent = 'Article Not Found';
    const body = document.querySelector('#articleBodyText');
    if (body) {
      body.innerHTML = `
        <div style="padding: 24px; background: #fff5f5; border: 1px solid #fed7d7; border-radius: 4px; color: #c53030;">
          <p style="margin: 0; font-weight: 600;">${escapeHtml(message)}</p>
          <p style="margin: 8px 0 0; font-size: 14px;"><a href="/news.html" style="color: var(--coral); text-decoration: underline;">Return to News and Events directory</a></p>
        </div>
      `;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArticle, { once: true });
  } else {
    initArticle();
  }
})();
