// Alle Texte der Seite. Du-Form, Schweizer Schreibweise. Zahlen kommen aus lib/site.ts, nie von Hand.
import { chf } from '@/lib/format'
import { jahreText, site } from '@/lib/site'

const partner = site.partnerAnzahl
const ort = `${site.address.city} ${site.address.canton}`

export const meta = {
  title: 'Digitaler Auftritt für Ostschweizer KMU | Alperna GmbH',
  description: 'Website, Google-Profil und Social Media aus einer Hand. Wir sorgen dafür, dass Ostschweizer KMU online gefunden werden und Anfragen bekommen.',
}

export const nav = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Referenzen', href: '#referenzen' },
  { label: 'Über uns', href: '#ueber-uns' },
  { label: 'Fragen', href: '#fragen' },
  { label: 'Kontakt', href: '#kontakt' },
]

export const hero = {
  eyebrow: `Alperna GmbH · ${ort}`,
  h1: 'Website, Google-Profil und Social Media für Betriebe in der Ostschweiz.',
  lead: 'Zwei Gründer aus Speicher. Du erreichst uns persönlich, und wir kommen gerne bei dir im Betrieb vorbei.',
  termin: 'Termin buchen',
  terminHinweis: 'Kostenloses Erstgespräch, 30 Minuten',
  check: 'Gratis Marketing-Check',
  checkHinweis: 'Ergebnis in etwa einer Minute',
  vertrauen: ['Persönlich betreut, keine Hotline', 'Keine langen Verträge', `Antwort ${site.antwortZeit}`],
  kartenTitel: 'Betriebe aus der Region, mit denen wir arbeiten',
  kartenHinweis: 'Tippe auf eine Markierung, um mehr zu sehen.',
}

export const fakten = [
  { wert: String(partner), label: 'Partner, mit denen wir gearbeitet haben' },
  { wert: `${site.seitJahren} Jahre`, label: 'Erfahrung mit digitalen Auftritten' },
  { wert: `ab ${chf(site.preise.websiteAb)}`, label: 'für eine Website, der Richtpreis steht vorab fest' },
  { wert: ort, label: `Sitz der Alperna GmbH, ${site.address.street}` },
]

