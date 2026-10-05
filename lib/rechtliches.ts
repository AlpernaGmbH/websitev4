// ENTWURF. Basis ist der bisherige Text von alperna.ch, angepasst auf diese Website
// (Hosting bei Vercel, Marketing-Check mit KI, Kalender-Dialog, Kontaktformular).
// Muss vor dem Go-live juristisch geprüft werden.
import { site } from '@/lib/site'

export type Absatz = string | { liste: string[] }
export type Abschnitt = { titel: string; absaetze: Absatz[] }

export const entwurfHinweis = 'Entwurf: Dieser Text wird vor der Veröffentlichung juristisch geprüft und kann sich noch ändern.'

export const impressum = {
  titel: 'Impressum',
  stand: 'Stand: 05.10.2026 (Entwurf)',
  abschnitte: [
    {
      titel: 'Kontaktadresse',
      absaetze: [`${site.legalName}, ${site.address.street}, ${site.address.zip} ${site.address.city}, ${site.address.country}. E-Mail: ${site.email}. Website: www.alperna.ch. UID: ${site.uid}`],
    },
    {
      titel: 'Vertretungsberechtigte Personen',
      absaetze: [`${site.team.andrej.name}, Geschäftsführer. ${site.team.leander.name}, Geschäftsführer.`],
    },
    {
      titel: 'Haftungsausschluss (Disclaimer)',
      absaetze: [
        'Die Alperna GmbH übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen die Alperna GmbH wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.',
        'Alle Angebote sind unverbindlich. Die Alperna GmbH behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.',
        'Das Ergebnis des Marketing-Checks beruht auf öffentlich sichtbaren Informationen und auf einer automatischen Einschätzung. Es ist eine Orientierung und keine Beratung oder Zusicherung.',
      ],
    },
    {
      titel: 'Haftung für Links',
      absaetze: ['Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.'],
    },
    {
      titel: 'Urheberrechte',
      absaetze: ['Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf der Website gehören ausschliesslich der Alperna GmbH oder den speziell genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.'],
    },
  ] as Abschnitt[],
}

