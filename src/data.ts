export type Swatch = 'putih' | 'hitam' | 'warna' | 'hitam-warna'

export interface PriceRow {
  label: string
  swatch: Swatch
  /** Harga per ukuran, urutannya mengikuti `sizes`. null = tidak tersedia */
  prices: (number | null)[]
}

export interface Category {
  id: string
  title: string
  /** warna header kartu (mengikuti warna di daftar harga asli) */
  color: string
  /** warna teks header, default putih */
  textColor?: string
  sizes: string[]
  rows: PriceRow[]
  /** tambahan harga per pcs untuk lengan panjang */
  longSleeveExtra?: number
  note?: string
}

const SIZES_7 = ['S', 'M', 'ML', 'L', 'XL', 'XXL', 'XXXL']
const SIZES_6 = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export const categories: Category[] = [
  {
    id: 'combed-20s',
    title: 'Kaos Combed 20s',
    color: '#2f8be6',
    sizes: SIZES_7,
    longSleeveExtra: 9000,
    rows: [
      { label: 'Putih', swatch: 'putih', prices: [29000, 31000, 33000, 34000, 36000, 39000, 44000] },
      { label: 'Hitam', swatch: 'hitam', prices: [32000, 34000, 36000, 37000, 39000, 42000, 47000] },
      { label: 'Warna', swatch: 'warna', prices: [32000, 34000, 36000, 37000, 39000, 42000, 47000] },
    ],
  },
  {
    id: 'combed-24s',
    title: 'Kaos Combed 24s',
    color: '#1f4e9c',
    sizes: SIZES_7,
    longSleeveExtra: 9000,
    rows: [
      { label: 'Putih', swatch: 'putih', prices: [28000, 30000, 32000, 33000, 35000, 38000, 43000] },
      { label: 'Hitam', swatch: 'hitam', prices: [31000, 33000, 35000, 36000, 38000, 41000, 46000] },
      { label: 'Warna', swatch: 'warna', prices: [31000, 33000, 35000, 36000, 38000, 41000, 46000] },
    ],
  },
  {
    id: 'combed-30s',
    title: 'Kaos Combed 30s',
    color: '#f5b800',
    textColor: '#2b2100',
    sizes: SIZES_7,
    longSleeveExtra: 8000,
    rows: [
      { label: 'Putih', swatch: 'putih', prices: [23000, 25000, 27000, 28000, 30000, 33000, 38000] },
      { label: 'Hitam', swatch: 'hitam', prices: [26000, 28000, 30000, 31000, 33000, 36000, 41000] },
      { label: 'Warna', swatch: 'warna', prices: [26000, 28000, 30000, 31000, 33000, 36000, 41000] },
    ],
  },
  {
    id: 'krah-carded',
    title: 'Kaos Krah Carded',
    color: '#1f4e9c',
    sizes: SIZES_6,
    longSleeveExtra: 9000,
    rows: [
      { label: 'Hitam', swatch: 'hitam', prices: [46000, 48000, 50000, 52000, 55000, 60000] },
      { label: 'Warna', swatch: 'warna', prices: [46000, 48000, 50000, 52000, 55000, 60000] },
    ],
  },
  {
    id: 'krah-lacost-pique',
    title: 'Kaos Krah Lacost Pique',
    color: '#8e5bc9',
    sizes: SIZES_6,
    longSleeveExtra: 9000,
    rows: [
      { label: 'Hitam', swatch: 'hitam', prices: [null, 57000, 57000, 57000, 61000, 66000] },
      { label: 'Warna', swatch: 'warna', prices: [null, 57000, 57000, 57000, 61000, 66000] },
    ],
  },
  {
    id: 'stelan-anak',
    title: 'Kaos Stelan Anak',
    color: '#d9822b',
    sizes: SIZES_6,
    rows: [
      { label: 'Hitam / Warna', swatch: 'hitam-warna', prices: [28000, 29000, 30000, 31000, 34000, null] },
    ],
  },
  {
    id: 'atasan-anak',
    title: 'Kaos Atasan Anak Combed',
    color: '#2e9e4f',
    sizes: SIZES_6,
    rows: [
      { label: 'Putih', swatch: 'putih', prices: [18000, 19000, 20000, 21000, 23000, null] },
      { label: 'Hitam / Warna', swatch: 'hitam-warna', prices: [19000, 20000, 21000, 22000, 24000, null] },
    ],
  },
  {
    id: 'hoodie-zipper',
    title: 'Hoodie / Zipper Flace Poly',
    color: '#5b2a9e',
    sizes: SIZES_6,
    rows: [
      { label: 'Hoodie', swatch: 'hitam-warna', prices: [63000, 63000, 66000, 66000, 69000, 74000] },
      { label: 'Zipper', swatch: 'hitam-warna', prices: [66000, 66000, 69000, 69000, 72000, 77000] },
    ],
  },
  {
    id: 'sweatpants',
    title: 'Celana Sweatpants',
    color: '#e0242e',
    sizes: [],
    rows: [],
    note: 'Daftar harga sweatpants segera menyusul.',
  },
]
