// ─────────────────────────────────────────────────────────────
//  Struktura protokolu z prověrky – sdílí ji admin (/admin)
//  i zobrazení protokolu (/protokol). Každý protokol má vždy
//  stejné sekce a body, mění se jen hodnocení a poznámky.
// ─────────────────────────────────────────────────────────────

export const PROTOCOL_VERSION = 1;

export const protocolConfig = {
  /**
   * Veřejný klíč pro ověření podpisu protokolů (ECDSA P-256, JWK x/y).
   * Vygenerujete ho v /admin → Nastavení a vložíte sem. Prázdné = protokoly
   * se zobrazí bez ověření.
   */
  publicKey: null as null | { x: string; y: string },
  technician: 'Proklepto',
};

export type Status = 'ok' | 'warn' | 'bad' | 'na';

export const statuses: Record<Status, { label: string; short: string; icon: string }> = {
  ok: { label: 'V pořádku', short: 'OK', icon: 'check' },
  warn: { label: 'Pozor', short: 'Pozor', icon: 'alert' },
  bad: { label: 'Závada', short: 'Závada', icon: 'x' },
  na: { label: 'Nekontrolováno', short: '–', icon: 'minus' },
};

export type Section = {
  id: string;
  title: string;
  icon: string;
  /** místo na 3D autě pro špendlík s nálezem (null = bez fyzického místa) */
  anchor: [number, number, number] | null;
  items: { id: string; label: string }[];
};

export const sections: Section[] = [
  {
    id: 'historie',
    title: 'Historie a VIN',
    icon: 'history',
    anchor: null,
    items: [
      { id: 'vin', label: 'VIN odpovídá dokladům' },
      { id: 'najezd', label: 'Nájezd odpovídá historii' },
      { id: 'leasing', label: 'Bez leasingu a exekuce' },
      { id: 'odcizeni', label: 'Není hlášeno odcizení' },
      { id: 'servis', label: 'Servisní záznamy' },
    ],
  },
  {
    id: 'karoserie',
    title: 'Karoserie a lak',
    icon: 'layers',
    anchor: [0.35, 1.0, 0.95],
    items: [
      { id: 'lak', label: 'Tloušťka laku' },
      { id: 'spary', label: 'Spáry a usazení dílů' },
      { id: 'koroze', label: 'Koroze' },
      { id: 'skla', label: 'Skla a světla' },
    ],
  },
  {
    id: 'diagnostika',
    title: 'Diagnostika',
    icon: 'cpu',
    anchor: [0.75, 1.3, -0.35],
    items: [
      { id: 'pameti', label: 'Chybové paměti jednotek' },
      { id: 'kontrolky', label: 'Kontrolky na přístrojovce' },
      { id: 'baterie', label: 'Stav baterie' },
    ],
  },
  {
    id: 'motor',
    title: 'Motor a převodovka',
    icon: 'wrench',
    anchor: [1.55, 1.25, 0],
    items: [
      { id: 'start', label: 'Studený start a chod' },
      { id: 'uniky', label: 'Úniky oleje a kapalin' },
      { id: 'turbo', label: 'Turbo a sání' },
      { id: 'vyfuk', label: 'Výfuk a DPF' },
      { id: 'prevodovka', label: 'Spojka a převodovka' },
    ],
  },
  {
    id: 'podvozek',
    title: 'Podvozek a brzdy',
    icon: 'disc',
    anchor: [1.35, 0.5, 1.05],
    items: [
      { id: 'tlumice', label: 'Tlumiče a pružiny' },
      { id: 'ramena', label: 'Ramena a uložení' },
      { id: 'brzdy', label: 'Brzdy (kotouče, destičky)' },
      { id: 'pneu', label: 'Pneumatiky' },
      { id: 'rizeni', label: 'Řízení' },
    ],
  },
  {
    id: 'interier',
    title: 'Interiér a elektro',
    icon: 'seat',
    anchor: [-0.5, 1.35, 0.3],
    items: [
      { id: 'opotrebeni', label: 'Opotřebení odpovídá nájezdu' },
      { id: 'klima', label: 'Klimatizace' },
      { id: 'elektro', label: 'Elektrická výbava' },
      { id: 'airbagy', label: 'Airbagy' },
      { id: 'voda', label: 'Bez stop po vodě' },
    ],
  },
  {
    id: 'jizda',
    title: 'Zkušební jízda',
    icon: 'steering',
    anchor: [-1.35, 0.5, 1.05],
    items: [
      { id: 'razeni', label: 'Řazení' },
      { id: 'tah', label: 'Tah a výkon' },
      { id: 'hluk', label: 'Vibrace a hluk' },
      { id: 'brzdeni', label: 'Brzdění' },
      { id: 'geometrie', label: 'Přímá jízda a geometrie' },
    ],
  },
  {
    id: 'doklady',
    title: 'Doklady',
    icon: 'file',
    anchor: null,
    items: [
      { id: 'tp', label: 'Technický průkaz a ORV' },
      { id: 'stk', label: 'Platná STK' },
      { id: 'knizka', label: 'Servisní knížka' },
      { id: 'majitele', label: 'Počet majitelů' },
    ],
  },
];

