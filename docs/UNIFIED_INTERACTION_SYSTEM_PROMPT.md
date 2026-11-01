# CAU Website: Unified UI/UX Interaction State Machine — Audit Report & Strict Agent Prompt

## PART 1: UI/UX INTERACTION AUDIT REPORT

### 1.1 Root Cause of Visual & Behavioral Inconsistency
Across the `cau-package` repository (`client/*.html`, `client/departments/*.html`, and `client/programs/*.html`), interactive elements currently suffer from **State Fragmentation**:
1. **Disconnected `:hover` vs. `:active` / `.active` States:** Hovering over an element (buttons, nav links, filter pills, tabs, cards) triggers one visual style, while clicking (`:active`) or selecting (`.active` / `.is-active`) triggers a completely different color, border, or text treatment—or no feedback at all.
2. **Inconsistent Label Text Behavior:** Inner text labels (`<span>`, `<a>`, `<button>`) change font-weight, color, or opacity inconsistently between hover and active states across different pages (`index.html` vs. `clubs.html` vs. `english-quest.html` vs. `placement-test.html`).
3. **Ad-Hoc Inline `<style>` Overrides:** Individual HTML files define local `:hover` rules with hardcoded hex colors and transition speeds (`0.2s`, `0.3s`, `ease`, `ease-in-out`), overriding `client/cau-navigation-theme.css` and `client/cau-responsive.css`.

### 1.2 The Solution: Deterministic State Parity
Every interactive element across the entire website must obey **one strict law**:
> **Visual & Label Parity (`Hover == Active == Selected`):** Whether a user hovers over an element (`:hover`), clicks/holds it (`:active`), focuses it via keyboard (`:focus-visible`), or selects it as the current active state (`.is-active`, `.active`, `[aria-selected="true"]`, `[aria-current="page"]`), the **Surface Color, Border Color, Glow/Shadow Token, and Label Text Style (color, weight, letter-spacing, and icon position) MUST be 100% identical.**
>
> **Physical Tactile Distinction:** The ONLY difference between `:hover` and `:active` (click) is physical elevation:
> - **Hover (`:hover`):** Applies the Unified Active Visual/Label State + subtle lift (`transform: translateY(-2px)`).
> - **Click/Press (`:active`):** Keeps the exact same Unified Active Visual/Label State + tactile press (`transform: translateY(0) scale(0.98)`).
> - **Selected (`.is-active` / `.active`):** Locks in the exact same Unified Active Visual/Label State at rest (`transform: translateY(0)`).

---
---

## PART 2: STRICT EXECUTION PROMPT FOR ANTIGRAVITY IDE

**Instructions for Agent:** You are a Principal UI/UX Systems Architect and Lead Frontend Engineer. You must enforce **100% Deterministic Interaction & Label State Parity** across every file in `cau-package` (`client/`, `client/departments/`, and `client/programs/`).

### CRITICAL RULES (STRICT ENFORCEMENT — ZERO EXCEPTIONS)
1. **INSPECT HOMEPAGE FIRST:** Read `client/index.html` and `client/cau-navigation-theme.css` first. Extract the exact brand primary, accent, surface, border, and text tokens from `client/index.html`.
2. **BAN LOCAL HOVER/ACTIVE INVENTIONS:** No individual `.html` file is allowed to invent custom `:hover` or `:active` colors, transitions, or font changes inside inline `<style>` tags. All interactive states must inherit from `client/cau-design-system.css` and `client/cau-navigation-theme.css`.
3. **UNIFIED SELECTOR GROUPING:** Whenever you style an interactive state in CSS, you MUST group `:hover`, `:active`, `:focus-visible`, `.active`, `.is-active`, `[aria-current="page"]`, and `[aria-selected="true"]` into the **same CSS rule block** for colors, borders, and label typography so they can never drift apart.

---

### STEP 1: CREATE THE MASTER INTERACTION ENGINE (`client/cau-design-system.css`)

Create or update `client/cau-design-system.css` and link it in the `<head>` of every HTML file in `client/`, `client/departments/`, and `client/programs/`. Implement the following exact state architecture (using the exact brand hex/rgb values extracted from `client/index.html`):