export const check = {
  id: 'check',
  eyebrow: 'Gratis Marketing-Check',
  h2: 'Wie gut wird dein Betrieb online gefunden?',
  lead: 'Wir prüfen deine Website, dein Google-Profil und deine Social-Media-Kanäle. Danach schreibt eine KI eine ehrliche Einschätzung deiner Marke. Das dauert etwa eine Minute und kostet nichts.',
  punkte: ['Wir prüfen nur, was öffentlich sichtbar ist.', 'Das Ergebnis siehst du direkt hier auf der Seite.', 'Danach entscheidest du, ob du mit uns sprechen möchtest.'],
  formular: {
    betrieb: 'Dein Betrieb',
    firma: 'Name deines Betriebs',
    ort: 'Ort',
    branche: 'Branche',
    brancheWaehlen: 'Bitte wählen',
    website: 'Website',
    websiteHinweis: 'zum Beispiel www.meinbetrieb.ch',
    social: 'Social Media',
    optional: 'freiwillig',
    socialHinweis: 'Kanäle, die auf deiner Website verlinkt sind, finden wir selbst. Hier kannst du weitere eintragen und schätzen, wie oft du postest.',
    kanalAdresse: 'Adresse oder Name',
    haeufigkeit: 'Wie oft postest du?',
    haeufigkeitWaehlen: 'Bitte wählen',
    start: 'Check generieren',
    hinweis: 'Kostenlos und unverbindlich. Im nächsten Schritt brauchen wir deine E-Mail-Adresse, damit wir dir das Ergebnis zeigen können.',
    pflicht: 'Bitte fülle die markierten Felder aus.',
  },
  branchen: [
    ['gastro', 'Gastronomie, Restaurant, Café'],
    ['hotel', 'Hotel, Ferienwohnung, B&B'],
    ['beauty', 'Coiffeur, Kosmetik, Beauty'],
    ['health', 'Gesundheit, Praxis, Therapie'],
    ['fitness', 'Fitness, Sport, Kurse'],
    ['retail', 'Detailhandel, Laden'],
    ['producer', 'Produktion, Manufaktur, Hofladen'],
    ['craft', 'Handwerk, Bau, Garten'],
    ['b2b', 'Beratung, Dienstleistung (B2B)'],
    ['realestate', 'Immobilien, Treuhand'],
    ['auto', 'Garage, Auto, Mobilität'],
    ['other', 'Andere Branche'],
  ] as [string, string][],
  netze: [
    ['instagram', 'Instagram'],
    ['facebook', 'Facebook'],
    ['linkedin', 'LinkedIn'],
    ['tiktok', 'TikTok'],
    ['youtube', 'YouTube'],
  ] as [string, string][],
  haeufigkeit: [
    ['none', 'Gar nicht'],
    ['rare', 'Seltener als monatlich'],
    ['monthly', 'Etwa monatlich'],
    ['weekly', 'Etwa wöchentlich'],
    ['several', 'Mehrmals pro Woche'],
  ] as [string, string][],
  popup: {
    titel: 'Fast geschafft. Wohin dürfen wir dein Ergebnis zeigen?',
    lead: 'Gib deine E-Mail-Adresse ein, dann siehst du dein Ergebnis. Wir nutzen sie nur für dieses Ergebnis und eine persönliche Rückmeldung von uns. Kein Newsletter, keine Weitergabe.',
    email: 'E-Mail-Adresse',
    emailPlatzhalter: 'name@betrieb.ch',
    emailFehler: 'Bitte gib eine gültige E-Mail-Adresse an.',
    einwilligung: 'Ich bin einverstanden, dass Alperna meine Angaben dafür verwendet.',
    einwilligungLink: 'Datenschutz',
    einwilligungFehler: 'Bitte bestätige die Einwilligung, damit wir dir das Ergebnis zeigen können.',
    button: 'Ergebnis anzeigen',
    warten: 'Wir zeigen dein Ergebnis, sobald die Analyse fertig ist.',
    abbrechen: 'Abbrechen',
    schliessen: 'Schliessen',
    fehlerTitel: 'Die Analyse hat nicht geklappt',
    laeuftTitel: 'Deine Analyse läuft bereits',
    schritte: ['Website laden', 'Technik und Suchmaschinen prüfen', 'Google-Profil und Social Media abgleichen', 'Marke einschätzen'],
    fertig: 'Analyse fertig',
  },
  ergebnis: {
    fuer: 'Ergebnis für',
    titel: 'Deine Online-Sichtbarkeit',
    von: 'von 100',
    stark: 'Starke Basis. Mit gezielten Schritten holst du noch mehr heraus.',
    mittel: 'Solide Ansätze, aber da ist noch Luft. Wir zeigen dir, wo.',
    schwach: 'Hier liegt viel Luft nach oben. Wir zeigen dir, wo du am meisten gewinnst.',
    kiTitel: 'Einschätzung deiner Marke',
    kiHinweis: 'Von einer KI geschrieben, auf Basis der Messwerte und des öffentlichen Textes deiner Startseite. Sie ersetzt kein Gespräch.',
    kiStaerken: 'Das gelingt schon',
    kiLuecken: 'Das fällt auf',
    kiSchritte: 'Hier würden wir anfangen',
    keineKi: 'Die KI-Einschätzung war gerade nicht verfügbar. Die Messwerte stehen unten. Im Gespräch schauen wir sie gemeinsam an.',
    messwerte: 'Die Messwerte im Einzelnen',
    selbstangabe: 'Selbstangabe',
    nichtGeprueft: 'Nicht automatisch geprüft',
    ok: 'In Ordnung',
    weitereOk: 'weitere Punkte in Ordnung',
    allesOk: 'Alle Punkte in Ordnung',
    luecke: 'Verbesserungspotenzial',
    naechsterBaustein: 'Dein nächster Baustein',
    keinBaustein: 'Gemeinsam anschauen',
    keinBausteinText: 'Dein Auftritt steht auf einer soliden Basis. Wenn du magst, schauen wir im Gespräch gemeinsam, was als Nächstes am meisten bringt.',
    grund: 'Hier liegt bei dir die grösste Lücke. Mit einem Baustein nach dem anderen kommst du am schnellsten voran.',
    grenze: 'Der Check liest nur öffentlich sichtbare Informationen und ersetzt kein Gespräch. Einzelne Punkte, etwa dein Google-Profil, prüfen wir im Erstgespräch persönlich.',
    termin: 'Ergebnis im Gespräch besprechen',
    nochmal: 'Weitere Website prüfen',
  },
  fehler: {
    allgemein: 'Die Analyse hat nicht geklappt. Prüfe die Website-Adresse oder versuche es in ein paar Minuten nochmals.',
    zuOft: 'Du hast den Check ein paarmal gestartet. Versuch es in zehn Minuten nochmals.',
    direkt: 'Du kannst uns auch direkt schreiben. Wir prüfen deinen Auftritt dann persönlich.',
    senden: 'Das Senden hat nicht geklappt. Bitte versuche es nochmals.',
  },
}

