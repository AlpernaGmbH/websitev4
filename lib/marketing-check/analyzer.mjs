// Kopie aus AlpernaGmbH/tool (lib/marketing-check/analyzer.mjs), Stand 05.10.2026.
// Bewusst als JavaScript belassen, damit Website und Tool dieselbe Engine nutzen.
// Typen: siehe analyzer.d.ts.
//
// Lokale Ergänzung (alperna-ch), sonst unverändert: `pageSnapshot` und das Feld `snapshot` im Ergebnis.
// Der Schnappschuss ist die Grundlage der KI-Einschätzung (lib/ki.ts). Er enthält nur öffentlichen Text, hart begrenzt.

// Alperna Marketing-Check – Analyse-Engine
// Prüft eine Website serverseitig auf SEO, SEA-Tracking, Shop, Buchung, Newsletter,
// Social-Media-Verknüpfung und (optional via Google Places API) den Google-Business-Eintrag.

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const UA =
  "Mozilla/5.0 (compatible; AlpernaCheck/1.0; +https://alperna.ch/check.html)";
const MAX_BYTES = 2_500_000;
const TIMEOUT_MS = 12_000;

/* ------------------------------------------------------------------ */
/* Branchen: Ist ein Online-Shop bzw. eine Online-Buchung sinnvoll?   */
/* ------------------------------------------------------------------ */
export const INDUSTRIES = {
  gastro: {
    label: "Gastronomie / Restaurant / Café",
    shop: "gering",
    booking: "hoch",
    shopHint: "Gutscheine online verkaufen kann sich lohnen.",
    bookingHint:
      "Tischreservation online spart Telefonate und bringt Gäste auch ausserhalb der Öffnungszeiten.",
  },
  hotel: {
    label: "Hotel / Ferienwohnung / B&B",
    shop: "gering",
    booking: "hoch",
    shopHint: "Gutscheine und Pakete können online verkauft werden.",
    bookingHint:
      "Direktbuchung über die eigene Website spart Plattform-Provisionen.",
  },
  beauty: {
    label: "Coiffeur / Kosmetik / Beauty",
    shop: "mittel",
    booking: "hoch",
    shopHint:
      "Pflegeprodukte und Gutscheine online verkaufen bringt Zusatzumsatz.",
    bookingHint:
      "Online-Terminbuchung ist in der Branche Standard – Kundschaft erwartet sie.",
  },
  health: {
    label: "Gesundheit / Praxis / Therapie",
    shop: "gering",
    booking: "hoch",
    shopHint: "Ein Shop ist in der Regel nicht nötig.",
    bookingHint: "Online-Termine entlasten das Praxistelefon spürbar.",
  },
  fitness: {
    label: "Fitness / Sport / Kurse",
    shop: "mittel",
    booking: "hoch",
    shopHint: "Abos, Kurse und Gutscheine lassen sich online verkaufen.",
    bookingHint:
      "Kurs- und Probetraining-Buchung online senkt die Einstiegshürde.",
  },
  retail: {
    label: "Detailhandel / Laden",
    shop: "hoch",
    booking: "gering",
    shopHint:
      "Ein Online-Shop (oder Click & Collect) erweitert die Reichweite über die Öffnungszeiten hinaus.",
    bookingHint: "Online-Buchung ist meist nicht nötig.",
  },
  producer: {
    label: "Produktion / Manufaktur / Hofladen",
    shop: "hoch",
    booking: "gering",
    shopHint:
      "Direktverkauf online steigert die Marge gegenüber dem Zwischenhandel.",
    bookingHint: "Online-Buchung ist meist nicht nötig.",
  },
  craft: {
    label: "Handwerk / Bau / Garten",
    shop: "gering",
    booking: "mittel",
    shopHint: "Ein Shop ist in der Regel nicht nötig.",
    bookingHint:
      "Ein Online-Offertformular oder Terminbuchung für Besichtigungen bringt qualifizierte Anfragen.",
  },
  b2b: {
    label: "Beratung / Dienstleistung (B2B)",
    shop: "gering",
    booking: "mittel",
    shopHint: "Ein Shop ist in der Regel nicht nötig.",
    bookingHint:
      "Ein Buchungslink für Erstgespräche (z. B. Calendly) verkürzt den Weg zum Termin.",
  },
  realestate: {
    label: "Immobilien / Treuhand",
    shop: "gering",
    booking: "mittel",
    shopHint: "Ein Shop ist in der Regel nicht nötig.",
    bookingHint:
      "Online-Terminbuchung für Beratungen oder Besichtigungen ist ein Plus.",
  },
  auto: {
    label: "Garage / Auto / Mobilität",
    shop: "mittel",
    booking: "hoch",
    shopHint: "Zubehör, Reifen oder Gutscheine können online verkauft werden.",
    bookingHint:
      "Service-Termine online buchen ist für Kundschaft sehr bequem.",
  },
  other: {
    label: "Andere Branche",
    shop: "mittel",
    booking: "mittel",
    shopHint: "Ob ein Shop Sinn macht, klären wir im Gespräch.",
    bookingHint: "Ob eine Online-Buchung Sinn macht, klären wir im Gespräch.",
  },
};

