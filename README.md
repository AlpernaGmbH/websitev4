# alperna.ch · One-Pager

Neue Website der Alperna GmbH: ein ruhiger One-Pager mit den Handlungen «Termin buchen» und «Gratis Marketing-Check».
Next.js (App Router), TypeScript, reines CSS. Stand, offene Punkte und Entscheidungen stehen in [STATUS.md](STATUS.md), Spec und Plan unter `docs/superpowers/`.

```bash
npm install
npm run dev          # Entwicklung
npm run check        # Typprüfung, Unit-Tests, Build
npm run test:e2e     # End-to-End (erst `npm run build`), nutzt den installierten Google Chrome
node scripts/shots.mjs <Ordner>   # Screenshots aller Abschnitte bei drei Breiten
```

Umgebungsvariablen: siehe `.env.example`. Fakten (Zahlen, Preise, Adresse) stehen an einer Stelle: `lib/site.ts`. Texte: `lib/content.ts`.