export const leistungen = {
  id: 'leistungen',
  eyebrow: 'Leistungen',
  h2: 'Drei Dinge, die wir richtig machen',
  lead: 'Wir beginnen meistens mit der Website. Danach schlagen wir dir immer nur den nächsten Schritt vor, und nur, wenn er dir etwas bringt.',
  karten: [
    {
      titel: 'Website',
      versprechen: 'Eine Website, die auf dem Handy gut aussieht und dir Anfragen bringt.',
      punkte: ['Texte und Aufbau, die zu deinen Kunden passen', 'Eigene Fotos statt Stockbilder, auf Wunsch mit Shooting bei dir', 'Kontakt, WhatsApp und Terminbuchung gleich eingebaut'],
      preis: `ab ca. ${chf(site.preise.websiteAb)}`,
      preisZusatz: `mit Fotoshooting ca. ${chf(site.preise.websiteMitShooting)}`,
    },
    {
      titel: 'Google-Profil',
      versprechen: 'Damit du bei Google und auf Maps richtig auftauchst, wenn jemand in der Nähe nach dir sucht.',
      punkte: ['Profil einrichten oder aufräumen', 'Öffnungszeiten, Leistungen und Fotos aktuell halten', 'Bewertungen beantworten'],
      preis: 'Preis im Gespräch',
      preisZusatz: 'wenig Aufwand, grosse Wirkung',
    },
    {
      titel: 'Social Media',
      versprechen: 'Beiträge und Videos, die nach deinem Betrieb aussehen und nicht nach Vorlage.',
      punkte: ['Wir planen, filmen und posten vor Ort bei dir', 'Du siehst vorher, was online geht', 'Auf Wunsch übernehmen wir alles'],
      preis: `Einzelner Beitrag ab ${chf(site.preise.einzelbeitrag)}`,
      preisZusatz: 'laufende Betreuung nach Absprache',
    },
  ],
  weitere: 'Auf Anfrage machen wir auch Onlineshops, Online-Buchung und Google Ads. Das schlagen wir nur vor, wenn es sich für deinen Betrieb lohnt.',
}

export const referenzen = {
  id: 'referenzen',
  eyebrow: 'Referenzen',
  h2: 'Das haben wir für Betriebe in deiner Nähe gemacht',
  lead: 'Jeder Betrieb ist anders. Hier siehst du vier davon: wo sie standen, was wir gemacht haben und was dabei herauskam.',
  ausgangslage: 'Ausgangslage',
  umsetzung: 'Was wir gemacht haben',
  weitereTitel: 'Auch dabei',
  zitateTitel: 'Das sagen unsere Partner',
  logoTitel: `${partner} Partner, mit denen wir gearbeitet haben`,
}

