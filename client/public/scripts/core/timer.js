export function createTimer({ onTick, onExpire }) {
  let raf = 0, deadline = 0, total = 0, running = false, lastWhole = -1;

  function frame(now) {
    if (!running) return;
    const left = Math.max(0, deadline - now);
    const whole = Math.ceil(left / 1000);
    onTick?.({ leftMs: left, whole, ratio: total ? left / total : 0, changed: whole !== lastWhole });
    lastWhole = whole;
    if (left <= 0) { running = false; onExpire?.(); return; }
    if (typeof requestAnimationFrame !== 'undefined') raf = requestAnimationFrame(frame);
  }

  return {
    start(seconds) {
      if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf);
      total = seconds * 1000;
      deadline = (typeof performance !== 'undefined' ? performance.now() : Date.now()) + total;
      running = true; lastWhole = -1;
      if (typeof requestAnimationFrame !== 'undefined') raf = requestAnimationFrame(frame);
    },
    stop() { // returns elapsed ms
      running = false;
      if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf);
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      return Math.min(total, total - Math.max(0, deadline - now));
    },
  };
}
