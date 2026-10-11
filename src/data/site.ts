// ─────────────────────────────────────────────────────────────
//  Proklepto – centrální konfigurace webu
//  Kontakty, ceny a texty upravujte tady, propíšou se všude.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Proklepto',
  version: '1.1.0',
  url: 'https://proklepto.cz',
  tagline: 'Ojetinu nejdřív proklepneme.',
  description:
    'Nezávislá prověrka ojetého auta před koupí. Historie a VIN, lak, diagnostika, zkušební jízda a protokol s fotkami ještě ten den. Olomoucký kraj a celá Morava.',
  // TODO: doplnit skutečné kontaktní údaje
  phone: '+420 000 000 000',
  phoneHref: 'tel:+420000000000',
  email: 'info@proklepto.cz',
  baseCity: 'Olomouc',
  baseGeo: { lat: 49.5938, lon: 17.2509 },
  hours: 'Po–So 8:00–18:00',
  openingHoursSpec: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' },
  ],
  // Doprava
  freeRadiusKm: 25,
  pricePerKm: 8,
};

export type Service = {
  id: string;
  name: string;
  price: number;
  priceFrom?: boolean;
  /** probíhá na místě u auta (true) nebo na dálku (false) */
  onSite: boolean;
  lead: string;
  features: string[];
  main?: boolean;
};

export const services: Service[] = [
  {
    id: 'dalku',
    name: 'Prověrka na dálku',
    price: 990,
    onSite: false,
    lead: 'Než pojedete přes půl Moravy, zjistím, jestli to auto za cestu stojí.',
    features: ['Historie podle VIN', 'Leasing, exekuce, odcizení', 'Rozbor inzerátu a fotek', 'Telefonát s prodejcem'],
  },
  {
    id: 'misto',
    name: 'Prověrka na místě',
    price: 3990,
    onSite: true,
    main: true,
    lead: 'Přijedu k autu a projdu ho celé. Výsledek vám zavolám ještě z místa.',
    features: [
      'Vše z prověrky na dálku',
      'Měření laku na každém dílu',
      'Diagnostika řídicích jednotek',
      'Motor, podvozek, zkušební jízda',
      'Protokol s fotkami týž den',
    ],
  },
  {
    id: 'klic',
    name: 'Auto na klíč',
    price: 9990,
    priceFrom: true,
    onSite: false,
    lead: 'Řeknete rozpočet a požadavky. Auto najdu, prověřím a pomůžu s koupí.',
    features: ['Výběr vhodných aut', 'Prověrka až 3 vozů', 'Vyjednání ceny', 'Kontrola smlouvy a převodu'],
  },
];

export const mainService = services.find((s) => s.main)!;

export const checks = [
  { icon: 'history', title: 'Historie a VIN', text: 'Nájezd v čase, servis, nehody, leasing, odcizení.' },
  { icon: 'layers', title: 'Karoserie a lak', text: 'Tloušťka laku na každém dílu, spáry, koroze.' },
  { icon: 'cpu', title: 'Diagnostika', text: 'Chybové paměti všech řídicích jednotek.' },
  { icon: 'wrench', title: 'Motor a převodovka', text: 'Studený start, úniky, spojka, turbo, DPF.' },
  { icon: 'disc', title: 'Podvozek a brzdy', text: 'Tlumiče, ramena, kotouče, pneumatiky.' },
  { icon: 'seat', title: 'Interiér a elektro', text: 'Opotřebení vs. nájezd, klimatizace, výbava.' },
  { icon: 'steering', title: 'Zkušební jízda', text: 'Řazení, tah, vibrace, brzdy, zvuky.' },
  { icon: 'file', title: 'Doklady', text: 'Shoda VIN, servisní knížka, STK, smlouva.' },
];

export const steps = [
  { title: 'Vyberete termín', text: 'V kalendáři zvolíte službu a čas a pošlete odkaz na inzerát.' },
  { title: 'Ověřím historii', text: 'Před výjezdem zkontroluji VIN. Když je auto podezřelé, řeknu vám to hned.' },
  { title: 'Prověřím auto', text: 'Na místě 1,5 až 2,5 hodiny. Nemusíte u toho být.' },
  { title: 'Dostanete verdikt', text: 'Telefonát z místa, protokol s fotkami ještě ten den.' },
];

export const faqs = [
  {
    q: 'Kolik stojí prověrka ojetého auta?',
    a: `Prověrka na místě stojí ${mainService.price.toLocaleString('cs-CZ')} Kč. V Olomouci a do ${site.freeRadiusKm} km je doprava zdarma, dál ${site.pricePerKm} Kč/km. Prověrka na dálku (historie, VIN, inzerát) stojí ${services[0].price} Kč.`,
  },
  {
    q: 'Musím být u prověrky osobně?',
    a: 'Nemusíte. Termín domluvím s prodejcem, výsledek vám zavolám z místa a protokol pošlu e-mailem.',
  },
  {
    q: 'Kam jezdíte?',
    a: 'Hlavně Olomoucký kraj. Běžně i Jihomoravský, Zlínský a Moravskoslezský kraj, po domluvě kamkoli.',
  },
  {
    q: 'Prověříte i auto z bazaru nebo dovezené?',
    a: 'Ano. Soukromníci, bazary i dealeři. U dovozů ověřím historii v dostupných evropských databázích.',
  },
  {
    q: 'Co když prodejce prověrku odmítne?',
    a: 'Je to varovný signál. Často pomůže, když termín domluvím přímo já a vysvětlím, jak prověrka probíhá.',
  },
  {
    q: 'Kdy se platí?',
    a: 'Až po prověrce, převodem nebo hotově. Když auto vyřadím už podle historie, platíte jen prověrku na dálku.',
  },
];

export const formatPrice = (n: number) => `${n.toLocaleString('cs-CZ').replace(/\s/g, ' ')} Kč`;
