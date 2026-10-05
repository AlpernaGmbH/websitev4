// Schweizer Schreibweise. Bewusst ohne Intl, damit Server und Browser identisch ausgeben.

/** 25000 -> «25’000» */
export function fmt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '’')
}

/** 1000 -> «CHF 1’000» */
export function chf(n: number): string {
  return `CHF ${fmt(n)}`
}
