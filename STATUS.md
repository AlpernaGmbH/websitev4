# STATUS

Stand: 05.10.2026. Repo `AlpernaGmbH/websitev4`, Vercel-Projekt `websitev4`. Spec und Plan: `docs/superpowers/`.

## Geprüft (05.10.2026)
- 53 Unit-Tests und 40 End-to-End-Tests (20 Fälle auf Desktop und Handy) grün. Der Check-Ablauf ist mit gemockter Analyse getestet, es entstehen dabei keine echten Leads und keine KI-Kosten.
- Lighthouse mobil, lokal, Produktions-Build: Performance 92, Accessibility 100, Best Practices 100. SEO 69, allein wegen `noindex` (wird mit `NEXT_PUBLIC_INDEXABLE=1` zu 100).
- Sichtprüfung aller Abschnitte bei 1280, 768 und 375 px (`node scripts/shots.mjs <Ordner>`).
- Vercel-Build erfolgreich (READY).

## Nicht geprüft
- **Die Seite auf Vercel selbst.** Die Vorschau liegt hinter dem Vercel-Login, der Zugang über die Schnittstelle wurde mit 403 abgelehnt. Bitte `https://websitev4-website-dbed.vercel.app` im Browser öffnen.
- **Die echte KI-Einschätzung.** Lokal gibt es keinen Gateway-Zugang. Der Code läuft gegen eine simulierte KI und fällt bei jedem Fehler sauber auf «Ergebnis ohne KI-Abschnitt» zurück. Ob das Gateway auf Vercel antwortet (Guthaben, Modell `mistral/mistral-large-3`), zeigt der erste echte Check. Im Zweifel in den Laufzeit-Logs nach «check ok mit ki» oder «ohne ki» suchen.
- **Der Versand an n8n** (Kontaktformular und Check-Lead). `N8N_WEBHOOK_URL` ist in Vercel gesetzt, es wurde aber bewusst kein Test-Lead ausgelöst, damit keine Mail und kein Eintrag im Notion CRM entstehen.

## Fertig
- One-Pager: Header, Hero (Termin buchen, Gratis Marketing-Check), Belege, Marketing-Check, Leistungen, Ablauf, Referenzen, Über uns, FAQ, Kontakt, Footer. Alles in Du-Form.
- Marketing-Check: Eingaben, «Check generieren», Popup mit E-Mail-Pflicht (Analyse läuft währenddessen), Ergebnis auf der Seite. Lead geht an den n8n-Webhook (Mail an kontakt@alperna.ch, Notion Sales CRM).
- KI-Einschätzung der Marke über das Vercel AI Gateway, mit Prüfung der Antwort. Ohne KI-Zugang erscheint das Ergebnis ohne diesen Abschnitt.
- Termin-Dialog (Calendly, lädt erst beim Öffnen). Kontaktformular mit Honigtopf und optionaler Rückrufnummer.
- Impressum und Datenschutz als Entwurf, mit sichtbarem Hinweis.
- Seite ist `noindex`. Keine Cookies, kein Tracking.

## Offen vor dem Go-live
- **Impressum und Datenschutz juristisch prüfen.** Aktuell Entwurf auf Basis der alten Texte, angepasst auf Vercel, Marketing-Check mit KI, Calendly und n8n/Notion.
- **Vercel Pro.** Der Hobby-Plan ist laut Nutzungsbedingungen nicht für gewerbliche Seiten gedacht.
- **Domain-Umstellung** von Framer auf Vercel (DNS), danach `NEXT_PUBLIC_INDEXABLE=1` setzen und Search Console prüfen. alperna.ch zeigt bis dahin weiter auf Framer.
- **Vercel Deployment Protection:** Neue Projekte sind standardmässig hinter dem Vercel-Login. Für einen Link an Dritte in den Projekteinstellungen ausschalten.
- **KI-Zugang prüfen.** Das AI Gateway braucht auf Vercel gekauftes Guthaben (siehe `marketing-tool`, Entscheid 56: ca. 5 Franken im Monat). Obergrenze pro Serverinstanz: `KI_TAGESLIMIT` (Standard 200 pro Tag).
- **Marketing-Check mit drei echten Betrieben testen**, mit und ohne KI.
- **Zitate** stehen ohne Personennamen (wie auf der alten Seite). Mit Namen und Freigabe wirken sie stärker.
- Der Check begrenzt pro IP auf 6 Läufe in 10 Minuten, pro Serverinstanz. Für eine zentrale Zählung braucht es einen gemeinsamen Speicher (z. B. Upstash).
- Engine `lib/marketing-check/analyzer.mjs` ist eine Kopie aus `AlpernaGmbH/tool`. Änderungen dort müssen von Hand nachgezogen werden.

## Befund zur alten Seite (Grund für die Neugestaltung)
Widersprüchliche Zahlen (28 oder 21 Partner, 3 oder 6 Jahre Erfahrung, «100 % zufriedene Kunden»), Hype-Zahlen ohne Einordnung, Zitate ohne Person, ein Kundenlogo mit Link auf eine 404-Seite, kein Telefon. Alle Fakten stehen jetzt an einer Stelle: `lib/site.ts`.

## Befehle
`npm run dev`, `npm test`, `npm run test:e2e`, `npm run check` (Typprüfung, Tests, Build).
