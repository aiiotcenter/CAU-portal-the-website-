const INTERVAL_DAYS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };

export function review(entry, correct, today) {
  const box = correct ? Math.min(5, (entry?.box ?? 1) + 1) : 1;
  return { box, due: today + INTERVAL_DAYS[box] };
}

export function dueIds(srsMap, today) {
  return Object.entries(srsMap)
    .filter(([, v]) => v.due <= today)
    .sort((a, b) => a[1].box - b[1].box)
    .map(([id]) => id);
}
