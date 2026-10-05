# alperna.ch: Konzept «Nähe»

Stand: 05.10.2026. Ersetzt `2026-10-05-onepager-design.md` im Gestalterischen (Look, Aufbau, Texte). Marketing-Check, API und Technik bleiben wie dort beschrieben.

## Warum neu
Der erste Bau übernahm Look, Texte und Aufbau der bestehenden Vercel-Seite (`websitev2`). Andrej wollte ein eigenständiges, sehr vertrauenswürdiges Design, an dem man sofort sieht: Die sind von hier.

## Entscheidungen (Andrej, 05.10.2026)
- Richtung: Mix aus «Nachbarn» (Nähe zuerst) und «Der Brief» (Persönlichkeit). Der Brief gehört zu «Über uns», sonst eine normale Website.
- **Headline normal und sachlich**, die Aussage trägt die Karte: «Website, Google-Profil und Social Media für Betriebe in der Ostschweiz.»
- **Hero bleibt wie im Entwurf**, aber ohne Radar-Ringe und ohne Entfernungs-Eingabe. Weniger Bewegung: Linien zeichnen sich einmal, Markierungen erscheinen nacheinander, sonst ruht die Karte.
- **Markenfarbe Gelb** (`#FFD700`) statt Grün: Handlungen, Haken, Nummern, Hervorhebungen. Tiefblau (`#111A28`) für Text und Markierungen.
- Du-Form. Auf der Karte erscheinen Projekte, nicht ein Entfernungsrechner.

## Die Karte
- Echte Geodaten (swisstopo über das npm-Paket `swiss-maps`, Jahr 2024, weil nur dort Gemeindenamen stehen). Ausschnitt Appenzell, St. Gallen, Bodensee, Rheintal. Erzeugt mit `scripts/karte/geo.mjs` nach `lib/karte.json`.
- Sieben Betriebe, nummeriert nach Entfernung von Speicher: BC Trogen Speicher (Trogen), IFJ Startup Helper (St. Gallen), Gewerbeverband AR (Teufen, Sommerkonferenz), Regina Massagen (Haslen AI), Stiftung Wirtschaftsförderung AR (Herisau, Handelsregistersitz), Beyond Borders (Ebenalp), Gustav Kahn (Romanshorn). Quellen der Orte in `lib/karte-projekte.ts`.
- Markierungen und Beschriftungen sind HTML über dem SVG, damit sie auf jedem Gerät gleich gross und lesbar sind. Auf dem Handy zeigt ein hochformatiger Ausschnitt die Karte (`MOBIL`).
- Wer wählt (Maus, Tastatur, Antippen), sieht Name, Ort, Entfernung und was wir gemacht haben in der Info-Leiste.
- Kartenquelle im Footer: swisstopo.

## Aufbau
Header, Hero (Karte), Fakten, Marketing-Check (gelbes Band), Leistungen, Referenzen, Ablauf, Über uns (Brief, Porträts, Einblicke), FAQ, Kontakt, Footer.

## Gestaltung
Schrift Atkinson Hyperlegible Next (für beste Lesbarkeit entwickelt), Caveat nur für die Unterschrift. Fliesstext 19 px, mobil 18 px, Buttons mindestens 48 px, Markierungen mit 40 px Trefferfläche. Warmes Papier und Sandton als Flächen.

## Offen
- Orte weiterer Kunden (z. B. Appenzellerland Sport, Fahrschule Amno, Gewerbeverein Waldstatt, Appartement Romanshorn) und ob sie gezeigt werden dürfen.
- Stiftung Wirtschaftsförderung AR: Status in der Kundenliste prüfen (im CRM am 15.09. noch «kontaktiert»).
