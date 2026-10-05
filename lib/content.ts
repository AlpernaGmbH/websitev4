// Alle Texte der Seite. Du-Form, Schweizer Schreibweise. Zahlen kommen aus lib/site.ts, nie von Hand.
import { chf } from '@/lib/format'
import { jahreText, site } from '@/lib/site'

/** Text mit höchstens einem Akzentwort (kursiv, mit goldener Markierung) */
export type Teil = { t: string; em?: boolean }

const partner = site.partnerAnzahl
const ort = `${site.address.city} ${site.address.canton}`

export const meta = {
  title: 'Digitaler Auftritt für Ostschweizer KMU | Alperna GmbH',
  description: 'Website, Google-Profil und Social Media aus einer Hand. Wir sorgen dafür, dass Ostschweizer KMU online gefunden werden und Anfragen bekommen.',
}

export const nav = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Ablauf', href: '#ablauf' },
  { label: 'Referenzen', href: '#referenzen' },
  { label: 'Über uns', href: '#ueber-uns' },
  { label: 'Fragen', href: '#fragen' },
  { label: 'Kontakt', href: '#kontakt' },
]

export const hero = {
  eyebrow: `Alperna GmbH, ${ort}`,
  h1: [{ t: 'Wir sorgen dafür, dass dich Kunden ' }, { t: 'online finden.', em: true }] as Teil[],
  lead: 'Website, Google-Profil und Social Media aus einer Hand, für Betriebe in der Ostschweiz. Du sprichst direkt mit Andrej und Leander, den Gründern.',
  termin: 'Termin buchen',
  terminHinweis: 'Kostenloses Erstgespräch, 30 Minuten',
  check: 'Gratis Marketing-Check',
  checkHinweis: 'Ergebnis in etwa einer Minute',
  vertrauen: ['Kostenlos und unverbindlich', 'Keine langen Verträge', `Antwort ${site.antwortZeit}`],
  fotoTitel: 'Andrej Good und Leander Züst',
  fotoUntertitel: `Gründer der Alperna GmbH in ${ort}`,
}

export const belege = [
  { wert: String(partner), label: 'Partner, mit denen wir gearbeitet haben' },
  { wert: `${site.seitJahren} Jahre`, label: 'Erfahrung mit digitalen Auftritten' },
  { wert: `ab ${chf(site.preise.websiteAb)}`, label: 'für eine Website, der Richtpreis steht vorab fest' },
  { wert: ort, label: `Sitz der Alperna GmbH, ${site.address.street}` },
]

export const check = {
  id: 'check',
  eyebrow: 'Gratis Marketing-Check',
  h2: [{ t: 'Wie gut wird dein Betrieb ' }, { t: 'online gefunden?', em: true }] as Teil[],
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
  h2: [{ t: 'Was wir für ' }, { t: 'dich', em: true }, { t: ' tun.' }] as Teil[],
  lead: 'Wir starten meist mit der Website. Danach schlagen wir dir immer nur den nächsten Baustein vor, und nur, wenn er dir etwas bringt.',
  karten: [
    {
      titel: 'Website',
      preis: `ab ca. ${chf(site.preise.websiteAb)}`,
      preisZusatz: `mit eigenem Shooting ca. ${chf(site.preise.websiteMitShooting)}`,
      text: 'Eine Website, die auf dem Handy überzeugt und Anfragen bringt.',
      punkte: ['Texte und Aufbau, die zu deinen Kunden passen', 'Eigene Fotos statt Stockbilder', 'Anfrageformular, WhatsApp und Terminbuchung'],
    },
    {
      titel: 'Google-Profil',
      preis: 'Preis im Gespräch',
      preisZusatz: 'kleiner Aufwand, grosse Wirkung',
      text: 'Wer in der Region nach deiner Branche sucht, findet dich bei Google und auf Google Maps.',
      punkte: ['Profil einrichten oder in Ordnung bringen', 'Öffnungszeiten, Leistungen und Fotos pflegen', 'Bewertungen beantworten'],
    },
    {
      titel: 'Social Media',
      preis: `Einzelner Beitrag ab ${chf(site.preise.einzelbeitrag)}`,
      preisZusatz: 'auf Wunsch komplett für dich',
      text: 'Beiträge und Videos, die zu deinen Kunden passen. Wir planen, produzieren und posten.',
      punkte: ['Themen und Kanäle, die zu dir passen', 'Fotos und Videos vor Ort bei dir', 'Du siehst vorab, was online geht'],
    },
  ],
  weitere: 'Auf Anfrage: Onlineshop, Online-Buchung und Google Ads. Wir schlagen sie nur vor, wenn sie für deinen Betrieb der sinnvollste nächste Schritt sind.',
}

export const ablauf = {
  id: 'ablauf',
  eyebrow: 'So arbeiten wir',
  h2: [{ t: 'In vier Schritten ' }, { t: 'zum Auftritt,', em: true }, { t: ' der läuft.' }] as Teil[],
  lead: 'Transparent und Schritt für Schritt. Du weisst immer, was als Nächstes passiert.',
  etappen: [
    { titel: 'Kennenlernen', text: 'Kostenloses Erstgespräch bei dir im Betrieb, am Telefon oder per Video. Wir hören zu und stellen die richtigen Fragen.' },
    { titel: 'Vorschlag', text: 'Wir schauen uns deinen heutigen Auftritt an und schlagen dir den nächsten sinnvollen Baustein vor, mit klarem Preis.' },
    { titel: 'Umsetzung', text: 'Wir setzen den Baustein um und halten dich mit kurzen Updates auf dem Laufenden. Du siehst, woran wir arbeiten und warum.' },
    { titel: 'Betreuung', text: `Auf Wunsch betreuen wir deinen Auftritt weiter: Hosting, Anpassungen, Beiträge. Du erreichst uns per WhatsApp oder E-Mail, ${site.erreichbarkeitTageProJahr} Tage im Jahr.` },
  ],
}