export const ablauf = {
  id: 'ablauf',
  eyebrow: 'So arbeiten wir',
  h2: 'In vier Schritten zum Auftritt, der läuft',
  lead: 'Du weisst jederzeit, was als Nächstes passiert und was es kostet.',
  schritte: [
    { titel: 'Kennenlernen', text: 'Wir treffen uns 30 Minuten, bei dir im Betrieb, am Telefon oder per Video. Wir hören zu, bevor wir etwas vorschlagen.' },
    { titel: 'Vorschlag', text: 'Wir schauen uns deinen heutigen Auftritt an, sagen dir offen, was wir sehen, und schlagen den nächsten sinnvollen Schritt vor. Mit Preis.' },
    { titel: 'Umsetzung', text: 'Wir setzen es um und melden uns zwischendurch kurz. So siehst du, woran wir arbeiten und warum.' },
    { titel: 'Betreuung', text: `Wenn du magst, bleiben wir dran: Hosting, Anpassungen, Beiträge. Du erreichst uns per WhatsApp oder E-Mail, ${site.erreichbarkeitTageProJahr} Tage im Jahr.` },
  ],
}

export const ueberUns = {
  id: 'ueber-uns',
  eyebrow: 'Über uns',
  h2: 'Wer hinter Alperna steckt',
  rollen: {
    andrej: { rolle: 'Text und Produktion' },
    leander: { rolle: 'Video und Produktion' },
  },
  briefOrt: `${ort}, im Oktober 2026`,
  anrede: 'Guten Tag',
  absaetze: [
    'Wir sind Andrej und Leander und arbeiten von Speicher aus. Die Betriebe, für die wir arbeiten, kennst du vielleicht: den Badmintonclub in Trogen, den Gewerbeverband, ein Restaurant am Bodensee.',
    'Im Kern machen wir drei Dinge: Websites, Google-Profile und Social Media. Du siehst immer, was wir tun und was es kostet.',
    `Ja, wir sind jung. Seit ${jahreText} Jahren arbeiten wir an digitalen Auftritten, haben ${partner} Partner betreut und studieren beide ${site.studium}. Dafür bekommst du keine Hotline, sondern uns beide.`,
    'Am liebsten lernen wir uns bei einem Kaffee in deinem Betrieb kennen.',
  ],
  gruss: 'Freundliche Grüsse',
  unterschrift: 'Andrej & Leander',
  signatur: 'Andrej Good und Leander Züst, Gründer',
  ps: 'Lass vorher unseren Marketing-Check über deinen Auftritt laufen. Er kostet nichts und dauert eine Minute.',
  psButton: 'Marketing-Check starten',
  einblickeTitel: 'So arbeiten wir vor Ort',
  einblicke: [
    { src: '/images/kulissen/interview.webp', alt: 'Alperna beim Filmen eines Interviews beim Kunden vor Ort' },
    { src: '/images/kulissen/kamera.webp', alt: 'Kameraaufbau von Alperna für eine Videoproduktion' },
    { src: '/images/kulissen/schnitt.webp', alt: 'Alperna bei der Videobearbeitung am Rechner' },
    { src: '/images/kulissen/licht.webp', alt: 'Alperna beim Videodreh mit Studiolicht' },
  ],
}

