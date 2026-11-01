/* CAU AI Assistant — Official Campus & Admissions Interactive Guide
   Swiss Editorial Design System • Context-Aware • Fully Offline & Online Resilient
   Cyprus Aydın University (CAU) • Kyrenia, TRNC */
(() => {
  const CSS = `
:root {
  --cau-chat-primary: #f04432;
  --cau-chat-primary-hover: #d93a29;
  --cau-chat-primary-rgb: 240, 68, 50;
  --cau-chat-bg: #ffffff;
  --cau-chat-panel-border: #111214;
  --cau-chat-text: #111214;
  --cau-chat-muted: #5e6065;
  --cau-chat-header-bg: #111214;
  --cau-chat-header-text: #ffffff;
  --cau-chat-bubble-ai: #f5f5f2;
  --cau-chat-bubble-ai-border: #e6e6e1;
  --cau-chat-bubble-ai-text: #111214;
  --cau-chat-bubble-user: #111214;
  --cau-chat-bubble-user-text: #ffffff;
  --cau-chat-chip-bg: #f0f0eb;
  --cau-chat-chip-border: #dcdcd5;
  --cau-chat-chip-text: #1a1b1e;
  --cau-chat-chip-hover-bg: #111214;
  --cau-chat-chip-hover-text: #ffffff;
  --cau-chat-input-bg: #ffffff;
  --cau-chat-input-border: #d8d8d2;
  --cau-chat-shadow: none;
}

[data-theme="dark"] {
  --cau-chat-bg: #121418;
  --cau-chat-panel-border: rgba(255, 255, 255, 0.16);
  --cau-chat-text: #f2f3f5;
  --cau-chat-muted: #9a9ca1;
  --cau-chat-header-bg: #0c0d0f;
  --cau-chat-header-text: #ffffff;
  --cau-chat-bubble-ai: rgba(255, 255, 255, 0.06);
  --cau-chat-bubble-ai-border: rgba(255, 255, 255, 0.1);
  --cau-chat-bubble-ai-text: #f0f1f4;
  --cau-chat-bubble-user: #f04432;
  --cau-chat-bubble-user-text: #ffffff;
  --cau-chat-chip-bg: rgba(255, 255, 255, 0.08);
  --cau-chat-chip-border: rgba(255, 255, 255, 0.14);
  --cau-chat-chip-text: #e6e7eb;
  --cau-chat-chip-hover-bg: #ffffff;
  --cau-chat-chip-hover-text: #111214;
  --cau-chat-input-bg: rgba(255, 255, 255, 0.05);
  --cau-chat-input-border: rgba(255, 255, 255, 0.15);
  --cau-chat-shadow: none;
}

.cau-chat-root {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1200;
  font-family: "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14.5px;
  line-height: 1.45;
  color: var(--cau-chat-text);
}

.cau-chat-root[dir="rtl"] {
  right: auto;
  left: 24px;
}

/* Floating Launcher — Clean minimal flat design */
.cau-chat-toggle {
  height: 48px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: var(--radius, 4px) !important;
  background: var(--cau-chat-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 0 14px;
  cursor: pointer;
  box-shadow: none !important;
  transition: all 0.18s ease;
  position: relative;
}

.cau-chat-toggle:hover {
  background: var(--cau-chat-primary-hover);
  transform: translateY(-2px);
  box-shadow: none !important;
}

.cau-chat-toggle:active {
  transform: translateY(0);
}

.cau-chat-toggle-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  font-size: 14px;
}

.cau-chat-pulse {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 9px;
  height: 9px;
  background: #22c55e !important;
  border: 2px solid #fff;
  border-radius: 50%;
}

/* Chat Panel Window — Minimal 1px border, zero shadow */
.cau-chat-panel {
  position: fixed;
  right: 24px;
  bottom: 84px;
  width: min(420px, calc(100vw - 32px));
  height: min(620px, calc(100vh - 110px));
  display: none;
  flex-direction: column;
  background: var(--cau-chat-bg);
  border: 1px solid var(--cau-chat-panel-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: none !important;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  transition: width 0.2s ease, height 0.2s ease;
  z-index: 1201;
}

.cau-chat-root[dir="rtl"] .cau-chat-panel {
  right: auto;
  left: 24px;
}

.cau-chat-panel.expanded {
  width: min(720px, calc(100vw - 32px));
  height: min(760px, calc(100vh - 110px));
}

.cau-chat-panel.open {
  display: flex;
  animation: cau-chat-open 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cau-chat-open {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Chat Header */
.cau-chat-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: var(--cau-chat-header-bg);
  color: var(--cau-chat-header-text);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cau-chat-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cau-chat-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--cau-chat-primary);
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 16px;
  position: relative;
  flex-shrink: 0;
}

.cau-chat-avatar-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 9px;
  height: 9px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid var(--cau-chat-header-bg);
}

.cau-chat-title-group {
  display: flex;
  flex-direction: column;
}

.cau-chat-title-group h2 {
  margin: 0;
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #fff;
  line-height: 1.2;
}

.cau-chat-title-group p {
  margin: 2px 0 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.cau-chat-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cau-chat-btn {
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: all 0.15s ease;
}

.cau-chat-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.cau-chat-btn:focus-visible {
  outline: 2px solid var(--cau-chat-primary);
  outline-offset: 2px;
}

/* Chat Body */
.cau-chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scroll-behavior: smooth;
}

.cau-chat-body::-webkit-scrollbar {
  width: 6px;
}

.cau-chat-body::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.25);
  border-radius: 3px;
}

.cau-chat-body::-webkit-scrollbar-thumb:hover {
  background: rgba(120, 120, 120, 0.4);
}

/* Messages */
.cau-chat-msg-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 88%;
}

.cau-chat-msg-row.user {
  align-self: flex-end;
  align-items: flex-end;
}

.cau-chat-msg-row.ai {
  align-self: flex-start;
  align-items: flex-start;
}

.cau-chat-msg {
  padding: 12px 16px;
  border-radius: 10px;
  line-height: 1.48;
  font-size: 14px;
  overflow-wrap: anywhere;
  position: relative;
  box-shadow: none !important;
}

.cau-chat-msg.user {
  background: var(--cau-chat-bubble-user);
  color: var(--cau-chat-bubble-user-text);
  border-radius: 10px;
  border-bottom-right-radius: 2px;
  box-shadow: none !important;
}

.cau-chat-msg.ai {
  background: var(--cau-chat-bubble-ai);
  color: var(--cau-chat-bubble-ai-text);
  border: 1px solid var(--cau-chat-bubble-ai-border);
  border-radius: 10px;
  border-bottom-left-radius: 2px;
  box-shadow: none !important;
}

.cau-chat-msg-meta {
  font-size: 10.5px;
  color: var(--cau-chat-muted);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.cau-chat-msg-copy {
  border: 0;
  background: transparent;
  color: var(--cau-chat-muted);
  font-size: 11px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.cau-chat-msg-copy:hover {
  color: var(--cau-chat-text);
}

/* Quick Action Buttons within AI message */
.cau-chat-cta-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--cau-chat-bubble-ai-border);
}

.cau-chat-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.cau-chat-cta-btn.whatsapp {
  background: #25d366;
  color: #fff;
}

.cau-chat-cta-btn.whatsapp:hover {
  background: #20ba59;
  transform: translateY(-1px);
}

.cau-chat-cta-btn.apply {
  background: var(--cau-chat-primary);
  color: #fff;
}

.cau-chat-cta-btn.apply:hover {
  background: var(--cau-chat-primary-hover);
  transform: translateY(-1px);
}

.cau-chat-cta-btn.link {
  background: var(--cau-chat-chip-bg);
  color: var(--cau-chat-text);
  border: 1px solid var(--cau-chat-chip-border);
}

.cau-chat-cta-btn.link:hover {
  background: var(--cau-chat-text);
  color: var(--cau-chat-bg);
}

/* Formatted Elements inside message */
.cau-chat-msg strong {
  font-weight: 700;
  color: inherit;
}

.cau-chat-msg ul, .cau-chat-msg ol {
  margin: 6px 0;
  padding-left: 20px;
}

.cau-chat-msg li {
  margin: 3px 0;
}

.cau-chat-code-pill {
  display: inline-block;
  background: rgba(var(--cau-chat-primary-rgb), 0.1);
  color: var(--cau-chat-primary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12.5px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

/* Suggestion Chips */
.cau-chat-chips-section {
  margin-top: 10px;
}

.cau-chat-chips-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--cau-chat-muted);
  margin-bottom: 6px;
}

.cau-chat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cau-chat-chip {
  background: var(--cau-chat-chip-bg);
  border: 1px solid var(--cau-chat-chip-border);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  color: var(--cau-chat-chip-text);
  cursor: pointer;
  box-shadow: none !important;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
  line-height: 1.3;
}

.cau-chat-chip:hover {
  background: var(--cau-chat-chip-hover-bg);
  color: var(--cau-chat-chip-hover-text);
  border-color: var(--cau-chat-chip-hover-bg);
  transform: translateY(-1px);
  box-shadow: none !important;
}

/* Official Sources */
.cau-chat-sources {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--cau-chat-bubble-ai-border);
  font-size: 12px;
}

.cau-chat-sources strong {
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cau-chat-muted);
}

.cau-chat-sources a {
  color: var(--cau-chat-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.cau-chat-sources a:hover {
  color: var(--cau-chat-primary-hover);
}

/* Typing Indicator */
.cau-chat-typing {
  align-self: flex-start;
  background: var(--cau-chat-bubble-ai);
  border: 1px solid var(--cau-chat-bubble-ai-border);
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cau-chat-dot {
  width: 7px;
  height: 7px;
  background: var(--cau-chat-primary);
  border-radius: 50%;
  animation: cau-chat-dot-bounce 1.3s infinite ease-in-out both;
}

.cau-chat-dot:nth-child(1) { animation-delay: -0.32s; }
.cau-chat-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes cau-chat-dot-bounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.cau-chat-typing-label {
  font-size: 12px;
  color: var(--cau-chat-muted);
  margin-left: 4px;
}

/* Chat Footer / Form */
.cau-chat-foot {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-top: 1px solid var(--cau-chat-panel-border);
  background: var(--cau-chat-bg);
  gap: 6px;
}

.cau-chat-form-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.cau-chat-input {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--cau-chat-input-border);
  border-radius: 8px;
  background: var(--cau-chat-input-bg);
  padding: 10px 14px;
  font: inherit;
  font-size: 14px;
  color: var(--cau-chat-text);
  box-shadow: none !important;
  transition: border-color 0.15s ease;
}

.cau-chat-input:focus-visible {
  outline: none;
  border-color: #111214;
  box-shadow: none !important;
}

.cau-chat-input::placeholder {
  color: var(--cau-chat-muted);
  opacity: 0.8;
}

.cau-chat-send {
  width: 42px;
  height: 40px;
  border: 0;
  border-radius: 8px;
  background: var(--cau-chat-primary);
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: none !important;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.cau-chat-send:hover {
  background: var(--cau-chat-primary-hover);
  transform: translateY(-1px);
  box-shadow: none !important;
}

.cau-chat-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none !important;
}

.cau-chat-send:focus-visible {
  outline: 2px solid var(--cau-chat-primary);
  outline-offset: 2px;
  box-shadow: none !important;
}

.cau-chat-foot-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  line-height: 1.2;
  min-height: 16px;
  padding: 0 2px;
}

.cau-chat-word-counter {
  font-size: 11px;
  font-weight: 500;
  color: var(--cau-chat-muted);
  font-variant-numeric: tabular-nums;
  transition: color 0.15s ease;
}

.cau-chat-word-counter.cau-word-warning {
  color: var(--cau-chat-primary);
  font-weight: 700;
}

.cau-chat-word-limit-msg {
  font-size: 11px;
  color: var(--cau-chat-primary);
  font-weight: 600;
}

.cau-chat-input.cau-input-exceeded {
  border-color: var(--cau-chat-primary) !important;
  background: rgba(240, 68, 50, 0.04);
}

.cau-chat-disclaimer {
  font-size: 10.5px;
  color: var(--cau-chat-muted);
  text-align: center;
  letter-spacing: 0.01em;
}

/* Mobile Responsive */
@media (max-width: 575.98px) {
  .cau-chat-root { right: 16px; bottom: 16px; }
  .cau-chat-panel {
    right: 12px;
    left: 12px;
    bottom: 74px;
    width: auto;
    height: calc(100vh - 90px);
    border-radius: 12px;
  }
  .cau-chat-root[dir="rtl"] { left: 16px; }
  .cau-chat-root[dir="rtl"] .cau-chat-panel { right: 12px; left: 12px; }
  .cau-chat-toggle { height: 46px; padding: 0 16px 0 12px; font-size: 13.5px; border-radius: 23px; }
  .cau-chat-panel.expanded { width: auto; height: calc(100vh - 90px); }
}

/* Sidebar AI Advisor Card for Program Pages */
.sidebar-ai-advisor-card {
  background: var(--sys-surface, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left: 3px solid var(--cau-chat-primary, #f04432) !important;
  border-radius: 10px;
  padding: 22px 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}
[data-theme="dark"] .sidebar-ai-advisor-card {
  background: #14171d;
  border-color: rgba(255, 255, 255, 0.1);
  border-left-color: var(--cau-chat-primary, #f04432) !important;
}
.sidebar-ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--cau-chat-primary, #f04432);
  background: rgba(240, 68, 50, 0.08);
  padding: 4px 9px;
  border-radius: 4px;
  margin-bottom: 10px;
}
.sidebar-ai-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--cau-chat-text, #111214);
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}
.sidebar-ai-desc {
  font-size: 13px;
  color: var(--cau-chat-muted, #5e6065);
  line-height: 1.45;
  margin: 0 0 14px;
}
.sidebar-ai-chips {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.sidebar-ai-chip {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px 13px;
  background: var(--sys-surface-2, rgba(0, 0, 0, 0.03));
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--cau-chat-text, #111214);
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}
.sidebar-ai-chip i {
  color: var(--cau-chat-primary, #f04432);
  font-size: 13px;
  width: 16px;
  text-align: center;
  transition: color 0.15s ease;
}
.sidebar-ai-chip:hover {
  background: var(--cau-chat-text, #111214);
  border-color: var(--cau-chat-text, #111214);
  color: #ffffff;
  transform: translateX(3px);
}
.sidebar-ai-chip:hover i {
  color: #ffffff;
}
[data-theme="dark"] .sidebar-ai-chip {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
}
[data-theme="dark"] .sidebar-ai-chip:hover {
  background: var(--cau-chat-primary, #f04432);
  border-color: var(--cau-chat-primary, #f04432);
  color: #ffffff;
}
.sidebar-ai-input-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--cau-chat-bg, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 6px;
  padding: 4px 6px 4px 12px;
  transition: border-color 0.15s ease;
}
[data-theme="dark"] .sidebar-ai-input-wrap {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
}
.sidebar-ai-input-wrap:focus-within {
  border-color: var(--cau-chat-primary, #f04432);
}
.sidebar-ai-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--cau-chat-text, #111214);
  outline: none;
  padding: 5px 0;
  font-family: inherit;
}
.sidebar-ai-input::placeholder {
  color: var(--cau-chat-muted, #5e6065);
  font-size: 12.5px;
}
.sidebar-ai-submit-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: var(--cau-chat-primary, #f04432);
  color: #ffffff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.15s ease;
  flex-shrink: 0;
}
.sidebar-ai-submit-btn:hover {
  background: var(--cau-chat-primary-hover, #d93a29);
}
`;

  const state = {
    open: false,
    expanded: false,
    sound: true,
    loading: false,
    programs: [],
    history: [],
    navigatorMode: null,
    navigatorPayload: null,
  };

  const STORAGE_KEY = 'cau_chat_history_v2';
  const SOUND_KEY = 'cau_chat_sound_enabled';

  const normalized = (value) => String(value || '').toLocaleLowerCase();

  // Web Audio Synthesizer (Zero asset dependencies)
  const playSound = (kind) => {
    if (!state.sound) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (kind === 'send') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } else if (kind === 'receive') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch {
      /* AudioContext autoplay policy or not supported */
    }
  };

  const officialSources = {
    studentAffairs: { label: 'CAU: Office of Student Affairs', url: 'https://cau.edu.tr/en/office-of-student-affairs/' },
    international: { label: 'CAU International', url: 'https://international.cau.edu.tr/' },
    apply: { label: 'CAU International: Apply Portal', url: 'https://international.cau.edu.tr/apply/' },
    programmes: { label: 'CAU International: Programmes', url: 'https://international.cau.edu.tr/programs/' },
    tuition: { label: 'CAU: Tuition & Fees Schedule', url: 'https://international.cau.edu.tr/tuition-fees/' },
    tuitionTr: { label: 'CAU: Tuition & Fees', url: 'https://www.cau.edu.tr/en/tuition-fees/' },
    scholarships: { label: 'CAU International: Scholarships', url: 'https://international.cau.edu.tr/scholarship/' },
    accommodation: { label: 'CAU International: Accommodation', url: 'https://international.cau.edu.tr/accommodation/' },
    personnel: { label: 'CAU: Personnel Department', url: 'https://cau.edu.tr/en/personnel-department/' },
    akademikKadro: { label: 'CAU: Academic Staff Directory', url: 'https://akademikkadro.cau.edu.tr/' },
    cauMain: { label: 'CAU: Official Website', url: 'https://cau.edu.tr/' },
    faculties: { label: 'CAU: Faculties', url: 'https://cau.edu.tr/en/faculties/' },
    aboutCau: { label: 'CAU: About us', url: 'https://cau.edu.tr/en/about-us/' },
  };

  const staffDirectory = [
    { keywords: ["software", "yazilim"], label: "Software Engineering", staff: ["Dr. Öğr. Üyesi Everistus Zeluwa Orji — Software Engineering (English)"] },
    { keywords: ["computer engineering", "computer", "bilgisayar"], label: "Computer Engineering", staff: ["Dr. Öğr. Üyesi Ruhsan Önder — Computer Engineering (English)"] },
    { keywords: ["information security", "bilgi guvenligi"], label: "Information Security Engineering", staff: ["Dr. Öğr. Üyesi Gizem Baran — Information Security Engineering (English)"] },
    { keywords: ["electrical", "electronics", "elektrik"], label: "Electrical and Electronics Engineering", staff: ["Prof. Dr. Sertan Serte — Electrical and Electronics Engineering (English)", "Dr. Öğr. Üyesi Muhammad Asif Rabbani — Electrical and Electronics Engineering"] },
    { keywords: ["mechatronics", "mekatronik"], label: "Mechatronics Engineering", staff: ["Doç. Dr. Roozbeh Vaziri — Mechatronics Engineering (English)"] },
    { keywords: ["civil engineering", "civil"], label: "Civil Engineering", staff: ["Search akademikkadro.cau.edu.tr for Civil Engineering — live directory"] },
    { keywords: ["architecture"], label: "Architecture", staff: ["Doç. Dr. Vefa Tezcan — Architecture (English)", "Dr. Öğr. Üyesi Maryam Iranfar — Architecture (English)", "Dr. Öğr. Üyesi Kamyar Fuladlu — Architecture (English)"] },
    { keywords: ["interior architecture", "interior", "ic mimarlik"], label: "Interior Architecture and Environmental Design", staff: ["Dr. Öğr. Üyesi Ayşegül Deniz Yamaçoba — Interior Architecture and Environmental Design"] },
    { keywords: ["law", "hukuk"], label: "Law", staff: ["Prof. Dr. Yadigar İzmirli — Law", "Prof. Dr. Zehra Gönül Balkır — Law", "Prof. Dr. Selma Çetiner — Law"] },
    { keywords: ["dentistry", "dis hekimligi"], label: "Dentistry", staff: ["Prof. Dr. Cem Kurtoğlu — Dentistry (English)", "Dr. Öğr. Üyesi Şule Nur Purdaş — Dentistry"] },
    { keywords: ["tourism", "hotel management", "turizm"], label: "Tourism and Hotel Management", staff: ["Prof. Dr. Hasan Tunç — Tourism Faculty (Dean)", "Assoc. Prof. Dr. Soolmaz Azarmi Lafmajani — Tourism and Hotel Management (Head)", "Doç. Dr. Tuğrul Günay — Tourism and Hotel Management"] },
    { keywords: ["gastronomy", "culinary", "gastronomi"], label: "Gastronomy and Culinary Arts", staff: ["Dr. Öğr. Üyesi Emine Erkanlı — Gastronomy and Culinary Arts"] },
    { keywords: ["nursing", "hemsirelik"], label: "Nursing", staff: ["Prof. Dr. Lale Ayşegül Büyükgönenç — Nursing", "Prof. Dr. Mehmet Zeki Avcı — Nursing", "Doç. Dr. Funda Karaman — Nursing (English)"] },
    { keywords: ["physiotherapy", "fizyoterapi", "rehabilitation"], label: "Physiotherapy and Rehabilitation", staff: ["Prof. Dr. Emel Şahin — Physiotherapy and Rehabilitation", "Dr. Öğr. Üyesi Hasan Cellatoğlu — Physiotherapy and Rehabilitation", "Dr. Öğr. Üyesi Damla Parmak — Physiotherapy and Rehabilitation"] },
    { keywords: ["psychology", "psikoloji"], label: "Psychology", staff: ["Dr. Öğr. Üyesi Sevğül Türkoğlu — Psychology", "Dr. Öğr. Üyesi Linda Fraim — Psychology", "Dr. Öğr. Üyesi Hakan Yağcı — Psychology (English)"] },
    { keywords: ["guidance", "psychological counseling", "rehberlik"], label: "Guidance and Psychological Counseling", staff: ["Prof. Dr. Ömer Üre — Guidance and Psychological Counseling", "Prof. Dr. Aslı Bugay Sökmez — Guidance and Psychological Counseling"] },
    { keywords: ["business", "isletme"], label: "Business Administration", staff: ["Prof. Dr. Erdal Güryay — Business (English)", "Prof. Dr. Arzu Alvan — Business Administration (English)"] },
    { keywords: ["international relations", "uluslararasi iliskiler"], label: "International Relations", staff: ["Doç. Dr. Cemal Yorgancıoğlu — International Relations (English)", "Doç. Dr. Mehmet Direkli — International Relations (English)"] },
    { keywords: ["banking", "finance", "bankacilik"], label: "Banking and Finance", staff: ["Doç. Dr. Hatice İmamoğlu — Banking and Finance (English)", "Dr. Öğr. Üyesi Shahrzad Safaeimanesh — Banking and Finance (English)"] },
  ];

  function findStaffForQuery(q) {
    const lower = q.toLocaleLowerCase();
    const sorted = [...staffDirectory].sort((a, b) => Math.max(...b.keywords.map(k => k.length)) - Math.max(...a.keywords.map(k => k.length)));
    for (const e of sorted) {
      if (e.keywords.some(k => lower.includes(k))) return e;
    }
    return undefined;
  }

  // Detect Context from active URL
  function getPageContext() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/programs/')) {
      const slug = path.split('/programs/')[1]?.replace('.html', '') || '';
      const formatted = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { type: 'program', slug, title: formatted };
    }
    if (path.includes('/departments/')) {
      const slug = path.split('/departments/')[1]?.replace('.html', '') || '';
      const formatted = slug.replace('faculty-of-', 'Faculty of ').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { type: 'department', slug, title: formatted };
    }
    if (path.includes('scholarship')) return { type: 'scholarship' };
    if (path.includes('tuition')) return { type: 'tuition' };
    if (path.includes('international')) return { type: 'international' };
    return { type: 'general' };
  }

  function getContextualChips() {
    const ctx = getPageContext();
    if (ctx.type === 'program') {
      return [
        { label: `💰 Tuition & Fees for ${ctx.title}`, prompt: `What are the tuition fees and scholarship discounts for ${ctx.title}?` },
        { label: `👨‍🏫 Professors teaching ${ctx.title}`, prompt: `Who are the professors and faculty members teaching ${ctx.title}?` },
        { label: `📚 Degree Duration & Language`, prompt: `What is the degree duration, language of instruction, and ECTS credits for ${ctx.title}?` },
        { label: `📝 How to Apply`, prompt: `How do I apply for ${ctx.title} as an international student?` },
        { label: `💬 WhatsApp Admissions`, prompt: `Can I speak with an international admissions advisor on WhatsApp?` },
      ];
    }
    if (ctx.type === 'department') {
      return [
        { label: `🏛️ Degrees in ${ctx.title}`, prompt: `What bachelor and master programs are offered under ${ctx.title}?` },
        { label: `🎓 Faculty Dean & Staff`, prompt: `Who is the Dean and leading professors in ${ctx.title}?` },
        { label: `🔬 Laboratories & Facilities`, prompt: `What laboratories and academic infrastructure are available in ${ctx.title}?` },
        { label: `💰 Fees & Scholarships`, prompt: `What are the fees and scholarship criteria for programs in ${ctx.title}?` },
      ];
    }
    if (ctx.type === 'scholarship') {
      return [
        { label: `🏆 SAT 85% & 100% Scholarships`, prompt: `How does the SAT score grant 85% and 100% scholarship at CAU?` },
        { label: `🔄 Transfer 85% Scholarship`, prompt: `What are the criteria for transfer student 85% scholarship?` },
        { label: `👥 Sibling 70% to 80% Discount`, prompt: `How does the sibling scholarship discount work?` },
        { label: `📝 Submit Documents for Scholarship`, prompt: `How do I apply and submit my transcripts for scholarship evaluation?` },
      ];
    }
    return [
      { label: `🎓 Find a Program`, action: `program_finder`, prompt: `Help me find a program based on my interests.` },
      { label: `🧮 Calculate Tuition`, action: `tuition_calculator`, prompt: `Calculate my estimated tuition and scholarship.` },
      { label: `🎯 Career → Degree`, action: `career_finder`, prompt: `Help me match my career goal to a CAU degree.` },
      { label: `🧭 Student Journey Guide`, action: `university_guide`, prompt: `Show me the complete student journey from admission to arrival.` },
      { label: `🌍 International Student Mode`, action: `international_mode`, prompt: `I am an international student applying from my country.` },
      { label: `📝 Application Checklist`, action: `application_process`, prompt: `Show me the required document checklist for application.` },
      { label: `🏫 Campus Assistant`, action: `campus_assistant`, prompt: `Where are campus facilities like the library, printing, and offices?` },
      { label: `📅 First-Week Planner`, action: `student_planner`, prompt: `What should I do in my first week at CAU?` },
      { label: `🌴 Life in Kyrenia`, action: `cyprus_life`, prompt: `Tell me about living expenses and student life in Kyrenia.` },
      { label: `💬 WhatsApp Admissions`, prompt: `How can I contact CAU international admissions on WhatsApp?` },
    ];
  }

  // Client Catalog & Rule Fallback Engine
  const localFallback = (question) => {
    const query = normalized(question);
    const words = query.split(/\s+/).filter((word) => word.length > 3);

    // Multilingual greetings
    if (/^(?:hi|hello|hey|good\s+(?:morning|afternoon|evening)|merhaba|selam|مرحبا|مرحباً|أهلا|اهلا|سلام|السلام عليكم|привет|здравствуйте|bonjour|hola|hallo|thanks?|thank you|teşekkür|شكرا|شكراً|спасибо|merci)[!?.\s]*$/i.test(query)) {
      if (/[\u0600-\u06FF]/.test(query)) {
        return {
          answer: 'أهلاً وسهلاً بك في **جامعة قبرص أيدن (CAU)**! 👋\n\nأنا مرشدك الجامعي المعتمد، يسعدني إجابتك بدقة عن:\n- **البرامج والتخصصات المتاحة** (48 تخصصاً في البكالوريوس والدراسات العليا)\n- **الرسوم والمنح الدراسية** (منح 50% وحتى 100% للمتفوقين)\n- **شروط وخطوات التقديم أونلاين**\n- **السكن الطلابي المعتمد والحياة في كيرينيا**\n\nكيف يمكنني مساعدتك اليوم؟',
          sources: [officialSources.cauMain, officialSources.international],
          suggestedChips: [
            { label: 'الرسوم والمنح', prompt: 'كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟' },
            { label: 'التخصصات الدراسية', prompt: 'ما هي التخصصات والبرامج المتاحة في الجامعة؟' },
            { label: 'كيفية التقديم', prompt: 'كيف أقدم على الجامعة وما هي الأوراق المطلوبة؟' },
            { label: 'تواصل عبر واتساب', prompt: 'كيف أتواصل مع مكتب القبول الدولي عبر واتساب؟' }
          ]
        };
      }
      return {
        answer: 'Hello! I’m **CAU’s AI Assistant** — your direct guide to Cyprus Aydın University.\n\nI can help you with:\n- **Degree Programmes & Curricula** (Bachelor’s, Master’s, Ph.D., Associate)\n- **Tuition Fees & Scholarships (USD $)** (50% to 100% merit waivers)\n- **Online Applications & Visa Guidance** for international students\n- **Academic Staff & Professors** across all 8 faculties\n- **Dormitories & Campus Life** in beautiful Kyrenia, TRNC.\n\nWhat would you like to explore today?',
        sources: [officialSources.cauMain, officialSources.international],
        suggestedChips: [
          { label: 'Tuition & Fees ($)', prompt: 'How much is tuition for international students in USD?' },
          { label: 'Scholarships (50%–100%)', prompt: 'What scholarships are available for international students?' },
          { label: 'Dentistry Dual Campus', prompt: 'Tell me about the 5-year Dentistry dual-campus program.' },
          { label: '8 Faculties', prompt: 'What are the 8 faculties at CAU?' }
        ]
      };
    }

    // Sports, Athletics, Football Team, Gym & Facilities
    if (/football|soccer|futsal|basketball|volleyball|tennis|table tennis|sport|sports|gym|fitness|athletics|team\b|teams\b|stadium|pitch|tournament|rector.*cup|workout|exercise|training|spor|futbol|basketbol|voleybol|tenis|turnuva|saha|antreman|kulüp|kulübü|كرة قدم|كرة القدم|رياضة|رياضات|فريق|فرق|نادي رياضي|صالات رياضية|جيم|نوادي|футбол|спорт|команда|тренировк/i.test(query)) {
      if (/[\u0600-\u06FF]/.test(query)) {
        return {
          answer: `**الفرق الرياضية، فريق كرة القدم والمرافق في جامعة قبرص أيدن (CAU) ⚽🏆**\n\nنعم، تمتلك جامعة قبرص أيدن نشاطاً رياضياً حيوياً وفرقاً رسمية تمثل الجامعة:\n\n• **فريق كرة القدم الرسمي والصالات (Futsal)**:\n  تمتلك الجامعة فريقاً رسمياً لكرة القدم (11 لاعباً) وفريقاً لكرة قدم الصالات يشارك في بطولات **الاتحاد الرياضي للجامعات في شمال قبرص (KKTC Üniversite Sporları Federasyonu)**.\n• **بطولة كأس رئيس الجامعة السنوية (Rektörlük Kupası)**:\n  بطولة دورية سنوية في كرة القدم يتنافس فيها طلاب الكليات المختلفة والجاليات الدولية للفوز بكأس البطولة.\n• **الفرق الرياضية الأخرى**:\n  - فريق كرة السلة (طلاب وطالبات)\n  - فريق الكرة الطائرة\n  - فريق تنس الطاولة وبطولات الشطرنج\n• **المرافق الرياضية وصالة الجيم (Fitness Gym)**:\n  - صالة لياقة بدنية حديثة مجهزة بالكامل ومتاحة مجاناً لجميع طلاب الجامعة المسجلين.\n  - ملاعب رياضية خارجية لكرة السلة والكرة الطائرة في الحرم الجامعي.\n  - ملاعب عشب صناعي وتنسيق مع مجمعات كيرينيا الرياضية للمباريات الرسمية.\n• **كيفية الانضمام وتجارب الأداء**:\n  تقام اختبارات الانضمام للفرق في بداية فصلي الخريف والربيع بتنظيم **إدارة الصحة والثقافة والرياضة (SKS)**. يحق لجميع الطلاب الدوليين المشاركة والتسجيل.\n\nللتسجيل أو الاستفسار: تواصل عبر البريد **bilgi@cau.edu.tr** أو تفضل بزيارة مكتب SKS / شؤون الطلاب في الحرم الجامعي.`,
          sources: [officialSources.cauMain, officialSources.aboutCau],
          suggestedChips: [
            { label: '⚽ تجارب أداء كرة القدم', prompt: 'كيف أنضم إلى تجارب أداء فريق كرة القدم بالجامعة؟' },
            { label: '🏋️ صالة الجيم والياقة', prompt: 'أين تقع صالة الجيم وما هي أوقات الدخول؟' },
            { label: '🏢 السكن الطلابي', prompt: 'ما هي خيارات السكن الطلابي المتاحة في كيرينيا؟' },
            { label: '💰 الرسوم والمنح', prompt: 'كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟' }
          ]
        };
      }
      return {
        answer: `**CAU Sports Teams, Football & Athletics Facilities ⚽🏆**\n\nYes! Cyprus Aydın University (CAU) has active collegiate sports teams and dedicated athletic facilities:\n\n• **CAU Official Football & Futsal Team**:\n  CAU competes in the **TRNC Inter-University Sports Federation (KKTC Üniversite Sporları Federasyonu)** national championships with official Men's Football (11-a-side) and Futsal (indoor soccer) varsity squads.\n• **Intramural Rector's Cup (Rektörlük Kupası)**:\n  An annual campus-wide football tournament where international student teams and academic departments compete for championship trophies.\n• **Other Varsity Teams & Clubs**:\n  - **Basketball Teams** (Men's & Women's)\n  - **Volleyball Team**\n  - **Table Tennis Team** & Chess League\n• **Sports Facilities & Campus Gym**:\n  - **On-Campus Fitness Center / Gym**: Equipped with cardio treadmills, free weights, and resistance machines, completely free for registered CAU students.\n  - **Multi-purpose outdoor courts** for basketball and volleyball.\n  - Regular access to Kyrenia artificial turf pitches (halı saha) and partnerships with municipal stadiums for league matches.\n• **How to Join & Tryouts**:\n  Tryouts are held at the start of every Fall and Spring semester by the **Directorate of Health, Culture, and Sports (SKS)**. All enrolled international students are eligible to try out!\n\nFor tryout announcements or to register with a sports club, contact Student Affairs at **bilgi@cau.edu.tr** (+90 392 650 00 00).`,
        sources: [officialSources.cauMain, officialSources.aboutCau],
        suggestedChips: [
          { label: '⚽ Football Tryouts', prompt: 'How can I join the CAU football team tryouts?' },
          { label: '🏋️ Campus Gym & Fitness', prompt: 'Where is the fitness gym located on campus?' },
          { label: '🌴 Living in Cyprus', prompt: 'What is the cost of living in Kyrenia for students?' },
          { label: '💰 Tuition & Scholarships', prompt: 'What are the tuition fees and scholarships?' }
        ]
      };
    }

    // Cyprus, Kyrenia (TRNC) Living, Costs, Weather, Transport, Safety & Visas
    if (/living cost|cost of living|expenses|how much to live|weather|climate|currency|lira|safe|safety|crime|secure|transport|shuttle|bus|dolmus|dolmuş|taxi|beach|beaches|travel|flight|ticket|visa|residence permit|residency|ikamet|part-time|work|job|employment|تكلفة المعيشة|المعيشة في قبرص|مصاريف المعيشة|طقس|أمان|مواصلات|عمل الطلاب|yaşam maliyeti|girne hayat|kıbrıs yaşam|güvenli mi|çalışma izni|havalimanı|стоимость проживан|погода на кипре|безопасност/i.test(query)) {
      if (/[\u0600-\u06FF]/.test(query)) {
        return {
          answer: `**الحياة والمعيشة الطلابية في مدينة كيرينيا، شمال قبرص (TRNC) 🌴🏛️**\n\nتعد كيرينيا (Girne) عروس البحر الأبيض المتوسط وإحدى أجمل المدن الساحلية والجامعية في المنطقة:\n\n• **تكاليف المعيشة الشهرية**:\n  تتراوح المصاريف الشهرية للطالب بين **350 إلى 500 يورو شهرياً** (تشمل الطعام، السوبرماركت، المواصلات، باقة الإنترنت وشريحة الهاتف، والمصروف الشخصي).\n• **العملة والتعاملات المالية**:\n  - العملة الرسمية للمشتريات اليومية هي **الليرة التركية (TRY / ₺)**.\n  - اليورو والدولار والجنيه الإسترليني مقبولة على نطاق واسع، والرسوم الدراسية تسدد باليورو.\n  - أجهزة الصراف الآلي (ATM) تقبل بطاقات فيزا وماستركارد الدولية في كل مكان.\n• **الطقس والمناخ**:\n  - مناخ متوسطي مشمس بأكثر من **300 يوم شمس سنوياً**.\n  - الصيف دافئ ومشمس (30–38 درجة مئوية)، والشتاء معتدل (12–18 درجة مئوية) ولا تسقط ثلوج على الساحل.\n• **المواصلات وباصات الجامعة المجانية**:\n  - توفر الجامعة **حافلات نقل مجانية** منتظمة تربط بين السكن الطلابي، مركز كيرينيا، والحرم الجامعي.\n  - تتوفر حافلات النقل العامة (الدولموش) بسهولة للتنقل بين كيرينيا ونيقوسيا (Lefkoşa).\n• **الأمان والاستقرار**:\n  - تصنف شمال قبرص عالمياً بين **أكثر الوجهات أمناً وأماناً للطلاب** مع انعدام الجريمة ومجتمع طلابي دولي ودود من 30+ جنسية.\n• **الاستقبال من المطار والإقامة**:\n  - توفر الجامعة **خدمة استقبال مجانية من مطار إرجان (Ercan Airport - ECN)** للطلاب الجدد.\n  - تصدر تأشيرة الدخول في المطار بموجب ورقة القبول، وتتولى الجامعة مساعدة الطالب في استخراج الإقامة الطلابية (İkamet).`,
          sources: [officialSources.cauMain, officialSources.international, officialSources.accommodation],
          suggestedChips: [
            { label: '🏢 السكن الطلابي', prompt: 'ما هي تفاصيل السكن الطلابي المعتمد في كيرينيا؟' },
            { label: '🚌 مواصلات الجامعة', prompt: 'هل تتوفر حافلات نقل مجانية للحرم الجامعي؟' },
            { label: '💰 الرسوم والمنح', prompt: 'كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟' },
            { label: '⚽ الفرق الرياضية', prompt: 'هل يوجد فريق كرة قدم وفرق رياضية في الجامعة؟' }
          ]
        };
      }
      return {
        answer: `**Student Life & Living in Kyrenia, Northern Cyprus (TRNC) 🌴🏛️**\n\nKyrenia (Girne) is one of the Mediterranean's safest and most beautiful university towns:\n\n• **Monthly Living Expenses**:\n  Average student monthly living budget is **350 – 500 EUR / month** (covering food, groceries, mobile plan, local transport, and personal leisure).\n• **Currency & Payments**:\n  - The local currency for day-to-day purchases is the **Turkish Lira (TRY / ₺)**.\n  - Tuition is paid in EUR; foreign currencies (EUR, USD, GBP) and international cards (Visa/Mastercard) are widely used.\n• **Climate & Weather**:\n  - Mediterranean climate with **over 300 days of sunshine** every year!\n  - Summers (June–Sept) are warm and sunny (30–38°C); winters (Dec–Feb) are mild and green (12–18°C).\n• **Complimentary Transportation**:\n  - CAU operates **free campus shuttle buses** running throughout the day between student dormitories, Kyrenia city center, and the main campus.\n  - Shared minibuses ('dolmuş') connect Kyrenia with Nicosia and Famagusta.\n• **World-Class Safety**:\n  - Northern Cyprus is ranked among the safest study destinations worldwide, with virtually zero violent crime.\n• **Airport Pickup & Student Visa**:\n  - **Free airport pickup** from Ercan International Airport (ECN) for incoming students who submit flight details to **admission@cau.edu.tr**.\n  - Upon arrival with your CAU Official Acceptance Letter, you receive your student transit visa, followed by TRNC Student Residence Permit (İkamet) guidance from Student Affairs.`,
        sources: [officialSources.cauMain, officialSources.international, officialSources.accommodation],
        suggestedChips: [
          { label: '🏢 Student Dormitories', prompt: 'What dormitories are available for students in Kyrenia?' },
          { label: '🚌 Free Campus Shuttle', prompt: 'Is there a free bus shuttle to campus?' },
          { label: '⚽ Sports & Football', prompt: 'Is there any football team at CAU?' },
          { label: '💰 Tuition & Scholarships', prompt: 'What are the tuition fees and scholarships?' }
        ]
      };
    }

    // Program specific lookup in bundled catalog
    if (state.programs && state.programs.length > 0) {
      const matched = state.programs.filter(p => {
        const title = normalized(p['Program Name']);
        const dept = normalized(p.Department);
        return title.includes(query) || query.includes(title) || (words.length > 0 && words.every(w => title.includes(w) || dept.includes(w)));
      });

      if (matched.length > 0) {
        const top = matched[0];
        const fee = top['Price / Tuition'] || top.publishedTuition || '10,000 EUR per year';
        const dur = top.Duration || '4 Years';
        const lang = top.Language || 'English';
        const deg = top['Degree Level'] || 'Bachelor';
        const link = top.slug ? `/programs/${top.slug}.html` : '/programs.html';

        return {
          answer: `Here are the official details for **${top['Program Name']}** at CAU:\n\n` +
            `• **Degree Level**: ${deg}\n` +
            `• **Faculty / Department**: ${top.Department}\n` +
            `• **Language of Instruction**: ${lang}\n` +
            `• **Duration**: ${dur}\n` +
            `• **Annual Tuition**: **${fee}** *(with 50%–100% scholarships, net tuition ranges from 5,000 EUR to 0 EUR + annual registration fee)*\n\n` +
            `You can review the full semester-by-semester curriculum and course outlines on the program page or submit an application online.`,
          sources: [{ label: `CAU: ${top['Program Name']}`, url: top['Source URL'] || officialSources.programmes.url }, officialSources.tuition],
          actionLinks: [
            { label: 'View Program Page', url: link, kind: 'link' },
            { label: 'Apply Online', url: 'https://international.cau.edu.tr/apply/', kind: 'apply' },
            { label: 'WhatsApp Advisor', url: 'https://wa.me/905488357171?text=' + encodeURIComponent(`Hello CAU, I want to inquire about ${top['Program Name']}`), kind: 'whatsapp' }
          ],
          suggestedChips: [
            { label: `Tuition for ${top['Program Name']}`, prompt: `How much is tuition for ${top['Program Name']}?` },
            { label: 'Scholarships Available', prompt: `What scholarships apply to ${top['Program Name']}?` },
            { label: 'How to Apply', prompt: `How do I apply for ${top['Program Name']}?` },
            { label: 'Faculty Staff', prompt: `Who teaches in ${top.Department}?` }
          ]
        };
      }
    }

    if (/akademik|academic staff|\bprof\b|prof\.|professor|lecturer|faculty member|instructor|\bdoctor\b|hoca|öğretim|kadro|staff directory|who teaches|who is.*teach|which.*teach/.test(query)) {
      const hit = findStaffForQuery(query);
      if (hit) {
        return {
          answer: `For **${hit.label}** at CAU, verified academic staff include:\n\n` +
            hit.staff.map(s => `• **${s}**`).join('\n') +
            `\n\nFor photos, CVs, and institutional email addresses (name@cau.edu.tr), browse the searchable staff portal at **akademikkadro.cau.edu.tr**.`,
          sources: [officialSources.akademikKadro, officialSources.personnel],
          actionLinks: [{ label: 'Academic Staff Directory', url: 'https://akademikkadro.cau.edu.tr/', kind: 'link' }]
        };
      }
      return {
        answer: 'CAU’s academic roster comprises 100+ distinguished scholars and professors across 8 faculties. You can search the official directory live at **akademikkadro.cau.edu.tr** by faculty (e.g. Dentistry, Law, Engineering, Health Sciences) and academic title (Prof. Dr., Doç. Dr., Dr. Öğr. Üyesi).',
        sources: [officialSources.akademikKadro, officialSources.personnel],
        actionLinks: [{ label: 'Browse Staff Directory', url: 'https://akademikkadro.cau.edu.tr/', kind: 'link' }]
      };
    }

    if (/tuition|fee|cost|payment|iban|bank|installment|usd|dollar|price|ücret|fiyat|كم الرسوم|رسوم|стоимость/i.test(query)) {
      return {
        answer: `**Cyprus Aydın University — Official Tuition & Fee Schedule (USD $)**\n\n` +
          `• **Annual Registration + VAT + Activity Fee**: Flat **$600 USD** across all programs.\n\n` +
          `• **Bachelor and Associate Degrees (Annual Total)**:\n` +
          `  - Standard Fee: $10,000 + $600 = **$10,600 USD**\n` +
          `  - 50% Scholarship: $5,000 + $600 = **$5,600 USD**\n` +
          `  - 60% Scholarship: $4,000 + $600 = **$4,600 USD**\n` +
          `  - 70% Scholarship: $3,000 + $600 = **$3,600 USD**\n` +
          `  - 80% Scholarship: $2,000 + $600 = **$2,600 USD**\n` +
          `  - 85% Scholarship (SAT/Transfer): $1,500 + $600 = **$2,100 USD**\n` +
          `  - 90% Scholarship: $1,000 + $600 = **$1,600 USD**\n` +
          `  - 100% Scholarship: $0 + $600 = **$600 USD Total**\n\n` +
          `• **Faculty of Dentistry Dual-Campus (5-Year Program)**:\n` +
          `  - **Years 1–3 at CAU (Cyprus)**: Standard $22,600 | 50%: $11,600 | 60%: $9,400 | 70%: $7,200 | 80%: $5,000 USD/year\n` +
          `  - **Years 4–5 at IAU (Istanbul)**: Standard $37,100 | 50%: $17,850 | 60%: $14,400 | 70%: $10,950 | 80%: $7,500 USD/year\n\n` +
          `• **Master's Degrees (Total Program)**: Standard $7,600 | 50%: $4,100 | 60%: $3,400 | 70%: $2,700 | 80%: $2,000 USD\n` +
          `• **Ph.D. / Doctorate (Total Program)**: Standard $12,600 | 25%: $9,600 | 40%: $7,800 | 50%: $6,600 USD\n\n` +
          `• **Mandatory Deposits** (for unconditional acceptance letter): $1,250 USD (Bachelor/Master), $1,500 USD (Ph.D.), $2,500 USD (Dentistry).\n\n` +
          `*(Note: Dormitory accommodation is priced separately in Euros €)*`,
        sources: [officialSources.tuition, officialSources.scholarships],
        actionLinks: [
          { label: 'View Tuition Schedule', url: 'https://international.cau.edu.tr/tuition-fees/', kind: 'link' },
          { label: 'WhatsApp Admissions', url: 'https://wa.me/905488357171?text=' + encodeURIComponent('Hello, I would like to request an official fee calculation and payment details.'), kind: 'whatsapp' }
        ]
      };
    }

    if (/scholarship|sat|sibling|assistantship|burs|منحة|المنح|стипенди/i.test(query)) {
      return {
        answer: `**CAU International Scholarship Opportunities**\n\n` +
          `• **Merit Scholarships**: Available across tiers: 50%, 60%, 70%, 80%, 85%, 90%, and 100%.\n` +
          `• **SAT Merit Scholarship**:\n` +
          `  - SAT Score **1200+** ➔ **85% Scholarship** ($2,100 USD total/yr)\n` +
          `  - SAT Score **1300+** ➔ **100% Tuition Scholarship** (only $600 annual fee payable)\n` +
          `• **Transfer Student Scholarship**: **85% Scholarship** for eligible university transfers with CGPA ≥ 2.0.\n` +
          `• **Sibling Scholarship**: **70% Scholarship** for all international students; increases up to **80%** if sibling is currently enrolled at CAU.\n` +
          `• **Student Assistantship**: On-campus employment positions for students maintaining a GPA > 3.0.`,
        sources: [officialSources.scholarships, officialSources.international],
        actionLinks: [
          { label: 'Scholarship Details', url: 'https://international.cau.edu.tr/scholarship/', kind: 'link' },
          { label: 'Apply for Scholarship', url: 'https://international.cau.edu.tr/apply/', kind: 'apply' }
        ]
      };
    }

    if (/apply|application|admission|visa|offer letter|how to apply|kayıt|başvuru|تسجيل|поступлен/i.test(query)) {
      return {
        answer: `**How to Apply to Cyprus Aydın University**\n\n` +
          `1. **Submit Online**: Complete the application on CAU’s portal (**apply.cau.edu.tr**).\n` +
          `2. **Upload Documents (PDF)**:\n` +
          `   - Undergraduate: High school diploma & transcript, passport, 4 photos.\n` +
          `   - Master's / Ph.D.: Previous degree diploma & transcript, passport, 4 photos.\n` +
          `3. **Language Proficiency Cutoffs**:\n` +
          `   - Undergraduate: CSU EPE B1 | IELTS 5.0 | TOEFL iBT 60 | Duolingo 85 | TÖMER B1\n` +
          `   - Graduate: CSU EPE B2 | IELTS 5.5 | TOEFL iBT 65 | Duolingo 90 | TÖMER B2\n` +
          `4. **Tuition Deposit**: $1,250 USD (Bachelor/Master), $1,500 USD (Ph.D.), $2,500 USD (Dentistry) to issue official unconditional Acceptance Letter for visa.\n` +
          `5. **Free Airport Pickup**: Provided from Ercan International Airport (ECN) upon flight submission.\n\n` +
          `Contact: **admission@cau.edu.tr** | WhatsApp: **+90 548 835 71 71**.`,
        sources: [officialSources.apply, officialSources.international],
        actionLinks: [
          { label: 'Start Online Application', url: 'https://international.cau.edu.tr/apply/', kind: 'apply' },
          { label: 'WhatsApp Admissions', url: 'https://wa.me/905488357171?text=' + encodeURIComponent('Hello CAU, I would like guidance on applying for admission.'), kind: 'whatsapp' }
        ]
      };
    }

    if (/accommodation|dorm|housing|dormitory|yurt|سكن|общежит/i.test(query)) {
      return {
        answer: `**Student Accommodation — International Aydın Student Dormitory (Kyrenia)**\n\n` +
          `A secure, modern residence with a **142-bed capacity** located in Kyrenia:\n\n` +
          `• **Official Pricing for 9-Month Full Academic Year (in Euros €)**:\n` +
          `  - **Single Room**: **€5,500 EUR** (9 months total)\n` +
          `  - **Double Room (Per Person)**: **€3,200 EUR** (9 months total)\n` +
          `  - **Triple Room (Per Person)**: **€2,800 EUR** (9 months total)\n\n` +
          `• **Included Amenities**:\n` +
          `  - Fully equipped on-site gym & fitness center\n` +
          `  - Modern shared kitchen facilities\n` +
          `  - Quiet study & meeting rooms, library, and TV lounge\n` +
          `  - Landscaped gardens and Mediterranean sea views\n` +
          `  - **Complimentary regular shuttle bus** between dormitory and CAU campus\n` +
          `  - High-speed Wi-Fi and 24/7 security.\n\n` +
          `Booking contact: **+90 548 899 0484** | https://aydindorm.com/.`,
        sources: [officialSources.accommodation, officialSources.international],
        actionLinks: [{ label: 'Dormitory Info', url: 'https://international.cau.edu.tr/accommodation/', kind: 'link' }]
      };
    }

    // Official Institutional Numbers & Statistics from Handbook
    if (/how many students|how many alumni|how many faculties|how many partner|how many international|how many countries|how many clubs|numbers that matter|statistics|numbers\b|figures\b|sayılar|rakamlar|kaç öğrenci|kaç mezun|kaç fakülte|كم عدد/i.test(query)) {
      return {
        answer: `**Official Cyprus Aydın University Key Numbers & Statistics:**\n\n` +
          `• **1,200+** Alumni worldwide\n` +
          `• **3,000+** Enrolled Students\n` +
          `• **1,000+** International Students\n` +
          `• **60+** Countries our students come from\n` +
          `• **8 Academic Faculties** (Dentistry, Engineering, Health Sciences, Economics/Administrative/Social Sciences, Fine Arts & Design, Law, Education, Tourism)\n` +
          `• **11** Application and Research Centers\n` +
          `• **50+** International Partner Institutions\n` +
          `• **3** Dual Degree Programs\n` +
          `• **5+** Faculty Exchanges\n` +
          `• **15** Active Student Clubs\n` +
          `• **IAU Strategic Partner Metrics**: Founded 2003, Istanbul European side, 50,000+ students, 8,500+ international students from 124 countries, 17 faculties, 83.6% graduate job placement rate\n` +
          `• **Accommodation**: International Aydın Student Dormitory with 142 beds capacity, 9-month EUR rates (€5,500 / €3,200 / €2,800).`,
        sources: [officialSources.aboutCau, officialSources.cauMain],
        actionLinks: [
          { label: 'About CAU Numbers', url: '/about.html', kind: 'link' },
          { label: 'Tuition Fees Schedule ($)', url: '/tuition.html', kind: 'link' }
        ]
      };
    }

    // Assoc. Prof. Dr. Tuğrul Günay — Director of the International Office
    if (/tuğrul|tugrul|gunay|günay|international office director/i.test(query)) {
      return {
        answer: `**Assoc. Prof. Dr. Tuğrul Günay — Director of the International Office (IAU & CAU) 🌐**\n\n` +
          `Assoc. Prof. Dr. Tuğrul Günay heads international partnerships, student mobility, and cross-border academic initiatives for Cyprus Aydın University and Istanbul Aydın University.\n\n` +
          `Official Statement from CAU Handbook (Page 11):\n` +
          `*\"Internationalization is more than mobility — it’s about building bridges of knowledge, culture, and shared purpose. At Cyprus Aydin University, I am committed to fostering global partnerships and empowering students to thrive in a truly interconnected world.\"*\n\n` +
          `Dr. Günay manages 50+ international partner universities, dual-degree pathways (such as Dentistry 3+2), and student admissions across 60+ countries.\n\n` +
          `Contact the International Office: **admission@cau.edu.tr** | WhatsApp: **+90 548 835 71 71**.`,
        sources: [officialSources.aboutCau, officialSources.international],
        actionLinks: [
          { label: 'IAU Partnership Info', url: '/about.html', kind: 'link' },
          { label: 'WhatsApp Admissions', url: 'https://wa.me/905488357171', kind: 'whatsapp' }
        ]
      };
    }

    // Leadership, Board of Trustees & Administration
    if (/fatma nur|mütevelli|board of trustees|burcu tunay|secretary general|genel sekreter|aytul|aytül/i.test(query)) {
      return {
        answer: `**Cyprus Aydın University Governance & Key Administrative Leadership:**\n\n` +
          `• **Board of Trustees Chairwoman (Mütevelli Heyeti Başkanı)**: Fatma Nur AYDIN\n` +
          `• **Secretary General (Genel Sekreter)**: Burcu TUNAY (Acting Head of Student Affairs, burcutunay@cau.edu.tr; extension 6020)\n` +
          `• **Director of Personnel Department**: Aytül DENLİ (ik@cau.edu.tr; extension 6056)\n` +
          `• **Director of the International Office**: Assoc. Prof. Dr. Tuğrul Günay (tugrulgunay@cau.edu.tr)\n` +
          `• **Faculty Deans**:\n` +
          `  - Faculty of Dentistry: Prof. Dr. Cem Kurtoğlu\n` +
          `  - Faculty of Engineering: Prof. Dr. Hikmet Ş. Aybar\n` +
          `  - Faculty of Health Sciences: Prof. Dr. Mehmet Zeki Avcı\n` +
          `  - Faculty of Economics, Administrative & Social Sciences: Prof. Dr. Arzu Alvan Bozdereli\n` +
          `  - Faculty of Law: Prof. Dr. Z. Gönül Balkır\n` +
          `  - Faculty of Tourism: Prof. Dr. Hasan Tunç\n\n` +
          `For general university administration and student affairs, contact **bilgi@cau.edu.tr** (+90 392 650 00 00).`,
        sources: [officialSources.aboutCau, officialSources.studentAffairs, officialSources.personnel],
        actionLinks: [{ label: 'About CAU Leadership', url: '/about.html', kind: 'link' }]
      };
    }

    if (/faculty|faculties|dean|deans|dekan|fakülte/i.test(query)) {
      return {
        answer: `**CAU Academic Structure (8 Faculties & Leadership)**\n\n` +
          `1. **Faculty of Dentistry**: Prof. Dr. Cem Kurtoğlu (5-year dual campus with IAU)\n` +
          `2. **Faculty of Law**: Prof. Dr. Z. Gönül Balkır (Law & International Law)\n` +
          `3. **Faculty of Education**: Guidance & Psychological Counseling, Turkish & English Language Teaching\n` +
          `4. **Faculty of Economics, Administrative and Social Sciences**: Prof. Dr. Arzu Alvan Bozdereli (Business, IR, Psychology, Banking, Civil Aviation Management)\n` +
          `5. **Faculty of Fine Arts and Design**: Architecture, Interior Architecture\n` +
          `6. **Faculty of Engineering**: Prof. Dr. Hikmet Ş. Aybar (Software, Computer, Electrical, Mechatronics, Civil, Security)\n` +
          `7. **Faculty of Health Sciences**: Prof. Dr. Mehmet Zeki Avcı (Nursing TR/EN, Physiotherapy)\n` +
          `8. **Faculty of Tourism**: Prof. Dr. Hasan Tunç (Tourism & Hotel Management, Gastronomy & Culinary Arts)\n\n` +
          `Plus Vocational Schools (5 Associate degrees — all YÖK accredited) and Graduate Institute (14 Master's & 6 Ph.D. degrees).`,
        sources: [officialSources.faculties, officialSources.aboutCau],
        actionLinks: [{ label: 'View All Faculties', url: 'https://cau.edu.tr/en/faculties/', kind: 'link' }]
      };
    }

    if (/partner|partnership|iau|istanbul aydin|istanbul aydın/i.test(query)) {
      return {
        answer: `**Strategic Partnership: Cyprus Aydın University & Istanbul Aydın University (IAU) 🤝**\n\n` +
          `Cyprus Aydın University (CAU) maintains a strategic academic partnership with **Istanbul Aydın University (IAU)**:\n\n` +
          `• **About IAU**: Founded in 2003 on Istanbul’s European side, IAU boasts **50,000+ active students** (including **8,500+ international students** from 124 countries), 17 faculties, and an **83.6% graduate job placement rate**.\n` +
          `• **Dual-Degree & Mobility**: Joint research, faculty exchanges, and dual-campus programs like the **5-Year Dentistry Degree** (Years 1–3 at CAU in Cyprus, Years 4–5 at IAU in Istanbul).\n` +
          `• **Director of the International Office**: Assoc. Prof. Dr. Tuğrul Günay:\n` +
          `  *\"Internationalization is more than mobility — it’s about building bridges of knowledge, culture, and shared purpose. At Cyprus Aydin University, I am committed to fostering global partnerships and empowering students to thrive in a truly interconnected world.\"*`,
        sources: [officialSources.aboutCau, officialSources.cauMain],
        actionLinks: [{ label: 'About CAU & IAU', url: '/about.html', kind: 'link' }]
      };
    }

    if (/testimonial|testimonials|student story|stories|yasir|jamal|romeo|koyue|omar abo|jmei|setia|santoso|قصص الطلاب|تجارب الطلاب/i.test(query)) {
      return {
        answer: `**Authentic Student Stories & Testimonials from CAU (Official Handbook):**\n\n` +
          `• **Yasir Jamal (Pakistan) – Tourism Management (MS)**:\n` +
          `  *\"Tourism isn’t just about places; it’s about connections, cultures, and unforgettable experiences. At Cyprus Aydın University, I’ve discovered that every journey starts with curiosity and ends with growth. The professors are inspiring and encourage us to think globally. Whether you’re guiding travelers, shaping hospitality, or focusing on sustainable tourism, CAU offers a world of opportunities to learn and make a difference.\"*\n\n` +
          `• **Romeo Lele Koyue (Cameroon) – Ph.D. in Business Administration**:\n` +
          `  *\"At Cyprus Aydin University, the Music and Art Club is more than a space for creativity — it's where we discover, grow, and inspire. Every melody and masterpiece is a step toward becoming who we’re truly meant to be: bold, creative, and unforgettable. Just like in my Ph.D. journey in Business Administration, it's about leaving a legacy. Whether through research or rhythm, we build something future students will carry forward.\"*\n\n` +
          `• **Omar Abo Jmei (Palestine) – Department of Electrical and Electronic Engineering**:\n` +
          `  *\"Driven by purpose and passion, my journey in Electrical and Electronic Engineering at Cyprus Aydın University is more than a degree—it’s a mission to innovate, solve real-world problems, and build a smarter, sustainable future. Every circuit I design and challenge I face brings me closer to making a meaningful impact. As a student from Palestine, I carry the hopes of my community, believing that through technology and education, we can brighten even the darkest corners. Cyprus Aydın University has given me the tools, environment, and inspiration to dream bigger and achieve more.\"*\n\n` +
          `• **Setia Amantha Laura Santoso (Indonesia) – Business Administration (English)**:\n` +
          `  *“CAU is so much fun! I’ve made amazing friends from all around the world. The teachers are supportive and make learning enjoyable, and there’s even a school bus service that makes getting around easy. What makes CAU special is its diverse and welcoming environment, where every day brings new opportunities to learn, connect, and grow.”*`,
        sources: [officialSources.aboutCau, officialSources.cauMain],
        actionLinks: [{ label: 'Read Student Stories', url: '/about.html', kind: 'link' }]
      };
    }

    if (/club|clubs|activities|society|societies|kulüp/i.test(query)) {
      return {
        answer: `**Active Student Clubs at Cyprus Aydın University (15+ Clubs):**\n\n` +
          `CAU offers vibrant student life with 15+ student-led clubs:\n` +
          `• Public Health Club • Physiotherapy Club • Football Club\n` +
          `• Young Red Crescent Club • Travel & Photography Club • Law Club\n` +
          `• First Aid Club • Blue Butterfly (Children’s Rights) • MEDI Foundation (Addiction Awareness)\n` +
          `• Music Club • PDR Counseling Club • Psychology Club\n` +
          `• Art and Design Club • Chess Club • Theatre Club`,
        sources: [officialSources.cauMain, officialSources.aboutCau],
        actionLinks: [{ label: 'Campus Life', url: '/about.html', kind: 'link' }]
      };
    }

    if (/contact|whatsapp|phone|email|address|location|girne|kyrenia|nerede|iletişim|اتصال/i.test(query)) {
      return {
        answer: `**Cyprus Aydın University Contact Directory**\n\n` +
          `• **Campus Address**: Dr. Fazıl Küçük Caddesi No.80, Ozanköy / Girne, Northern Cyprus (TRNC)\n` +
          `• **WhatsApp / Mobile Admissions**: +90 548 835 71 71\n` +
          `• **Main Switchboard**: +90 392 650 00 00\n` +
          `• **International Admissions Email**: admission@cau.edu.tr\n` +
          `• **Student Affairs Email**: bilgi@cau.edu.tr\n` +
          `• **Human Resources / Personnel**: ik@cau.edu.tr`,
        sources: [officialSources.cauMain, officialSources.international],
        actionLinks: [
          { label: 'Chat on WhatsApp', url: 'https://wa.me/905488357171?text=' + encodeURIComponent('Hello CAU Admissions!'), kind: 'whatsapp' },
          { label: 'Send Email', url: 'mailto:admission@cau.edu.tr', kind: 'link' }
        ]
      };
    }

    const isCAU = /cau|cyprus|aydin|kibris|girne|kyrenia|nicosia|lefkoşa|trnc|kktc|ercan|island|mediterranean|admission|apply|application|scholarship|tuition|fee|cost|price|iban|payment|bank|installment|program|programme|faculty|department|degree|bachelor|master|phd|doctorate|associate|course|curriculum|akademik|kadro|professor|lecturer|instructor|doctor|dean|rector|personnel|staff|directory|dorm|accommodation|housing|residence|yurt|student affairs|student id|exam|transcript|certificate|graduation|attendance|ebs|registration|sport|sports|football|soccer|futsal|basketball|volleyball|tennis|gym|fitness|athletics|team|teams|pitch|stadium|tournament|cup|workout|exercise|training|living cost|cost of living|expenses|weather|climate|currency|lira|safe|safety|crime|transport|shuttle|bus|taxi|beach|visa|ikamet|residence permit|part-time|work|job|dentistry|software|computer|engineering|architecture|interior|civil|electrical|mechatronics|security|law|nursing|physiotherapy|psychology|guidance|business|banking|finance|tourism|hospitality|gastronomy|aviation|prep school|قبرص|أيدن|ايدن|جامعة|رسوم|اسعار|تكلفة|منح|منحة|قبول|تسجيل|تقديم|تخصص|تخصصات|برامج|برنامج|سكن|كيرينيا|جيرنة|طب|اسنان|أسنان|هندسة|برمجيات|تمريض|عمارة|صيدلة|إدارة|قانون|سياحة|رياضة|كرة قدم|فريق|صالات|جيم|معيشة|طقس|أمان|مواصلات|فيزا|إقامة|ücret|harç|fiyat|burs|bölüm|fakülte|kayıt|başvuru|yurt|spor|futbol|basketbol|voleybol|takım|kulüp|yaşam|masraf|girne|hava|güvenli|ulaşım|ikamet|çalışma|футбол|спорт|команда|тренировк|стоимость|программ|стипенди|проживан|кипр|кирени|поступлен|виз/i.test(query);

    if (!isCAU) {
      if (/[\u0600-\u06FF]/.test(query)) {
        return {
          answer: `أنا المساعد الذكي الرسمي لـ **جامعة قبرص أيدن (CAU)**. 🎓\n\nأنا مخصص ومدرّب حصرياً للإجابة عن كل ما يتعلق بـ **جامعة قبرص أيدن (CAU)**: التخصصات والكليات، الرسوم والمنح الدراسية، شروط القبول، الفرق الرياضية (كرة القدم، السلة، الجيم)، ومرافق السكن والحياة الطلابية في **قبرص (كيرينيا)**.\n\nلا يمكنني الإجابة عن مواضيع خارج هذا النطاق الأكاديمي والطلابي. كيف يمكنني مساعدتك في دراستك أو تقديمك للجامعة؟`,
          sources: [officialSources.cauMain, officialSources.aboutCau],
          suggestedChips: [
            { label: '⚽ فريق كرة القدم', prompt: 'هل يوجد فريق كرة قدم وفرق رياضية في الجامعة؟' },
            { label: '💰 الرسوم والمنح', prompt: 'كم رسوم الدراسة والمنح المتاحة في جامعة قبرص أيدن؟' },
            { label: '🎓 دليل التخصصات', prompt: 'ما هي التخصصات والبرامج المتاحة في الجامعة؟' },
            { label: '🌴 المعيشة في قبرص', prompt: 'كم تكلفة المعيشة في كيرينيا للطلاب؟' }
          ]
        };
      }
      return {
        answer: `I am the official AI Assistant for **Cyprus Aydın University (CAU)**. 🎓\n\nI specialize exclusively in answering questions about **CAU academic degree programmes, tuition & scholarships, admissions, sports teams (Football, Futsal, Basketball, Gym), campus facilities, and student life in Cyprus (Kyrenia, TRNC)**.\n\nI cannot assist with queries outside this context. How can I help you with your studies, application, or student journey at Cyprus Aydın University?`,
        sources: [officialSources.cauMain, officialSources.aboutCau],
        suggestedChips: [
          { label: '⚽ Sports & Football Team', prompt: 'Is there any football team at CAU?' },
          { label: '💰 Tuition & Scholarships', prompt: 'What are the tuition fees and scholarships?' },
          { label: '🎓 All Degree Programmes', prompt: 'What bachelor and master degrees are offered?' },
          { label: '🌴 Living in Cyprus', prompt: 'What is the cost of living in Kyrenia for students?' }
        ]
      };
    }

    return {
      answer: `I can assist you with all aspects of **Cyprus Aydın University (CAU)**, including:\n\n` +
        `• **48+ Programmes**: Dentistry, Software Engineering, Architecture, Nursing, Law, Tourism, Business...\n` +
        `• **Sports & Athletics**: Official Football/Futsal team, Basketball, Volleyball, on-campus fitness gym.\n` +
        `• **Admissions & Documents**: Eligibility, requirements, conditional offers.\n` +
        `• **Tuition & Scholarships**: Guaranteed 50% waiver, SAT (85–100%), sibling, and transfer discounts.\n` +
        `• **Living in Cyprus**: Housing, dormitories, free shuttle bus, and living costs in Kyrenia.\n\n` +
        `Feel free to ask a specific question or select one of the quick topics below!`,
      sources: [officialSources.cauMain, officialSources.international, officialSources.akademikKadro],
      actionLinks: [
        { label: 'Browse Programs', url: '/programs.html', kind: 'link' },
        { label: 'WhatsApp Admissions', url: 'https://wa.me/905488357171', kind: 'whatsapp' }
      ]
    };
  };

  const formatMarkdown = (text) => {
    if (!text) return '';
    let formatted = String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code / IBAN snippets
    formatted = formatted.replace(/`([^`]+)`/g, '<span class="cau-chat-code-pill">$1</span>');
    // Bullet lists
    formatted = formatted.replace(/^[•\-\*]\s+(.*)$/gm, '<li style="margin-left:16px;list-style:disc;">$1</li>');
    // Numbered lists
    formatted = formatted.replace(/^(\d+)\.\s+(.*)$/gm, '<li style="margin-left:16px;list-style:decimal;">$2</li>');
    // Line breaks
    formatted = formatted.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

    // Automatically highlight IBAN
    formatted = formatted.replace(/(TR\d{2}\s?(?:\d{4}\s?){5}\d{2})/g, '<span class="cau-chat-code-pill">$1</span>');

    return formatted;
  };

  const remoteAnswer = async (question, priorHistory) => {
    // Read Student Consultation Profile from sessionStorage
    let studentProfileData = null;
    try {
      const saved = sessionStorage.getItem('cauStudentProfile');
      if (saved) studentProfileData = JSON.parse(saved);
    } catch (_) {}

    const historyToSend = priorHistory || (state.history || []).filter(m => !(m.role === 'user' && m.content === question)).slice(-6);

    let enhancedQuestion = question;
    if (studentProfileData && (studentProfileData.interests?.length || studentProfileData.workPreference)) {
      const pText = `[Context: Student Consultation Profile: Interests: ${(studentProfileData.interests || []).join(', ')}; Work: ${studentProfileData.workPreference}; Style: ${studentProfileData.learningStyle}; Goal: ${studentProfileData.goal}; Degree: ${studentProfileData.degreeLevel}; Lang: ${studentProfileData.language}] `;
      if (!question.includes('[Context: Student Consultation Profile')) {
        enhancedQuestion = `${pText}${question}`;
      }
    }

    const response = await fetch('/api/trpc/assistant.ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        json: {
          question: enhancedQuestion,
          history: historyToSend,
          studentProfile: studentProfileData
        },
      }),
    });
    if (!response.ok) throw new Error(`Assistant request failed (${response.status})`);
    const payload = await response.json();
    const result = payload && payload.result && payload.result.data ? (payload.result.data.json || payload.result.data) : undefined;
    if (!result || typeof result.answer !== 'string') throw new Error('Assistant response was incomplete');

    // Human Escalation Check (Requirement 13: Visa, Transfer Credit, Legal Exceptions)
    const sensitiveTopics = /visa|residence permit|ikamet|transfer credit|legal|exception|special scholarship|individual admission/i;
    if (sensitiveTopics.test(question)) {
      result.actionLinks = result.actionLinks || [];
      if (!result.actionLinks.some(l => l.kind === 'whatsapp')) {
        result.actionLinks.unshift({
          label: 'WhatsApp Admissions Counselor',
          url: 'https://wa.me/905488357171?text=' + encodeURIComponent(`Hello CAU Admissions Counselor, I need guidance regarding: ${question}`),
          kind: 'whatsapp'
        });
      }
      if (!result.actionLinks.some(l => l.label === 'International Office')) {
        result.actionLinks.push({
          label: 'Contact International Office',
          url: 'mailto:admission@cau.edu.tr',
          kind: 'link'
        });
      }
    }

    return result;
  };

  // Derive smart CTA action buttons from text content if not explicitly provided
  const inferActionLinks = (text, explicitLinks) => {
    if (Array.isArray(explicitLinks) && explicitLinks.length) return explicitLinks;
    const links = [];
    const lower = text.toLowerCase();

    if (lower.includes('whatsapp') || lower.includes('+90 548 835 71 71') || lower.includes('admission@cau.edu.tr')) {
      links.push({
        label: 'WhatsApp Admissions',
        url: 'https://wa.me/905488357171?text=' + encodeURIComponent('Hello CAU, I am inquiring about admissions.'),
        kind: 'whatsapp'
      });
    }
    if (lower.includes('apply') || lower.includes('application') || lower.includes('portal') || lower.includes('conditional offer')) {
      links.push({
        label: 'Apply Online',
        url: 'https://international.cau.edu.tr/apply/',
        kind: 'apply'
      });
    }
    if (lower.includes('akademikkadro') || lower.includes('academic staff') || lower.includes('directory')) {
      links.push({
        label: 'Staff Directory',
        url: 'https://akademikkadro.cau.edu.tr/',
        kind: 'link'
      });
    }
    return links;
  };

  const mount = () => {
    if (document.querySelector('.cau-chat-root')) return;

    // Load sound preference
    try {
      const savedSound = localStorage.getItem(SOUND_KEY);
      if (savedSound !== null) state.sound = savedSound === 'true';
    } catch { /* storage restricted */ }

    const root = document.createElement('div');
    root.className = 'cau-chat-root';
    if (document.documentElement.dir === 'rtl') root.setAttribute('dir', 'rtl');

    root.innerHTML = `
