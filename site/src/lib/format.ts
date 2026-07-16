export function formatDate(iso: string): string {
  // Keep YYYY-MM-DD display for zh-CN personal site
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}
