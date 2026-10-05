import { readFileSync } from 'node:fs'
export function readDbf(path, enc = 'utf-8') {
  const b = readFileSync(path)
  const n = b.readUInt32LE(4), hl = b.readUInt16LE(8), rl = b.readUInt16LE(10)
  const fields = []
  for (let o = 32; b[o] !== 0x0d; o += 32) {
    fields.push({ name: b.toString('ascii', o, o + 11).replace(/\0.*$/, ''), len: b[o + 16] })
  }
  const dec = new TextDecoder(enc)
  const rows = []
  for (let i = 0; i < n; i++) {
    let o = hl + i * rl + 1
    const row = {}
    for (const f of fields) { row[f.name] = dec.decode(b.subarray(o, o + f.len)).trim(); o += f.len }
    rows.push(row)
  }
  return { fields: fields.map((f) => f.name), rows }
}