<style>${CSS}</style>
<button class="cau-chat-toggle" type="button" aria-label="Open CAU AI assistant" aria-expanded="false">
  <div class="cau-chat-toggle-icon">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z"/>
    </svg>
  </div>
  <span>Ask CAU</span>
  <span class="cau-chat-pulse" aria-hidden="true"></span>
</button>

<div class="cau-chat-panel" role="dialog" aria-label="CAU AI Assistant" aria-hidden="true">
  <div class="cau-chat-head">
    <div class="cau-chat-brand">
      <div class="cau-chat-avatar">
        <i class="fa-solid fa-graduation-cap"></i>
        <span class="cau-chat-avatar-status"></span>
      </div>
      <div class="cau-chat-title-group">
        <h2>Ask CAU AI</h2>
        <p><i class="fa-solid fa-shield-halved" style="color:#f04432;font-size:10px;"></i> Verified Campus Guide</p>
      </div>
    </div>
    <div class="cau-chat-actions">
      <button class="cau-chat-btn cau-chat-sound" type="button" aria-label="Toggle sound" title="${state.sound ? 'Mute sound' : 'Unmute sound'}">
        <i class="fa-solid ${state.sound ? 'fa-volume-high' : 'fa-volume-xmark'}" aria-hidden="true"></i>
      </button>
      <button class="cau-chat-btn cau-chat-expand" type="button" aria-label="Toggle full window size" title="Expand / Compress">
        <i class="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true"></i>
      </button>
      <button class="cau-chat-btn cau-chat-reset" type="button" aria-label="Reset conversation" title="New conversation">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
      </button>
      <button class="cau-chat-btn cau-chat-close" type="button" aria-label="Close assistant" title="Close">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>
  </div>

  <div class="cau-chat-body" aria-live="polite"></div>

  <form class="cau-chat-foot" novalidate>
    <div class="cau-chat-form-row">
      <input class="cau-chat-input" type="text" placeholder="Ask about programs, sports, living, fees..." autocomplete="off" aria-label="Your question" />
      <button class="cau-chat-send" type="submit" aria-label="Send question">
        <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
      </button>
    </div>
    <div class="cau-chat-foot-meta">
      <span class="cau-chat-word-counter">0 / 30 words</span>
      <span class="cau-chat-word-limit-msg" style="display:none;"></span>
    </div>
    <div class="cau-chat-disclaimer">
      Cyprus Aydın University • Fall 2026/27 Admissions Active
    </div>
  </form>
