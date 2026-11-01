/* Swiss editorial university interactions: coral actions, thin-rule geometry, and restrained motion. */
/* ─── CUSTOM CURSOR (runs on all pages that load this script) ─────────────── */
(() => {
  if (window.__CAU_MILK_INITIALIZED__) return;
  window.__CAU_MILK_INITIALIZED__ = true;
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(hover: none)').matches;
  if (isTouch) return;
  const existingRing = document.querySelector('.cau-page-cursor');
  if (existingRing) existingRing.remove();
  let dot = document.querySelector('.cau-page-cursor-dot');
  if (!dot) {
    dot = document.createElement('div');
    dot.className = 'cau-page-cursor-dot is-hidden';
    document.body.appendChild(dot);
  }
  let visible = false;
  window.addEventListener('mousemove', (e) => {
    if (!visible) { visible = true; dot.classList.remove('is-hidden'); }
    dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });
  document.addEventListener('mouseleave', () => { visible = false; dot.classList.add('is-hidden'); });
  document.addEventListener('mouseenter', () => { visible = true; dot.classList.remove('is-hidden'); });
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a,button,.btn,input,select,textarea,[role="button"],[tabindex="0"]')) dot.classList.add('is-hovering');
  }, { passive: true });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a,button,.btn,input,select,textarea,[role="button"],[tabindex="0"]')) dot.classList.remove('is-hovering');
  }, { passive: true });
  document.addEventListener('mousedown', () => dot.classList.add('is-active-press'));
  document.addEventListener('mouseup', () => dot.classList.remove('is-active-press'));
})();
/* ─────────────────────────────────────────────────────────────────────────── */
(() => {
    const canUsePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.CAU_ADD_CARD_INDICATOR = () => {};
        const activate = (event) => {
            positionIndicator(event);
            surface.classList.add('is-pointer-active');
        };
        const deactivate = () => surface.classList.remove('is-pointer-active');
        if (window.PointerEvent) {
            surface.addEventListener('pointerenter', activate);
            surface.addEventListener('pointermove', positionIndicator);
            surface.addEventListener('pointerleave', deactivate);
        } else {
            surface.addEventListener('mouseenter', activate);
            surface.addEventListener('mousemove', positionIndicator);
            surface.addEventListener('mouseleave', deactivate);
        }
    };

    const dropdownRegistry = [];
    const closeDropdowns = (except) => dropdownRegistry.forEach((entry) => {
        if (entry !== except) entry.close(false);
    });
    window.CAU_ENHANCE_SELECT = (select, {
        align = 'left',
        wide = false
    } = {}) => {
        if (!select || select.dataset.cauEnhanced) return;
        select.dataset.cauEnhanced = 'true';
        select.classList.add('cau-dd-native');
        const dropdown = document.createElement('div');
        dropdown.className = `cau-dd${align === 'right' ? ' cau-dd-right' : ''}${wide ? ' cau-dd-wide' : ''}`;
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'cau-dd-toggle';
        toggle.setAttribute('aria-haspopup', 'listbox');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', select.getAttribute('aria-label') || 'Select an option');
        const value = document.createElement('span');
        value.className = 'cau-dd-value';
        const chevron = document.createElement('i');
        chevron.className = 'fa-solid fa-chevron-down cau-dd-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        toggle.append(value, chevron);
        const panel = document.createElement('div');
        panel.className = 'cau-dd-panel';
        panel.setAttribute('role', 'listbox');
        select.insertAdjacentElement('afterend', dropdown);
        dropdown.append(toggle, panel, select);
        const entry = {
            select,
            dropdown,
            toggle,
            panel,
            value,
            close(focus) {
                dropdown.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                if (focus) toggle.focus();
            },
            sync() {
                const option = select.selectedOptions[0] || select.options[0];
                if (!option) {
                    value.textContent = '';
                    return;
                }
                const text = option.textContent.trim();
                const match = text.match(/^(.*?)\s*\((\d+)\)$/);
                if (match) {
                    value.innerHTML = `<span class="cau-dd-value-title">${match[1]}</span> <span class="cau-dd-value-count">(${match[2]})</span>`;
                } else {
                    value.textContent = text;
                }
            },
            build() {
                panel.textContent = '';
                Array.from(select.options).forEach((option, index) => {
                    const optionButton = document.createElement('button');
                    optionButton.type = 'button';
                    optionButton.className = 'cau-dd-option';
                    optionButton.setAttribute('role', 'option');
                    optionButton.setAttribute('aria-selected', String(index === select.selectedIndex));
                    
                    const text = option.textContent.trim();
                    const match = text.match(/^(.*?)\s*\((\d+)\)$/);
                    if (match) {
                        optionButton.innerHTML = `<span class="cau-dd-option-text">${match[1]}</span><span class="cau-dd-option-meta"><span class="cau-dd-badge">${match[2]}</span><i class="fa-solid fa-check cau-dd-check" aria-hidden="true"></i></span>`;
                    } else {
                        optionButton.innerHTML = `<span class="cau-dd-option-text">${text}</span><i class="fa-solid fa-check cau-dd-check" aria-hidden="true"></i>`;
                    }

                    optionButton.addEventListener('click', () => {
                        select.value = option.value;
                        select.dispatchEvent(new Event('change', {
                            bubbles: true
                        }));
                        entry.close(true);
                    });
                    panel.appendChild(optionButton);
                });
            },
        };
        toggle.addEventListener('click', () => {
            if (dropdown.classList.contains('open')) return entry.close(true);
            closeDropdowns(entry);
            entry.build();
            dropdown.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
            const selectedOpt = panel.querySelector('[aria-selected="true"]');
            if (selectedOpt) {
                selectedOpt.focus();
                selectedOpt.scrollIntoView({ block: 'nearest' });
            } else {
                panel.firstElementChild?.focus();
            }
        });
        dropdown.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                entry.close(true);
            } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                if (!dropdown.classList.contains('open')) {
                    entry.build();
                    dropdown.classList.add('open');
                    toggle.setAttribute('aria-expanded', 'true');
                }
                const options = Array.from(panel.querySelectorAll('.cau-dd-option'));
                if (!options.length) return;
                const activeIndex = options.indexOf(document.activeElement);
                let nextIndex = event.key === 'ArrowDown' ? activeIndex + 1 : activeIndex - 1;
                if (nextIndex < 0) nextIndex = options.length - 1;
                if (nextIndex >= options.length) nextIndex = 0;
                options[nextIndex]?.focus();
                options[nextIndex]?.scrollIntoView({ block: 'nearest' });
            }
        });
        select.addEventListener('change', entry.sync);
        entry.sync();
        dropdownRegistry.push(entry);
    };
    window.CAU_SYNC_SELECTS = () => dropdownRegistry.forEach((entry) => {
        entry.build();
        entry.sync();
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.cau-dd')) closeDropdowns(null);
    });
})();

