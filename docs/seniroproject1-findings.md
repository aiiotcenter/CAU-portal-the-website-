# Senior Project 1 brief — implementation findings

The supplied brief defines the CAU international website as a responsive, accessible academic platform built around a frictionless discovery journey from curiosity to application. Its design system specifies Navy Blue `#002469`, Orange `#F44029`, white/light-gray/dark-gray neutrals, a flat interface without drop shadows, reusable buttons and form fields, dropdown-driven program filtering, a persistent global header/footer, a visible Apply Now action, and responsive desktop/mobile layouts.

The brief explicitly calls for a global header with logo, About Us, Programs, Scholarships, Tuition, a language toggle, and Apply Now; a homepage program-search hub; program search filters for Degree, Department, Language, and Duration; admissions, scholarships, tuition, international-office, FAQ, news, 404, and program-detail safety-net routes; standardized contact forms with Name, Phone, Email, and messaging support; accordions/tables for dense data; and direct human support through the contact/newsletter areas.

The existing site already contains most page routes, program filtering, tuition tables, FAQ accordions, contact/newsletter behavior, shared footer, and responsive layouts. The main project-brief gaps are a visible global language-toggle control, consistent message fields in the inquiry form, and a documented alignment between the homepage finder and the program-search flow.

## DOCX-driven implementation verification

Added a visible English language-toggle control to every static page header and standardized the inquiry forms with a required message textarea. The existing navy/orange/gray flat visual system remains intact, while the homepage and Tuition & Fees page preserve the responsive mobile header, hero, tables, and form layout. Desktop and mobile screenshots were checked.

## Multilingual foundation verification

Added a five-language selector (English, Arabic, Russian, French, Persian) to all static page headers, with localStorage persistence and document `lang`/`dir` updates. Arabic and Persian switch to RTL-safe layout rules. Shared navigation, Apply Now, finder controls, programme links, contact fields, send actions, and newsletter headings use the dictionary foundation. The compact homepage hero finder retains its arrow-only control; the full program directory receives the translated Show programs label.

## Final language-selector verification

The homepage now shows the five-language selector beside Apply Now on desktop and beside the mobile navigation toggle on small screens. The compact hero finder retains its single-arrow action without label wrapping, and the existing hero/navigation proportions remain stable after the runtime was added.

## Translation switching proof

URL-selected French visibly translates the global navigation, Apply Now label, hero headline, and finder label. URL-selected Arabic visibly translates the same interface, reverses the navigation and hero alignment, and mirrors the finder control order through RTL document direction. Native select option labels remain a separate content layer to translate next.

## Translation bug fix

The runtime was expanded so visible content changes on language selection now include the homepage hero, finder heading and options, Why CAU, numbers, degrees, news, community, contact, footer headings, page headings, navigation, Apply Now, form placeholders, and program actions. Arabic/Persian preserve RTL behavior, while URL overrides such as `/?lang=fr` and `/?lang=ar` provide deterministic verification links.

## Manual selector repair verification

The selector runtime now uses delegated `change` and `input` listeners, works whether scripts execute before or after DOM readiness, exposes `window.CAU_TRANSLATE`, and persists the selected language. Russian and Persian localized entry modes visibly translate the header, hero, finder labels/options, and Apply action; Persian activates RTL alignment and mirrored control order.

## Program catalog import verification

Imported 47 records from the workbook’s Program Catalog sheet into `client/program-catalog.json`. The Programs page now generates Degree, Department, Language, and Duration options from the dataset, renders department/degree/language/duration/tuition metadata in each card, supports combined filtering and full-text search over catalog fields, and progressively reveals the complete result set. Desktop and mobile screenshots show the imported records and responsive card/filter behavior.

## Catalog integration repair verification

The catalog is now wired to both the dedicated Programs page and the homepage Find your program directory. The homepage dynamically renders six catalog-backed cards, reports the full matching count, and routes Show programs selections to `/programs.html` with degree/interest query parameters. The full Programs page accepts those parameters and renders the corresponding filtered results. Desktop screenshots confirm the homepage and filtered route now respond to the imported dataset.

## Live catalog function repair

Root cause was the catalog JSON location: it was stored under `client/`, while the deployed static site reliably exposes public assets from `client/public/`. Moved the 451 KB dataset to `client/public/program-catalog.json`; the live endpoint now returns HTTP 200 with all 47 records. The Programs page renders records and filter controls, and degree/interest query cases load successfully after deployment.

## Excel category and information filter verification

Merged all three workbook sheets into the public JavaScript dataset. Programs now expose six Excel-derived category values and two billing-basis values in dedicated filter groups, while cards show category, published tuition, billing basis, and tuition notes. Search also scans the full program details, category, billing, tuition notes, source title, and workbook metadata. Desktop and mobile screenshots confirm the expanded filter rail and readable information cards.

## Bundled local catalog verification

Replaced runtime catalog fetching with `client/program-catalog.js`, a bundled 47-record global loaded before the homepage and Programs scripts. Both pages now read the same local dataset directly; the Programs filter summary exposes the loaded record count. JavaScript syntax and script order were verified, and desktop screenshots confirm the homepage and Programs page load through the bundled path without a catalog network request.

## Browser runtime interaction fix verification

The issue was caused by browser runtime assets being stored outside the deployable public directory. Moved `i18n.js`, `script.js`, `programs.js`, and `program-catalog.js` into `client/public/`, where the existing root script URLs resolve reliably. All four assets return HTTP 200 as JavaScript, and syntax checks pass. Homepage and Programs screenshots now load through the corrected public runtime paths.

## Header, title, and finder redesign verification

Desktop verification confirms the hero filter is removed, the header spans the full content width, page titles use one shared desktop scale, and the homepage directory now uses a neutral four-card academic-stage grid with Level and Faculty controls. The language control’s new icon currently renders as literal `f1AB` text instead of the Font Awesome glyph, so the icon content escape needs correction before final delivery.

## Final responsive redesign verification

The language control now renders the actual language icon, not literal escape text. Mobile verification confirms the compact icon/select treatment, full-width mobile header, natural responsive title wrapping, hero filter removal, and page-title consistency. Desktop verification confirms single-line page titles and the full-width header. The homepage directory uses four neutral cards and Level/Faculty selectors; the full Programs handoff uses degree and department query parameters.
