const COLORS: Record<string, string> = {
  white: "#d1d5db",
  ขาว: "#d1d5db",
  black: "#111827",
  ดำ: "#111827",
  red: "#ef4444",
  แดง: "#ef4444",
  blue: "#3b82f6",
  น้ำเงิน: "#2563eb",
  ฟ้า: "#38bdf8",
  silver: "#9ca3af",
  เงิน: "#9ca3af",
  gray: "#6b7280",
  grey: "#6b7280",
  เทา: "#6b7280",
  green: "#22c55e",
  เขียว: "#22c55e",
  yellow: "#facc15",
  เหลือง: "#facc15",
  orange: "#f97316",
  ส้ม: "#f97316",
  brown: "#92400e",
  น้ำตาล: "#92400e",
  gold: "#d4a017",
  ทอง: "#d4a017",
  purple: "#8b5cf6",
  ม่วง: "#8b5cf6",
  pink: "#ec4899",
  ชมพู: "#ec4899",
};

const FALLBACK = "#9ca3af";

export function colorToHex(name: string): string {
  const key = name.trim().toLowerCase();
  if (!key) return FALLBACK;

  const hit = Object.keys(COLORS).find((k) => key.includes(k));
  if (hit) return COLORS[hit];

  if (typeof CSS !== "undefined" && CSS.supports("color", key)) {
    return key;
  }

  return FALLBACK;
}