/* ------------------------------------------------------------------ */
/* Erkennungsmuster                                                    */
/* ------------------------------------------------------------------ */
const SHOP_SYSTEMS = [
  ["Shopify", /cdn\.shopify\.com|myshopify\.com|Shopify\.theme/i],
  ["WooCommerce", /woocommerce|wc-ajax|wp-content\/plugins\/woocommerce/i],
  ["Shopware", /shopware/i],
  ["Magento", /mage\/cookies|Magento_|magento/i],
  ["PrestaShop", /prestashop/i],
  ["Wix Stores", /wixstores|wix-ecommerce/i],
  [
    "Squarespace Commerce",
    /squarespace-commerce|static\.squarespace\.com\/.*commerce/i,
  ],
  ["Jimdo Shop", /jimdo.*(shop|store)/i],
  ["Ecwid", /ecwid\.com|app\.ecwid/i],
  ["Gambio", /gambio/i],
  ["JTL-Shop", /jtl-shop|jtlshop/i],
];
const SHOP_WORDS =
  /in den warenkorb|zum warenkorb|warenkorb|add to cart|zur kasse|onlineshop|online-shop|\/shop\b|\/cart\b|\/checkout\b/i;

const BOOKING_SYSTEMS = [
  ["Calendly", /calendly\.com/i],
  ["Cal.com", /cal\.com\//i],
  ["SimplyBook", /simplybook\./i],
  ["Booksy", /booksy\.com/i],
  ["Treatwell", /treatwell\./i],
  ["Shore", /shore\.com|connect\.shore/i],
  ["Timify", /timify\.com/i],
  ["Planity", /planity\.com/i],
  ["Salonized", /salonized\.com/i],
  ["Acuity", /acuityscheduling\.com/i],
  [
    "Microsoft Bookings",
    /outlook\.office365\.com\/owa\/calendar|bookings\.office/i,
  ],
  ["OneDoc", /onedoc\.ch/i],
  ["Doctolib", /doctolib\./i],
  ["Medicosearch", /medicosearch\.ch/i],
  ["OpenTable", /opentable\./i],
  ["Quandoo", /quandoo\./i],
  ["TheFork", /thefork\.|lafourchette/i],
  ["Lunchgate", /lunchgate\.ch/i],
  ["aleno", /aleno\.me/i],
  ["resmio", /resmio\./i],
  ["bookingkit", /bookingkit\./i],
  ["Regiondo", /regiondo\./i],
  [
    "Booking-Engine (Hotel)",
    /seekda|cultuzz|hotelnetsolutions|bookassist|simple-booking|mews\.(li|com)|sihot|protel|hotel-spider|guestline|cloudbeds|beds24|smoobu/i,
  ],
  ["Eversports", /eversports\./i],
  ["Magicline", /magicline\./i],
];
const BOOKING_WORDS =
  /termin buchen|termin vereinbaren|online buchen|jetzt buchen|online-termin|tisch reservieren|jetzt reservieren|online reservieren|book now|book online/i;

const NEWSLETTER_SYSTEMS = [
  ["Mailchimp", /list-manage\.com|mailchimp|mc\.us\d+|chimpstatic/i],
  ["Brevo (Sendinblue)", /sibforms\.com|sendinblue|brevo\.com/i],
  ["CleverReach", /cleverreach/i],
  ["Klaviyo", /klaviyo/i],
  ["MailerLite", /mailerlite/i],
  ["rapidmail", /rapidmail/i],
  ["Newsletter2Go", /newsletter2go/i],
  ["GetResponse", /getresponse/i],
  ["ActiveCampaign", /activehosted\.com|activecampaign/i],
  ["HubSpot", /hsforms|hs-scripts|hubspot/i],
  ["Mailjet", /mailjet/i],
];
const NEWSLETTER_WORDS = /newsletter/i;

const SOCIAL_PATTERNS = {
  instagram: /https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9_.]+/i,
  facebook: /https?:\/\/(?:[a-z]+\.)?facebook\.com\/[A-Za-z0-9_.\-/?=]+/i,
  linkedin:
    /https?:\/\/(?:[a-z]+\.)?linkedin\.com\/(?:company|in|school)\/[A-Za-z0-9_\-%.]+/i,
  tiktok: /https?:\/\/(?:www\.)?tiktok\.com\/@[A-Za-z0-9_.]+/i,
  youtube:
    /https?:\/\/(?:www\.)?youtube\.com\/(?:@|channel\/|c\/|user\/)[A-Za-z0-9_\-.]+/i,
};

