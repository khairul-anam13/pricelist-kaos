import { useMemo, useState } from 'react'
import { categories } from './data'
import PriceCard from './components/PriceCard'
import Calculator from './components/Calculator'
import { newLine, summarize, type CartLine } from './cart'
import { formatRupiah } from './hooks'

const ALL = 'semua'

export default function App() {
  const [active, setActive] = useState<string>(ALL)
  const [longSleeve, setLongSleeve] = useState(false)
  const [lines, setLines] = useState<CartLine[]>(() => [newLine()])
  const cart = summarize(lines)

  const visible = useMemo(
    () => (active === ALL ? categories : categories.filter((c) => c.id === active)),
    [active],
  )

  return (
    <div className="page">
      <header className="hero">
        <p className="hero__eyebrow">Harga Grosir</p>
        <h1>Pricelist Kaos &amp; Apparel</h1>
        <p className="hero__sub">
          Harga per pcs dalam Rupiah. Pilih kategori atau aktifkan lengan panjang untuk melihat
          harga akhir.
        </p>
      </header>

      <div className="toolbar" role="region" aria-label="Filter harga">
        <div className="chips" role="tablist" aria-label="Kategori">
          <button
            role="tab"
            aria-selected={active === ALL}
            className={`chip${active === ALL ? ' chip--on' : ''}`}
            onClick={() => setActive(ALL)}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={active === c.id}
              className={`chip${active === c.id ? ' chip--on' : ''}`}
              onClick={() => setActive(c.id)}
            >
              {c.title.replace(/^Kaos /, '')}
            </button>
          ))}
        </div>

        <div className="toolbar__right">
          <label className="switch">
            <input
              type="checkbox"
              checked={longSleeve}
              onChange={(e) => setLongSleeve(e.target.checked)}
            />
            <span className="switch__track" aria-hidden="true">
              <span className="switch__thumb" />
            </span>
            <span className="switch__label">Lengan panjang</span>
          </label>

          <a href="#hitung" className="cartlink">
            Hitung belanja
            {cart.pcs > 0 && (
              <span className="cartlink__sum">
                {cart.pcs} pcs · Rp {formatRupiah(cart.total)}
              </span>
            )}
          </a>
        </div>
      </div>

      <main className="grid">
        {visible.map((c, i) => (
          <PriceCard key={c.id} category={c} longSleeve={longSleeve} index={i} />
        ))}
      </main>

      <Calculator lines={lines} setLines={setLines} />

      <footer className="page__foot">
        Harga dapat berubah sewaktu-waktu. Hubungi kami untuk konfirmasi stok dan warna.
      </footer>
    </div>
  )
}