document.addEventListener('DOMContentLoaded', () => {

    const heroVideo = document.querySelector('.hero-video-native[data-start-at]');
    if (heroVideo) {
        const startAt = Number(heroVideo.dataset.startAt) || 0;
        let startApplied = false;
        const seekToStart = () => {
            if (!Number.isFinite(heroVideo.duration) || heroVideo.duration <= startAt) return;
            heroVideo.currentTime = startAt;
            startApplied = true;
        };
        if (heroVideo.readyState >= HTMLMediaElement.HAVE_METADATA) seekToStart();
        else heroVideo.addEventListener('loadedmetadata', seekToStart, {
            once: true
        });
        heroVideo.addEventListener('timeupdate', () => {
            if (startApplied && heroVideo.currentTime < startAt - 0.25 && !heroVideo.seeking) seekToStart();
        });
    }

    const finderButton = document.querySelector('#findProgramBtn');
    const finderFeedback = document.querySelector('#finderFeedback');
    const levelSelect = document.querySelector('#levelSelect');
    const interestSelect = document.querySelector('#interestSelect');

    finderButton ?.addEventListener('click', () => {
        const level = levelSelect.value;
        const interest = interestSelect.value;
        finderFeedback.textContent = interest === "I'm interested in.." ?
            `Showing our ${level.toLowerCase()} programmes. Choose an area of interest for a narrower match.` :
            `Great choice — ${interest} ${level.toLowerCase()} programmes are ready to explore.`;
        document.querySelector('#degrees') ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    const directoryLevel = document.querySelector('#programDirectoryLevel');
    const directoryFaculty = document.querySelector('#programDirectoryFaculty');
    const directoryButton = document.querySelector('#programDirectoryBtn');
    const directoryStatus = document.querySelector('#programDirectoryStatus');
    const directoryGrid = document.querySelector('#homepageProgramGrid');
    const normalizeDirectory = (value) => String(value || '').trim().toLowerCase().replace(/[’‘]/g, "'");

    const i18nDirectory = {
        levelGroupLabels: {
            'Preparatory + Associate': {
                en: 'Preparatory + Associate',
                ar: 'البرامج التحضيرية والدبلوم',
                ru: 'Подготовительные и дипломные программы',
                fr: 'Programmes Préparatoires & Diplômes',
                fa: 'پیش‌دانشگاهی و کاردانی'
            },
            'Bachelor': {
                en: 'Bachelor',
                ar: 'البكالوريوس',
                ru: 'Бакалавриат',
                fr: 'Licence / Bachelor',
                fa: 'کارشناسی'
            },
            'Master': {
                en: 'Master',
                ar: 'الماجستير',
                ru: 'Магистратура',
                fr: 'Master',
                fa: 'کارشناسی ارشد'
            },
            'Ph.D.': {
                en: 'Ph.D.',
                ar: 'الدكتوراه',
                ru: 'Докторантура',
                fr: 'Doctorat',
                fa: 'دکتری'
            }
        },
        levelNames: {
            'Bachelor': { en: 'Bachelor', ar: 'البكالوريوس', ru: 'Бакалавриат', fr: 'Licence', fa: 'کارشناسی' },
            'Master': { en: 'Master', ar: 'الماجستير', ru: 'Магистратура', fr: 'Master', fa: 'کارشناسی ارشد' },
            'Ph.D.': { en: 'Ph.D.', ar: 'الدكتوراه', ru: 'Докторантура', fr: 'Doctorat', fa: 'دکتری' },
            'Associate': { en: 'Associate', ar: 'الدبلوم', ru: 'Диплом', fr: 'Diplôme', fa: 'کاردانی' },
            'Preparatory': { en: 'Preparatory', ar: 'السنة التحضيرية', ru: 'Подготовительный курс', fr: 'Préparatoire', fa: 'پیش‌دانشگاهی' }
        },
        faculties: {
            'Faculty of Dentistry': { en: 'Faculty of Dentistry', ar: 'كلية طب الأسنان', ru: 'Факультет стоматологии', fr: 'Faculté de médecine dentaire', fa: 'دانشکده دندانپزشکی' },
            'Faculty of Engineering and Architecture': { en: 'Faculty of Engineering and Architecture', ar: 'كلية الهندسة والعمارة', ru: 'Факультет инженерии и архитектуры', fr: "Faculté d'ingénierie et d'architecture", fa: 'دانشکده مهندسی و معماری' },
            'Faculty of Health Sciences': { en: 'Faculty of Health Sciences', ar: 'كلية العلوم الصحية', ru: 'Факультет медицинских наук', fr: 'Faculté des sciences de la santé', fa: 'دانشکده علوم بهداشت' },
            'Faculty of Humanities and Social Sciences': { en: 'Faculty of Humanities and Social Sciences', ar: 'كلية العلوم الإنسانية والاجتماعية', ru: 'Факультет гуманитарных и социальных наук', fr: 'Faculté des sciences humaines et sociales', fa: 'دانشکده علوم انسانی و اجتماعی' },
            'Faculty of Law': { en: 'Faculty of Law', ar: 'كلية الحقوق', ru: 'Юридический факультет', fr: 'Faculté de droit', fa: 'دانشکده حقوق' },
            'Faculty of Tourism and Applied Sciences': { en: 'Faculty of Tourism and Applied Sciences', ar: 'كلية السياحة والعلوم التطبيقية', ru: 'Факультет туризма и прикладных наук', fr: 'Faculté de tourisme et sciences appliquées', fa: 'دانشکده گردشگری و علوم کاربردی' },
            'Vocational School of Health Services': { en: 'Vocational School of Health Services', ar: 'المعهد المهني للخدمات الصحية', ru: 'Профессиональная школа медицинских услуг', fr: 'École professionnelle des services de santé', fa: 'مدرسه عالی خدمات بهداشتی' },
            'Vocational School': { en: 'Vocational School', ar: 'المعهد المهني', ru: 'Профессиональная школа', fr: 'École professionnelle', fa: 'مدرسه عالی فنی و حرفه‌ای' },
            'English Preparatory School': { en: 'English Preparatory School', ar: 'مدرسة اللغة الإنجليزية التحضيرية', ru: 'Подготовительная школа английского языка', fr: "École préparatoire d'anglais", fa: 'مدرسه پیش‌دانشگاهی زبان انگلیسی' },
            "Graduate Programs — Master's": { en: "Graduate Programs — Master's", ar: "برامج الدراسات العليا — الماجستير", ru: "Программы магистратуры", fr: "Programmes de Master", fa: "تحصیلات تکمیلی — کارشناسی ارشد" },
            "Graduate Programs — Ph.D": { en: "Graduate Programs — Ph.D", ar: "برامج الدراسات العليا — الدكتوراه", ru: "Программы докторантуры", fr: "Programmes de Doctorat", fa: "تحصیلات تکمیلی — دکتری" }
        }
    };

    const getLang = () => window.CAU_LANG || localStorage.getItem('cau-language') || 'en';
    const translateLevelGroup = (label) => {
        const lang = getLang();
        return i18nDirectory.levelGroupLabels[label]?.[lang] || label;
    };
    const translateLevel = (lvl) => {
        const lang = getLang();
        return i18nDirectory.levelNames[lvl]?.[lang] || lvl;
    };
    const translateFaculty = (fac) => {
        const lang = getLang();
        return i18nDirectory.faculties[fac]?.[lang] || fac;
    };
    const formatProgrammeCount = (count) => {
        const lang = getLang();
        if (lang === 'ar') return `${count} برنامجاً`;
        if (lang === 'ru') return `${count} программ`;
        if (lang === 'fr') return `${count} programmes`;
        if (lang === 'fa') return `${count} برنامه`;
        return `${count} programme${count === 1 ? '' : 's'}`;
    };
    const formatViewButton = (groupLabel) => {
        const lang = getLang();
        if (lang === 'ar') return 'عرض البرامج';
        if (lang === 'ru') return 'Смотреть программы';
        if (lang === 'fr') return 'Voir les programmes';
        if (lang === 'fa') return 'مشاهده برنامه‌ها';
        return 'View programmes';
    };
    const formatMoreText = (n) => {
        const lang = getLang();
        if (lang === 'ar') return `+${n} أخرى`;
        if (lang === 'ru') return `+еще ${n}`;
        if (lang === 'fr') return `+${n} de plus`;
        if (lang === 'fa') return `+${n} مورد دیگر`;
        return `+${n} more`;
    };

    const levelGroups = [{
            label: 'Preparatory + Associate',
            levels: ['Preparatory', 'Associate']
        },
        {
            label: 'Bachelor',
            levels: ['Bachelor']
        },
        {
            label: 'Master',
            levels: ['Master']
        },
        {
            label: 'Ph.D.',
            levels: ['Ph.D.']
        },
    ];
    const directoryProgramsUrl = () => {
        const params = new URLSearchParams();
        if (directoryLevel ?.value && directoryLevel.value !== 'all') params.set('degree', directoryLevel.value);
        if (directoryFaculty ?.value && directoryFaculty.value !== 'all') params.set('department', directoryFaculty.value);
        return `/programs.html${params.toString() ? `?${params.toString()}` : ''}`;
    };
    const directoryCard = (group, records, index) => {
        const lang = getLang();
        const faculties = [...new Set(records.map((program) => program.Department))];
        const translatedFaculties = faculties.map(f => translateFaculty(f));
        const facultyText = translatedFaculties.length > 3 
            ? `${translatedFaculties.slice(0, 3).join(' · ')} ${formatMoreText(translatedFaculties.length - 3)}` 
            : translatedFaculties.join(' · ');
        const cardDegree = group.levels.length === 1 ? group.levels[0] : (directoryLevel?.value && directoryLevel.value !== 'all' ? directoryLevel.value : group.levels[0]);
        const cardParams = new URLSearchParams();
        if (cardDegree && cardDegree !== 'all') cardParams.set('degree', cardDegree);
        if (directoryFaculty?.value && directoryFaculty.value !== 'all') cardParams.set('department', directoryFaculty.value);
        const cardUrl = `/programs.html${cardParams.toString() ? `?${cardParams.toString()}` : ''}`;
        const translatedGroupLabel = translateLevelGroup(group.label);
        const translatedLevels = group.levels.map(l => translateLevel(l)).join(' · ');
        const arrowSvg = `<i class="system-arrow ms-2" aria-hidden="true"></i>`;
        return `<article class="program-directory-card cau-scroll-item"><span class="program-directory-level">${translatedGroupLabel}</span><h3>${formatProgrammeCount(records.length)}</h3><p class="program-directory-meta">${facultyText || 'No faculty selected'}</p><a class="program-directory-link btn btn-coral" href="${cardUrl}">${formatViewButton(group.label)} ${arrowSvg}</a></article>`;
    };
    let directoryCatalog = [];
    let levels = [];
    let faculties = [];
    const populateDirectoryFilters = () => {
        const lang = getLang();
        const levelCounts = {};
        directoryCatalog.forEach((p) => {
            const lvl = p['Degree Level'];
            if (lvl) levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
        });
        levels = Object.keys(levelCounts).sort((a, b) => a.localeCompare(b));

        const facultyCounts = {};
        directoryCatalog.forEach((p) => {
            const fac = p.Department;
            if (fac) facultyCounts[fac] = (facultyCounts[fac] || 0) + 1;
        });
        faculties = Object.keys(facultyCounts).sort((a, b) => a.localeCompare(b));

        const degreeDefaultLabel = lang === 'ar' ? 'الدرجة العلمية' : lang === 'fa' ? 'مقطع تحصیلی' : lang === 'ru' ? 'Уровень образования' : lang === 'fr' ? "Niveau d'études" : 'Degree level';
        const facultyDefaultLabel = lang === 'ar' ? 'الكلية' : lang === 'fa' ? 'دانشکده' : lang === 'ru' ? 'Факультет' : lang === 'fr' ? 'Faculté' : 'Faculty';

        if (directoryLevel) {
            const currentVal = directoryLevel.value;
            directoryLevel.innerHTML = `<option value="all">${degreeDefaultLabel}</option>${levels.map((level) => `<option value="${level}">${translateLevel(level)} (${levelCounts[level]})</option>`).join('')}`;
            if (currentVal && (currentVal === 'all' || levels.includes(currentVal))) directoryLevel.value = currentVal;
            else directoryLevel.value = 'all';
        }
        if (directoryFaculty) {
            const currentVal = directoryFaculty.value;
            directoryFaculty.innerHTML = `<option value="all">${facultyDefaultLabel}</option>${faculties.map((faculty) => `<option value="${faculty}">${translateFaculty(faculty)} (${facultyCounts[faculty]})</option>`).join('')}`;
            if (currentVal && (currentVal === 'all' || faculties.includes(currentVal))) directoryFaculty.value = currentVal;
            else directoryFaculty.value = 'all';
        }
    };
    const resetDirectoryFilters = () => {
        if (directoryLevel) directoryLevel.value = 'all';
        if (directoryFaculty) directoryFaculty.value = 'all';
        if (window.CAU_SYNC_SELECTS) window.CAU_SYNC_SELECTS();
        filterDirectory();
    };
    const filterDirectory = (shouldScroll = false) => {
        const lang = getLang();
        const level = directoryLevel?.value || 'all';
        const faculty = directoryFaculty?.value || 'all';
        const filtered = directoryCatalog.filter((program) => 
            (level === 'all' || program['Degree Level'] === level) && 
            (faculty === 'all' || program.Department === faculty)
        );
        const cards = levelGroups.map((group, index) => ({
            group,
            records: filtered.filter((program) => group.levels.includes(program['Degree Level'])),
            index
        })).filter(({
            records
        }) => records.length > 0);

        if (directoryGrid) {
            if (cards.length === 0) {
                const emptyMsg = lang === 'ar' ? 'لا توجد برامج تطابق الفلاتر المحددة.' : lang === 'fa' ? 'هیچ برنامه‌ای با فیلترهای انتخابی مطابقت ندارد.' : lang === 'ru' ? 'Нет программ, соответствующих выбранным фильтрам.' : lang === 'fr' ? 'Aucun programme ne correspond aux filtres sélectionnés.' : 'No programmes match the selected filters.';
                const resetBtnText = lang === 'ar' ? 'إعادة تعيين الفلاتر' : lang === 'fa' ? 'بازنشانی فیلترها' : lang === 'ru' ? 'Сбросить фильтры' : lang === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters';
                directoryGrid.innerHTML = `<div class="program-directory-empty"><p>${emptyMsg}</p><button type="button" class="btn btn-coral mt-2" id="programDirectoryEmptyReset">${resetBtnText}</button></div>`;
                document.querySelector('#programDirectoryEmptyReset')?.addEventListener('click', resetDirectoryFilters);
            } else {
                directoryGrid.innerHTML = cards.slice(0, 4).map(({
                    group,
                    records,
                    index
                }) => directoryCard(group, records, index)).join('');
            }
        }
        if (directoryStatus) {
            const hasFilter = level !== 'all' || faculty !== 'all';
            if (hasFilter) {
                const translatedLevel = level !== 'all' ? translateLevel(level) : '';
                const translatedFaculty = faculty !== 'all' ? translateFaculty(faculty) : '';
                let labelText = '';
                if (level !== 'all' && faculty !== 'all') {
                    labelText = lang === 'ar' ? `لـ <strong>${translatedLevel}</strong> · <strong>${translatedFaculty}</strong>` 
                        : lang === 'fa' ? `برای <strong>${translatedLevel}</strong> · <strong>${translatedFaculty}</strong>`
                        : lang === 'ru' ? `для <strong>${translatedLevel}</strong> · <strong>${translatedFaculty}</strong>`
                        : lang === 'fr' ? `pour <strong>${translatedLevel}</strong> · <strong>${translatedFaculty}</strong>`
                        : `for <strong>${level}</strong> · <strong>${faculty}</strong>`;
                } else if (level !== 'all') {
                    labelText = lang === 'ar' ? `لـ <strong>${translatedLevel}</strong>`
                        : lang === 'fa' ? `برای <strong>${translatedLevel}</strong>`
                        : lang === 'ru' ? `для <strong>${translatedLevel}</strong>`
                        : lang === 'fr' ? `pour <strong>${translatedLevel}</strong>`
                        : `for <strong>${level}</strong>`;
                } else {
                    labelText = lang === 'ar' ? `لـ <strong>${translatedFaculty}</strong>`
                        : lang === 'fa' ? `برای <strong>${translatedFaculty}</strong>`
                        : lang === 'ru' ? `для <strong>${translatedFaculty}</strong>`
                        : lang === 'fr' ? `pour <strong>${translatedFaculty}</strong>`
                        : `for <strong>${faculty}</strong>`;
                }
                const resetText = lang === 'ar' ? 'إعادة تعيين الفلاتر' : lang === 'fa' ? 'بازنشانی فیلترها' : lang === 'ru' ? 'Сбросить фильтры' : lang === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters';
                const showingPrefix = lang === 'ar' ? `عرض ${filtered.length} من ${directoryCatalog.length} برنامجاً`
                    : lang === 'fa' ? `نمایش ${filtered.length} از ${directoryCatalog.length} برنامه`
                    : lang === 'ru' ? `Показано ${filtered.length} из ${directoryCatalog.length} программ`
                    : lang === 'fr' ? `Affichage de ${filtered.length} sur ${directoryCatalog.length} programmes`
                    : `Showing ${filtered.length} of ${directoryCatalog.length} programmes`;
                directoryStatus.innerHTML = `${showingPrefix} ${labelText} · <button type="button" class="program-reset-link" id="programDirectoryReset">${resetText}</button>`;
                document.querySelector('#programDirectoryReset')?.addEventListener('click', resetDirectoryFilters);
            } else {
                if (lang === 'ar') directoryStatus.textContent = `${filtered.length} برنامجاً معتمداً ضمن ${cards.length} مستويات أكاديمية`;
                else if (lang === 'fa') directoryStatus.textContent = `${filtered.length} برنامه آموزشی در ${cards.length} مقطع تحصیلی`;
                else if (lang === 'ru') directoryStatus.textContent = `${filtered.length} программ каталога в ${cards.length} группах уровней`;
                else if (lang === 'fr') directoryStatus.textContent = `${filtered.length} programmes du catalogue répartis sur ${cards.length} cycles`;
                else directoryStatus.textContent = `${filtered.length} catalogue programmes across ${cards.length} level groups`;
            }
        }
        if (shouldScroll) document.querySelector('#program-directory')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };
    window.CAU_REFRESH_HOMEPAGE_DIRECTORY = () => {
        populateDirectoryFilters();
        window.CAU_SYNC_SELECTS?.();
        filterDirectory();
    };
    directoryLevel?.addEventListener('change', () => filterDirectory());
    directoryFaculty?.addEventListener('change', () => filterDirectory());
    directoryButton?.addEventListener('click', () => {
        const level = directoryLevel?.value;
        const faculty = directoryFaculty?.value;
        const params = new URLSearchParams();
        if (level && level !== 'all') params.set('degree', level);
        if (faculty && faculty !== 'all') params.set('department', faculty);
        window.location.href = `/programs.html${params.toString() ? `?${params.toString()}` : ''}`;
    });
    if (directoryGrid) {
        const initDirectory = async () => {
            if (Array.isArray(window.CAU_PROGRAM_CATALOG) && window.CAU_PROGRAM_CATALOG.length) {
                directoryCatalog = window.CAU_PROGRAM_CATALOG;
            } else {
                try {
                    const res = await fetch(`/program-catalog.json?t=${Date.now()}`, { cache: 'no-store' });
                    if (res.ok) {
                        directoryCatalog = await res.json();
                        window.CAU_PROGRAM_CATALOG = directoryCatalog;
                    }
                } catch (e) {
                    console.error('[Homepage] Could not load program-catalog.json:', e);
                }
            }
            if (directoryCatalog.length) {
                populateDirectoryFilters();
                window.CAU_SYNC_SELECTS?.();
                filterDirectory();
                window.CAU_TRANSLATE ?.(window.CAU_LANG || 'en');
            } else if (directoryStatus) {
                directoryStatus.textContent = 'Programme catalog unavailable. Open Programs to try again.';
            }
        };
        initDirectory();
    }

    document.querySelectorAll('.language-select').forEach((select) => window.CAU_ENHANCE_SELECT ?.(select, {
        align: 'right'
    }));
    window.CAU_ENHANCE_SELECT ?.(directoryLevel, {
        wide: true
    });
    window.CAU_ENHANCE_SELECT ?.(directoryFaculty, {
        wide: true
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const getNewsCards = () => document.querySelectorAll('.news-card');
    const newsFilterStatus = document.querySelector('#newsFilterStatus');
    const updateNewsFilter = (filter, label) => {
        let visibleCount = 0;
        getNewsCards().forEach((card) => {
            const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
            const isVisible = filter === 'all' || categories.includes(filter);
            card.classList.toggle('is-hidden', !isVisible);
            if (isVisible) visibleCount += 1;
        });
        if (newsFilterStatus) {
            newsFilterStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'story' : 'stories'} in ${label}`;
        }
    };
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            updateNewsFilter(button.dataset.filter || 'all', button.textContent.trim());
        });
    });
    updateNewsFilter('all', 'All');
    getNewsCards().forEach((card) => window.CAU_ADD_CARD_INDICATOR ?.(card));
    window.CAU_REFRESH_NEWS = () => {
        const active = document.querySelector('.filter-btn.active');
        updateNewsFilter(active ?.dataset.filter || 'all', active ?.textContent.trim() || 'All');
        getNewsCards().forEach((card) => window.CAU_ADD_CARD_INDICATOR ?.(card));
    };

    const archiveSearch = document.querySelector('#newsArchiveSearch');
    const archiveButtons = document.querySelectorAll('.news-archive-filter');
    const getArchiveCards = () => document.querySelectorAll('.news-archive-card');
    const archiveStatus = document.querySelector('#newsArchiveStatus');
    const archiveEmpty = document.querySelector('#newsArchiveEmpty');
    let archiveCategory = 'all';
    const updateNewsArchive = () => {
        const query = (archiveSearch ?.value || '').trim().toLowerCase();
        let visibleCount = 0;
        getArchiveCards().forEach((card) => {
            const categories = (card.dataset.archiveCategory || '').split(/\s+/).filter(Boolean);
            const searchable = `${card.dataset.archiveSearch || ''} ${card.textContent || ''}`.toLowerCase();
            const matchesCategory = archiveCategory === 'all' || categories.includes(archiveCategory);
            const matchesSearch = !query || searchable.includes(query);
            const visible = matchesCategory && matchesSearch;
            card.classList.toggle('is-hidden', !visible);
            if (visible) visibleCount += 1;
        });
        if (archiveStatus) archiveStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'story' : 'stories'} found`;
        if (archiveEmpty) archiveEmpty.hidden = visibleCount !== 0;
    };
    archiveButtons.forEach((button) => button.addEventListener('click', () => {
        archiveButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        archiveCategory = button.dataset.archiveFilter || 'all';
        updateNewsArchive();
    }));
    archiveSearch ?.addEventListener('input', updateNewsArchive);
    updateNewsArchive();
    window.CAU_REFRESH_NEWS_ARCHIVE = updateNewsArchive;

    // Dynamic News Loader from CMS news.json
    const loadDynamicNews = async () => {
        const homeGrid = document.querySelector('.split-content.news-grid');
        const archiveGrid = document.querySelector('.news-archive-grid');
        if (!homeGrid && !archiveGrid) return;

        const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[char]));

        const formatNewsDate = (isoStr) => {
            if (!isoStr) return '';
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return isoStr;
            return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        };

        const formatArchiveDate = (isoStr) => {
            if (!isoStr) return '';
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return isoStr;
            return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        };

        const getCategoryTag = (cat) => {
            const c = (cat || 'general').toLowerCase();
            if (c.includes('academic') || c.includes('ranking')) return 'general announcement academic';
            if (c.includes('campus') || c.includes('culture') || c.includes('student')) return 'activities students';
            if (c.includes('international') || c.includes('collab')) return 'collaborating general';
            if (c.includes('research') || c.includes('teknofest')) return 'general collaborating';
            if (c.includes('announcement')) return 'announcement general';
            if (c.includes('scholar')) return 'scholarship';
            return c;
        };

        const getCategoryBadgeInfo = (cat) => {
            const c = (cat || 'general').toLowerCase();
            if (c.includes('announcement') || c.includes('academic') || c.includes('ranking')) {
                return {
                    badgeClass: 'news-category-badge--coral',
                    icon: '<i class="fa-solid fa-bullhorn me-1" aria-hidden="true"></i>',
                    display: 'Announcement',
                    tag: 'Institutional'
                };
            }
            if (c.includes('student') || c.includes('activities') || c.includes('culture')) {
                return {
                    badgeClass: 'news-category-badge--navy',
                    icon: '<i class="fa-solid fa-users me-1" aria-hidden="true"></i>',
                    display: 'Student Life',
                    tag: 'Campus'
                };
            }
            if (c.includes('teknofest') || c.includes('collab') || c.includes('grad') || c.includes('tech') || c.includes('innovation')) {
                return {
                    badgeClass: 'news-category-badge--emerald',
                    icon: '<i class="fa-solid fa-microchip me-1" aria-hidden="true"></i>',
                    display: 'Innovation',
                    tag: 'Engineering'
                };
            }
            if (c.includes('scholar') || c.includes('aid')) {
                return {
                    badgeClass: 'news-category-badge--gold',
                    icon: '<i class="fa-solid fa-award me-1" aria-hidden="true"></i>',
                    display: 'Scholarships',
                    tag: 'Admissions'
                };
            }
            return {
                badgeClass: 'news-category-badge--navy',
                icon: '<i class="fa-solid fa-newspaper me-1" aria-hidden="true"></i>',
                display: cat || 'General',
                tag: 'Dispatch'
            };
        };

        const estimateReadTime = (text) => {
            const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
            const mins = Math.max(2, Math.min(5, Math.ceil(words / 45)));
            return `${mins} min read`;
        };

        try {
            const res = await fetch(`/news.json?t=${Date.now()}`, { cache: 'no-store' });
            if (!res.ok) return;
            const allNews = await res.json();
            if (!Array.isArray(allNews) || !allNews.length) return;

            const published = allNews.filter((n) => n.status === 'published');
            if (!published.length) return;

            // 1. Homepage News Grid
            if (homeGrid) {
                const top2 = published.slice(0, 2);
                homeGrid.innerHTML = `${top2.map((story) => {
                    const img = story.image || '/assets/untitled2-12-b26e7632db_5e13efc2.jpg';
                    const link = `/news-details.html?slug=${encodeURIComponent(story.slug || story.id)}`;
                    const tag = getCategoryTag(story.category);
                    const categoryName = story.category || 'Announcement';
                    const excerpt = story.summary || 'Stay updated with official campus releases, academic breakthroughs, and student milestones at Cyprus Aydın University.';
                    return `<article class="news-card cau-card" data-category="${escapeHtml(tag)}">
                      <a class="news-image-wrap" href="${link}" aria-label="Read: ${escapeHtml(story.title)}">
                        <img src="${escapeHtml(img)}" alt="${escapeHtml(story.title)}" loading="lazy" decoding="async" />
                      </a>
                      <div class="news-card__body">
                        <h3 class="news-card__title">
                          <a href="${link}">${escapeHtml(story.title)}</a>
                        </h3>
                        <time datetime="${escapeHtml(story.publishedAt || '')}" class="news-card__date">${escapeHtml(formatNewsDate(story.publishedAt))}</time>
                        <p class="news-card__summary">${escapeHtml(excerpt)}</p>
                        <a class="news-card__action" href="${link}" aria-label="Read full story: ${escapeHtml(story.title)}">
                          <span>Read full story</span>
                          <i class="system-arrow ms-1" aria-hidden="true"></i>
                        </a>
                      </div>
                    </article>`;
                }).join('')}<a class="show-all" href="/news.html"><span>Show all news and events</span> <i class="system-arrow ms-1" aria-hidden="true"></i></a>`;

                window.CAU_REFRESH_NEWS?.();
            }

            // 2. Archive Grid (/news.html)
            if (archiveGrid) {
                archiveGrid.innerHTML = published.map((story, index) => {
                    const img = story.image || '/assets/untitled2-12-b26e7632db_5e13efc2.jpg';
                    const tag = getCategoryTag(story.category);
                    const isFeat = index === 0 ? ' news-archive-card-featured' : '';
                    const detailUrl = `/news-details.html?slug=${encodeURIComponent(story.slug || story.id)}`;
                    const searchIndex = `${story.title} ${story.summary || ''} ${story.category || ''} ${tag}`.toLowerCase();
                    return `<article class="news-archive-card${isFeat}" id="${escapeHtml(story.slug || story.id)}" data-archive-category="${escapeHtml(tag)}" data-archive-search="${escapeHtml(searchIndex)}">
                      <a class="news-archive-media" href="${detailUrl}" aria-label="Read: ${escapeHtml(story.title)}">
                        <img src="${escapeHtml(img)}" alt="${escapeHtml(story.title)}" loading="lazy" decoding="async" />
                      </a>
                      <div class="news-archive-card__body">
                        <span class="news-archive-category">${escapeHtml(story.category || 'Announcement')}</span>
                        <h2 class="news-archive-card__title"><a href="${detailUrl}">${escapeHtml(story.title)}</a></h2>
                        <time datetime="${escapeHtml(story.publishedAt || '')}" class="news-archive-card__date">${escapeHtml(formatArchiveDate(story.publishedAt))}</time>
                        ${story.summary ? `<p class="news-archive-summary">${escapeHtml(story.summary)}</p>` : ''}
                        <a href="${detailUrl}" class="read-article-link" aria-label="Read full story: ${escapeHtml(story.title)}"><span>Read full story</span> <i class="system-arrow ms-1" aria-hidden="true"></i></a>
                      </div>
                    </article>`;
                }).join('');

                window.CAU_REFRESH_NEWS_ARCHIVE?.();
            }
        } catch (err) {
            console.error('[News] Dynamic load failed:', err);
        }
    };
    loadDynamicNews();

    // Note: contactForm and newsletterForm are handled automatically by the canonical CAU Interaction Engine (data-cau-form).

    const revealItems = document.querySelectorAll('.split-section, .numbers-section, .contact-panel, .community-row');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px'
        });
        revealItems.forEach((item) => {
            item.classList.add('reveal-on-scroll');
            observer.observe(item);
        });
    }

    const countUpMetrics = () => {
        const counters = [...document.querySelectorAll('.why-metrics strong')];
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        counters.forEach((counter) => {
            if (counter.dataset.counted === 'true') return;
            const rawValue = counter.dataset.counterTarget || counter.textContent.trim();
            counter.dataset.counterTarget = rawValue;
            const match = rawValue.match(/^(\d+)(.*)$/);
            if (!match) return;
            const target = Number(match[1]);
            const suffix = match[2] || '';
            const render = (value) => {
                counter.textContent = `${value}${suffix}`;
            };
            counter.dataset.counted = 'true';
            if (reduceMotion) return render(target);
            const startedAt = performance.now();
            const duration = 850;
            const step = (now) => {
                const progress = Math.min((now - startedAt) / duration, 1);
                render(Math.round(target * (1 - Math.pow(1 - progress, 3))));
                if (progress < 1) requestAnimationFrame(step);
            };
            render(0);
            requestAnimationFrame(step);
        });
    };
    const whySection = document.querySelector('#why');
    const startCounters = () => window.requestAnimationFrame(countUpMetrics);
    if (whySection && 'IntersectionObserver' in window) {
        const metricObserver = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                startCounters();
                metricObserver.disconnect();
            }
        }, {
            threshold: 0.22
        });
        metricObserver.observe(whySection);
        window.setTimeout(startCounters, 450);
    } else startCounters();
    window.addEventListener('load', startCounters, {
        once: true
    });
});

