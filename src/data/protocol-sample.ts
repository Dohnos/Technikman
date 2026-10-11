// Ukázkový protokol pro /protokol/ukazka/ a úvodní stránku.
import { emptyProtocol, type Protocol } from './protocol';

const base = emptyProtocol();

export const sampleProtocol: Protocol = {
  ...base,
  id: 'PK-UKAZKA-001',
  date: '2026-10-08',
  place: 'Olomouc',
  client: 'Ukázkový klient',
  car: {
    make: 'Škoda',
    model: 'Octavia Combi III',
    engine: '2.0 TDI, 110 kW',
    fuel: 'Nafta',
    gearbox: 'Automat DSG',
    year: '2018',
    vin: 'TMBJJ7NE0J0XXXXXX',
    plate: '',
    km: '148 200',
    color: 'Modrá metalíza',
    price: '329 000',
    ad: '',
  },
  verdict: 'sleva',
  summary:
    'Auto je technicky v dobrém stavu a nájezd odpovídá historii. Dva díly na pravé straně byly přelakované, bez známek vážné nehody. Před koupí počítejte s výměnou předních kotoučů a opravou snímače NOx.',
  discount: '15 000',
  items: {
    ...base.items,
    'historie.servis': { s: 'ok', n: '6 záznamů v historii, poslední před 9 měsíci' },
    'karoserie.lak': { s: 'warn', n: 'Dveře PZ a blatník PP přelakované' },
    'diagnostika.pameti': { s: 'warn', n: 'Uložená chyba snímače NOx', c: 6500 },
    'podvozek.brzdy': { s: 'warn', n: 'Přední kotouče pod limitem', c: 4500 },
    'podvozek.pneu': { s: 'ok', n: 'Zimní sada, 6 mm' },
    'interier.klima': { s: 'ok' },
    'doklady.majitele': { s: 'ok', n: '2 majitelé v ČR' },
  },
  paint: {
    kapota: 118,
    strecha: 112,
    kufr: 121,
    blatnikLP: 115,
    dvereLP: 119,
    dvereLZ: 117,
    blatnikLZ: 122,
    blatnikPP: 265,
    dverePP: 124,
    dverePZ: 238,
    blatnikPZ: 120,
  },
  gallery: '',
};
