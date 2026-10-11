// ─────────────────────────────────────────────────────────────
//  Rezervace termínu
//  Teď běží vestavěný kalendář. Až budete mít externí službu
//  (Reservio, Cal.com, Calendly, Google Calendar…), stačí přepnout
//  `provider` na 'embed' a vložit odkaz do `embedUrl`.
// ─────────────────────────────────────────────────────────────

export const booking = {
  provider: 'internal' as 'internal' | 'embed',
  /** URL pro vložení externího kalendáře (iframe), použije se při provider: 'embed' */
  embedUrl: '',

  /**
   * Kam odeslat rezervaci. Prázdné = otevře se e-mail s vyplněnou rezervací.
   * Funguje s Formspree, Web3Forms, Basin apod. (POST, FormData).
   */
  endpoint: '',

  /** Kolik dní dopředu jde rezervovat */
  daysAhead: 30,
  /** Minimální předstih v hodinách */
  minNoticeHours: 16,
  /** Pracovní dny: 0 = neděle, 1 = pondělí … 6 = sobota */
  workdays: [1, 2, 3, 4, 5, 6],
  /** Časy začátku prověrky. Klíč = den v týdnu, `default` pro ostatní. */
  slots: {
    default: ['08:00', '10:30', '13:00', '15:30'],
    6: ['09:00', '11:30'],
  } as Record<string, string[]>,
  /** Zavřeno – dovolená apod. (YYYY-MM-DD). České svátky se počítají automaticky. */
  closed: [] as string[],
  /** Již obsazené termíny (YYYY-MM-DD HH:MM) – ruční blokace, než bude napojený kalendář */
  taken: [] as string[],

  confirmText: 'Termín potvrdím telefonicky, obvykle do 2 hodin v pracovní době.',
};
