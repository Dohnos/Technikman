// ─────────────────────────────────────────────────────────────
//  Admin protokolů (/admin) – vše běží v prohlížeči:
//  koncepty v localStorage, podpis klíčem uloženým v prohlížeči,
//  výsledkem je odkaz /protokol/#… pro klienta.
// ─────────────────────────────────────────────────────────────
import { iconSvg } from '../data/icons';
import {
  emptyProtocol,
  itemKey,
  paintStatus,
  panels,
  protocolConfig,
  sections,
  sectionStatus,
  statuses,
  totalCost,
  type Protocol,
  type Status,
} from '../data/protocol';
import { encodeProtocol, generateKeyPair } from './protocol-codec';
import { withBase } from '../lib/paths';

type Record_ = { uid: string; protocol: Protocol; updated: number };
type SignKey = { privateJwk: JsonWebKey; publicKey: { x: string; y: string } };

const LS_LIST = 'proklepto.protocols';
const LS_CURRENT = 'proklepto.current';
const LS_KEY = 'proklepto.signKey';

const read = <T>(k: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
    return true;
  } catch {
    return false;
  }
};
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const kc = (n: number) => `${n.toLocaleString('cs-CZ')} Kč`;
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const download = (name: string, data: unknown) => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const protocolUrl = (hash: string) => `${location.origin}${withBase('/protokol/')}#${hash}`;