export const referenzen = {
  id: 'referenzen',
  eyebrow: 'Referenzen',
  h2: [{ t: 'Das haben wir für Betriebe ' }, { t: 'aus der Region', em: true }, { t: ' umgesetzt.' }] as Teil[],
  lead: 'Jeder Betrieb ist anders. Hier siehst du, wie die Ausgangslage aussah, was wir gemacht haben und was dabei herauskam.',
  ausgangslage: 'Ausgangslage',
  umsetzung: 'Was wir gemacht haben',
  zitateTitel: 'Das sagen unsere Partner',
  logoTitel: `${partner} Partner, mit denen wir gearbeitet haben`,
}

export const ueberUns = {
  id: 'ueber-uns',
  eyebrow: 'Über uns',
  h2: [{ t: 'Zwei Gründer, die du ' }, { t: 'persönlich', em: true }, { t: ' kennenlernst.' }] as Teil[],
  lead: 'Andrej sorgt für die richtigen Worte, Leander für das passende Bild. Zusammen kümmern wir uns darum, dass du auf allen Kanälen überzeugst.',
  karten: [
    {
      id: 'andrej' as const,
      rolle: 'Mitgründer · Text und Produktion',
      text: 'Ich schreibe die Texte, baue die Websites und filme vor Ort. Was ich dir zusage, halte ich. Wenn ein Schritt nichts bringt, sage ich es dir.',
    },
    {
      id: 'leander' as const,
      rolle: 'Mitgründer · Video und Produktion',
      text: 'Ich plane die Inhalte und schneide die Videos. Mir ist wichtig, dass das Material nach deinem Betrieb aussieht und nicht nach Vorlage.',
    },
  ],
  jungTitel: 'Ja, wir sind jung. Deshalb kümmern wir uns persönlich.',
  jungText: `Wir arbeiten seit ${jahreText} Jahren an digitalen Auftritten, haben ${partner} Partner betreut und studieren beide ${site.studium}. Du bekommst keine Hotline, sondern uns beide, ${site.erreichbarkeitTageProJahr} Tage im Jahr per WhatsApp oder E-Mail.`,
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
  h2: [{ t: 'Gut zu ' }, { t: 'wissen.', em: true }] as Teil[],
  fragen: [
    {
      q: 'Wie lange bin ich gebunden?',
      a: 'Wir arbeiten ohne lange Vertragslaufzeiten. Eine Website ist ein einmaliger Auftrag. Für Hosting und laufende Betreuung besprechen wir die Konditionen transparent im Erstgespräch.',
    },
    {
      q: 'Was kostet der Einstieg?',
      a: `Eine Website kostet ab ca. ${chf(site.preise.websiteAb)}, mit eigenem Shooting ca. ${chf(site.preise.websiteMitShooting)}. Ein einzelner Social-Media-Beitrag kostet ${chf(site.preise.einzelbeitrag)}. Alles Weitere besprechen wir nach dem Erstgespräch, damit du nur bezahlst, was dein Betrieb braucht.`,
    },
    {
      q: 'Bringt das in unserer Region etwas?',
      a: 'Wir haben es in der Region schon umgesetzt. Der BC Trogen Speicher hat in 3 Monaten 690 % mehr Instagram-Aufrufe erzielt, die Website der Massagepraxis Regina brachte rund 12 Kontakt-Klicks in den ersten sechs Wochen. Ob es bei dir etwas bringt, klären wir im Erstgespräch. Das kostet nichts.',
    },
    {
      q: 'Versteht ihr unser Geschäft?',
      a: 'Wir fragen zuerst, bevor wir etwas vorschlagen. Im Erstgespräch erzählst du uns von deinem Betrieb, wir schauen uns deinen Auftritt an und sagen dir offen, was wir sehen. Erfahrung haben wir unter anderem mit einem Restaurant, einer Massagepraxis, einem Sportverein, Coaching und einem Gewerbeverband.',
    },
    {
      q: 'Behalte ich die Kontrolle?',
      a: 'Du weisst bei uns immer, was wir tun und warum. Du bekommst kurze Updates, und das Material, das wir für dich produzieren, kannst du selbst weiterverwenden.',
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
  h2: [{ t: 'Lernen wir uns ' }, { t: 'kennen.', em: true }] as Teil[],
  lead: 'Ein Gespräch, 30 Minuten, unverbindlich. Danach weisst du, woran du bist.',
  termin: 'Termin buchen',
  terminText: 'Such dir direkt einen Termin aus.',
  whatsapp: 'WhatsApp schreiben',
  whatsappText: 'Schnelle Fragen und Rückmeldungen.',
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
  copyright: `© ${new Date().getFullYear()} ${site.legalName}`,
}

export const termin = {
  titel: 'Termin buchen',
  schliessen: 'Schliessen',
  neuerTab: 'In neuem Tab öffnen',
  laedt: 'Der Kalender wird geladen',
}

