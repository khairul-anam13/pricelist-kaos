import { categories, type Category, type PriceRow } from './data'

/** tambahan harga bila satu jenis kaos hanya diambil 1 pcs (total semua ukuran) */
export const SINGLE_PCS_SURCHARGE = 3000

export interface CartLine {
  id: number
  /** `${categoryId}:${indeks baris}` */
  key: string
  longSleeve: boolean
  /** jumlah per ukuran */
  qty: Record<string, number>
}

export interface Option {
  category: Category
  row: PriceRow
}

const firstKey = (() => {
  const c = categories.find((x) => x.rows.length > 0)!
  return `${c.id}:0`
})()

let nextId = 1
export const newLine = (): CartLine => ({ id: nextId++, key: firstKey, longSleeve: false, qty: {} })

export function findOption(key: string): Option {
  const [id, i] = key.split(':')
  const category = categories.find((c) => c.id === id)!
  return { category, row: category.rows[Number(i)] }
}

/** lengan panjang hanya berlaku bila kategorinya punya tambahan harga */
export const hasLongSleeve = (o: Option, line: CartLine): boolean =>
  line.longSleeve && !!o.category.longSleeveExtra

export function unitPrice(o: Option, sizeIndex: number, longSleeve: boolean): number | null {
  const p = o.row.prices[sizeIndex]
  if (p === null) return null
  return p + (longSleeve ? o.category.longSleeveExtra ?? 0 : 0)
}

export interface LineSummary {
  pcs: number
  subtotal: number
  surcharge: number
  total: number
}

export function summarize(lines: CartLine[]) {
  const pcsByKind = new Map<string, number>()

  const base = lines.map((line) => {
    const o = findOption(line.key)
    const sleeve = hasLongSleeve(o, line)
    let pcs = 0
    let subtotal = 0
    o.category.sizes.forEach((size, i) => {
      const price = unitPrice(o, i, sleeve)
      const n = line.qty[size] ?? 0
      if (price === null || n <= 0) return
      pcs += n
      subtotal += n * price
    })
    // baris ganda untuk jenis yang sama dihitung sebagai satu jenis
    const kind = `${line.key}|${sleeve}`
    pcsByKind.set(kind, (pcsByKind.get(kind) ?? 0) + pcs)
    return { kind, pcs, subtotal }
  })

  const rows: LineSummary[] = base.map(({ kind, pcs, subtotal }) => {
    const surcharge = pcs === 1 && pcsByKind.get(kind) === 1 ? SINGLE_PCS_SURCHARGE : 0
    return { pcs, subtotal, surcharge, total: subtotal + surcharge }
  })

  const sum = (f: (r: LineSummary) => number) => rows.reduce((a, r) => a + f(r), 0)
  return { rows, pcs: sum((r) => r.pcs), surcharge: sum((r) => r.surcharge), total: sum((r) => r.total) }
}
