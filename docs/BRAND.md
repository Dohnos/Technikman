# Proklepto – brand manuál v1.0

Webová verze s ukázkami: `/brand/`.

## Název a myšlenka
**Proklepto** vychází z „proklepnout“: důkladně prověřit, než se rozhodnete. Značka působí jako dobrý technik. Je přesná, přátelská a stojí na straně zákazníka.

**Claim:** *Ojetinu nejdřív proklepneme.*

## Logo
- **Značka:** písmeno „P“, jehož bříško tvoří lupa a nožička rukojeť. Uvnitř lupy je zelená fajfka, tedy výsledek „v pořádku“.
- **Podklad:** zaoblený čtverec, radius 28 % (18/64).
- **Logotyp:** `proklepto` malými písmeny, Bricolage Grotesque ExtraBold (800), prostrkání −4 %.
- **Ochranná zóna:** ¼ šířky značky. **Minimální velikost:** 24 px.
- **Varianty:** tmavá značka na světlém pozadí, bílá značka na tmavém nebo oranžovém pozadí, jednobarevná.
- Soubor: `public/favicon.svg` (vektor), `public/icon-512.png`.

## Barvy
| Název | HEX | Použití |
| --- | --- | --- |
| Signál | `#FF5A1F` | primární akce, zvýraznění, značka |
| Asfalt | `#101828` | text, tmavé prvky, podklad loga |
| Kontrola | `#17C98A` | úspěch, „v pořádku“, fajfka |
| Noc | `#0B1220` | tmavé sekce, patička |
| Křída | `#F7F5F0` | pozadí stránky |
| Jantar | `#FFB020` | doplňková barva, přechody |

Poměr: 60 % Křída/bílá · 25 % Asfalt/Noc · 10 % Signál · 5 % Kontrola.

## Typografie
- **Nadpisy:** Bricolage Grotesque, 700–800, letter-spacing −3,5 %, line-height 1.05.
- **Text:** Inter, 400–650, základ 17 px, line-height 1.6.

## Ikony
Vlastní sada 24 × 24 px, tah 1,75 px, kulaté konce a spoje (`src/components/Icon.astro`). V odznacích 52 px s radiusem 16 px a tónovaným pozadím.

## Tvary a pohyb
- Zaoblení: 12 / 20 / 28 / 40 px, tlačítka a štítky jako „pilulka“.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`, u hoveru jemná pružina `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Animace mají smysl: sken, odhalení a fajfka. Vždy respektují `prefers-reduced-motion`.

## Tón komunikace
- ✓ Krátce a jasně. „Tohle auto nekupujte.“
- ✓ Lidskou řečí, technické pojmy vysvětlit.
- ✓ Sebevědomě, ale bez strašení.
- ✕ Žádné superlativy a prázdné fráze.
- ✕ Nikdy neslibovat, co nejde ověřit.
