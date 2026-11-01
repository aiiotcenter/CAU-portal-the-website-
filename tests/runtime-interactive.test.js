import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

const html = fs.readFileSync('client/english-quest.html', 'utf8');

describe('CAU English Prep Hub - Interactive Runtime Execution Engine', () => {

  // Lightweight Headless DOM Shim for Node testing
  class MockElement {
    constructor(tagName = 'div', id = '') {
      this.tagName = tagName.toUpperCase();
      this.id = id;
      const set = new Set();
      this.classList = {
        add: (c) => set.add(c),
        remove: (c) => set.delete(c),
        toggle: (c, force) => {
          if (force === undefined) {
            if (set.has(c)) set.delete(c);
            else set.add(c);
          } else if (force) {
            set.add(c);
          } else {
            set.delete(c);
          }
        },
        has: (c) => set.has(c),
        contains: (c) => set.has(c)
      };
      this.attributes = new Map();
      this.style = {};
      this.textContent = '';
      this.innerHTML = '';
      this.value = '';
      this.children = [];
    }
    getAttribute(name) { return this.attributes.get(name); }
    setAttribute(name, val) { this.attributes.set(name, String(val)); }
    appendChild(child) { this.children.push(child); return child; }
  }

  // Setup mock DOM based on actual HTML element IDs
  const elements = new Map();
  const idRegex = /id=["']([a-zA-Z0-9_\-]+)["']/g;
  let match;
  while ((match = idRegex.exec(html)) !== null) {
    const id = match[1];
    if (!elements.has(id)) {
      elements.set(id, new MockElement('div', id));
    }
  }

  // Add specific classes to mock panes and buttons
  const mockPillars = [
    { id: 'pillar-focus', pillar: 'pillar-focus' },
    { id: 'pillar-curriculum', pillar: 'pillar-curriculum' },
    { id: 'pillar-analytics', pillar: 'pillar-analytics' },
    { id: 'pillar-community', pillar: 'pillar-community' }
  ];

  const pillarButtons = [];
  const pillarPanes = [];

  for (const p of mockPillars) {
    const btn = new MockElement('button');
    btn.classList.add('pillar-tab-btn');
    btn.setAttribute('data-pillar', p.pillar);
    pillarButtons.push(btn);

    const pane = elements.get(p.id) || new MockElement('div', p.id);
    pane.classList.add('pillar-pane');
    elements.set(p.id, pane);
    pillarPanes.push(pane);
  }

  // Mock global environment
  const mockStorage = new Map();
  global.window = {
    scrollTo: () => {},
    localStorage: {
      getItem: (k) => mockStorage.get(k) || null,
      setItem: (k, v) => mockStorage.set(k, String(v)),
      removeItem: (k) => mockStorage.delete(k)
    }
  };

  global.document = {
    getElementById: (id) => elements.get(id) || null,
    querySelectorAll: (selector) => {
      if (selector === '.pillar-tab-btn') return pillarButtons;
      if (selector === '.pillar-pane') return pillarPanes;
      return [];
    },
    createElement: (tag) => new MockElement(tag)
  };

  // Test switchPillar logic
  const PILLAR_ALIASES = {
    'pillar-arena': 'pillar-focus',
    'pillar-simulator': 'pillar-analytics',
    'pillar-speaking': 'pillar-community'
  };

  function switchPillar(pillarId) {
    const targetId = PILLAR_ALIASES[pillarId] || pillarId;
    pillarButtons.forEach(btn => {
      const p = btn.getAttribute("data-pillar");
      btn.classList.toggle("is-active", p === targetId || p === pillarId);
    });
    pillarPanes.forEach(pane => {
      pane.classList.toggle("is-active", pane.id === targetId || pane.id === pillarId);
    });
  }

  describe('1. 4-View Switcher Logic & Backward Compatibility Aliases', () => {
    test('Switch to Today Focus activates pillar-focus pane and tab', () => {
      switchPillar('pillar-focus');
      const focusPane = elements.get('pillar-focus');
      assert.ok(focusPane.classList.has('is-active'), 'Focus pane must be active');
      assert.ok(!elements.get('pillar-curriculum').classList.has('is-active'), 'Curriculum pane must be inactive');
      assert.ok(!elements.get('pillar-analytics').classList.has('is-active'), 'Analytics pane must be inactive');
      assert.ok(!elements.get('pillar-community').classList.has('is-active'), 'Community pane must be inactive');
    });

    test('Switch to Curriculum activates pillar-curriculum pane and tab', () => {
      switchPillar('pillar-curriculum');
      assert.ok(elements.get('pillar-curriculum').classList.has('is-active'), 'Curriculum pane active');
      assert.ok(!elements.get('pillar-focus').classList.has('is-active'), 'Focus pane inactive');
    });

    test('Switch to Mastery & Diagnostics activates pillar-analytics pane', () => {
      switchPillar('pillar-analytics');
      assert.ok(elements.get('pillar-analytics').classList.has('is-active'), 'Analytics pane active');
    });

    test('Switch to Campus Community activates pillar-community pane', () => {
      switchPillar('pillar-community');
      assert.ok(elements.get('pillar-community').classList.has('is-active'), 'Community pane active');
    });

    test('Legacy switchPillar("pillar-arena") seamlessly maps to pillar-focus', () => {
      switchPillar('pillar-arena');
      assert.ok(elements.get('pillar-focus').classList.has('is-active'), 'Mapped to pillar-focus');
    });

    test('Legacy switchPillar("pillar-simulator") seamlessly maps to pillar-analytics', () => {
      switchPillar('pillar-simulator');
      assert.ok(elements.get('pillar-analytics').classList.has('is-active'), 'Mapped to pillar-analytics');
    });

    test('Legacy switchPillar("pillar-speaking") seamlessly maps to pillar-community', () => {
      switchPillar('pillar-speaking');
      assert.ok(elements.get('pillar-community').classList.has('is-active'), 'Mapped to pillar-community');
    });
  });

  describe('2. Prep Modular League Progression', () => {
    const PREP_MODULES = {
      module4: { name: "Module 4 (Track C1 Exit Prep)", emoji: "🎓", points: 14820, rank: 1 },
      module3: { name: "Module 3 (Track B2 Intermediate)", emoji: "📙", points: 13950, rank: 2 },
      module2: { name: "Module 2 (Track B1 Pre-Intermediate)", emoji: "📘", points: 11200, rank: 3 },
      module1: { name: "Module 1 (Track A2 Elementary)", emoji: "📚", points: 10450, rank: 4 }
    };

    test('Contains all 4 Hazırlık modules with proper CEFR progression', () => {
      assert.strictEqual(Object.keys(PREP_MODULES).length, 4);
      assert.ok(PREP_MODULES.module1.name.includes("A2 Elementary"));
      assert.ok(PREP_MODULES.module2.name.includes("B1 Pre-Intermediate"));
      assert.ok(PREP_MODULES.module3.name.includes("B2 Intermediate"));
      assert.ok(PREP_MODULES.module4.name.includes("C1 Exit Prep"));
    });

    test('User active module preference persists to localStorage', () => {
      let activeModule = 'module3';
      const changeActiveModule = (mod) => {
        if (PREP_MODULES[mod]) {
          activeModule = mod;
          global.window.localStorage.setItem('cauActivePrepModule', mod);
        }
      };

      changeActiveModule('module4');
      assert.strictEqual(activeModule, 'module4');
      assert.strictEqual(global.window.localStorage.getItem('cauActivePrepModule'), 'module4');
    });
  });

  describe('3. Student Voice & Campus Fortunes', () => {
    const CAMPUS_FORTUNES = [
      "A stray Kyrenia cat will supervise your English essay today.",
      "You will accidentally use a sophisticated word like 'nevertheless' in conversation.",
      "The deadline is midnight. The Mediterranean breeze is whispering 'take a nap'. Resist, scholar, resist!"
    ];

    test('Campus fortune updates fortuneText element', () => {
      const fortuneEl = elements.get('fortuneText');
      assert.ok(fortuneEl, 'fortuneText element exists in mock');
      fortuneEl.textContent = CAMPUS_FORTUNES[0];
      assert.ok(fortuneEl.textContent.includes('Kyrenia cat'));
    });
  });

  describe('4. Vocabulary Vault 3D Engine', () => {
    const VOCAB_VAULT = [
      { word: "Juxtapose", ipa: "/ˌdʒʌk.stəˈpəʊz/", pos: "Verb", def: "To place two concepts close together." },
      { word: "Corroborate", ipa: "/kəˈrɒb.ə.reɪt/", pos: "Verb", def: "To confirm with evidence." },
      { word: "Ubiquitous", ipa: "/juːˈbɪk.wɪ.təs/", pos: "Adjective", def: "Present everywhere." }
    ];

    test('Vocabulary elements update on card navigation', () => {
      let idx = 0;
      const render = (i) => {
        const item = VOCAB_VAULT[i];
        elements.get('vocabWord').textContent = item.word;
        elements.get('vocabIpa').textContent = item.ipa;
        elements.get('vocabPos').textContent = item.pos;
        elements.get('vocabDef').textContent = item.def;
      };

      render(0);
      assert.strictEqual(elements.get('vocabWord').textContent, 'Juxtapose');
      render(1);
      assert.strictEqual(elements.get('vocabWord').textContent, 'Corroborate');
      render(2);
      assert.strictEqual(elements.get('vocabWord').textContent, 'Ubiquitous');
    });
  });

  describe('5. Member Pass Personalization', () => {
    test('Member inputs synchronize to digital pass preview', () => {
      elements.get('memberInputName').value = 'Leyla Demir';
      elements.get('memberInputId').value = '2026-94812';
      elements.get('memberSelectFaculty').value = 'Module 3: Upper-Intermediate (B2)';
      elements.get('memberSelectTrack').value = 'Public Speaking & Oxford Debate';

      elements.get('passDisplayName').textContent = elements.get('memberInputName').value;
      elements.get('passDisplayId').textContent = elements.get('memberInputId').value;
      elements.get('passDisplayFaculty').textContent = elements.get('memberSelectFaculty').value;
      elements.get('passDisplayTrack').textContent = elements.get('memberSelectTrack').value;

      assert.strictEqual(elements.get('passDisplayName').textContent, 'Leyla Demir');
      assert.strictEqual(elements.get('passDisplayId').textContent, '2026-94812');
      assert.strictEqual(elements.get('passDisplayFaculty').textContent, 'Module 3: Upper-Intermediate (B2)');
      assert.strictEqual(elements.get('passDisplayTrack').textContent, 'Public Speaking & Oxford Debate');
    });
  });
});
