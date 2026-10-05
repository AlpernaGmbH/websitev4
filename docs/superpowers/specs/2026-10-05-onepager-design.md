# alperna.ch One-Pager: Design

Stand: 05.10.2026. Freigegeben im Chat am 05.10.2026.

## Ziel

Die heutige Website (Framer) wirkt für 50- bis 60-jährige Schweizer Inhaber unglaubwürdig. Neu entsteht ein One-Pager, der Vertrauen aufbaut und zwei Handlungen auslöst: **Termin buchen** und **Gratis Marketing-Check**. Beide stehen im Hero.

Zielgruppe: Inhaber und Geschäftsführer von KMU in der Ostschweiz, 50 bis 60 Jahre.

## Entscheidungen

| Thema | Entscheidung |
|---|---|
| Anrede | **Du** (Entscheid von Andrej, 05.10.2026) |
| Marketing-Check | Alle Eingaben, «Generieren», Popup mit **E-Mail-Pflicht**, danach Ergebnis auf der Seite |
| Inhalte | Alles von www.alperna.ch darf gezeigt werden (Projekte, Logos, Zitate, Fotos) |
| Teamfotos | von alperna.ch |
| Impressum, Datenschutz | Entwurf, vor Go-live juristisch prüfen |
| Domain | alperna.ch bleibt auf Framer, bis Andrej die Umstellung ausdrücklich freigibt |
| Hosting | Vercel (neues Projekt `alperna-ch`), Repo `AlpernaGmbH/alperna-ch` |

## Warum die heutige Seite unglaubwürdig wirkt (Befund)

- Widersprüchliche Zahlen: «28 Partner» (Hero), «21 Partner» (Über uns), «100 % zufriedene Kunden», «6 Jahre Praxiserfahrung» gegen «seit drei Jahren».
- Hype-Zahlen ohne Einordnung («175M Aufrufe», «25’000 Beiträge»).
- Zitate ohne Person, Kundenlogo mit Link auf eine 404-Seite.
- Kein Telefon («Anrufe nehmen wir leider nicht entgegen»), Vorlagen-Optik.

Gegenmassnahmen: eine Quelle für alle Fakten (`lib/site.ts`, vom Team am 04.10.2026 bestätigt: 28 Partner, 3 Jahre), Zahlen nur mit Einordnung, echte Gesichter, Adresse und UID sichtbar, Preise genannt, Referenzen mit Name, Branche und Zahl, ruhige Gestaltung.

## Aufbau

1. Header mit festem Button «Termin buchen»
2. Hero: Nutzen in Alltagssprache, Buttons «Termin buchen» (primär) und «Gratis Marketing-Check» (sekundär), Foto der Gründer, Vertrauenszeile
3. Belegleiste: überprüfbare Fakten
4. Marketing-Check (dunkler Abschnitt)
5. Leistungen: Website, Google-Profil, Social Media, dazu eine Zeile «auf Anfrage»
6. Ablauf in vier Etappen
7. Referenzen: ausgewählte Fälle mit Zahlen, Zitate mit Namen des Betriebs, Logoleiste
8. Über uns: Porträts, ehrliche Antwort auf «zu jung?», Einblicke
9. FAQ
10. Kontakt: Termin, WhatsApp, E-Mail, Formular, Adresse
11. Footer. Impressum und Datenschutz als eigene Seiten

## Look

Hell und ruhig. Papierton als Fläche, Alperna-Tiefblau als Text, Gold nur als einzelner Akzent (Markierung, Nummern, Fokus), nie als Fläche. Überschriften in Instrument Serif, Fliesstext Montserrat mit 19 px (mobil 18 px), Zeilenhöhe 1.65, Kontrast AAA im Fliesstext. Buttons mindestens 52 px hoch. Der Marketing-Check-Abschnitt ist dunkel (Tiefblau), alles andere hell.

Palette aus dem Alperna Design System (`#121110`, `#FDFBFB`, `#FFD700`, `#111A28`, `#1B2740`, `#26324A`). Einzige Abweichung: Serifenschrift für Überschriften statt Poppins.

## Marketing-Check: Ablauf

1. Besucher füllt Firma, Ort, Branche, Website (Pflicht: Firma, Branche, Website) und optional Social-Kanäle aus.
2. «Check generieren»: Die Analyse startet **sofort** im Hintergrund (`POST /api/check`), gleichzeitig öffnet sich das Popup.
3. Popup: E-Mail und Datenschutz-Checkbox, Hinweis «nur für dieses Ergebnis, kein Newsletter, keine Weitergabe». Daneben der Fortschritt der Analyse.
4. Sind E-Mail und Analyse da, schliesst das Popup und das Ergebnis erscheint inline: Gesamtnote, Kategorien, Befunde, ein Vorschlag für den nächsten Baustein, Button «Termin buchen».
5. Lead: genau ein `POST /api/lead` mit E-Mail und Kurzergebnis, sobald das Ergebnis oder ein Fehler feststeht (Fallback beim Schliessen der Seite). Weiterleitung an den bestehenden n8n-Webhook (Mail an kontakt@alperna.ch, Eintrag im Notion Sales CRM).
6. Schliesst der Besucher das Popup ohne E-Mail, wird die Analyse abgebrochen und das Formular bleibt ausgefüllt.

Fehlerfälle: Analyse schlägt fehl → verständliche Meldung, Hinweis auf Termin und Kontakt, E-Mail wird trotzdem als Lead gesendet. Zu viele Anfragen (429) → eigene Meldung.

## Technik

- Next.js (App Router), TypeScript, reines CSS mit Tokens. Keine Tracking-Skripte, keine Cookies.
- Schriften über `next/font` (selbst gehostet), Bilder als WebP über `next/image`.
- Routen: `/` (One-Pager), `/impressum`, `/datenschutz`, `/api/check`, `/api/lead`, `/api/kontakt`.
- `/api/check` leitet geprüfte Eingaben an die bestehende Analyse in `alperna-tool` weiter (`CHECK_API_URL`), begrenzt pro IP.
- `/api/kontakt` und `/api/lead` senden an `N8N_WEBHOOK_URL`. Ohne Konfiguration antworten sie mit 503 statt scheinbar zu funktionieren.
- «Termin buchen» öffnet Calendly als Dialog (iframe, wird erst beim Öffnen geladen), mit Link «In neuem Tab öffnen» als Rückfall.
- Vorschau auf Vercel mit `noindex`. Indexierung erst über `NEXT_PUBLIC_INDEXABLE=1` beim Go-live.
- Tests: Playwright (Seite, Buttons, kompletter Check-Ablauf mit simulierter Analyse, E-Mail-Pflicht, Kontaktformular), Typprüfung, Build. Lighthouse mobil. Sichtprüfung bei 375, 768 und 1280 px.

## Offen für Go-live (nicht Teil dieses Auftrags)

- Impressum und Datenschutz juristisch prüfen.
- Vercel Pro (Hobby ist nicht für gewerbliche Nutzung vorgesehen).
- Domain-Umstellung von Framer: DNS, `NEXT_PUBLIC_INDEXABLE=1`, Search Console.
- Zitate waren auf der Live-Seite ohne Namen. Wenn Kunden einer Namensnennung zustimmen, wirkt das stärker.
- Marketing-Check mit drei echten Betrieben testen.
