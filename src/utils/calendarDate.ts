/** Local calendar YYYY-MM-DD (aligned with backend booking validation). */
export function formatLocalYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayLocalYMD(): string {
  return formatLocalYMD(new Date());
}

export function isPastYmd(ymd: string): boolean {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return true;
  return ymd < todayLocalYMD();
}

export function filterQueueEntriesForToday<T extends { appointmentId: string }>(
  queueEntries: T[],
  appointments: { id: string; date: string }[],
  dayYmd: string,
): T[] {
  const dates = new Map(appointments.map((a) => [a.id, a.date]));
  return queueEntries.filter((e) => dates.get(e.appointmentId) === dayYmd);
}