</div>
`;

    document.body.appendChild(root);

    const toggle = root.querySelector('.cau-chat-toggle');
    const panel = root.querySelector('.cau-chat-panel');
    const close = root.querySelector('.cau-chat-close');
    const reset = root.querySelector('.cau-chat-reset');
    const soundBtn = root.querySelector('.cau-chat-sound');
    const expandBtn = root.querySelector('.cau-chat-expand');
    const body = root.querySelector('.cau-chat-body');
    const form = root.querySelector('.cau-chat-foot');
    const input = root.querySelector('.cau-chat-input');
    const send = root.querySelector('.cau-chat-send');
    const wordCounter = root.querySelector('.cau-chat-word-counter');
    const limitMsg = root.querySelector('.cau-chat-word-limit-msg');

    const renderWelcome = () => {
      body.innerHTML = '';
      const chips = getContextualChips();
      const welcome = document.createElement('div');
      welcome.className = 'cau-chat-msg-row ai';
      welcome.innerHTML = `
<div class="cau-chat-msg ai">
  Welcome to <strong>Cyprus Aydın University</strong>! 👋<br><br>
  I’m your AI Admissions and Campus Advisor. Ask me anything about bachelor’s or master’s degrees, tuition fees, 50%–100% scholarships, professor directories, or dormitory accommodation in Kyrenia.
  <div class="cau-chat-chips-section">
    <div class="cau-chat-chips-label">Popular Topics for You</div>
    <div class="cau-chat-chips">
      ${chips.map(c => `<button class="cau-chat-chip" type="button" data-prompt="${c.prompt.replace(/"/g, '&quot;')}" ${c.action ? `data-action="${c.action}"` : ''}>${c.label}</button>`).join('')}
    </div>
  </div>
