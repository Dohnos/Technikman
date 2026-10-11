// Vykreslení protokolu do stránky (sdílí /protokol, /protokol/ukazka a náhled v adminu).
import { iconSvg } from '../data/icons';
import {
  itemKey,
  paintScale,
  paintStatus,
  panels,
  sections,
  sectionStatus,
  statuses,
  totalCost,
  verdicts,
  type Protocol,
  type Status,
} from '../data/protocol';

export type Trust = 'verified' | 'invalid' | 'unsigned' | 'nokey' | 'sample' | 'draft';

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const safeUrl = (u: string) => (/^https?:\/\//i.test(u) ? esc(u) : '');
const kc = (n: number) => `${n.toLocaleString('cs-CZ')} Kč`;
const fmtDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  return y ? new Date(y, m - 1, day).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
};

const trustInfo: Record<Trust, { icon: string; text: string; tone: string }> = {
  verified: { icon: 'shield', text: 'Ověřený protokol Proklepto', tone: 'ok' },
  invalid: { icon: 'alert', text: 'Pozor: podpis nesouhlasí, protokol mohl být upraven', tone: 'bad' },
  unsigned: { icon: 'alert', text: 'Protokol bez podpisu, nelze ověřit původ', tone: 'warn' },
  nokey: { icon: 'lock', text: 'Podepsaný protokol (ověření není na webu nastaveno)', tone: 'warn' },
  sample: { icon: 'eye', text: 'Ukázkový protokol', tone: 'neutral' },
  draft: { icon: 'edit', text: 'Náhled konceptu', tone: 'neutral' },
};

const statusPill = (s: Status, label?: string) =>
  `<span class="pv-status pv-status--${s}">${iconSvg(statuses[s].icon, 14)}${esc(label ?? statuses[s].short)}</span>`;

