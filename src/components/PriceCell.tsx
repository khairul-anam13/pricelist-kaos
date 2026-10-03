import { formatRupiah, useTween } from '../hooks'

interface Props {
  value: number | null
}

export default function PriceCell({ value }: Props) {
  // useTween harus selalu dipanggil; untuk harga kosong pakai 0 lalu tidak ditampilkan
  const shown = useTween(value ?? 0)

  if (value === null) {
    return <td className="cell cell--empty" aria-label="Tidak tersedia">–</td>
  }
  return <td className="cell">{formatRupiah(shown)}</td>
}
