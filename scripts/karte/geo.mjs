import * as topojson from 'topojson-client'
import { geoMercator, geoPath, geoCentroid, geoDistance } from 'd3-geo'
import { readFileSync, writeFileSync } from 'node:fs'
import { readDbf } from './dbf.mjs'

const Y = '2024'
const dir = `node_modules/swiss-maps/${Y}`
const topo = JSON.parse(readFileSync(`${dir}/ch-combined.json`, 'utf-8'))
const clean = (s) => s.replace(/\0/g, '').trim()
const namen = (f) => Object.fromEntries(readDbf(`${dir}/${f}.dbf`).rows.map((r) => [r.id, clean(r.name)]))
const nCantons = namen('cantons'), nMuni = namen('municipalities'), nLakes = namen('lakes')

// Ausschnitt: Appenzell, St. Gallen, Bodensee, Rheintal
const W = 1200, H = 900
const win = { type: 'Polygon', coordinates: [[[9.10, 47.215], [9.10, 47.60], [9.80, 47.60], [9.80, 47.215], [9.10, 47.215]]] }
const proj = geoMercator().fitExtent([[0, 0], [W, H]], win)
proj.clipExtent([[-40, -40], [W + 40, H + 40]])
const path = geoPath(proj).digits(1)

const cantons = topojson.feature(topo, topo.objects.cantons).features.map((f) => ({ name: nCantons[f.id], d: path(f) })).filter((c) => c.d)
const lakes = topojson.feature(topo, topo.objects.lakes).features.map((f) => ({ name: nLakes[f.id], d: path(f) })).filter((c) => c.d)
const land = path(topojson.feature(topo, topo.objects.country))
const cantonBorders = path(topojson.mesh(topo, topo.objects.cantons, (a, b) => a !== b))
const countryBorder = path(topojson.mesh(topo, topo.objects.country, (a, b) => a === b))
const muniBorders = path(topojson.mesh(topo, topo.objects.municipalities, (a, b) => a !== b))

// Orte im Ausschnitt (Schwerpunkt der Gemeinde)
const places = {}
for (const f of topojson.feature(topo, topo.objects.municipalities).features) {
  const c = geoCentroid(f)
  if (c[0] < 9.05 || c[0] > 9.85 || c[1] < 47.17 || c[1] > 47.64) continue
  const p = proj(c)
  if (!p || p[0] < 8 || p[0] > W - 8 || p[1] < 8 || p[1] > H - 8) continue
  places[nMuni[f.id]] = { lon: +c[0].toFixed(4), lat: +c[1].toFixed(4), x: +p[0].toFixed(1), y: +p[1].toFixed(1) }
}
const pt = (lon, lat) => { const p = proj([lon, lat]); return { lon, lat, x: +p[0].toFixed(1), y: +p[1].toFixed(1) } }
// Nordufer des Bodensees (Deutschland/Österreich) von Hand, damit der See nicht an der Landesgrenze abbricht.
const nordPts = [[9.1,47.7],[9.35,47.7],[9.4,47.69],[9.48,47.658],[9.55,47.61],[9.62,47.575],[9.68,47.55],[9.74,47.51],[9.76,47.49],[9.62,47.455],[9.49,47.455],[9.4,47.5],[9.33,47.55],[9.22,47.615],[9.12,47.645]]
const nordsee = path({ type: 'Polygon', coordinates: [[...nordPts, nordPts[0]]] })
const out = { nordsee,
  W, H, land, cantons, lakes, cantonBorders, countryBorder, muniBorders, places,
  upk: +(proj.scale() / (6371 * Math.cos(47.41 * Math.PI / 180))).toFixed(2),
  extras: { saentis: pt(9.3434, 47.2494), bodensee: pt(9.55, 47.585), rheintal: pt(9.665, 47.30), oesterreich: pt(9.77, 47.44), liechtenstein: pt(9.56, 47.225) },
}
const PIN_NAMEN = { Trogen: 'Trogen', Teufen: 'Teufen (AR)', Romanshorn: 'Romanshorn', 'St. Gallen': 'St. Gallen', Herisau: 'Herisau', Haslen: 'Schlatt-Haslen', Speicher: 'Speicher' }
out.punkte = Object.fromEntries(Object.entries(PIN_NAMEN).map(([k, v]) => [k, places[v] ? { x: places[v].x, y: places[v].y, lon: places[v].lon, lat: places[v].lat } : null]))
out.punkte.Ebenalp = pt(9.415, 47.2845)
const STAEDTE = ['Arbon', 'Rorschach', 'Gossau (SG)', 'Appenzell', 'Altstätten', 'Urnäsch', 'Heiden', 'Gais']
out.staedte = Object.fromEntries(STAEDTE.filter((n) => places[n]).map((n) => [n.replace(/ \(.*\)$/, ''), { x: places[n].x, y: places[n].y }]))
delete out.places
writeFileSync(process.argv[2] ?? 'karte.json', JSON.stringify(out))
const kb = (s) => Math.round(s.length / 1024)
console.log('Kantone:', cantons.map((c) => c.name).join(', '))
console.log('Seen:', lakes.map((l) => l.name).join(', '))
console.log('Orte im Ausschnitt:', Object.keys(places).length)
for (const n of ['Speicher', 'Trogen', 'Herisau', 'Appenzell', 'St. Gallen', 'Romanshorn', 'Rorschach', 'Heiden', 'Gais', 'Altstätten', 'Arbon', 'Teufen (AR)', 'Bühler', 'Urnäsch', 'Gossau (SG)', 'Wil (SG)', 'Walzenhausen', 'Rehetobel']) console.log(' ', n, JSON.stringify(places[n] || 'FEHLT'))
const km = (a, b) => (geoDistance([a.lon, a.lat], [b.lon, b.lat]) * 6371).toFixed(1)
console.log('Speicher-Trogen km', km(places['Speicher'], places['Trogen']), '| -Herisau', km(places['Speicher'], places['Herisau']), '| -Romanshorn', km(places['Speicher'], places['Romanshorn']))
console.log('Grösse KB: land', kb(land), 'kantone', cantons.reduce((s, c) => s + kb(c.d), 0), 'seen', lakes.reduce((s, c) => s + kb(c.d), 0), 'gemeindegrenzen', kb(muniBorders), 'total', kb(JSON.stringify(out)))