export function initAdmin() {
  const form = document.querySelector<HTMLFormElement>('[data-form]')!;
  const listEl = document.querySelector<HTMLUListElement>('[data-list]')!;
  const savedEl = document.querySelector<HTMLElement>('[data-saved]')!;
  const costEl = document.querySelector<HTMLOutputElement>('[data-cost]')!;
  const toast = document.querySelector<HTMLElement>('[data-toast]')!;
  const dialog = document.querySelector<HTMLDialogElement>('[data-settings]')!;

  let records: Record_[] = read<Record_[]>(LS_LIST, []);
  let current: Record_;

  const persist = () => {
    const ok = write(LS_LIST, records);
    savedEl.textContent = ok ? `Uloženo ${new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}` : 'Nelze uložit (plné úložiště?)';
  };

  // ── Formulář ⇄ protokol ──
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | RadioNodeList | null;
  const setVal = (name: string, value: string) => {
    const el = field(name);
    if (!el) return;
    if (el instanceof RadioNodeList) el.value = value;
    else el.value = value;
  };
  const getVal = (name: string) => {
    const el = field(name);
    return el ? String(el.value ?? '').trim() : '';
  };

  const fill = (p: Protocol) => {
    form.reset();
    for (const k of ['id', 'date', 'place', 'client', 'tech', 'verdict', 'summary', 'discount', 'gallery'] as const) setVal(k, String(p[k] ?? ''));
    for (const [k, v] of Object.entries(p.car)) setVal(`car.${k}`, v);
    for (const sec of sections) {
      for (const it of sec.items) {
        const key = itemKey(sec.id, it.id);
        const r = p.items[key] ?? { s: 'ok' };
        setVal(`s:${key}`, r.s);
        setVal(`n:${key}`, r.n ?? '');
        setVal(`c:${key}`, r.c ? String(r.c) : '');
      }
    }
    for (const pn of panels) setVal(`paint.${pn.id}`, p.paint[pn.id] != null ? String(p.paint[pn.id]) : '');
    refresh();
  };

  const collect = (): Protocol => {
    const p = emptyProtocol();
    p.id = getVal('id') || current.protocol.id;
    p.date = getVal('date');
    p.place = getVal('place');
    p.client = getVal('client');
    p.tech = getVal('tech') || protocolConfig.technician;
    p.verdict = (getVal('verdict') || 'koupit') as Protocol['verdict'];
    p.summary = getVal('summary');
    p.discount = getVal('discount');
    p.gallery = getVal('gallery');
    for (const k of Object.keys(p.car) as (keyof Protocol['car'])[]) p.car[k] = getVal(`car.${k}`);
    for (const sec of sections) {
      for (const it of sec.items) {
        const key = itemKey(sec.id, it.id);
        const s = (getVal(`s:${key}`) || 'ok') as Status;
        const n = getVal(`n:${key}`);
        const c = Number(getVal(`c:${key}`)) || 0;
        p.items[key] = { s, ...(n ? { n } : {}), ...(c && s !== 'ok' ? { c } : {}) };
      }
    }
    p.paint = {};
    for (const pn of panels) {
      const raw = getVal(`paint.${pn.id}`);
      if (raw !== '' && !Number.isNaN(Number(raw))) p.paint[pn.id] = Number(raw);
    }
    return p;
  };

  // ── Živé přepočty ──
  const refresh = () => {
    const p = collect();
    for (const sec of sections) {
      const box = form.querySelector<HTMLElement>(`[data-sec="${sec.id}"] [data-sec-status]`);
      const st = sectionStatus(p, sec);
      if (box) box.innerHTML = `<span class="pill pill--${st}">${statuses[st].label}</span>`;
      for (const it of sec.items) {
        const key = itemKey(sec.id, it.id);
        const row = form.querySelector<HTMLElement>(`[data-item="${key}"]`);
        const r = p.items[key];
        row?.classList.toggle('is-flagged', r.s === 'warn' || r.s === 'bad');
        row?.classList.toggle('has-note', !!r.n);
      }
    }
    for (const pn of panels) {
      const dot = form.querySelector<HTMLElement>(`[data-paint-dot="${pn.id}"]`);
      if (dot) dot.className = paintStatus(p.paint[pn.id]) === 'na' ? '' : paintStatus(p.paint[pn.id]);
    }
    costEl.textContent = kc(totalCost(p));
    return p;
  };

  // ── Seznam konceptů ──
  const renderList = () => {
    const sorted = [...records].sort((a, b) => b.updated - a.updated);
    listEl.innerHTML = sorted
      .map((r) => {
        const car = [r.protocol.car.make, r.protocol.car.model].filter(Boolean).join(' ') || 'Bez názvu';
        return `<li class="${r.uid === current.uid ? 'is-active' : ''}" data-uid="${r.uid}">
          <button type="button" class="adm-list__open" data-open><b>${esc(car)}</b><small>${esc(r.protocol.id)} · ${esc(r.protocol.date)}</small></button>
          <button type="button" class="adm-icon-btn" data-dup title="Duplikovat">${iconSvg('copy', 16)}</button>
          <button type="button" class="adm-icon-btn" data-del title="Smazat">${iconSvg('trash', 16)}</button>
        </li>`;
      })
      .join('');
  };

  const open = (r: Record_) => {
    current = r;
    write(LS_CURRENT, r.uid);
    fill(r.protocol);
    renderList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const create = (protocol = emptyProtocol()) => {
    const r: Record_ = { uid: uid(), protocol, updated: Date.now() };
    records.push(r);
    persist();
    open(r);
  };

  let saveTimer = 0;
  const onChange = () => {
    const p = refresh();
    current.protocol = p;
    current.updated = Date.now();
    savedEl.textContent = 'Ukládám…';
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      persist();
      renderList();
    }, 400);
  };
  form.addEventListener('input', onChange);
  form.addEventListener('change', onChange);

  form.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-all-ok]');
    if (!btn) return;
    const sec = sections.find((s) => s.id === btn.dataset.allOk)!;
    for (const it of sec.items) setVal(`s:${itemKey(sec.id, it.id)}`, 'ok');
    onChange();
  });

  listEl.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const li = t.closest<HTMLElement>('li[data-uid]');
    if (!li) return;
    const r = records.find((x) => x.uid === li.dataset.uid);
    if (!r) return;
    if (t.closest('[data-open]')) open(r);
    else if (t.closest('[data-dup]')) {
      const copy = structuredClone(r.protocol);
      copy.id = emptyProtocol().id;
      create(copy);
    } else if (t.closest('[data-del]')) {
      const name = [r.protocol.car.make, r.protocol.car.model].filter(Boolean).join(' ') || r.protocol.id;
      if (!confirm(`Smazat protokol „${name}“? Tuto akci nejde vrátit.`)) return;
      records = records.filter((x) => x.uid !== r.uid);
      persist();
      if (records.length === 0) create();
      else if (r.uid === current.uid) open(records[0]);
      else renderList();
    }
  });

  document.querySelector('[data-new]')!.addEventListener('click', () => create());

  // ── Záloha ──
  document.querySelector('[data-export]')!.addEventListener('click', () =>
    download(`proklepto-protokoly-${new Date().toISOString().slice(0, 10)}.json`, { type: 'proklepto-protocols', records }),
  );
  document.querySelector('[data-download]')!.addEventListener('click', () => {
    const p = refresh();
    download(`${p.id}.json`, { type: 'proklepto-protocols', records: [{ ...current, protocol: p }] });
  });
  document.querySelector<HTMLInputElement>('[data-import]')!.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const incoming: Record_[] = (data.records ?? []).filter((r: Record_) => r?.protocol?.id && r.protocol.items);
      if (!incoming.length) throw new Error();
      let added = 0;
      for (const r of incoming) {
        const existing = records.findIndex((x) => x.uid === r.uid);
        if (existing >= 0) records[existing] = r;
        else {
          records.push(r);
          added++;
        }
      }
      persist();
      open(incoming[0]);
      alert(`Načteno ${incoming.length} protokolů (${added} nových).`);
    } catch {
      alert('Soubor není platná záloha protokolů Proklepto.');
    }
  });

  // ── Náhled a odkaz pro klienta ──
  const validate = (p: Protocol) => {
    const missing = ['car.make', 'car.model', 'id', 'date'].filter((n) => !getVal(n));
    form.querySelectorAll('.is-missing').forEach((el) => el.classList.remove('is-missing'));
    missing.forEach((n) => (field(n) as HTMLInputElement)?.classList.add('is-missing'));
    if (missing.length) {
      (field(missing[0]) as HTMLInputElement)?.focus();
      return false;
    }
    return !!p;
  };

  document.querySelector('[data-preview]')!.addEventListener('click', async () => {
    const p = refresh();
    const hash = await encodeProtocol(p);
    window.open(protocolUrl(`draft:${hash}`), '_blank', 'noopener');
  });

  const showToast = (text: string, link: string) => {
    toast.querySelector('[data-toast-text]')!.textContent = text;
    toast.querySelector<HTMLInputElement>('[data-toast-link]')!.value = link;
    toast.querySelector<HTMLAnchorElement>('[data-toast-open]')!.href = link;
    toast.hidden = false;
  };
  toast.querySelector('[data-toast-close]')!.addEventListener('click', () => (toast.hidden = true));
  toast.querySelector<HTMLInputElement>('[data-toast-link]')!.addEventListener('focus', (e) => (e.target as HTMLInputElement).select());

  document.querySelector('[data-share]')!.addEventListener('click', async () => {
    const p = refresh();
    if (!validate(p)) return;
    const key = read<SignKey | null>(LS_KEY, null);
    if (!key && !confirm('Nemáte nastavený podpisový klíč. Odkaz nepůjde ověřit a klient uvidí „Protokol bez podpisu“. Pokračovat?')) {
      dialog.showModal();
      return;
    }
    const link = protocolUrl(await encodeProtocol(p, key?.privateJwk));
    let copied = true;
    await navigator.clipboard.writeText(link).catch(() => (copied = false));
    showToast(copied ? (key ? 'Podepsaný odkaz zkopírován' : 'Odkaz zkopírován (bez podpisu)') : 'Odkaz pro klienta', link);
  });

  // ── Podpisový klíč ──
  const keyStatus = document.querySelector<HTMLElement>('[data-key-status]')!;
  const renderKey = () => {
    const key = read<SignKey | null>(LS_KEY, null);
    const site = protocolConfig.publicKey;
    const matches = !!key && !!site && site.x === key.publicKey.x && site.y === key.publicKey.y;
    keyStatus.innerHTML = key
      ? matches
        ? `<span class="pill pill--ok">${iconSvg('shield', 14)} Podpis aktivní</span>`
        : `<span class="pill pill--warn">${iconSvg('alert', 14)} Klíč není na webu</span>`
      : `<span class="pill pill--warn">${iconSvg('alert', 14)} Bez podpisu</span>`;

    const state = dialog.querySelector<HTMLElement>('[data-key-state]')!;
    const pub = dialog.querySelector<HTMLElement>('[data-key-pub]')!;
    if (!key) {
      state.innerHTML = `<div class="state state--warn">${iconSvg('alert', 18)} V tomto prohlížeči není klíč. Vytvořte nový, nebo načtěte zálohu.</div>`;
      pub.hidden = true;
    } else {
      state.innerHTML = matches
        ? `<div class="state state--ok">${iconSvg('shield', 18)} Klíč je nastavený i na webu. Odkazy se ověřují.</div>`
        : `<div class="state state--warn">${iconSvg('alert', 18)} Klíč je v prohlížeči, ale web ho ještě nezná. Vložte veřejný klíč do webu.</div>`;
      pub.hidden = false;
      dialog.querySelector<HTMLTextAreaElement>('[data-key-snippet]')!.value =
        `publicKey: { x: '${key.publicKey.x}', y: '${key.publicKey.y}' },`;
    }
  };

  document.querySelector('[data-open-settings]')!.addEventListener('click', () => {
    renderKey();
    dialog.showModal();
  });
  dialog.querySelector('[data-key-generate]')!.addEventListener('click', async () => {
    if (read<SignKey | null>(LS_KEY, null) && !confirm('Nový klíč nahradí stávající. Dříve podepsané odkazy se po změně klíče na webu přestanou ověřovat. Pokračovat?')) return;
    const pair = await generateKeyPair();
    write(LS_KEY, pair);
    renderKey();
  });
  dialog.querySelector('[data-key-copy]')!.addEventListener('click', () =>
    navigator.clipboard.writeText(dialog.querySelector<HTMLTextAreaElement>('[data-key-snippet]')!.value).catch(() => {}),
  );
  dialog.querySelector('[data-key-export]')!.addEventListener('click', () => {
    const key = read<SignKey | null>(LS_KEY, null);
    if (!key) return alert('Není co zálohovat, nejdřív vytvořte klíč.');
    download('proklepto-podpisovy-klic.json', { type: 'proklepto-sign-key', ...key });
  });
  dialog.querySelector<HTMLInputElement>('[data-key-import]')!.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.type !== 'proklepto-sign-key' || !data.privateJwk?.d || !data.publicKey?.x) throw new Error();
      write(LS_KEY, { privateJwk: data.privateJwk, publicKey: data.publicKey });
      renderKey();
    } catch {
      alert('Soubor není platná záloha podpisového klíče.');
    }
  });

  // ── Start ──
  const lastUid = read<string | null>(LS_CURRENT, null);
  const start = records.find((r) => r.uid === lastUid) ?? records[0];
  if (start) open(start);
  else create();
  renderKey();
  savedEl.textContent = 'Uloženo';
}
