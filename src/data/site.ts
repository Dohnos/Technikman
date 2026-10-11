// ─────────────────────────────────────────────────────────────
//  Proklepto – centrální konfigurace webu
//  Kontakty, ceny a texty upravujte tady, propíšou se všude.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Proklepto',
  version: '1.0.0',
  url: 'https://proklepto.cz',
  tagline: 'Ojetinu nejdřív proklepneme.',
  description:
    'Nezávislá prověrka ojetého auta před koupí. Kontrola historie a VIN, tloušťky laku, diagnostika, zkušební jízda a fotoprotokol ještě ten den. Olomoucký kraj a celá Morava.',
  // TODO: doplnit skutečné kontaktní údaje
  phone: '+420 000 000 000',
  phoneHref: 'tel:+420000000000',
  email: 'info@proklepto.cz',
  baseCity: 'Olomouc',
  baseGeo: { lat: 49.5938, lon: 17.2509 },
  hours: 'Po–So 8:00–19:00',
  openingHoursSpec: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '19:00' },
  ],
  // Doprava
  freeRadiusKm: 25,
  pricePerKm: 8,
  checkpoints: '120+',
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  priceFrom?: boolean;
  lead: string;
  cta: string;
  features: string[];
  featured?: boolean;
  icon: string;
};

export const plans: Plan[] = [
  {
    id: 'online',
    name: 'Prověrka online',
    price: 990,
    cta: 'Chci prověrku online',
    lead: 'Než vyrazíte na dlouhou cestu, víte, jestli se vůbec vyplatí.',
    icon: 'search',
    features: [
      'Rozbor inzerátu a fotek',
      'Historie vozu podle VIN',
      'Kontrola leasingu, exekuce a odcizení',
      'Cílené otázky prodejci po telefonu',
      'Doporučení: jet / nejet',
    ],
  },
  {
    id: 'kompletni',
    name: 'Kompletní prověrka',
    price: 3990,
    cta: 'Chci kompletní prověrku',
    lead: 'Technik na místě. Auto proklepne od střechy po výfuk.',
    icon: 'shield',
    featured: true,
    features: [
      'Vše z prověrky online',
      `${site.checkpoints} kontrolních bodů na místě`,
      'Měření tloušťky laku na všech dílech',
      'Diagnostika řídicích jednotek (OBD)',
      'Zkušební jízda a kontrola podvozku',
      'Fotoprotokol ještě ten den',
      'Argumenty pro vyjednání ceny',
    ],
  },
  {
    id: 'na-klic',
    name: 'Auto na klíč',
    price: 9990,
    priceFrom: true,
    cta: 'Chci auto na klíč',
    lead: 'Najdeme, prověříme a pomůžeme koupit. Vy jen podepíšete.',
    icon: 'key',
    features: [
      'Vyhledání aut podle rozpočtu',
      'Kompletní prověrka až 3 vozů',
      'Vyjednání ceny s prodejcem',
      'Kontrola kupní smlouvy',
      'Doprovod při předání a převodu',
    ],
  },
];

export const checks = [
  {
    icon: 'history',
    title: 'Historie a VIN',
    text: 'Stav tachometru v čase, servisní záznamy, nehody, leasing, odcizení i původ vozu.',
  },
  {
    icon: 'layers',
    title: 'Karoserie a lak',
    text: 'Tloušťkoměrem změříme každý díl. Odhalíme přelakování, tmel i skrytou bouračku.',
  },
  {
    icon: 'cpu',
    title: 'Diagnostika OBD',
    text: 'Načteme chybové paměti řídicích jednotek a hledáme smazané i skryté závady.',
  },
  {
    icon: 'wrench',
    title: 'Motor a převodovka',
    text: 'Studený start, úniky oleje, hlučnost, spojka, DPF, turbo a chování automatu.',
  },
  {
    icon: 'disc',
    title: 'Podvozek a brzdy',
    text: 'Tlumiče, ramena, uložení, kotouče, destičky, pneumatiky a koroze spodku.',
  },
  {
    icon: 'seat',
    title: 'Interiér a elektro',
    text: 'Opotřebení vs. nájezd, klimatizace, elektronika, airbagy a stopy po vodě.',
  },
  {
    icon: 'steering',
    title: 'Zkušební jízda',
    text: 'Řazení, tah motoru, vibrace, geometrie, brzdy a zvuky, které prodejce „neslyší“.',
  },
  {
    icon: 'file',
    title: 'Doklady',
    text: 'Shoda VIN s doklady, servisní knížka, STK, počet majitelů a kupní smlouva.',
  },
];