export const datenschutz = {
  titel: 'Datenschutzerklärung',
  stand: 'Für die Website alperna.ch. Stand: 05.10.2026 (Entwurf)',
  abschnitte: [
    {
      titel: '1. Verantwortliche Stelle',
      absaetze: [
        `Verantwortlich für die Bearbeitung von Personendaten auf dieser Website ist die ${site.legalName}, ${site.address.street}, ${site.address.zip} ${site.address.city}, ${site.address.country}, UID ${site.uid}, E-Mail ${site.email}.`,
        'Ansprechperson für Datenschutzfragen: Andrej Good, erreichbar über die oben genannte E-Mail-Adresse. Wir haben keinen Datenschutzberater ernannt. Nach Schweizer Recht besteht dazu für Unternehmen unserer Grösse keine Pflicht.',
      ],
    },
    {
      titel: '2. Geltungsbereich und Grundlagen',
      absaetze: [
        'Diese Datenschutzerklärung gilt für die Website alperna.ch sowie für unsere Profile auf Instagram, TikTok und LinkedIn und für unser Google Unternehmensprofil.',
        'Wir bearbeiten Personendaten nach dem Schweizer Bundesgesetz über den Datenschutz (DSG) und der zugehörigen Verordnung. Unser Angebot richtet sich an Personen und Unternehmen in der Schweiz. Sollte im Einzelfall die europäische Datenschutz-Grundverordnung (DSGVO) anwendbar sein, halten wir uns auch an deren Vorgaben.',
      ],
    },
    {
      titel: '3. Besuch der Website und Hosting',
      absaetze: [
        'Beim Aufruf der Website werden technische Daten automatisch an den Server unseres Hosting-Anbieters übermittelt und in Logdateien gespeichert: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Referrer, Browser, Betriebssystem und übertragene Datenmenge. Diese Daten fallen technisch zwingend an. Wir nutzen sie ausschliesslich für den sicheren Betrieb. Die Speicherdauer beträgt in der Regel 30 Tage.',
        'Die Website wird von Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Vercel setzt ein weltweit verteiltes Servernetzwerk ein. Personendaten können dabei in Länder ohne ein Datenschutzniveau, das dem schweizerischen gleichwertig ist, übermittelt werden. Die Übermittlung wird über Standardvertragsklauseln oder vergleichbare vertragliche Garantien abgesichert. Weitere Informationen: vercel.com/legal/privacy-policy.',
      ],
    },
    {
      titel: '4. Cookies, Reichweitenmessung und Schriften',
      absaetze: [
        'Diese Website setzt selbst keine Cookies und verwendet keine Reichweitenmessung, keine Werbe- oder Tracking-Pixel und keine Social-Media-Plugins. Die Schriften werden von unserem eigenen Server ausgeliefert, es werden dafür keine Daten an Google übermittelt.',
        'Ausnahme: Wenn Sie auf «Termin buchen» klicken, wird der Kalender eines Drittanbieters geladen (siehe Abschnitt 6). Dieser kann eigene Cookies setzen.',
      ],
    },
    {
      titel: '5. Marketing-Check',
      absaetze: [
        'Mit dem Marketing-Check können Sie die Online-Sichtbarkeit Ihres Betriebs prüfen lassen. Dafür bearbeiten wir Ihre Angaben: Name des Betriebs, Ort, Branche, Adresse Ihrer Website, freiwillig Ihre Social-Media-Kanäle und deren Postingfrequenz sowie Ihre E-Mail-Adresse.',
        'Unser Server ruft Ihre Website und deren öffentlich zugängliche Dateien (zum Beispiel robots.txt und sitemap.xml) ab und wertet sie aus. Wenn ein Schlüssel für die Google-Ortssuche hinterlegt ist, wird zusätzlich öffentlich sichtbare Profilinformation Ihres Betriebs bei Google abgefragt.',
        'Für die Einschätzung Ihrer Marke übermitteln wir die Messwerte der Analyse und einen kurzen Auszug des öffentlich sichtbaren Textes Ihrer Startseite (Titel, Beschreibung, Überschriften, einen Textauszug von rund 1500 Zeichen) sowie Betriebsname, Ort und Branche an einen KI-Dienst. Der Zugang erfolgt über das Vercel AI Gateway. Eingesetzt werden Modelle von Mistral AI (Frankreich) oder Anthropic (USA). Ihre E-Mail-Adresse erhält der KI-Dienst nicht. Die Texte der Einschätzung werden vor der Anzeige automatisch geprüft.',
        'Ihre E-Mail-Adresse und eine Kurzfassung des Ergebnisses (Betrieb, Website, Gesamtnote, schwächste Bereiche, Zusammenfassung) erhalten wir als Anfrage per E-Mail und in unserer Kundenverwaltung. Wir nutzen sie, um uns einmal persönlich bei Ihnen zu melden. Wir senden keinen Newsletter und geben die Adresse nicht an Dritte weiter. Wir löschen die Daten spätestens zwölf Monate nach dem letzten Kontakt.',
        'Rechtsgrundlage ist Ihre Einwilligung, die Sie vor der Anzeige des Ergebnisses erteilen. Sie können sie jederzeit mit Wirkung für die Zukunft widerrufen (kontakt@alperna.ch).',
      ],
    },
    {
      titel: '6. Terminbuchung über Calendly',
      absaetze: [
        'Wenn Sie auf «Termin buchen» klicken, öffnet sich ein Dialog, in dem der Kalender von Calendly LLC, 115 E Main St, Buford, GA 30518, USA, geladen wird. Erst dabei wird Ihre IP-Adresse an Calendly übermittelt. Daten, die Sie dort für die Buchung eingeben, bearbeitet Calendly in eigener Verantwortung. Weitere Informationen: calendly.com/privacy.',
        'Alternativ können Sie den Kalender in einem neuen Tab öffnen oder uns per E-Mail oder WhatsApp schreiben.',
      ],
    },
    {
      titel: '7. Kontaktaufnahme',
      absaetze: [
        'Wenn Sie das Kontaktformular nutzen oder uns schreiben, bearbeiten wir Ihre Angaben: Name, Betrieb, E-Mail-Adresse, freiwillig Ihre Telefonnummer für einen Rückruf und den Inhalt Ihrer Nachricht. Wir nutzen diese Daten ausschliesslich, um Ihre Anfrage zu beantworten und eine mögliche Zusammenarbeit anzubahnen.',
        'Das Formular sendet Ihre Angaben über einen Automatisierungsdienst (n8n) an unsere E-Mail (Google Workspace) und an unsere Kundenverwaltung (Notion). Dabei können Daten auf Servern in der EU und in den USA bearbeitet werden. Die Übermittlung ist über Standardvertragsklauseln oder gleichwertige Garantien abgesichert.',
        'Anfragen, aus denen keine Geschäftsbeziehung entsteht, löschen wir spätestens zwölf Monate nach dem letzten Kontakt, sofern keine gesetzliche Aufbewahrungspflicht besteht. Eine unverschlüsselte E-Mail bietet keine vollständige Vertraulichkeit.',
      ],
    },
    {
      titel: '8. WhatsApp',
      absaetze: ['Wenn Sie uns über den WhatsApp-Link schreiben, bearbeitet WhatsApp (Meta Platforms Ireland Limited, Dublin) Ihre Daten in eigener Verantwortung. Wir erhalten Ihre Telefonnummer und Ihre Nachricht und nutzen sie, um zu antworten. Beim blossen Besuch unserer Website werden keine Daten an WhatsApp übermittelt, der Link wird erst beim Anklicken aufgerufen.'],
    },
    {
      titel: '9. Unsere Profile auf sozialen Netzwerken und bei Google',
      absaetze: [
        'Wir betreiben Profile auf Instagram, TikTok und LinkedIn sowie ein Unternehmensprofil bei Google. Auf unserer Website verlinken wir mit einfachen Links darauf. Ein Datentransfer an diese Anbieter findet erst statt, wenn Sie einen Link anklicken. Sobald Sie unsere Profile besuchen, bearbeitet der jeweilige Anbieter Ihre Daten in eigener Verantwortung. Wir erhalten von den Plattformen anonymisierte, statistische Auswertungen.',
        { liste: ['Instagram: Meta Platforms Ireland Limited, Merrion Road, Dublin 4, Irland', 'TikTok: TikTok Technology Limited, 10 Earlsfort Terrace, Dublin 2, Irland', 'LinkedIn: LinkedIn Ireland Unlimited Company, Wilton Plaza, Dublin 2, Irland', 'Google: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland'] },
        'Auf unserer Website ist keine Google-Maps-Karte eingebettet. Der Link «Auf der Karte» öffnet Google Maps erst beim Anklicken.',
      ],
    },
    {
      titel: '10. Bearbeitung im Rahmen einer Geschäftsbeziehung',
      absaetze: [
        'Kommt es zu einer Zusammenarbeit, bearbeiten wir die dafür nötigen Daten unserer Kundinnen und Kunden sowie deren Ansprechpersonen: Kontaktangaben, Vertrags- und Projektdaten, Kommunikationsverläufe sowie Rechnungs- und Zahlungsdaten. Dafür setzen wir sorgfältig ausgewählte Dienstleister ein, die vertraglich zur Vertraulichkeit und zum Datenschutz verpflichtet sind. Auf Anfrage nennen wir Ihnen die konkret eingesetzten Dienstleister.',
        'Geschäftsunterlagen und Buchhaltungsbelege bewahren wir gemäss Artikel 958f des Obligationenrechts während zehn Jahren auf.',
      ],
    },
    {
      titel: '11. Weitergabe an Dritte und Datensicherheit',
      absaetze: [
        'Wir verkaufen keine Personendaten und geben sie nicht zu Werbezwecken an Dritte weiter. Eine Weitergabe erfolgt nur, wenn dies für die Erbringung unserer Leistungen nötig ist, wenn Sie eingewilligt haben oder wenn wir gesetzlich oder behördlich dazu verpflichtet sind.',
        'Wir treffen angemessene technische und organisatorische Massnahmen, um Ihre Daten zu schützen. Die Website wird über eine verschlüsselte Verbindung ausgeliefert. Ein vollständiger Schutz bei der Übertragung von Daten über das Internet ist technisch nicht möglich.',
      ],
    },
    {
      titel: '12. Ihre Rechte',
      absaetze: [
        'Im Rahmen des anwendbaren Datenschutzrechts haben Sie folgende Rechte:',
        { liste: ['Auskunft darüber, ob und welche Daten wir über Sie bearbeiten', 'Berichtigung unrichtiger Daten', 'Löschung von Daten, sofern keine gesetzliche Aufbewahrungspflicht entgegensteht', 'Einschränkung der Bearbeitung und Widerspruch gegen eine Bearbeitung', 'Datenherausgabe oder Datenübertragung in einem gängigen elektronischen Format', 'Widerruf einer erteilten Einwilligung, mit Wirkung für die Zukunft'] },
        'Wenden Sie sich dafür an kontakt@alperna.ch. Zur Sicherheit können wir einen Identitätsnachweis verlangen. Sie haben ausserdem das Recht, sich beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB), Feldeggweg 1, 3003 Bern, zu beschweren.',
      ],
    },
    {
      titel: '13. Automatisierte Entscheidungen, Kinder, Änderungen',
      absaetze: [
        'Wir setzen keine automatisierte Einzelentscheidung ein, die für Sie rechtliche Folgen hätte. Die automatische Einschätzung im Marketing-Check ist eine Orientierung und keine Entscheidung über Sie.',
        'Unser Angebot richtet sich an Unternehmen und nicht an Kinder. Wir erheben wissentlich keine Daten von Personen unter 16 Jahren.',
        'Wir können diese Datenschutzerklärung anpassen, wenn sich unsere Website, unsere Dienste oder die rechtlichen Vorgaben ändern. Es gilt jeweils die auf alperna.ch veröffentlichte Fassung.',
      ],
    },
  ] as Abschnitt[],
}
