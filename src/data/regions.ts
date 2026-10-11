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
      'Olomouc je moje základna. Auto v Olomouci a okolí prověřím nejrychleji a bez příplatku za dopravu, ať ho prodává bazar, nebo soukromník.',
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
      'Prostějov je 20 minut od Olomouce. Doprava je v ceně a termín se obvykle najde do pár dnů.',
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
      'Do Přerova a okolí jezdím často. Doprava je v ceně prověrky.',
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
      'Auta ze Šumperska často jezdí v horách. Při prověrce se proto víc dívám na korozi, podvozek a brzdy.',
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
      'Auta z Jesenicka mají za sebou horské zimy a sůl. Víc se zaměřuji na korozi, brzdy, spojku a pohon 4×4.',
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
      'Hranice jsou kousek po D1. Prověrku na Hranicku zvládnu rychle a za rozumnou dopravu.',
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
      'V Brně je největší nabídka ojetin na Moravě, a s ní i nejvíc aut s upraveným nájezdem. Prověrky v Brně často spojuji, takže se dělí i doprava.',
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
      'Vyškov je po D1 kousek od Olomouce. Prověrka tu vychází rychle i cenově.',
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
      'Do Zlína a okolí jezdím pravidelně. Termín často spojím s dalšími prověrkami ve Zlínském kraji.',
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
      'Kroměříž je hned za hranicí Olomouckého kraje, běžná trasa.',
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
      'Do Ostravy je to po D1 necelá hodina. U dovezených aut ověřuji historii v evropských databázích.',
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