export const faq = {
  id: 'fragen',
  eyebrow: 'Häufige Fragen',
  h2: 'Gut zu wissen',
  fragen: [
    {
      q: 'Wie lange bin ich an euch gebunden?',
      a: 'Gar nicht lange. Eine Website ist ein einmaliger Auftrag. Hosting und laufende Betreuung sind freiwillig, und die Konditionen legen wir vorher gemeinsam fest.',
    },
    {
      q: 'Was kostet der Einstieg?',
      a: `Eine Website startet bei ca. ${chf(site.preise.websiteAb)}, mit eigenem Fotoshooting bei ca. ${chf(site.preise.websiteMitShooting)}. Ein einzelner Social-Media-Beitrag kostet ${chf(site.preise.einzelbeitrag)}. Alles andere besprechen wir nach dem Erstgespräch, damit du nur bezahlst, was du brauchst.`,
    },
    {
      q: 'Bringt das bei uns in der Region wirklich etwas?',
      a: 'Beim BC Trogen Speicher sind die Instagram-Aufrufe in 3 Monaten um 690 % gestiegen. Auf der Website der Massagepraxis von Regina gab es in den ersten sechs Wochen rund 12 Klicks auf «Kontakt». Ob es bei dir etwas bringt, sagen wir dir im Erstgespräch ehrlich. Das kostet nichts.',
    },
    {
      q: 'Kennt ihr meine Branche?',
      a: 'Wir fragen erst und schlagen dann vor. Erfahrung haben wir unter anderem mit einem Restaurant, einer Massagepraxis, einem Sportverein, Verbänden, Coaching und Events.',
    },
    {
      q: 'Gehört das Material dann mir?',
      a: 'Ja. Fotos, Videos und Texte, die wir für dich machen, darfst du überall weiterverwenden.',
    },
    {
      q: 'Kann ich euch anrufen?',
      a: 'Spontane Anrufe nehmen wir nicht entgegen, weil wir oft bei Kunden vor Ort filmen. Schreib uns per WhatsApp oder E-Mail, oder hinterlass im Formular deine Nummer, dann rufen wir dich zurück. Das Erstgespräch führen wir auf Wunsch am Telefon, per Video oder bei dir im Betrieb.',
    },
    { q: 'Wie schnell meldet ihr euch?', a: `${site.antwortZeit[0].toUpperCase()}${site.antwortZeit.slice(1)} nach deiner Anfrage.` },
  ],
}

export const kontakt = {
  id: 'kontakt',
  eyebrow: 'Kontakt',
  h2: 'Sprechen wir miteinander',
  lead: 'Ein Gespräch, 30 Minuten, unverbindlich. Danach weisst du, woran du bist.',
  termin: 'Termin buchen',
  terminText: 'Such dir direkt einen Termin aus.',
  whatsapp: 'WhatsApp schreiben',
  whatsappText: 'Für schnelle Fragen.',
  mail: 'E-Mail schreiben',
  mailText: `Wir antworten ${site.antwortZeit}.`,
  adresse: 'Besuch uns in Speicher',
  formularTitel: 'Oder schreib uns kurz',
  formular: {
    name: { label: 'Dein Name', platzhalter: 'Vorname Nachname', fehler: 'Bitte gib deinen Namen an.' },
    firma: { label: 'Betrieb', platzhalter: 'Muster AG' },
    email: { label: 'E-Mail', platzhalter: 'name@betrieb.ch', fehler: 'Bitte gib eine gültige E-Mail-Adresse an.' },
    telefon: { label: 'Telefon für einen Rückruf', platzhalter: '079 123 45 67', hinweis: 'freiwillig' },
    nachricht: { label: 'Worum geht es?', platzhalter: 'Ein paar Sätze reichen.', fehler: 'Erzähl uns kurz, worum es geht.' },
    einwilligung: 'Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden.',
    einwilligungFehler: 'Bitte bestätige die Einwilligung.',
    button: 'Anfrage senden',
    senden: 'Wird gesendet',
    erfolg: `Danke, deine Nachricht ist angekommen. Wir melden uns ${site.antwortZeit}.`,
    fehlerVersand: `Das hat leider nicht geklappt. Schreib uns direkt an ${site.email}.`,
  },
}

export const footer = {
  about: `Partner für den digitalen Auftritt von Betrieben in St. Gallen, ${site.address.city}, Appenzell, im Rheintal und in der ganzen Ostschweiz.`,
  rechtliches: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
  ],
  karte: 'Kartendaten: swisstopo, Bundesamt für Landestopografie',
  copyright: `© ${new Date().getFullYear()} ${site.legalName}`,
}

export const termin = {
  titel: 'Termin buchen',
  schliessen: 'Schliessen',
  neuerTab: 'In neuem Tab öffnen',
  laedt: 'Der Kalender wird geladen',
}
