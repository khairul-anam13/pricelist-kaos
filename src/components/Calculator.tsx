import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import { categories } from '../data'
import { formatRupiah, useTween } from '../hooks'
import {
  SINGLE_PCS_SURCHARGE,
  findOption,
  hasLongSleeve,
  newLine,
  summarize,
  unitPrice,
  type CartLine,
} from '../cart'

interface Props {
  lines: CartLine[]
  setLines: Dispatch<SetStateAction<CartLine[]>>
}

const clamp = (n: number) => Math.min(999, Math.max(0, Math.floor(n) || 0))

export default function Calculator({ lines, setLines }: Props) {
  const summary = summarize(lines)
  const grand = useTween(summary.total)

  const patch = (id: number, p: Partial<CartLine>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...p } : l)))

  const setQty = (id: number, size: string, n: number) =>
    setLines((ls) =>
      ls.map((l) => (l.id === id ? { ...l, qty: { ...l.qty, [size]: clamp(n) } } : l)),
    )

  return (
    <section id="hitung" className="calc" aria-labelledby="calc-title">
      <header className="calc__head">
        <h2 id="calc-title">Hitung belanja</h2>
        <p>Pilih jenis kaos, lalu isi jumlah per ukuran. Total langsung terhitung.</p>
      </header>

      {lines.map((line, idx) => {
        const o = findOption(line.key)
        const { sizes, longSleeveExtra } = o.category
        const sleeve = hasLongSleeve(o, line)
        const s = summary.rows[idx]

        return (
          <div
            key={line.id}
            className="line"
            style={{ '--accent': o.category.color } as CSSProperties}
          >
            <div className="line__top">
              <label className="field">
                <span className="field__label">Jenis kaos</span>
                <select
                  value={line.key}
                  onChange={(e) => patch(line.id, { key: e.target.value })}
                >
                  {categories
                    .filter((c) => c.rows.length > 0)
                    .map((c) => (
                      <optgroup key={c.id} label={c.title}>
                        {c.rows.map((r, i) => (
                          <option key={r.label} value={`${c.id}:${i}`}>
                            {c.title} – {r.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                </select>
              </label>

              {longSleeveExtra ? (
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={line.longSleeve}
                    onChange={(e) => patch(line.id, { longSleeve: e.target.checked })}
                  />
                  <span className="switch__track" aria-hidden="true">
                    <span className="switch__thumb" />
                  </span>
                  <span className="switch__label">
                    Lengan panjang <small>+{formatRupiah(longSleeveExtra)}</small>
                  </span>
                </label>
              ) : null}

              <button
                type="button"
                className="line__del"
                aria-label="Hapus jenis ini"
                onClick={() => setLines((ls) => ls.filter((l) => l.id !== line.id))}
              >
                ×
              </button>
            </div>

            <ul className="sizes">
              {sizes.map((size, i) => {
                const price = unitPrice(o, i, sleeve)
                const n = line.qty[size] ?? 0
                if (price === null) {
                  return (
                    <li key={size} className="size size--off">
                      <span className="size__name">{size}</span>
                      <span className="size__price" aria-label="Tidak tersedia">–</span>
                    </li>
                  )
                }
                return (
                  <li key={size} className={`size${n > 0 ? ' size--on' : ''}`}>
                    <span className="size__name">{size}</span>
                    <span className="size__price">{formatRupiah(price)}</span>
                    <div className="stepper">
                      <button
                        type="button"
                        aria-label={`Kurangi ${size}`}
                        disabled={n === 0}
                        onClick={() => setQty(line.id, size, n - 1)}
                      >
                        −
                      </button>
                      <input
                        inputMode="numeric"
                        aria-label={`Jumlah ${size}`}
                        placeholder="0"
                        value={n || ''}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          setQty(line.id, size, Number(e.target.value.replace(/\D/g, '')))
                        }
                      />
                      <button
                        type="button"
                        aria-label={`Tambah ${size}`}
                        onClick={() => setQty(line.id, size, n + 1)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="line__sum">
              {s.pcs === 0 ? (
                <span className="line__hint">Belum ada jumlah.</span>
              ) : (
                <>
                  <span>
                    {s.pcs} pcs · Rp {formatRupiah(s.subtotal)}
                  </span>
                  {s.surcharge > 0 && (
                    <span className="line__warn">
                      Hanya 1 pcs: +Rp {formatRupiah(SINGLE_PCS_SURCHARGE)}. Ambil 2 pcs atau lebih
                      untuk harga normal.
                    </span>
                  )}
                  <strong>Rp {formatRupiah(s.total)}</strong>
                </>
              )}
            </div>
          </div>
        )
      })}

      <button type="button" className="calc__add" onClick={() => setLines((ls) => [...ls, newLine()])}>
        + Tambah jenis lain
      </button>

      <div className="calc__total" role="status">
        <div className="calc__meta">
          <span>{summary.pcs} pcs</span>
          {summary.surcharge > 0 && <span>termasuk tambahan 1 pcs Rp {formatRupiah(summary.surcharge)}</span>}
        </div>
        <div className="calc__grand">
          <span>Total belanja</span>
          <strong>Rp {formatRupiah(grand)}</strong>
        </div>
        <button
          type="button"
          className="calc__reset"
          disabled={lines.length === 1 && summary.pcs === 0}
          onClick={() => setLines([newLine()])}
        >
          Kosongkan
        </button>
      </div>
    </section>
  )
}
