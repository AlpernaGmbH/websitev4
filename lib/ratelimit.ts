// Einfache Begrenzung pro Serverinstanz. Reicht gegen Skripte, ersetzt kein Captcha.
const treffer = new Map<string, number[]>()

/**
 * Zählt eine Anfrage und sagt, ob der Schlüssel das Limit überschritten hat.
 * Gesperrte Anfragen zählen mit, wer weiter klopft, bleibt also gesperrt.
 */
export function zuOft(key: string, max: number, fensterMs: number, jetzt = Date.now()): boolean {
  const liste = (treffer.get(key) ?? []).filter((t) => jetzt - t < fensterMs)
  liste.push(jetzt)
  treffer.set(key, liste)
  if (treffer.size > 5000) {
    for (const [k, v] of treffer) if (v.every((t) => jetzt - t >= fensterMs)) treffer.delete(k)
  }
  return liste.length > max
}

/** IP des Besuchers. Vercel setzt `x-forwarded-for` selbst, ein vom Besucher mitgeschickter Wert wird überschrieben. */
export function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unbekannt'
}