</div>
`;
      body.appendChild(welcome);
    };

    // Load saved conversation if available
    const loadSavedHistory = () => {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            body.innerHTML = '';
            state.history = parsed;
            parsed.forEach(msg => {
              addMessageUI(msg.content, msg.role === 'user' ? 'user' : 'ai', msg.sources, msg.actionLinks, false, msg.suggestedChips);
            });
            return;
          }
        }
      } catch { /* storage fail */ }
      renderWelcome();
    };

    const saveHistory = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.history.slice(-16)));
      } catch { /* storage full */ }
    };

    // Theme synchronization
    const syncTheme = () => {
      const activeTheme = document.documentElement.dataset.theme || 'light';
      root.dataset.theme = activeTheme;
    };
    window.addEventListener('cau-theme-change', syncTheme);
    syncTheme();

    const setOpen = (open) => {
      state.open = open;
      toggle.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('open', open);
      panel.setAttribute('aria-hidden', String(!open));
      if (open) {
        input.focus();
        body.scrollTop = body.scrollHeight;
      } else {
        toggle.focus();
      }
    };

    window.CAU_OPEN_AI_CHAT = (prompt, mode, payload) => {
      setOpen(true);
      if (mode) {
        state.navigatorMode = mode;
        state.navigatorPayload = payload;
      }
      if (prompt) {
        setTimeout(() => {
          if (typeof ask === 'function') {
            ask(prompt);
          } else {
            input.value = prompt;
          }
        }, 120);
      }
    };

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-open-cau-chat]');
      if (trigger) {
        event.preventDefault();
        const prompt = trigger.getAttribute('data-prompt') || trigger.dataset.prompt;
        window.CAU_OPEN_AI_CHAT(prompt);
      }
    });

    const toggleExpand = () => {
      state.expanded = !state.expanded;
      panel.classList.toggle('expanded', state.expanded);
      const icon = expandBtn.querySelector('i');
      if (icon) {
        icon.className = state.expanded
          ? 'fa-solid fa-down-left-and-up-right-to-center'
          : 'fa-solid fa-up-right-and-down-left-from-center';
      }
    };

    const toggleSound = () => {
      state.sound = !state.sound;
      try {
        localStorage.setItem(SOUND_KEY, String(state.sound));
      } catch { /* storage restricted */ }
      const icon = soundBtn.querySelector('i');
      if (icon) {
        icon.className = state.sound ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      }
      soundBtn.title = state.sound ? 'Mute sound' : 'Unmute sound';
      if (state.sound) playSound('receive');
    };

    const addMessageUI = (text, kind, sources, actionLinks, animate = true, suggestedChips = []) => {
      const row = document.createElement('div');
      row.className = `cau-chat-msg-row ${kind}`;

      const msg = document.createElement('div');
      msg.className = `cau-chat-msg ${kind}`;

      if (kind === 'user') {
        msg.textContent = text;
        if (/[\u0600-\u06FF]/.test(text)) msg.setAttribute('dir', 'rtl');
      } else {
        if (text.includes('<div') && text.includes('class=')) {
          msg.innerHTML = text;
        } else {
          msg.innerHTML = formatMarkdown(text);
        }
        if (/[\u0600-\u06FF]/.test(text)) msg.setAttribute('dir', 'rtl');

        // Smart Action buttons
        const ctgs = inferActionLinks(text, actionLinks);
        if (ctgs.length > 0) {
          const ctaBar = document.createElement('div');
          ctaBar.className = 'cau-chat-cta-bar';
          ctgs.forEach(cta => {
            const btn = document.createElement('a');
            btn.className = `cau-chat-cta-btn ${cta.kind || 'link'}`;
            btn.href = cta.url;
            btn.target = cta.url.startsWith('http') ? '_blank' : '_self';
            btn.rel = 'noopener noreferrer';

            let iconHtml = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
            if (cta.kind === 'whatsapp') iconHtml = '<i class="fa-brands fa-whatsapp"></i>';
            else if (cta.kind === 'apply') iconHtml = '<i class="fa-solid fa-paper-plane"></i>';
            else if (cta.kind === 'link') iconHtml = '<i class="fa-solid fa-book-open"></i>';

            btn.innerHTML = `${iconHtml} <span>${cta.label}</span>`;
            ctaBar.appendChild(btn);
          });
          msg.appendChild(ctaBar);
        }

        // Official source links
        if (Array.isArray(sources) && sources.length > 0) {
          const sourceList = document.createElement('div');
          sourceList.className = 'cau-chat-sources';
          const title = document.createElement('strong');
          title.innerHTML = '<i class="fa-solid fa-link" style="font-size:10px;"></i> Verified Official Sources';
          sourceList.appendChild(title);

          sources.slice(0, 3).forEach((source) => {
            if (!source || !source.url) return;
            const link = document.createElement('a');
            link.href = source.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px;"></i> ${source.label || source.url}`;
            sourceList.appendChild(link);
          });
          if (sourceList.children.length > 1) msg.appendChild(sourceList);
        }

        // Suggested Follow-up Chips
        if (Array.isArray(suggestedChips) && suggestedChips.length > 0) {
          const chipsSection = document.createElement('div');
          chipsSection.className = 'cau-chat-chips-section';
          chipsSection.style.marginTop = '12px';
          chipsSection.innerHTML = `
            <div class="cau-chat-chips-label">Suggested follow-ups</div>
            <div class="cau-chat-chips">
              ${suggestedChips.map(c => `<button class="cau-chat-chip" type="button" data-prompt="${(c.prompt || '').replace(/"/g, '&quot;')}">${c.label || c.prompt}</button>`).join('')}
            </div>
          `;
          msg.appendChild(chipsSection);
        }
      }

      row.appendChild(msg);

      // Meta row (timestamp & copy button for AI)
      if (kind === 'ai') {
        const meta = document.createElement('div');
        meta.className = 'cau-chat-msg-meta';
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        meta.innerHTML = `<span>${timeStr}</span>`;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'cau-chat-msg-copy';
        copyBtn.type = 'button';
        copyBtn.title = 'Copy response';
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        copyBtn.addEventListener('click', () => {
          try {
            navigator.clipboard.writeText(text);
            copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color:#f04432;"></i> Copied!';
            setTimeout(() => { copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; }, 2000);
          } catch { /* clipboard restricted */ }
        });
        meta.appendChild(copyBtn);
        row.appendChild(meta);
      }

      body.appendChild(row);
      body.scrollTop = body.scrollHeight;

      if (animate && kind === 'ai') playSound('receive');
      if (animate && kind === 'user') playSound('send');
    };

    const getWordCount = (str) => {
      const trimmed = (str || '').trim();
      if (!trimmed) return 0;
      return trimmed.split(/\s+/).filter(Boolean).length;
    };

    const updateWordCounter = () => {
      const count = getWordCount(input.value);
      if (wordCounter) {
        wordCounter.textContent = `${count} / 30 words`;
        if (count > 30) {
          wordCounter.classList.add('cau-word-warning');
          if (limitMsg) {
            limitMsg.textContent = `Max 30 words (remove ${count - 30})`;
            limitMsg.style.display = 'inline';
          }
          input.classList.add('cau-input-exceeded');
          send.disabled = true;
        } else {
          wordCounter.classList.remove('cau-word-warning');
          if (limitMsg) limitMsg.style.display = 'none';
          input.classList.remove('cau-input-exceeded');
          if (!state.loading) send.disabled = count === 0;
        }
      }
    };

    input.addEventListener('input', updateWordCounter);

    const ask = async (question) => {
      const q = question.trim();
      if (state.loading || !q) return;

      const words = q.split(/\s+/).filter(Boolean);
      if (words.length > 30) {
        addMessageUI(`Please keep your question under 30 words (currently ${words.length} words). Short, focused questions help me provide the most accurate official guidance for Cyprus Aydın University.`, 'ai');
        updateWordCounter();
        return;
      }

      state.loading = true;
      send.disabled = true;
      input.value = '';
      updateWordCounter();

      const priorHistory = (state.history || [])
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));

      addMessageUI(q, 'user');
      state.history.push({ role: 'user', content: q });
      saveHistory();

      // Typing indicator with pulsing dots
      const typing = document.createElement('div');
      typing.className = 'cau-chat-typing';
      typing.innerHTML = `
