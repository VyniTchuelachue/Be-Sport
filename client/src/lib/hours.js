const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// Current weekday (0 = Sunday) and minutes past midnight in the store's timezone.
function nowIn(timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

/** e.g. { open: true, label: "Ouvert, ferme à 20:00" } */
export function openStatus(store) {
  if (!store?.hours?.length) return null;
  const { day, minutes } = nowIn(store.timezone || 'Africa/Douala');
  const today = store.hours[day];

  if (minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, today: day, label: `Ouvert, ferme à ${today.close}` };
  }
  if (minutes < toMinutes(today.open)) {
    return { open: false, today: day, label: `Fermé, ouvre à ${today.open}` };
  }
  const next = store.hours[(day + 1) % 7];
  return { open: false, today: day, label: `Fermé, ouvre demain à ${next.open}` };
}

/** Collapses identical consecutive days: "Lundi – Samedi 09:00 – 20:00". */
export function groupedHours(hours) {
  // Start the week on Monday.
  const week = [...hours.slice(1), hours[0]];
  const groups = [];
  for (const h of week) {
    const last = groups.at(-1);
    if (last && last.open === h.open && last.close === h.close) last.to = h.day;
    else groups.push({ from: h.day, to: h.day, open: h.open, close: h.close });
  }
  return groups.map((g) => ({
    days: g.from === g.to ? g.from : `${g.from} – ${g.to}`,
    time: `${g.open} – ${g.close}`,
  }));
}