```css
/* ==========================================================================
   1. GLOBAL INTERACTION & LABEL TOKENS
   ========================================================================== */
:root {
  /* Timing & Physics — Identical everywhere */
  --cau-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --cau-duration: 260ms;
  --cau-duration-press: 90ms;

  /* Label Typography Contract */
  --cau-label-font: inherit;
  --cau-label-weight: 600;
  --cau-label-tracking: 0.01em;
  --cau-label-line-height: 1.2;

  /* Interactive State Tokens (Extract exact brand colors from client/index.html) */
  --state-default-bg: var(--cau-surface, #ffffff);
  --state-default-text: var(--cau-text-primary, #0f172a);
  --state-default-border: rgba(15, 23, 42, 0.12);

  /* UNIFIED ENGAGED STATE (Used simultaneously by :hover, :active, and .is-active) */
  --state-engaged-bg: var(--cau-brand-primary, #0a192f);
  --state-engaged-accent: var(--cau-brand-accent, #d4af37);
  --state-engaged-text: #ffffff;
  --state-engaged-border: var(--cau-brand-accent, #d4af37);
  --state-engaged-shadow: 0 12px 28px -6px rgba(10, 25, 47, 0.22);
}

/* ==========================================================================
   2. UNIVERSAL LABEL TEXT CONTRACT (.cau-label)
   Every button, nav link, tab, filter pill, and action link must use this
   exact label rule so text never shifts weight, size, or alignment.
   ========================================================================== */
.cau-btn,
.cau-nav-link,
.cau-tab,
.cau-pill,
.cau-action-link,
.cau-option-btn {
  font-family: var(--cau-label-font);
  font-weight: var(--cau-label-weight);
  letter-spacing: var(--cau-label-tracking);
  line-height: var(--cau-label-line-height);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color var(--cau-duration) var(--cau-ease),
    color var(--cau-duration) var(--cau-ease),
    border-color var(--cau-duration) var(--cau-ease),
    box-shadow var(--cau-duration) var(--cau-ease),
    transform var(--cau-duration) var(--cau-ease);
}

/* ==========================================================================
   3. ARCHETYPE A: PRIMARY & SECONDARY BUTTONS (.cau-btn)
   Hover, Click (:active), Focus, and Selected (.is-active) share 100%
   identical colors, border, shadow, and label text color.
   ========================================================================== */
.cau-btn:is(:hover, :active, :focus-visible, .active, .is-active, [aria-selected="true"]) {
  background-color: var(--state-engaged-bg);
  color: var(--state-engaged-text) !important;
  border-color: var(--state-engaged-border);
  box-shadow: var(--state-engaged-shadow);
}

/* Ensure inner label spans and SVGs always match the parent engaged state */
.cau-btn:is(:hover, :active, :focus-visible, .active, .is-active) > * {
  color: inherit !important;
}

/* Unified Icon / Arrow Motion (e.g., blackarrow_13e10b28.svg or inline SVG) */
.cau-btn .cau-icon,
.cau-action-link .cau-icon {
  transition: transform var(--cau-duration) var(--cau-ease);
}

.cau-btn:is(:hover, :active, :focus-visible, .active, .is-active) .cau-icon,
.cau-action-link:is(:hover, :active, :focus-visible, .active, .is-active) .cau-icon {
  transform: translateX(4px);
}

/* Physical Elevation: Lift on Hover, Tactile Press on Click */
.cau-btn:hover {
  transform: translateY(-2px);
}
.cau-btn:active {
  transform: translateY(0) scale(0.98);
  transition-duration: var(--cau-duration-press);
}

/* ==========================================================================
   4. ARCHETYPE B: TABS, FILTER PILLS & SEGMENTED CONTROLS (.cau-tab, .cau-pill)
   Used in clubs.html, programs.html, departments.html, and english-quest.html
   ========================================================================== */
:is(.cau-tab, .cau-pill) {
  background-color: var(--state-default-bg);
  color: var(--state-default-text);
  border: 1px solid var(--state-default-border);
  border-radius: 9999px;
  padding: 0.625rem 1.25rem;
}

/* Hovering a pill OR clicking/selecting a pill produces the EXACT same visual & label state */
:is(.cau-tab, .cau-pill):is(:hover, :active, :focus-visible, .active, .is-active, [aria-selected="true"]) {
  background-color: var(--state-engaged-bg);
  color: var(--state-engaged-text) !important;
  border-color: var(--state-engaged-border);
  box-shadow: var(--state-engaged-shadow);
}

:is(.cau-tab, .cau-pill):hover {
  transform: translateY(-2px);
}
:is(.cau-tab, .cau-pill):active {
  transform: translateY(0) scale(0.98);
  transition-duration: var(--cau-duration-press);
}

/* ==========================================================================
   5. ARCHETYPE C: NAVIGATION & INLINE LINKS (.cau-nav-link, .cau-action-link)
   ========================================================================== */
:is(.cau-nav-link, .cau-action-link) {
  position: relative;
  color: inherit;
}

:is(.cau-nav-link, .cau-action-link)::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background-color: var(--state-engaged-accent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--cau-duration) var(--cau-ease);
}

/* Hover, Click, and Active Page link share the exact same label color & underline state */
:is(.cau-nav-link, .cau-action-link):is(:hover, :active, :focus-visible, .active, .is-active, [aria-current="page"]) {
  color: var(--state-engaged-accent) !important;
}

:is(.cau-nav-link, .cau-action-link):is(:hover, :active, :focus-visible, .active, .is-active, [aria-current="page"])::after {
  transform: scaleX(1);
}

/* ==========================================================================
   6. ARCHETYPE D: INTERACTIVE CARDS (.cau-card)
   Used across Home, Programs, Departments, News, Clubs, and Teachers
   ========================================================================== */
.cau-card {
  background-color: var(--state-default-bg);
  border: 1px solid var(--state-default-border);
  overflow: hidden;
  transition:
    transform var(--cau-duration) var(--cau-ease),
    box-shadow var(--cau-duration) var(--cau-ease),
    border-color var(--cau-duration) var(--cau-ease);
}

.cau-card:is(:hover, :active, :focus-within, .is-active) {
  border-color: var(--state-engaged-border);
  box-shadow: var(--state-engaged-shadow);
}

/* When a card is hovered, clicked, or active, its internal title & CTA link also enter the engaged state */
.cau-card:is(:hover, :active, :focus-within, .is-active) .cau-card-title {
  color: var(--state-engaged-accent);
}

.cau-card:is(:hover, :active, :focus-within, .is-active) .cau-card-media img {
  transform: scale(1.05);
}

.cau-card:hover {
  transform: translateY(-5px);
}
.cau-card:active {
  transform: translateY(-2px) scale(0.99);
  transition-duration: var(--cau-duration-press);
}

/* ==========================================================================
   7. ARCHETYPE E: QUIZ & PLACEMENT TEST OPTIONS (.cau-option-btn)
   Used in placement-test.html and english-quest.html
   ========================================================================== */
.cau-option-btn:is(:hover, :active, :focus-visible, .is-selected, [aria-checked="true"]) {
  border-color: var(--state-engaged-border);
  background-color: rgba(212, 175, 55, 0.14);
  color: var(--state-engaged-text);
  box-shadow: var(--state-engaged-shadow);
}

.cau-option-btn:is(:hover, :active, :focus-visible, .is-selected, [aria-checked="true"]) .cau-option-key {
  background-color: var(--state-engaged-accent);
  color: var(--state-engaged-bg);
}
```