<div class="cau-chat-dot"></div>
<div class="cau-chat-dot"></div>
<div class="cau-chat-dot"></div>
<span class="cau-chat-typing-label">Consulting CAU database...</span>
`;
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;

      try {
        let ans;
        if (state.navigatorMode) {
          let reqVal = q;
          if (state.navigatorMode === 'course_explainer') {
            reqVal = { query: q, slug: state.navigatorPayload };
          }
          const res = await fetch('/api/trpc/assistant.navigator', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ json: { action: state.navigatorMode, payload: reqVal, val: reqVal } }),
          });
          if (!res.ok) throw new Error('Navigator failed');
          const payload = await res.json();
          const data = payload.result?.data?.json || payload.result?.data;
          ans = {
            answer: data?.html || data?.answer || 'I could not process this request at this time.',
            sources: [officialSources.cauMain, officialSources.international],
            suggestedChips: data?.suggestedChips || []
          };
          state.navigatorMode = null;
        } else {
          ans = await remoteAnswer(q, priorHistory);
        }
        typing.remove();
        addMessageUI(ans.answer, 'ai', ans.sources, ans.actionLinks, true, ans.suggestedChips);
        state.history.push({ role: 'assistant', content: ans.answer, sources: ans.sources, actionLinks: ans.actionLinks, suggestedChips: ans.suggestedChips });
        saveHistory();
      } catch (error) {
        console.warn('[CAU Assistant] Remote query unavailable; falling back to client catalog engine.', error);
        typing.remove();
        const local = localFallback(q);
        addMessageUI(local.answer, 'ai', local.sources, local.actionLinks, true, local.suggestedChips);
        state.history.push({ role: 'assistant', content: local.answer, sources: local.sources, actionLinks: local.actionLinks, suggestedChips: local.suggestedChips });
        saveHistory();
      } finally {
        state.loading = false;
        updateWordCounter();
        input.focus();
      }
    };

    // Event listeners
    toggle.addEventListener('click', () => setOpen(!state.open));
    close.addEventListener('click', () => setOpen(false));
    expandBtn.addEventListener('click', toggleExpand);
    soundBtn.addEventListener('click', toggleSound);

    reset.addEventListener('click', () => {
      state.history = [];
      try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* fail */ }
      renderWelcome();
      input.value = '';
      updateWordCounter();
      input.focus();
    });

    body.addEventListener('click', (e) => {
      const chip = e.target.closest('.cau-chat-chip');
      if (chip && !state.loading) {
        const action = chip.getAttribute('data-action');
        const prompt = chip.getAttribute('data-prompt');
        if (action) {
          if (['university_guide', 'application_process', 'student_planner', 'cyprus_life'].includes(action)) {
            state.navigatorMode = action;
            ask(prompt || action);
          } else {
            state.navigatorMode = action;
            let introText = `Great! Let's get started.`;
            if (action === 'program_finder') {
              introText = `🎓 **CAU Program Finder**: What subjects, fields, or career paths interest you most? (e.g., Software, Artificial Intelligence, Business, Architecture, Nursing, Dentistry...)`;
            } else if (action === 'tuition_calculator') {
              introText = `🧮 **Tuition Calculator**: Which program level (Bachelor, Master, PhD, Dentistry) and scholarship tier (50%, 85% SAT, 100%) are you considering?`;
            } else if (action === 'career_finder') {
              introText = `🎯 **Career Pathway**: What profession or job title do you want to become? (e.g., UX Designer, Cloud Architect, Hospital Director, Diplomat...)`;
            } else if (action === 'international_mode') {
              introText = `🌍 **International Student Guide**: Which country are you applying from? (e.g., Nigeria, Pakistan, Yemen, India, Syria, Jordan...)`;
            } else if (action === 'campus_assistant') {
              introText = `🏫 **Campus Assistant**: What facility or office can I help you locate? (e.g., Library, printing center, international office, tuition cashier, shuttle bus...)`;
            }
            addMessageUI(introText, 'ai');
          }
        } else if (prompt) {
          ask(prompt);
        }
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (question) {
        if (getWordCount(question) > 30) {
          updateWordCounter();
          return;
        }
        ask(question);
      }
    });

    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && state.open) setOpen(false);
    });

    // Initialize history
    loadSavedHistory();

    // AI Semantic Search Integration
    const searchForm = document.getElementById('cauHeaderSearchForm');
    const searchInput = document.getElementById('cauHeaderSearchInput');
    const searchPanelDynamic = document.getElementById('searchPanel-dynamic');
    const searchDynamicList = document.getElementById('searchDynamicList');
    const searchDrawer = document.getElementById('cauSearchDrawer');

    if (searchForm && searchInput && searchPanelDynamic && searchDynamicList) {
      searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        document.querySelectorAll('.cau-search-panel').forEach(p => p.classList.remove('is-active'));
        document.querySelectorAll('.cau-search-tab').forEach(t => t.classList.remove('is-active'));
        
        searchPanelDynamic.style.display = 'block';
        searchPanelDynamic.classList.add('is-active');
        if (searchDrawer) searchDrawer.classList.add('open');

        searchDynamicList.innerHTML = '<div style="padding: 16px; color: var(--cau-chat-muted);">Searching CAU database with AI...</div>';

        try {
          const response = await fetch('/api/trpc/assistant.navigator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ json: { action: 'search', payload: query, val: query } })
          });
          const json = await response.json();
          const data = json.result?.data?.json || json.result?.data;

          if (data && data.links && data.answer) {
            let html = `<div style="grid-column: 1 / -1; padding: 12px 16px; background: var(--sys-surface-2, rgba(0,0,0,0.03)); border: 1px solid var(--cau-chat-chip-border, #e5e7eb); border-radius: 8px; margin-bottom: 12px; font-size: 0.95rem;"><strong>AI Summary:</strong> ${data.answer}</div>`;
            data.links.forEach(link => {
              html += `<a href="${link.url}" class="cau-search-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-bottom:1px solid rgba(0,0,0,0.06); text-decoration:none; color:inherit;">
                <span class="cau-search-item__title" style="font-weight:600;">${link.title} <i class="fa-solid fa-sparkles ms-2" style="color: var(--cau-chat-primary); font-size: 0.8em;"></i></span>
                <span class="cau-search-item__desc" style="font-size:0.8em; color:var(--cau-chat-muted);">View Page ↗</span>
              </a>`;
            });
            searchDynamicList.innerHTML = html;
          } else {
            searchDynamicList.innerHTML = '<div style="padding: 16px; color: var(--cau-chat-muted);">No results found.</div>';
          }
        } catch (err) {
          searchDynamicList.innerHTML = '<div style="padding: 16px; color: var(--cau-chat-muted);">AI Search unavailable.</div>';
        }
      });
    }

    // Program Detail AI Advisor Card & Interactive Course Assistant UI (Features 2 & 7)
    // Merged natively into Program Detail Sidebar Card (Zero floating buttons)
    const isProgramDetailPage = (window.location.pathname.includes('/programs/') && 
                                !window.location.pathname.endsWith('/programs.html') && 
                                !window.location.pathname.endsWith('/programs')) ||
                                (window.location.search.includes('program='));

    if (isProgramDetailPage) {
      let programTitle = '';
      let programSlug = '';
      
      const urlParams = new URLSearchParams(window.location.search);
      programSlug = urlParams.get('program') || urlParams.get('slug') || '';
      
      if (!programSlug && window.location.pathname.includes('/programs/')) {
        programSlug = window.location.pathname.split('/programs/')[1]?.replace('.html', '') || '';
      }
      
      const h1 = document.querySelector('h1');
      if (h1) programTitle = h1.textContent.trim();
      else if (programSlug) programTitle = programSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      if (programSlug || programTitle) {
        // Integrate into sidebar card naturally
        const sidebar = document.querySelector('.program-sidebar');
        if (sidebar && !document.querySelector('#programAiAdvisorCard')) {
          const advisorCard = document.createElement('div');
          advisorCard.id = 'programAiAdvisorCard';
          advisorCard.className = 'sidebar-card sidebar-ai-advisor-card';
          advisorCard.innerHTML = `
            <div class="sidebar-ai-header">
              <span class="sidebar-ai-badge"><i class="fa-solid fa-sparkles"></i> AI Academic Advisor</span>
              <h3 class="sidebar-ai-title">Questions about ${programTitle}?</h3>
              <p class="sidebar-ai-desc">Instant verified guidance on career pathways, workload, and scholarships.</p>
            </div>
            <div class="sidebar-ai-chips">
              <button type="button" class="sidebar-ai-chip" data-prompt="What are the top career prospects, job roles, and industries for ${programTitle} graduates from CAU?">
                <i class="fa-solid fa-briefcase"></i> Career Paths
              </button>
              <button type="button" class="sidebar-ai-chip" data-prompt="What is the net tuition fee, payment schedule, and scholarship opportunities for ${programTitle} at CAU?">
                <i class="fa-solid fa-calculator"></i> Tuition &amp; Aid
              </button>
              <button type="button" class="sidebar-ai-chip" data-prompt="How challenging are the courses in ${programTitle}, and what are the key subjects?">
                <i class="fa-solid fa-book-open"></i> Course Difficulty
              </button>
              <button type="button" class="sidebar-ai-chip" data-prompt="What are the admission requirements, prerequisites, and deadlines for ${programTitle}?">
                <i class="fa-solid fa-clipboard-check"></i> Admission Checklist
              </button>
            </div>
            <form class="sidebar-ai-form">
              <div class="sidebar-ai-input-wrap">
                <input type="text" class="sidebar-ai-input" placeholder="Ask anything about this degree..." aria-label="Ask AI about this degree" />
                <button type="submit" class="sidebar-ai-submit-btn" aria-label="Submit question" title="Ask AI">
                  <i class="fa-solid fa-arrow-up"></i>
                </button>
              </div>
            </form>
          `;

          const factsCard = sidebar.querySelector('.sidebar-facts');
          if (factsCard && factsCard.nextElementSibling) {
            sidebar.insertBefore(advisorCard, factsCard.nextElementSibling);
          } else {
            sidebar.prepend(advisorCard);
          }

          advisorCard.querySelectorAll('.sidebar-ai-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              const p = btn.getAttribute('data-prompt');
              window.CAU_OPEN_AI_CHAT(p, 'course_explainer', programSlug);
            });
          });

          const form = advisorCard.querySelector('.sidebar-ai-form');
          const input = advisorCard.querySelector('.sidebar-ai-input');
          form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const q = input?.value.trim();
            if (q) {
              window.CAU_OPEN_AI_CHAT(q, 'course_explainer', programSlug);
              input.value = '';
            }
          });
        }
      }

      // Feature 7: AI Interactive Course Assistant on curriculum items!
      document.querySelectorAll('.curriculum-course-list li').forEach(li => {
        li.style.cursor = 'pointer';
        li.title = 'Click to ask AI about this course';
        li.innerHTML = `<span style="border-bottom:1px dashed var(--cau-chat-muted,#999); display:inline-block;">${li.textContent}</span> <i class="fa-solid fa-sparkles" style="font-size:10px; color:var(--cau-chat-primary,#f04432); margin-left:4px; opacity:0.8;"></i>`;
        
        li.addEventListener('click', (e) => {
          e.preventDefault();
          const courseName = li.querySelector('span')?.textContent || li.textContent.trim();
          window.CAU_OPEN_AI_CHAT(`Explain this specific course: ${courseName}`, 'course_explainer', programSlug);
        });
      });
    }
  };

  // Preload program catalog in background for offline intelligence
  const fetchCatalog = async () => {
    try {
      if (Array.isArray(window.CAU_PROGRAM_CATALOG) && window.CAU_PROGRAM_CATALOG.length) {
        state.programs = window.CAU_PROGRAM_CATALOG;
        return;
      }
      const res = await fetch('/program-catalog.json');
      if (res.ok) {
        state.programs = await res.json();
        window.CAU_PROGRAM_CATALOG = state.programs;
      }
    } catch {
      /* Catalog preload optional */
    }
  };

  const init = () => {
    fetchCatalog();
    mount();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
