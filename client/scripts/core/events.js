const listeners = new Map();

export const bus = {
  on(evt, fn) {
    if (!listeners.has(evt)) listeners.set(evt, new Set());
    listeners.get(evt).add(fn);
    return () => listeners.get(evt)?.delete(fn); // unsubscribe
  },
  emit(evt, payload) {
    listeners.get(evt)?.forEach(fn => {
      try { fn(payload); } catch (err) { console.error(`[bus] ${evt}`, err); }
    });
  },
};