/* ------------------------------------------------------------------ */
/* Sicheres Abrufen (Schutz vor SSRF: keine internen Adressen)         */
/* ------------------------------------------------------------------ */
function isPrivateAddress(ip) {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  return (
    v6 === "::1" ||
    v6 === "::" ||
    v6.startsWith("fc") ||
    v6.startsWith("fd") ||
    v6.startsWith("fe80") ||
    (v6.startsWith("::ffff:") && isPrivateAddress(v6.slice(7)))
  );
}

async function assertPublicUrl(url) {
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Nur http- und https-Adressen sind erlaubt.");
  if (url.port && !["80", "443"].includes(url.port))
    throw new Error("Ungültiger Port.");
  if (url.username || url.password) throw new Error("Ungültige Adresse.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  )
    throw new Error("Interne Adressen sind nicht erlaubt.");
  const addrs = isIP(host)
    ? [{ address: host }]
    : await lookup(host, { all: true });
  if (!addrs.length || addrs.some((a) => isPrivateAddress(a.address)))
    throw new Error("Interne Adressen sind nicht erlaubt.");
}

async function safeFetch(
  rawUrl,
  { method = "GET", maxBytes = MAX_BYTES, timeout = TIMEOUT_MS } = {},
) {
  let url = new URL(rawUrl);
  const started = Date.now();
  for (let hop = 0; hop < 6; hop++) {
    await assertPublicUrl(url);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    let res;
    try {
      res = await fetch(url, {
        method,
        redirect: "manual",
        signal: ctrl.signal,
        headers: {
          "User-Agent": UA,
          Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
          "Accept-Language": "de-CH,de;q=0.9,en;q=0.6",
        },
      });
    } finally {
      clearTimeout(timer);
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      url = new URL(res.headers.get("location"), url);
      continue;
    }
    let body = "";
    if (method === "GET" && res.body) {
      const reader = res.body.getReader();
      const chunks = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        chunks.push(value);
        if (size > maxBytes) {
          await reader.cancel();
          break;
        }
      }
      body = new TextDecoder("utf-8", { fatal: false }).decode(
        Buffer.concat(chunks.map((c) => Buffer.from(c))),
      );
    }
    return {
      url,
      status: res.status,
      ok: res.ok,
      headers: res.headers,
      body,
      ms: Date.now() - started,
    };
  }
  throw new Error("Zu viele Weiterleitungen.");
}

/* ------------------------------------------------------------------ */
/* Hilfsfunktionen HTML                                                */
/* ------------------------------------------------------------------ */
const decode = (s = "") =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const attr = (tag, name) => {
  const m = tag.match(
    new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  return m ? decode(m[2] ?? m[3] ?? m[4] ?? "") : null;
};
const metaContent = (html, key) => {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const n = (attr(tag, "name") || attr(tag, "property") || "").toLowerCase();
    if (n === key) return attr(tag, "content");
  }
  return null;
};
const textOf = (html) =>
  decode(
    html
      .replace(
        /<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/gi,
        " ",
      )
      .replace(/<[^>]+>/g, " "),
  );