---

### STEP 2: PURGE CONFLICTING INLINE HOVER/ACTIVE CSS ACROSS ALL 60+ PAGES
Scan every `.html` file in:
- `client/*.html` (`index.html`, `about.html`, `admission.html`, `clubs.html`, `contact.html`, `dashboard.html`, `departments.html`, `english-quest.html`, `faq.html`, `international.html`, `news.html`, `news-details.html`, `placement-test.html`, `program-details.html`, `programs.html`, `404.html`)
- `client/departments/*.html` (all 8 faculty pages)
- `client/programs/*.html` (all 42 program pages)

**For every file:**
1. Search for local `:hover`, `:active`, and `.active` CSS rules inside `<style>` blocks that define custom transitions, colors, or font-weight changes on buttons, links, pills, tabs, or cards.
2. Remove those conflicting local overrides and replace the HTML element classes with the standardized system classes (`.cau-btn`, `.cau-tab`, `.cau-pill`, `.cau-nav-link`, `.cau-action-link`, `.cau-card`, `.cau-option-btn`).
3. Ensure that when a user clicks a tab, filter pill, or navigation item, JavaScript toggles `.is-active` and `aria-selected="true"` (or `aria-current="page"`) so the clicked state visually matches the hover state.

---

### STEP 3: ENFORCE LABEL TEXT CONSISTENCY
Audit all button and link labels across the website:
1. **No Font-Weight Jitter:** Never change `font-weight` between default, `:hover`, and `:active` (which causes horizontal layout shift). Keep `font-weight: var(--cau-label-weight)` constant across all states.
2. **Consistent Casing & Alignment:** Ensure all primary/secondary buttons, filter pills, and navigation items share consistent vertical centering (`display: inline-flex; align-items: center; gap: 0.5rem`) and identical label color transitions on both `:hover` and `:active`.

---

### STEP 4: GLOBAL VERIFICATION CHECKLIST
Before completing the task, verify the following across the entire site:
- [ ] **Hover == Click == Active Visual Parity:** Hovering any button, link, tab, or filter pill displays the exact same background color, border color, and label text color as clicking (`:active`) or selecting (`.is-active`) that element.
- [ ] **Tactile Click Response:** Every button and pill lifts smoothly (`-2px`) on `:hover` and presses down (`scale(0.98)`) on `:active` while keeping the exact same label and color styling.
- [ ] **Card-to-Label Coupling:** Hovering or clicking any `.cau-card` simultaneously highlights the card border, zooms the card image (`1.05x`), and shifts the card's inner CTA label and arrow (`translateX(4px)`).
- [ ] **Zero Rogue Styles:** No page in `client/`, `client/departments/`, or `client/programs/` uses a different transition curve, hover color, or active label style from `client/index.html`.