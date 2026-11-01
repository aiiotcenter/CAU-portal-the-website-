(() => {
    const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[char]));
    const decodeTrpcData = (payload) => payload ?.result ?.data ?.json || payload ?.result ?.data || payload ?.[0] ?.result ?.data ?.json || null;
    const loadPublishedNews = async () => {
        try {
            const response = await fetch('/api/trpc/cms.publicNews?input=%7B%22json%22%3Anull%7D', {
                credentials: 'same-origin'
            });
            if (!response.ok) return [];
            const data = decodeTrpcData(await response.json());
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    };
    const formatDate = (value, archiveStyle = false) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat(archiveStyle ? 'en-GB' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };
    const renderHomeNews = (stories) => {
        const grid = document.querySelector('.news-grid');
        if (!grid) return;
        const featured = stories.slice(0, 2);
        grid.innerHTML = `${featured.map((story) => `<article class="news-card cau-card" data-category="${escapeHtml(story.categories.join(' '))}"><a class="news-image-wrap" href="/news.html#${encodeURIComponent(story.slug)}" aria-label="Read: ${escapeHtml(story.title)}"><img src="${escapeHtml(story.imageUrl)}" alt="${escapeHtml(story.imageAlt || story.title)}" loading="lazy" decoding="async" /></a><div class="news-card__body"><h3 class="news-card__title"><a href="/news.html#${encodeURIComponent(story.slug)}">${escapeHtml(story.title)}</a></h3><time datetime="${escapeHtml(story.publishedDate || '')}" class="news-card__date">${escapeHtml(formatDate(story.publishedDate))}</time><p class="news-card__summary">${escapeHtml(story.excerpt || '')}</p><a class="news-card__action" href="/news.html#${encodeURIComponent(story.slug)}" aria-label="Read full story: ${escapeHtml(story.title)}"><span>Read full story</span><i class="system-arrow ms-1" aria-hidden="true"></i></a></div></article>`).join('')}<a class="show-all" href="/news.html"><span>Show all news and events</span> <i class="system-arrow ms-1" aria-hidden="true"></i></a>`;
        window.CAU_REFRESH_NEWS ?.();
    };
    const renderArchiveNews = (stories) => {
        const grid = document.querySelector('.news-archive-grid');
        if (!grid) return;
        grid.innerHTML = stories.map((story, index) => `<article class="news-archive-card${index === 0 ? ' news-archive-card-featured' : ''}" id="${escapeHtml(story.slug)}" data-archive-category="${escapeHtml(story.categories.join(' '))}" data-archive-search="${escapeHtml(`${story.title} ${story.excerpt} ${story.categories.join(' ')}`)}"><img src="${escapeHtml(story.imageUrl)}" alt="${escapeHtml(story.imageAlt || story.title)}" /><div><span class="news-archive-category">${escapeHtml(story.categories.join(' / '))}</span><h2>${escapeHtml(story.title)}</h2><time datetime="${escapeHtml(story.publishedDate || '')}">${escapeHtml(formatDate(story.publishedDate, true))}</time><p>${escapeHtml(story.excerpt || '')}</p><a href="#contact" aria-label="Request details about ${escapeHtml(story.title)}">Request details <i class="system-arrow ms-1" aria-hidden="true"></i></a></div></article>`).join('');
        window.CAU_REFRESH_NEWS_ARCHIVE ?.();
    };
    document.addEventListener('DOMContentLoaded', async () => {
        const stories = await loadPublishedNews();
        if (!stories.length) return;
        renderHomeNews(stories);
        renderArchiveNews(stories);
    });
})();