// Directional header scroll behavior is handled by cau-shell.js

const testimonialStage = document.querySelector('[data-testimonial-carousel]');
if (testimonialStage) {
    const testimonials = [...testimonialStage.querySelectorAll('.testimonial')];
    const previous = testimonialStage.querySelector('.testimonial-prev');
    const next = testimonialStage.querySelector('.testimonial-next');
    const count = testimonialStage.querySelector('.testimonial-count');
    const indicators = [...testimonialStage.querySelectorAll('.testimonial-indicator, .testimonial-nav-pill')];
    let activeTestimonial = 0;
    const renderTestimonial = (index) => {
        activeTestimonial = (index + testimonials.length) % testimonials.length;
        testimonials.forEach((testimonial, testimonialIndex) => {
            const isActive = testimonialIndex === activeTestimonial;
            testimonial.classList.toggle('is-active', isActive);
            testimonial.setAttribute('aria-hidden', String(!isActive));
        });
        indicators.forEach((indicator, indicatorIndex) => {
            const isActive = indicatorIndex === activeTestimonial;
            indicator.classList.toggle('is-active', isActive);
            indicator.setAttribute('aria-selected', String(isActive));
        });
        if (count) {
            const cur = String(activeTestimonial + 1).padStart(2, '0');
            const tot = String(testimonials.length).padStart(2, '0');
            count.textContent = `${cur} / ${tot}`;
        }
    };
    testimonialStage.classList.add('testimonial-carousel-ready');
    renderTestimonial(0);
    previous ?.addEventListener('click', () => renderTestimonial(activeTestimonial - 1));
    next ?.addEventListener('click', () => renderTestimonial(activeTestimonial + 1));
    indicators.forEach((indicator, indicatorIndex) => {
        indicator.addEventListener('click', () => renderTestimonial(indicatorIndex));
    });
}

document.querySelectorAll('.copyright').forEach((node) => {
    node.textContent = node.textContent.replace(/^Ac\s+/, '© ');
});
