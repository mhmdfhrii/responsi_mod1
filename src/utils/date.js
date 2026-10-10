export const today = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

export const addDays = (dateStr, n) => {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export const isValidDate = (s) =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s));
