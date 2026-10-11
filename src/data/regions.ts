// Lokality pro lokální SEO stránky /proverka-auta/<slug>/
// distanceKm = přibližná vzdálenost po silnici z Olomouce.

export type City = {
  slug: string;
  name: string;
  /** 6. pád s předložkou – „v Olomouci“ */
  locative: string;
  /** 2. pád – „Olomouce“ (pro „z okolí …“) */
  genitive: string;
  region: string;
  lat: number;
  lon: number;
  distanceKm: number;
  nearby: string[];
  intro: string;
  /** zobrazit jako samostatnou landing page */
  page: boolean;
};

export const regions = {
  olomoucky: 'Olomoucký kraj',
  jihomoravsky: 'Jihomoravský kraj',
  zlinsky: 'Zlínský kraj',
  moravskoslezsky: 'Moravskoslezský kraj',
} as const;

export const cities: City[] = [
  {
    slug: 'olomouc',
    name: 'Olomouc',
    locative: 'v Olomouci',
    genitive: 'Olomouce',
    region: regions.olomoucky,
    lat: 49.5938, lon: 17.2509,
    distanceKm: 0,
    nearby: ['Šternberk', 'Velká Bystřice', 'Hlubočky', 'Bohuňovice', 'Křelov', 'Velký Týnec'],
    intro:
      'Olomouc je naše domovská základna. Ojeté auto v Olomouci a okolí prověříme nejrychleji a bez příplatku za dopravu, ať ho prodává autobazar, nebo soukromník na sídlišti.',
    page: true,
  },
  {
    slug: 'prostejov',
    name: 'Prostějov',
    locative: 'v Prostějově',
    genitive: 'Prostějova',
    region: regions.olomoucky,
    lat: 49.4719, lon: 17.1118,
    distanceKm: 20,
    nearby: ['Kostelec na Hané', 'Konice', 'Němčice nad Hanou', 'Plumlov', 'Smržice'],
    intro:
      'Prostějov máme za humny. Prověrku ojetiny v Prostějově a na Prostějovsku zvládneme často obratem a doprava je v ceně.',
    page: true,
  },
  {
    slug: 'prerov',
    name: 'Přerov',
    locative: 'v Přerově',
    genitive: 'Přerova',
    region: regions.olomoucky,
    lat: 49.4551, lon: 17.4509,
    distanceKm: 25,
    nearby: ['Lipník nad Bečvou', 'Kojetín', 'Tovačov', 'Brodek u Přerova', 'Dřevohostice'],
    intro:
      'Přerov a Přerovsko patří k místům, kam vyjíždíme nejčastěji. Auto v Přerově proklepneme bez příplatku za dopravu.',
    page: true,
  },
  {
    slug: 'sumperk',
    name: 'Šumperk',
    locative: 'v Šumperku',
    genitive: 'Šumperka',
    region: regions.olomoucky,
    lat: 49.9653, lon: 16.9706,
    distanceKm: 55,
    nearby: ['Zábřeh', 'Mohelnice', 'Bludov', 'Postřelmov', 'Loučná nad Desnou'],
    intro:
      'Na Šumpersku se prodává hodně aut z horských oblastí, kde dostávají zabrat podvozek a spodek karoserie. Při prověrce v Šumperku se na korozi díváme o to pečlivěji.',
    page: true,
  },
  {
    slug: 'jesenik',
    name: 'Jeseník',
    locative: 'v Jeseníku',
    genitive: 'Jeseníku',
    region: regions.olomoucky,
    lat: 50.2294, lon: 17.2047,
    distanceKm: 90,
    nearby: ['Zlaté Hory', 'Javorník', 'Mikulovice', 'Lipová-lázně', 'Česká Ves'],
    intro:
      'Auta z Jesenicka mají za sebou horské zimy, sůl a stoupání. Při prověrce v Jeseníku proto dáváme důraz na korozi, brzdy, spojku a pohon 4×4.',
    page: true,
  },
  {
    slug: 'hranice',
    name: 'Hranice',
    locative: 'v Hranicích',
    genitive: 'Hranic',
    region: regions.olomoucky,
    lat: 49.5480, lon: 17.7347,
    distanceKm: 40,
    nearby: ['Lipník nad Bečvou', 'Potštát', 'Drahotuše', 'Teplice nad Bečvou'],
    intro:
      'Hranice leží na křižovatce cest na Ostravu i Zlín. Ojetinu v Hranicích a na Hranicku prověříme rychle a za férovou dopravu.',
    page: true,
  },
  {
    slug: 'brno',
    name: 'Brno',
    locative: 'v Brně',
    genitive: 'Brna',
    region: regions.jihomoravsky,
    lat: 49.1951, lon: 16.6068,
    distanceKm: 78,
    nearby: ['Modřice', 'Kuřim', 'Šlapanice', 'Rosice', 'Blansko', 'Židlochovice'],
    intro:
      'Brno je největší trh s ojetinami na Moravě. Tolik nabídek znamená i hodně aut s upraveným nájezdem. Prověrku v Brně a okolí běžně spojujeme s více auty v jeden den.',
    page: true,
  },
  {
    slug: 'vyskov',
    name: 'Vyškov',
    locative: 've Vyškově',
    genitive: 'Vyškova',
    region: regions.jihomoravsky,
    lat: 49.2775, lon: 16.9990,
    distanceKm: 50,
    nearby: ['Bučovice', 'Slavkov u Brna', 'Rousínov', 'Ivanovice na Hané'],
    intro:
      'Vyškov je na dálnici D1 kousek od Olomouce, takže prověrka ojetého auta ve Vyškově je rychlá a cenově příjemná.',
    page: true,
  },
  {
    slug: 'zlin',
    name: 'Zlín',
    locative: 've Zlíně',
    genitive: 'Zlína',
    region: regions.zlinsky,
    lat: 49.2265, lon: 17.6707,
    distanceKm: 70,
    nearby: ['Otrokovice', 'Vizovice', 'Fryšták', 'Napajedla', 'Slušovice'],
    intro:
      'Ve Zlíně a okolí prověřujeme auta od soukromníků i bazarů. Termín ve Zlíně se dá obvykle spojit s dalšími prověrkami ve Zlínském kraji.',
    page: true,
  },
  {
    slug: 'kromeriz',
    name: 'Kroměříž',
    locative: 'v Kroměříži',
    genitive: 'Kroměříže',
    region: regions.zlinsky,
    lat: 49.2979, lon: 17.3931,
    distanceKm: 45,
    nearby: ['Hulín', 'Holešov', 'Chropyně', 'Bystřice pod Hostýnem', 'Morkovice'],
    intro:
      'Kroměříž leží jen kousek za hranicí Olomouckého kraje. Prověrka ojetiny v Kroměříži a na Kroměřížsku je pro nás běžná trasa.',
    page: true,
  },
  {
    slug: 'ostrava',
    name: 'Ostrava',
    locative: 'v Ostravě',
    genitive: 'Ostravy',
    region: regions.moravskoslezsky,
    lat: 49.8209, lon: 18.2625,
    distanceKm: 95,
    nearby: ['Havířov', 'Frýdek-Místek', 'Opava', 'Karviná', 'Nový Jičín'],
    intro:
      'Do Ostravy to máme po D1 necelou hodinu. Prověrku auta v Ostravě se vyplatí objednat i kvůli široké nabídce dovezených vozů s nejasnou historií.',
    page: true,
  },
  // Další body na mapě (bez vlastní stránky)
  { slug: 'litovel', name: 'Litovel', locative: 'v Litovli', genitive: 'Litovle', region: regions.olomoucky, lat: 49.7012, lon: 17.0762, distanceKm: 22, nearby: [], intro: '', page: false },
  { slug: 'unicov', name: 'Uničov', locative: 'v Uničově', genitive: 'Uničova', region: regions.olomoucky, lat: 49.7709, lon: 17.1214, distanceKm: 27, nearby: [], intro: '', page: false },
  { slug: 'zabreh', name: 'Zábřeh', locative: 'v Zábřehu', genitive: 'Zábřehu', region: regions.olomoucky, lat: 49.8826, lon: 16.8722, distanceKm: 45, nearby: [], intro: '', page: false },
  { slug: 'uherske-hradiste', name: 'Uherské Hradiště', locative: 'v Uherském Hradišti', genitive: 'Uherského Hradiště', region: regions.zlinsky, lat: 49.0698, lon: 17.4597, distanceKm: 80, nearby: [], intro: '', page: false },
  { slug: 'opava', name: 'Opava', locative: 'v Opavě', genitive: 'Opavy', region: regions.moravskoslezsky, lat: 49.9387, lon: 17.9026, distanceKm: 90, nearby: [], intro: '', page: false },
];

export const pageCities = cities.filter((c) => c.page);

export const travelPrice = (km: number, free: number, perKm: number) => (km <= free ? 0 : km * perKm);