export const steps = [
  {
    icon: 'link',
    title: 'Pošlete inzerát',
    text: 'Odkaz na auto a kontakt na prodejce. Termín domluvíme obvykle do 48 hodin.',
  },
  {
    icon: 'history',
    title: 'Prověříme historii',
    text: 'Ještě před výjezdem zkontrolujeme VIN a databáze. Podezřelé auto stopneme hned.',
  },
  {
    icon: 'search',
    title: 'Proklepneme auto',
    text: 'Technik vyrazí na místo a auto projde bod po bodu včetně diagnostiky a jízdy.',
  },
  {
    icon: 'file',
    title: 'Dostanete verdikt',
    text: 'Telefonát hned z místa a fotoprotokol ještě ten den. Jasně: koupit, nebo ne.',
  },
];

export const faqs = [
  {
    q: 'Kolik stojí prověrka ojetého auta?',
    a: `Kompletní prověrka na místě stojí ${plans[1].price.toLocaleString('cs-CZ')} Kč. V Olomouci a do ${site.freeRadiusKm} km od ní je doprava zdarma, dál účtujeme ${site.pricePerKm} Kč/km. Samotná prověrka online (historie, VIN, inzerát) stojí ${plans[0].price} Kč.`,
  },
  {
    q: 'Musím být u prověrky osobně?',
    a: 'Nemusíte. Stačí poslat odkaz na inzerát a kontakt na prodejce. Termín domluvíme za vás, výsledek vám zavoláme přímo z místa a fotoprotokol pošleme e-mailem.',
  },
  {
    q: 'Jak dlouho prověrka trvá?',
    a: 'Na místě obvykle 1,5 až 2,5 hodiny podle typu vozu. Fotoprotokol dostanete ještě ten den.',
  },
  {
    q: 'Kde všude působíte?',
    a: 'Hlavní základnou je Olomouc a celý Olomoucký kraj. Běžně jezdíme i do Jihomoravského, Zlínského a Moravskoslezského kraje. Po domluvě kamkoli v Česku.',
  },
  {
    q: 'Prověříte i auto v autobazaru nebo dovezené ze zahraničí?',
    a: 'Ano. Prověřujeme vozy od soukromníků, z autobazarů i značkových dealerů. U dovezených aut prověříme historii v dostupných evropských databázích.',
  },
  {
    q: 'Prověřujete i hybridy a elektromobily?',
    a: 'Ano, prověřujeme osobní auta a dodávky do 3,5 t všech značek včetně hybridů a elektromobilů. U elektromobilů navíc kontrolujeme dostupné údaje o stavu baterie.',
  },
  {
    q: 'Co když prodejce prověrku odmítne?',
    a: 'Je to varovný signál. Seriózní prodejce nemá co skrývat. Často pomůže, když termín domluvíme my a vysvětlíme, jak prověrka probíhá.',
  },
  {
    q: 'Kdy a jak se platí?',
    a: 'Platíte až po prověrce, převodem nebo v hotovosti. Pokud auto stopneme už při online kontrole historie, platíte jen online prověrku.',
  },
];

export const brands = [
  'Škoda', 'Volkswagen', 'Audi', 'BMW', 'Mercedes-Benz', 'Toyota', 'Hyundai', 'Kia',
  'Ford', 'Peugeot', 'Renault', 'Volvo', 'Mazda', 'Seat', 'Cupra', 'Opel', 'Dacia', 'Tesla',
];

export const formatPrice = (n: number) => `${n.toLocaleString('cs-CZ').replace(/\s/g, ' ')} Kč`;
