import type { CSSProperties } from 'react'
import type { Category } from '../data'
import { formatRupiah, useInView } from '../hooks'
import PriceCell from './PriceCell'

interface Props {
  category: Category
  longSleeve: boolean
  index: number
}

export default function PriceCard({ category, longSleeve, index }: Props) {
  const { ref, inView } = useInView<HTMLElement>()
  const { title, color, textColor, sizes, rows, longSleeveExtra, note } = category

  const style = {
    '--accent': color,
    '--accent-text': textColor ?? '#ffffff',
    '--delay': `${Math.min(index, 4) * 70}ms`,
  } as CSSProperties

  const extra = longSleeve && longSleeveExtra ? longSleeveExtra : 0

  return (
    <article ref={ref} className={`card${inView ? ' card--in' : ''}`} style={style}>
      <header className="card__head">
        <h2>{title}</h2>
        <span className="card__tag">{rows.length > 0 ? 'Harga Grosir' : 'Segera'}</span>
      </header>

      {rows.length === 0 ? (
        <p className="card__empty">{note ?? 'Belum ada data harga.'}</p>
      ) : (
        <>
          <div className="card__scroll">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="table__corner">Size</th>
                  {sizes.map((s) => (
                    <th scope="col" key={s}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="table__label">
                      <span className={`dot dot--${row.swatch}`} aria-hidden="true" />
                      {row.label}
                    </th>
                    {row.prices.map((p, i) => (
                      <PriceCell key={sizes[i]} value={p === null ? null : p + extra} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="card__foot">
            {longSleeveExtra ? (
              <span className={longSleeve ? 'foot--active' : undefined}>
                {longSleeve
                  ? `Harga sudah termasuk lengan panjang (+${formatRupiah(longSleeveExtra)}/pcs)`
                  : `Lengan panjang +${formatRupiah(longSleeveExtra)}/pcs`}
              </span>
            ) : (
              <span>Harga per pcs</span>
            )}
          </footer>
        </>
      )}
    </article>
  )
}
