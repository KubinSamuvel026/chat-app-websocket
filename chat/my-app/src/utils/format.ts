export const formatTime = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const truncate = (s?: string, len = 36) => {
  if (!s) return "";
  return s.length > len ? s.slice(0, len - 1) + "…" : s;
};
