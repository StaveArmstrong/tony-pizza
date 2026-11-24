// Light / dark colours for the customer dashboard.
// This lives in JavaScript (not a separate .css file) so it can never be missing or empty:
// AppShell injects it as a <style> tag. The public website is not affected.
const themeCss = `
/* Light / dark colours for the customer dashboard only.
   The public website is not affected. The "dark" class is switched on by the Settings page. */

.ap-root {
  --ap-bg: #f4ede1;
  --ap-nav: rgba(255, 255, 255, 0.92);
  --ap-card: #ffffff;
  --ap-card2: #faf5ec;
  --ap-ink: #262626;
  --ap-ink2: #525252;
  --ap-ink3: #8b8b8b;
  --ap-line: #e7dfd0;
  --ap-input: #ffffff;
  --ap-hover: #fbf4e8;
  --ap-shadow: 0 1px 3px rgba(60, 40, 10, 0.08);
  --ap-shadow-lg: 0 12px 32px rgba(60, 40, 10, 0.18);
  background: var(--ap-bg);
  color: var(--ap-ink);
}

.ap-root.dark {
  --ap-bg: #121212;
  --ap-nav: rgba(26, 26, 26, 0.92);
  --ap-card: #1c1c1c;
  --ap-card2: #262626;
  --ap-ink: #f3f3f3;
  --ap-ink2: #c2c2c2;
  --ap-ink3: #8a8a8a;
  --ap-line: #303030;
  --ap-input: #262626;
  --ap-hover: #262626;
  --ap-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  --ap-shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.6);
}

.ap-nav { background: var(--ap-nav); backdrop-filter: blur(10px); border-bottom: 1px solid var(--ap-line); }
.ap-nav-bottom { background: var(--ap-nav); backdrop-filter: blur(10px); border-top: 1px solid var(--ap-line); }
.ap-card { background: var(--ap-card); box-shadow: var(--ap-shadow); }
.ap-card2 { background: var(--ap-card2); }
.ap-pop { background: var(--ap-card); box-shadow: var(--ap-shadow-lg); border: 1px solid var(--ap-line); }
.ap-ink { color: var(--ap-ink); }
.ap-ink2 { color: var(--ap-ink2); }
.ap-ink3 { color: var(--ap-ink3); }
.ap-line { border-color: var(--ap-line); }
.ap-divide > * + * { border-top: 1px solid var(--ap-line); }
.ap-hover:hover { background: var(--ap-hover); }

.ap-input {
  background: var(--ap-input);
  border: 1px solid var(--ap-line);
  color: var(--ap-ink);
}
.ap-input::placeholder { color: var(--ap-ink3); }
.ap-input:focus { outline: none; border-color: #f97316; }

/* order status pills */
.ap-pill-pending { background: rgba(245, 158, 11, 0.16); color: #b45309; }
.ap-pill-preparing { background: rgba(59, 130, 246, 0.14); color: #1d4ed8; }
.ap-pill-out_for_delivery { background: rgba(168, 85, 247, 0.14); color: #7e22ce; }
.ap-pill-delivered { background: rgba(34, 197, 94, 0.15); color: #15803d; }
.ap-pill-cancelled { background: rgba(239, 68, 68, 0.14); color: #b91c1c; }
.ap-root.dark .ap-pill-pending { color: #fbbf24; }
.ap-root.dark .ap-pill-preparing { color: #60a5fa; }
.ap-root.dark .ap-pill-out_for_delivery { color: #c084fc; }
.ap-root.dark .ap-pill-delivered { color: #4ade80; }
.ap-root.dark .ap-pill-cancelled { color: #f87171; }
`

export default themeCss