/** Díly karoserie pro měření laku (µm). Strana: L = levá, P = pravá, P/Z = přední/zadní. */
export const panels = [
  { id: 'kapota', label: 'Kapota' },
  { id: 'strecha', label: 'Střecha' },
  { id: 'kufr', label: 'Víko kufru' },
  { id: 'blatnikLP', label: 'Blatník LP' },
  { id: 'dvereLP', label: 'Dveře LP' },
  { id: 'dvereLZ', label: 'Dveře LZ' },
  { id: 'blatnikLZ', label: 'Blatník LZ' },
  { id: 'blatnikPP', label: 'Blatník PP' },
  { id: 'dverePP', label: 'Dveře PP' },
  { id: 'dverePZ', label: 'Dveře PZ' },
  { id: 'blatnikPZ', label: 'Blatník PZ' },
] as const;

export type PanelId = (typeof panels)[number]['id'];

/** Hranice tloušťky laku: do `ok` originál, do `warn` přelakováno, nad = tmel / oprava */
export const paintScale = { ok: 160, warn: 300 };
export const paintStatus = (um?: number | null): Status => (um == null || Number.isNaN(um) ? 'na' : um <= paintScale.ok ? 'ok' : um <= paintScale.warn ? 'warn' : 'bad');

export const verdicts = {
  koupit: { label: 'Doporučuji koupit', tone: 'ok', icon: 'shield' },
  sleva: { label: 'Koupit se slevou', tone: 'warn', icon: 'tag' },
  nekupovat: { label: 'Nedoporučuji koupit', tone: 'bad', icon: 'alert' },
} as const;
export type Verdict = keyof typeof verdicts;

export type ItemResult = { s: Status; n?: string; c?: number };

export type Protocol = {
  v: number;
  id: string;
  date: string;
  place: string;
  client: string;
  tech: string;
  car: {
    make: string;
    model: string;
    engine: string;
    fuel: string;
    gearbox: string;
    year: string;
    vin: string;
    plate: string;
    km: string;
    color: string;
    price: string;
    ad: string;
  };
  verdict: Verdict;
  summary: string;
  discount: string;
  items: Record<string, ItemResult>;
  paint: Partial<Record<PanelId, number>>;
  gallery: string;
};

export const itemKey = (sectionId: string, itemId: string) => `${sectionId}.${itemId}`;

const rank: Record<Status, number> = { na: 0, ok: 1, warn: 2, bad: 3 };
export const worst = (list: Status[]): Status => list.reduce<Status>((a, b) => (rank[b] > rank[a] ? b : a), 'na');

export const sectionStatus = (p: Protocol, sec: Section): Status =>
  worst(sec.items.map((it) => p.items[itemKey(sec.id, it.id)]?.s ?? 'na'));

export const totalCost = (p: Protocol) =>
  Object.values(p.items).reduce((sum, r) => sum + (r.s !== 'ok' && r.c ? r.c : 0), 0);

export const emptyProtocol = (): Protocol => {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const ymd = `${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}`;
  return {
    v: PROTOCOL_VERSION,
    id: `PK-${ymd}-${String(Math.floor(Math.random() * 900) + 100)}`,
    date: `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`,
    place: '',
    client: '',
    tech: protocolConfig.technician,
    car: { make: '', model: '', engine: '', fuel: '', gearbox: '', year: '', vin: '', plate: '', km: '', color: '', price: '', ad: '' },
    verdict: 'koupit',
    summary: '',
    discount: '',
    items: Object.fromEntries(sections.flatMap((s) => s.items.map((it) => [itemKey(s.id, it.id), { s: 'ok' as Status }]))),
    paint: {},
    gallery: '',
  };
};
