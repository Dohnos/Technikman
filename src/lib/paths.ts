// Interní odkazy s ohledem na `base` (např. GitHub Pages na /Technikman/).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path: string) => `${BASE}${path.startsWith('/') ? path : `/${path}`}`;

/** Absolutní URL (canonical, OG, JSON-LD) */
export const absUrl = (path: string, site: URL | string) => new URL(withBase(path), site).href;
