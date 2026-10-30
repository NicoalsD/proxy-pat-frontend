export function Mark({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const stroke = tone === "ink" ? "var(--ink)" : "var(--paper)";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" focusable="false">
      <path d="M2 16.5 7.5 8.5l4.6 5.2L20 3.5" fill="none" stroke={stroke} strokeWidth="1.6" />
      <circle cx="20" cy="3.5" r="2.1" fill={stroke} />
    </svg>
  );
}