export function renderProtocol(root: HTMLElement, p: Protocol, trust: Trust) {
  const v = verdicts[p.verdict] ?? verdicts.koupit;
  const allItems = sections.flatMap((s) => s.items.map((it) => p.items[itemKey(s.id, it.id)]?.s ?? 'na'));
  const warnCount = allItems.filter((s) => s === 'warn').length;
  const badCount = allItems.filter((s) => s === 'bad').length;
  const okCount = allItems.filter((s) => s === 'ok').length;
  const cost = totalCost(p);
  const t = trustInfo[trust];
  const car = p.car;
  const title = [car.make, car.model].filter(Boolean).join(' ') || 'Vozidlo';
  const meta = [
    car.year && ['Rok', car.year],
    car.km && ['Najeto', `${car.km} km`],
    car.engine && ['Motor', car.engine],
    car.fuel && ['Palivo', car.fuel],
    car.gearbox && ['Převodovka', car.gearbox],
    car.color && ['Barva', car.color],
    car.plate && ['SPZ', car.plate],
    car.price && ['Cena v inzerátu', `${car.price} Kč`],
  ].filter(Boolean) as [string, string][];
  const hasPaint = panels.some((pn) => p.paint[pn.id] != null);

  root.innerHTML = `
  <div class="pv-bar">
    <div class="pv-bar__id">
      <span class="pv-bar__no">${esc(p.id)}</span>
      <span>${esc(fmtDate(p.date))}${p.place ? ` · ${esc(p.place)}` : ''}</span>
    </div>
    <span class="pv-trust pv-trust--${t.tone}">${iconSvg(t.icon, 16)}${t.text}</span>
    <div class="pv-bar__actions">
      <button class="btn btn--ghost" type="button" data-pv-copy>${iconSvg('copy', 18)}<span>Kopírovat odkaz</span></button>
      <button class="btn" type="button" data-pv-print>${iconSvg('printer', 18)}<span>Stáhnout PDF</span></button>
    </div>
  </div>

  <section class="pv-hero">
    <div class="pv-car">
      <span class="label">${iconSvg('car', 16)} Protokol z prověrky</span>
      <h1 class="pv-car__title">${esc(title)}</h1>
      ${car.vin ? `<p class="pv-car__vin">VIN <code>${esc(car.vin)}</code></p>` : ''}
      <dl class="pv-meta">${meta.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
    </div>
    <div class="pv-verdict pv-verdict--${v.tone}">
      <div class="pv-verdict__head">
        <span class="pv-verdict__icon">${iconSvg(v.icon, 28)}</span>
        <div><small>Verdikt technika</small><strong>${esc(v.label)}</strong></div>
      </div>
      ${p.summary ? `<p class="pv-verdict__text">${esc(p.summary)}</p>` : ''}
      <dl class="pv-stats">
        <div><dt>V pořádku</dt><dd>${okCount}</dd></div>
        <div><dt>Pozor</dt><dd>${warnCount}</dd></div>
        <div><dt>Závady</dt><dd>${badCount}</dd></div>
        <div><dt>Odhad oprav</dt><dd>${cost ? kc(cost) : '–'}</dd></div>
        ${p.discount ? `<div class="pv-stats__wide"><dt>Doporučená sleva</dt><dd>${esc(p.discount)} Kč</dd></div>` : ''}
      </dl>
    </div>
  </section>

  <section class="pv-3d" aria-label="3D náhled auta s nálezy">
    <div class="pv-3d__stage">
      <canvas data-pv-canvas aria-hidden="true"></canvas>
      <div class="pv-3d__overlay" data-pv-overlay></div>
      <img class="pv-3d__print" data-pv-snapshot alt="" />
      <div class="pv-3d__tools">
        <button type="button" class="pv-toggle is-on" data-pv-layer="paint"${hasPaint ? '' : ' hidden'}>${iconSvg('layers', 16)} Lak</button>
        <button type="button" class="pv-toggle is-on" data-pv-layer="findings">${iconSvg('pin', 16)} Nálezy</button>
      </div>
      <p class="pv-3d__hint">${iconSvg('rotate', 16)} Tažením otočíte auto</p>
      <div class="pv-legend">
        <span><i class="ok"></i>Originál do ${paintScale.ok} µm</span>
        <span><i class="warn"></i>Přelakováno do ${paintScale.warn} µm</span>
        <span><i class="bad"></i>Tmel / oprava</span>
      </div>
    </div>
  </section>

  <section class="pv-overview" aria-label="Přehled sekcí">
    ${sections
      .map((s) => {
        const st = sectionStatus(p, s);
        return `<a class="pv-tile pv-tile--${st}" href="#sekce-${s.id}">
          <span class="pv-tile__icon">${iconSvg(s.icon, 22)}</span>
          <span class="pv-tile__name">${esc(s.title)}</span>
          ${statusPill(st)}
        </a>`;
      })
      .join('')}
  </section>

  <section class="pv-sections">
    ${sections
      .map((s) => {
        const st = sectionStatus(p, s);
        return `<article class="pv-sec" id="sekce-${s.id}">
          <header class="pv-sec__head">
            <span class="pv-sec__icon pv-sec__icon--${st}">${iconSvg(s.icon, 22)}</span>
            <h2>${esc(s.title)}</h2>
            ${statusPill(st, statuses[st].label)}
          </header>
          <ul class="pv-items">
            ${s.items
              .map((it) => {
                const r = p.items[itemKey(s.id, it.id)] ?? { s: 'na' as Status };
                return `<li class="pv-item pv-item--${r.s}">
                  <span class="pv-item__mark">${iconSvg(statuses[r.s].icon, 14)}</span>
                  <div class="pv-item__text"><span>${esc(it.label)}</span>${r.n ? `<small>${esc(r.n)}</small>` : ''}</div>
                  ${r.c && r.s !== 'ok' ? `<span class="pv-item__cost">${kc(r.c)}</span>` : ''}
                </li>`;
              })
              .join('')}
          </ul>
        </article>`;
      })
      .join('')}
  </section>

  ${
    hasPaint
      ? `<section class="pv-paint">
    <header class="pv-sec__head"><span class="pv-sec__icon">${iconSvg('layers', 22)}</span><h2>Měření laku</h2></header>
    <ul class="pv-paint__list">
      ${panels
        .map((pn) => {
          const val = p.paint[pn.id];
          const st = paintStatus(val);
          const pct = val ? Math.min(100, (val / 400) * 100) : 0;
          return `<li class="pv-paint__row pv-paint__row--${st}">
            <span>${esc(pn.label)}</span>
            <span class="pv-paint__bar"><i style="width:${pct}%"></i></span>
            <b>${val != null ? `${val} µm` : '–'}</b>
          </li>`;
        })
        .join('')}
    </ul>
  </section>`
      : ''
  }

  <footer class="pv-foot">
    ${safeUrl(p.gallery) ? `<a class="btn btn--accent" href="${safeUrl(p.gallery)}" target="_blank" rel="noopener">${iconSvg('image', 18)} Fotodokumentace</a>` : ''}
    <div class="pv-sign">
      <small>Prověrku provedl</small>
      <strong>${esc(p.tech)}</strong>
      <span>${esc(fmtDate(p.date))}${p.client ? ` · pro ${esc(p.client)}` : ''}</span>
    </div>
    <p class="pv-disclaimer">Protokol popisuje stav vozidla v době prověrky podle vizuální kontroly, měření a diagnostiky bez demontáže dílů. Odhad nákladů na opravy je orientační.</p>
  </footer>`;
}