/* Ergänzung alperna-ch: kurzer Schnappschuss der Startseite für die KI-Einschätzung. */
const clip = (v, n) => String(v || "").replace(/\s+/g, " ").trim().slice(0, n);
function pageSnapshot(html) {
  const title = clip(decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]), 160);
  const description = clip(
    metaContent(html, "description") || metaContent(html, "og:description"),
    300,
  );
  const headings = (html.match(/<h[1-3]\b[\s\S]*?<\/h[1-3]>/gi) || [])
    .map((h) => clip(textOf(h), 120))
    .filter(Boolean)
    .slice(0, 12);
  const lang = clip((html.match(/<html[^>]*\blang\s*=\s*["']?([a-zA-Z-]+)/i) || [])[1], 12);
  const body = (html.match(/<body[\s\S]*<\/body>/i) || [html])[0];
  return {
    title,
    description,
    headings,
    lang,
    excerpt: clip(textOf(body), 1500),
    hasOgImage: Boolean(metaContent(html, "og:image")),
    hasTelLink: /href\s*=\s*["']tel:/i.test(html),
    hasMailLink: /href\s*=\s*["']mailto:/i.test(html),
    hasImpressum: /impressum/i.test(textOf(body)),
  };
}

/* ------------------------------------------------------------------ */
/* Einzelprüfungen                                                     */
/* ------------------------------------------------------------------ */
function checkSeo(page, extras) {
  const html = page.body;
  const items = [];
  const add = (ok, label, detail, weight = 1) =>
    items.push({ ok, label, detail, weight });

  const title = decode(
    (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "",
  );
  add(
    title.length >= 10 && title.length <= 65,
    "Seitentitel",
    title
      ? `«${title.slice(0, 80)}» (${title.length} Zeichen, ideal 10–65)`
      : "Kein Seitentitel gefunden",
    2,
  );

  const desc = metaContent(html, "description") || "";
  add(
    desc.length >= 50 && desc.length <= 165,
    "Meta-Beschreibung",
    desc
      ? `${desc.length} Zeichen (ideal 50–160)`
      : "Fehlt – Google wählt selbst einen Textausschnitt",
    2,
  );

  const h1s = (html.match(/<h1\b[\s\S]*?<\/h1>/gi) || [])
    .map((h) => textOf(h))
    .filter(Boolean);
  add(
    h1s.length === 1,
    "Hauptüberschrift (H1)",
    h1s.length === 0
      ? "Keine H1 gefunden"
      : h1s.length === 1
        ? `«${h1s[0].slice(0, 70)}»`
        : `${h1s.length} H1-Überschriften (ideal: genau eine)`,
    1.5,
  );

  add(
    page.url.protocol === "https:",
    "HTTPS-Verschlüsselung",
    page.url.protocol === "https:" ? "Aktiv" : "Website läuft ohne HTTPS",
    2,
  );
  add(
    /<meta[^>]+name=["']?viewport/i.test(html),
    "Mobile-Optimierung (Viewport)",
    /<meta[^>]+name=["']?viewport/i.test(html)
      ? "Vorhanden"
      : "Kein Viewport – Darstellung auf dem Handy vermutlich schlecht",
    2,
  );

  const lang = attr((html.match(/<html\b[^>]*>/i) || [""])[0], "lang");
  add(Boolean(lang), "Sprachangabe", lang ? `lang="${lang}"` : "Fehlt", 0.5);

  const canonical = /<link[^>]+rel=["']?canonical/i.test(html);
  add(
    canonical,
    "Canonical-Tag",
    canonical ? "Vorhanden" : "Fehlt – Risiko für doppelte Inhalte",
    0.5,
  );

  const og = Boolean(
    metaContent(html, "og:title") && metaContent(html, "og:image"),
  );
  add(
    og,
    "Social-Media-Vorschau (Open Graph)",
    og
      ? "Titel und Bild für geteilte Links vorhanden"
      : "Fehlt – geteilte Links sehen unattraktiv aus",
    1,
  );

  const ld = [
    ...html.matchAll(
      /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ]
    .map((m) => m[1])
    .join(" ");
  const localBiz =
    /"@type"\s*:\s*"?(LocalBusiness|Restaurant|Store|Hotel|Dentist|MedicalBusiness|HealthAndBeautyBusiness|HairSalon|BeautySalon|AutoRepair|ProfessionalService|HomeAndConstructionBusiness|FoodEstablishment|Organization)/i.test(
      ld,
    );
  add(
    localBiz,
    "Strukturierte Daten (Schema.org)",
    localBiz
      ? "Firmendaten für Google hinterlegt"
      : ld
        ? "Vorhanden, aber ohne Firmenangaben"
        : "Fehlen – Google versteht Adresse und Öffnungszeiten schlechter",
    1,
  );

  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const withAlt = imgs.filter((t) => (attr(t, "alt") || "").length > 0).length;
  const altRatio = imgs.length ? withAlt / imgs.length : 1;
  add(
    altRatio >= 0.8,
    "Bild-Beschreibungen (Alt-Texte)",
    imgs.length
      ? `${withAlt} von ${imgs.length} Bildern beschrieben`
      : "Keine Bilder gefunden",
    1,
  );

  const noindex =
    /noindex/i.test(metaContent(html, "robots") || "") ||
    /noindex/i.test(page.headers.get("x-robots-tag") || "");
  add(
    !noindex,
    "Indexierung durch Google",
    noindex
      ? "Seite ist auf «noindex» gesetzt – erscheint nicht bei Google!"
      : "Erlaubt",
    3,
  );

  add(
    extras.sitemap,
    "XML-Sitemap",
    extras.sitemap ? "Gefunden" : "Keine sitemap.xml gefunden",
    1,
  );
  add(
    extras.robots,
    "robots.txt",
    extras.robots ? "Gefunden" : "Nicht gefunden",
    0.5,
  );

  const words = textOf(html)
    .split(" ")
    .filter((w) => w.length > 2).length;
  add(
    words >= 250,
    "Textumfang Startseite",
    `ca. ${words} Wörter${words < 250 ? " – wenig Inhalt für Google" : ""}`,
    1,
  );

  const secs = (page.ms / 1000).toFixed(1);
  add(
    page.ms < 2500,
    "Antwortzeit Server",
    `${secs} s${page.ms >= 2500 ? " – langsam" : ""}`,
    1.5,
  );

  const kb = Math.round(Buffer.byteLength(html) / 1024);
  add(kb < 600, "HTML-Grösse", `${kb} KB`, 0.5);

  const total = items.reduce((s, i) => s + i.weight, 0);
  const score = items.reduce((s, i) => s + (i.ok ? i.weight : 0), 0) / total;
  return { score, items, title, description: desc };
}

function detectTracking(html) {
  const ga4 = [...new Set(html.match(/G-[A-Z0-9]{6,12}/g) || [])];
  const gtm = /GTM-[A-Z0-9]{4,9}/.test(html);
  const gads =
    /AW-\d{6,12}|googleadservices\.com|googleads\.g\.doubleclick\.net|google_conversion_id/i.test(
      html,
    );
  const meta = /connect\.facebook\.net\/[^"']*fbevents|fbq\(\s*['"]init/i.test(
    html,
  );
  const linkedin = /snap\.licdn\.com|_linkedin_partner_id/i.test(html);
  const tiktok = /analytics\.tiktok\.com|ttq\.load/i.test(html);
  return { ga4: ga4.length > 0, gtm, gads, meta, linkedin, tiktok };
}

function checkSea(tracking) {
  const items = [
    {
      ok: tracking.ga4 || tracking.gtm,
      label: "Web-Analyse (Google Analytics / Tag Manager)",
      detail:
        tracking.ga4 || tracking.gtm
          ? "Eingebunden – Besucherzahlen werden gemessen"
          : "Nicht gefunden – Erfolg der Website ist nicht messbar",
    },
    {
      ok: tracking.gads,
      label: "Google Ads Conversion-Tracking",
      detail: tracking.gads
        ? "Gefunden – deutet auf aktive Google-Werbung hin"
        : "Nicht gefunden – keine Hinweise auf Google Ads",
    },
    {
      ok: tracking.meta,
      label: "Meta Pixel (Facebook/Instagram Ads)",
      detail: tracking.meta
        ? "Gefunden"
        : "Nicht gefunden – Retargeting auf Instagram/Facebook nicht möglich",
    },
  ];
  const score =
    (items[0].ok ? 0.4 : 0) + (items[1].ok ? 0.4 : 0) + (items[2].ok ? 0.2 : 0);
  return {
    score,
    items,
    note: "Ob Anzeigen tatsächlich laufen, lässt sich zusätzlich im Google Ads Transparency Center prüfen.",
  };
}

function detectFrom(list, html) {
  return list.filter(([, re]) => re.test(html)).map(([name]) => name);
}

function findSocialLinks(html) {
  const found = {};
  for (const [net, re] of Object.entries(SOCIAL_PATTERNS)) {
    const hrefs = [...html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)].map((m) =>
      decode(m[1]),
    );
    const hit = hrefs.find(
      (h) => re.test(h) && !/sharer|share\?|intent|plugins|dialog/i.test(h),
    );
    if (hit) found[net] = hit;
  }
  return found;
}

const FREQ_SCORE = {
  none: 0,
  rare: 0.2,
  monthly: 0.45,
  weekly: 0.8,
  several: 1,
};
const FREQ_LABEL = {
  none: "Gar nicht",
  rare: "Seltener als monatlich",
  monthly: "Etwa monatlich",
  weekly: "Etwa wöchentlich",
  several: "Mehrmals pro Woche",
};
const NET_LABEL = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
};

function checkSocial(input, linkedOnSite) {
  const channels = [];
  const nets = new Set([
    ...Object.keys(input.socials || {}).filter((k) => input.socials[k]?.url),
    ...Object.keys(linkedOnSite),
  ]);
  for (const net of nets) {
    const entry = input.socials?.[net] || {};
    const freq = entry.freq || (entry.url ? "monthly" : null);
    channels.push({
      network: net,
      label: NET_LABEL[net] || net,
      url: entry.url || linkedOnSite[net],
      linkedOnSite: Boolean(linkedOnSite[net]),
      freq,
      freqLabel: freq ? FREQ_LABEL[freq] : "Unbekannt",
      freqScore: freq ? (FREQ_SCORE[freq] ?? 0.3) : 0.3,
    });
  }
  const items = [];
  if (!channels.length) {
    items.push({
      ok: false,
      label: "Social-Media-Kanäle",
      detail: "Keine Kanäle angegeben oder auf der Website verlinkt",
    });
    return { score: 0, items, channels };
  }
  const best = Math.max(...channels.map((c) => c.freqScore));
  const avg = channels.reduce((s, c) => s + c.freqScore, 0) / channels.length;
  const linked = channels.filter((c) => c.linkedOnSite).length;
  items.push({
    ok: channels.length >= 2,
    label: "Anzahl Kanäle",
    detail: `${channels.length} aktiv: ${channels.map((c) => c.label).join(", ")}`,
  });
  for (const c of channels) {
    items.push({
      ok: c.freqScore >= 0.8,
      label: `Beitragshäufigkeit ${c.label}`,
      detail: `${c.freqLabel}${c.freqScore < 0.8 ? " – Empfehlung: mindestens 1× pro Woche" : ""}`,
    });
  }
  items.push({
    ok: linked === channels.length,
    label: "Verlinkung auf der Website",
    detail: `${linked} von ${channels.length} Kanälen sind auf der Website verlinkt`,
  });
  const score = Math.min(
    1,
    0.55 * best +
      0.25 * avg +
      0.1 * Math.min(1, channels.length / 3) +
      0.1 * (linked / channels.length),
  );
  return { score, items, channels };
}

async function checkGoogleBusiness(input, html) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (key && input.company) {
    try {
      const res = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": key,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.websiteUri,places.businessStatus,places.regularOpeningHours,places.photos",
          },
          body: JSON.stringify({
            textQuery: [input.company, input.city].filter(Boolean).join(" "),
            languageCode: "de",
            regionCode: "CH",
            maxResultCount: 3,
          }),
        },
      );
      const data = await res.json();
      const host = input.website
        ? new URL(input.website).hostname.replace(/^www\./, "")
        : "";
      const places = data.places || [];
      const p =
        places.find((x) => host && x.websiteUri?.includes(host)) || places[0];
      if (!p) {
        return {
          verified: true,
          found: false,
          score: 0,
          items: [
            {
              ok: false,
              label: "Google-Business-Profil",
              detail:
                "Kein Eintrag gefunden – bei lokalen Suchen und auf Google Maps unsichtbar",
            },
          ],
        };
      }
      const rating = p.rating ?? null,
        reviews = p.userRatingCount ?? 0;
      const items = [
        {
          ok: true,
          label: "Google-Business-Profil",
          detail: `Gefunden: ${p.displayName?.text || ""}, ${p.formattedAddress || ""}`,
        },
        {
          ok: reviews >= 20,
          label: "Anzahl Bewertungen",
          detail: `${reviews} Bewertungen${reviews < 20 ? " – mehr Bewertungen stärken das Vertrauen" : ""}`,
        },
        {
          ok: rating !== null && rating >= 4.3,
          label: "Durchschnittliche Bewertung",
          detail:
            rating !== null
              ? `${rating.toFixed(1)} von 5 Sternen`
              : "Noch keine Bewertung",
        },
        {
          ok: Boolean(p.websiteUri),
          label: "Website im Profil hinterlegt",
          detail: p.websiteUri ? "Ja" : "Nein",
        },
        {
          ok: Boolean(p.regularOpeningHours),
          label: "Öffnungszeiten hinterlegt",
          detail: p.regularOpeningHours ? "Ja" : "Nein",
        },
        {
          ok: (p.photos?.length || 0) >= 5,
          label: "Fotos im Profil",
          detail: `${p.photos?.length || 0} Fotos (Google liefert max. 10)`,
        },
      ];
      const score =
        0.4 +
        0.15 * Math.min(1, reviews / 50) +
        (rating ? 0.15 * Math.max(0, (rating - 3.5) / 1.5) : 0) +
        (p.websiteUri ? 0.1 : 0) +
        (p.regularOpeningHours ? 0.1 : 0) +
        0.1 * Math.min(1, (p.photos?.length || 0) / 10);
      return {
        verified: true,
        found: true,
        score: Math.min(1, score),
        items,
        mapsUrl: p.googleMapsUri,
        rating,
        reviews,
      };
    } catch {
      /* Fallback unten */
    }
  }
  const mapsHint =
    /google\.[a-z.]+\/maps|maps\.google\.|goo\.gl\/maps|maps\.app\.goo\.gl|g\.page\//i.test(
      html,
    );
  return {
    verified: false,
    found: mapsHint ? "wahrscheinlich" : "unbekannt",
    score: mapsHint ? 0.5 : 0.25,
    items: [
      {
        ok: mapsHint,
        label: "Google-Business-Profil",
        detail: mapsHint
          ? "Website verlinkt auf Google Maps – ein Eintrag existiert wahrscheinlich. Optimierung prüfen wir im Gespräch."
          : "Konnte nicht automatisch bestätigt werden – wir prüfen den Eintrag persönlich.",
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Haupt-Analyse                                                       */
/* ------------------------------------------------------------------ */
export function normalizeUrl(raw) {
  let s = String(raw || "").trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  const u = new URL(s);
  if (!u.hostname.includes("."))
    throw new Error("Bitte eine gültige Website-Adresse angeben.");
  return u.toString();
}

export async function analyze(input) {
  const industry = INDUSTRIES[input.industry] ? input.industry : "other";
  const ind = INDUSTRIES[industry];
  const website = normalizeUrl(input.website);
  if (!website) throw new Error("Bitte eine Website angeben.");

  let page;
  try {
    page = await safeFetch(website);
  } catch (e) {
    // https fehlgeschlagen → http versuchen
    if (website.startsWith("https://")) {
      try {
        page = await safeFetch(website.replace("https://", "http://"));
      } catch {
        /* unten */
      }
    }
    if (!page)
      throw new Error(
        e.message?.includes("erlaubt")
          ? e.message
          : "Die Website konnte nicht geladen werden. Stimmt die Adresse?",
      );
  }
  if (!page.ok)
    throw new Error(`Die Website antwortet mit Fehler ${page.status}.`);

  const origin = page.url.origin;
  const [robots, sitemap] = await Promise.all([
    safeFetch(origin + "/robots.txt", {
      maxBytes: 100_000,
      timeout: 6000,
    }).catch(() => null),
    safeFetch(origin + "/sitemap.xml", {
      maxBytes: 200_000,
      timeout: 6000,
    }).catch(() => null),
  ]);
  const hasRobots = Boolean(
    robots?.ok && /user-agent|sitemap|disallow|allow/i.test(robots.body),
  );
  const hasSitemap = Boolean(
    (sitemap?.ok && /<urlset|<sitemapindex/i.test(sitemap.body)) ||
    /sitemap:/i.test(robots?.body || ""),
  );

  const html = page.body;
  const seo = checkSeo(page, { robots: hasRobots, sitemap: hasSitemap });
  const tracking = detectTracking(html);
  const sea = checkSea(tracking);

  const shopSystems = detectFrom(SHOP_SYSTEMS, html);
  const hasShop = shopSystems.length > 0 || SHOP_WORDS.test(html);
  const bookingSystems = detectFrom(BOOKING_SYSTEMS, html);
  const hasBooking =
    bookingSystems.length > 0 || BOOKING_WORDS.test(textOf(html));
  const newsletterSystems = detectFrom(NEWSLETTER_SYSTEMS, html);
  const hasNewsletterForm = /<input[^>]+type=["']?email/i.test(html);
  const hasNewsletter =
    newsletterSystems.length > 0 ||
    (NEWSLETTER_WORDS.test(textOf(html)) && hasNewsletterForm);

  const linkedOnSite = findSocialLinks(html);
  const social = checkSocial(input, linkedOnSite);
  const gbp = await checkGoogleBusiness(
    { ...input, website: page.url.toString() },
    html,
  );

  const rel = { hoch: 1, mittel: 0.5, gering: 0 };
  const categories = [
    {
      id: "seo",
      title: "Website & SEO",
      weight: 25,
      score: seo.score,
      items: seo.items,
    },
    {
      id: "gbp",
      title: "Google-Business-Profil",
      weight: 20,
      score: gbp.score,
      items: gbp.items,
      verified: gbp.verified,
    },
    {
      id: "social",
      title: "Social Media",
      weight: 20,
      score: social.score,
      items: social.items,
      channels: social.channels,
      selfReported: true,
    },
    {
      id: "sea",
      title: "Online-Werbung (SEA) & Tracking",
      weight: 12,
      score: sea.score,
      items: sea.items,
      note: sea.note,
    },
    {
      id: "newsletter",
      title: "Newsletter",
      weight: 9,
      score: hasNewsletter ? 1 : 0,
      items: [
        {
          ok: hasNewsletter,
          label: "Newsletter-Anmeldung",
          detail: hasNewsletter
            ? `Gefunden${newsletterSystems.length ? ` (${newsletterSystems.join(", ")})` : ""}`
            : "Keine Anmeldung gefunden – E-Mail ist der günstigste Kanal für Stammkundschaft",
        },
      ],
    },
    {
      id: "shop",
      title: "Online-Shop",
      relevance: ind.shop,
      weight: 7 * rel[ind.shop],
      score: hasShop ? 1 : 0,
      hint: ind.shopHint,
      items: [
        {
          ok: hasShop,
          label: "Online-Shop",
          detail: hasShop
            ? `Gefunden${shopSystems.length ? ` (${shopSystems.join(", ")})` : ""}`
            : ind.shop === "gering"
              ? "Kein Shop – für deine Branche meist auch nicht nötig"
              : "Kein Online-Shop gefunden",
        },
      ],
    },
    {
      id: "booking",
      title: "Online-Buchung",
      relevance: ind.booking,
      weight: 7 * rel[ind.booking],
      score: hasBooking ? 1 : 0,
      hint: ind.bookingHint,
      items: [
        {
          ok: hasBooking,
          label: "Online-Buchung / Reservation",
          detail: hasBooking
            ? `Gefunden${bookingSystems.length ? ` (${bookingSystems.join(", ")})` : ""}`
            : ind.booking === "gering"
              ? "Keine Online-Buchung – für deine Branche meist nicht nötig"
              : "Keine Online-Buchung gefunden",
        },
      ],
    },
  ];

  const weighted = categories.filter((c) => c.weight > 0);
  const total = weighted.reduce((s, c) => s + c.weight, 0);
  const score = Math.round(
    (weighted.reduce((s, c) => s + c.score * c.weight, 0) / total) * 100,
  );

  return {
    checkedAt: new Date().toISOString(),
    company: input.company || page.url.hostname,
    city: input.city || "",
    industry,
    industryLabel: ind.label,
    url: page.url.toString(),
    score,
    categories,
    snapshot: pageSnapshot(html),
    facts: {
      hasShop,
      hasBooking,
      hasNewsletter,
      tracking,
      gbpFound: gbp.found,
      gbpVerified: gbp.verified,
      socialCount: social.channels.length,
      seoScore: Math.round(seo.score * 100),
      shopRelevance: ind.shop,
      bookingRelevance: ind.booking,
    },
  };
}
