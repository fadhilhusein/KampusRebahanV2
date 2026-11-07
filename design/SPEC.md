# KampusRebahan UI Spec (dari `design/kampusrebahan.pen`)

Sumber: file pen.dev `design/kampusrebahan.pen` (frame "Design System" + 42 layar). Semua nilai di bawah diambil dari file itu. Spec ini cukup untuk implementasi tanpa membuka .pen.

Arah gaya: halaman full-screen (bukan kartu mengambang), latar abu-putih rata, tipografi sans tebal dan rapat, tombol pil hitam (primer) dan pil abu (sekunder), kartu putih membulat dengan bayangan lembut. Tanpa glow, glass, blur, atau teks gradien.

---

## 1. Design tokens

### 1.1 Warna (hanya light; dark mode BELUM didesain)

| Token | Hex | Pakai untuk |
|---|---|---|
| `bg` | `#E9ECF0` | latar frame Design System saja (tidak dipakai di layar) |
| `card` | `#F7F7F8` | **latar halaman** (body), latar baris kredensial |
| `surface` | `#FFFFFF` | kartu, input, tabel, tombol ikon, menu pil navbar |
| `ink` | `#111113` | teks utama, tombol primer, tab/chip aktif, kartu saldo gelap |
| `muted` | `#5B5F66` | teks sekunder, label tabel, placeholder (kontras ≥ 5:1 di `card`/`surface`) |
| `pill` | `#E8E9EC` | tombol sekunder, chip/tab tidak aktif, skeleton |
| `line` | `#8A8E96` | border input dan search (≥ 3:1 untuk indikator non-teks) |
| `hairline` | `#E2E3E6` | pembatas baris tabel, footer top border, border kartu varian |
| `accent` | `#2447E0` | bubble `@nama`, ring fokus tombol |
| `success` / `success-bg` | `#146C3A` / `#DDF3E4` | badge Selesai, ikon cek, nominal saldo masuk |
| `warn` / `warn-bg` | `#8A4B08` / `#FDEBCB` | badge Menunggu, countdown |
| `danger` / `danger-bg` | `#A4210F` / `#FBE0DA` | badge Dibatalkan/Gagal, tombol Tolak, input error |
| teks di atas `ink` | `#FFFFFF` (utama), `#C9CBD1` (label sekunder) | kartu saldo/statistik gelap |
| ikon cek di toast | `#7BE0A0` | toast sukses |

Saran implementasi: CSS variables di `app/globals.css` (`--kr-card`, `--kr-ink`, dst.) lalu dipetakan ke `@theme` Tailwind 4.

### 1.2 Tipografi

- Heading: **Inter Tight** (Google Fonts, `next/font/google`), bobot 600/700/800.
- Body: **Inter**, bobot 400/500/600.

| Gaya | Font | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| Display hero (desktop) | Inter Tight | 84 | 700 | -4px | 0.98 |
| Display hero (mobile) | Inter Tight | 42 | 700 | -2px | 1.0 |
| H1 halaman desktop | Inter Tight | 64 (auth, status, produk, legal) / 56 (dashboard, checkout, detail) | 700 | -3px (64) / -2.5px (56) | default (~1.1) |
| H1 halaman mobile | Inter Tight | 34–36 | 700 | -1.5px | default |
| H2 section | Inter Tight | 44 (landing) / 32 (ulasan) / 28 (mobile) | 700 | -1.5 / -1 / -1px | default |
| Judul kartu | Inter Tight | 20–24 | 600 | -0.4 s/d -0.6px | default |
| Angka statistik | Inter Tight | 40 desktop / 32 mobile (admin 36/30, mini 24) | 700 | -1.5px | default |
| Harga besar | Inter Tight | 36 (detail) / 24 (total, buy bar) / 18 (kartu produk) | 700 | -1.5 / -0.8 / 0 | default |
| 404 | Inter Tight | 200 desktop / 120 mobile | 700 | -10 / -6px | 0.9 |
| Body besar | Inter | 16 | 400 | 0 | 1.5 |
| Body | Inter | 14 | 400/500 | 0 | default |
| Small | Inter | 13 | 400/600 | 0 | default |
| Label/caption | Inter | 12 | 500/600 | 0 (overline: +1.2px, UPPERCASE) | default |

Ukuran minimum 12px. Tidak boleh lebih kecil.

### 1.3 Radius

| Nilai | Pakai |
|---|---|
| 999 (full) | tombol, chip, tab, badge, search, menu navbar, tombol ikon, banner pembelian |
| 36 | panel QR desktop, visual detail produk |
| 28 | kartu produk, kartu dashboard/statistik, ringkasan, kartu form mobile |
| 32 | kartu form auth desktop, kartu kredensial desktop |
| 24 | tabel, kartu ulasan, opsi metode bayar, item mobile |
| 20 | tile gambar kartu produk, kartu varian, QR placeholder, toast |
| 16 | baris kredensial, thumbnail ringkasan |
| 14 | input field |
| 9–10 | logo mark |
| Bubble `@nama` | `[18,18,18,4]` (TL,TR,BR,BL) |

### 1.4 Bayangan

| Nama | Nilai CSS |
|---|---|
| `shadow-card` | `0 10px 30px rgba(17,18,19,0.10)` (`#1112131A`) |
| `shadow-sm` | `0 2px 8px rgba(17,18,19,0.08)` (`#11121314`), untuk tombol ikon, menu navbar, banner |

### 1.5 Spacing dan layout

- Skala: 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 40 / 48 / 56 / 64.
- **Halaman full-screen**: `min-height: 100vh` (desain: 900px desktop, 844px mobile), latar `card`, tidak ada wrapper membulat atau bayangan.
- Padding halaman: desktop `24px 80px 48px` (atas, kanan/kiri, bawah). Mobile `16px 20px 28px`.
- Lebar kanvas desain: 1440 desktop (konten 1280), 390 mobile (konten 350). Implementasi: `max-w-[1280px] mx-auto px-5 md:px-20`.
- Jarak antar section (gap vertikal): 48 desktop (40 di dashboard), 32 mobile (24 di dashboard).
- Footer menempel di bawah layar (flex column + spacer `flex-1`).
- Halaman auth, sukses/batal bayar, dan 404: konten di tengah vertikal (spacer `flex-1` di atas dan di bawah konten).
- Breakpoint: desain mobile untuk < 768px, desktop ≥ 1024px. Di 768–1023 pakai desktop dengan grid dikurangi (produk 2–3 kolom).

### 1.6 Navbar

- Desktop: satu baris `justify-between`, `align-center`, tinggi sekitar 48px, tanpa latar.
  - Kiri: logo mark 32×32 (radius 10, `ink`, huruf "K" Inter Tight 18/800 putih) + teks "KampusRebahan" Inter Tight 18/700, -0.4px. Gap 10.
  - Tengah: **pil menu** `surface`, radius full, padding `12px 28px`, gap 28, `shadow-sm`. Isi: Produk, Cara beli, Riwayat, Bantuan (Inter 14/500 `ink`).
  - Kanan: 2 tombol ikon 44×44 (user, sun/moon), gap 10.
- Mobile: logo mark 30×30 (radius 9, "K" 16/800) + teks 16/700. Kanan: tombol ikon tema + tombol ikon `menu` (hamburger) 44×44, gap 8. Menu tengah disembunyikan dan dibuka lewat hamburger (sheet/dropdown: perlu `aria-expanded`, tutup dengan Escape).

---

## 2. Komponen

Semua kontrol interaktif wajib punya **fokus keyboard**: `outline: 3px solid var(--accent); outline-offset: 2px` (tombol) atau border 2px `ink` (input). Jangan `outline-none` tanpa pengganti. Tap target minimal 44px.

### Tombol
| Varian | Spesifikasi |
|---|---|
| Primer | bg `ink`, teks putih Inter 14/600, padding `14px 26px`, radius full, gap ikon 8. Hover: bg `#2A2A2E`. Fokus: outline 3px `accent` offset 2px. Disabled: opacity .5 |
| Sekunder | bg `pill`, teks `ink` 14/600, padding sama. Hover: bg `#DCDDE1` |
| Bahaya | bg `danger-bg`, teks `danger` 14/600. Hover: bg `#F7CFC6` |
| Kecil (di kartu/tabel) | padding `10px 18px` (kartu produk "Beli") atau `8px 16px` dan teks 13 (aksi tabel, "Salin") |
| Ikon | 44×44 (40×40 untuk Salin), lingkaran `surface`, border 1px `hairline`, `shadow-sm`, ikon lucide 18px `ink`. Wajib `aria-label` |
| Full width | tombol form dan mobile memakai `w-full` |

Catatan: jangan bungkus `<button>` di dalam `<Link>`. Pakai `<Link>` bergaya tombol (temuan audit #7).

### Bubble `@nama`
bg `accent`, teks putih Inter 15/600 (mobile 13), padding `10px 16px`, radius `18 18 18 4`. Dekoratif (`aria-hidden`), posisi absolut di atas galeri.

### Badge status
Radius full, padding `5px 12px`, Inter 12/600.
- Selesai / Stok tersedia: `success-bg` + `success`
- Menunggu / Menunggu pembayaran: `warn-bg` + `warn`
- Dibatalkan / Gagal: `danger-bg` + `danger`
- Netral (kategori): `pill` + `muted`

### Chip filter / tab
Radius full, padding `9px 16px` (chip) atau `10px 18px` (tab desktop, dengan ikon lucide 16 dan gap 8), teks 13/600. Aktif: bg `ink`, teks putih. Tidak aktif: bg `pill`, teks `ink`. Tab mobile: tanpa ikon, `flex-1`, padding `11px 4–8px`, gap 6. Pakai `role="tablist"`/`aria-current`.

### Input / field
- Label: Inter 13/600 `ink`, gap 8 ke field.
- Field: tinggi 48, radius 14, bg `surface`, border 1px `line`, padding horizontal 16, teks 14 `ink`, placeholder `muted`.
- Fokus: border 2px `ink`.
- Error: border 2px `danger` + pesan 12/500 `danger` di bawah field (contoh: "Format email tidak valid.").
- Search: tinggi 48, radius full, border 1px `line`, padding `0 18px`, ikon lucide `search` 18 `muted`, gap 10. Lebar 360 desktop, penuh di mobile.

### Kartu produk
- Kontainer: `surface`, radius 28, padding 12, gap 14, `shadow-card`. Lebar mengikuti grid (272 di 4 kolom 1280px).
- Tile: tinggi 180 (130 mobile), radius 20, gradien linear atas→bawah (lihat §4), ikon lucide 56 putih di tengah.
- Body (padding horizontal 6, gap 6): nama Inter Tight 18/600 -0.3px, deskripsi 13 `muted`.
- Footer (padding `4 6 6 6`, `justify-between`): harga Inter Tight 18/700 + tombol primer kecil "Beli".
- Hover: `shadow` sedikit lebih kuat (`0 14px 36px rgba(17,18,19,.14)`), tanpa scale/rotate. Seluruh kartu adalah satu link ke `/products/[id]`. Tombol Beli tetap terpisah (bukan link di dalam link).
- Varian galeri hero: hanya tile (body + footer disembunyikan), padding 8, radius 26, lebar 210, tile 210 tinggi.

### Kartu varian (`VariantSelector`, komponen .pen "VariantCard")
Data dari `ProductVariant`: `name`, `type`, `price`, `duration`, `warranty`, `stock`.
Gaya ringkas: 4 baris, tanpa daftar ikon bertumpuk.
- Kontainer: `<button role="radio">`, `relative`, `surface`, radius 20, padding `22px 18px 16px`, gap 12, border 1.5px `hairline`. Hover: border `line`. Fokus: outline 3px `accent` offset 2px.
- **Tag pengiriman** (absolut, `top:-12px; left:16px`): pil `success` padding `4px 10px`, gap 5, ikon `zap` 12 putih + "Pengiriman otomatis" 12/600 putih. Sembunyikan jika stok habis.
- **Baris 1** (gap 12, align start): kolom judul (gap 4) + radio di kanan.
  - Nama: "{name} · {duration}" Inter Tight 16/600 -0.3px, line-height 1.3, boleh 2 baris.
  - Stok di bawah nama, 12px: `stock > 3` → `muted` 500 "Stok tersedia: {n}"; `1–3` → `warn` 600 "Sisa {n}, segera habis"; `0` → `muted` "Stok habis".
  - Radio 22×22, border 2px `line`. Dipilih: border `accent` + titik 10px `accent` di tengah.
- **Baris 2** (gap 10, align center): chip tipe (`pill`, radius full, padding `4px 10px`, gap 5, ikon 12 `ink` + label 12/600; Sharing `users`, Invite `user-plus`, Private `lock-keyhole`) + garansi (ikon 14 + teks 13): ada → `shield-check` + "Garansi {warranty}" `success`; kosong/"No Garansi" → `shield-off` + "Tanpa garansi" `muted`.
- **Baris 3** (border-top 1px `hairline`, padding-top 12, gap 8, align center): harga Inter Tight 20/700 -0.6px. **Opsional**, hanya jika data punya harga coret (`ProductVariant` saat ini tidak punya): harga lama 13 `muted` dicoret + badge diskon (`accent`, radius 8, padding `3px 7px`, 12/700 putih "-{n}%"). Jangan tampilkan diskon karangan.
- **Dipilih**: border 2px `accent`, latar `#F4F6FE`, radio terisi.
- **Habis**: `disabled`, latar `card`, nama, harga, dan chip `muted`, radio border `hairline`, tanpa tag pengiriman. Jangan pakai opacity (kontras turun).
- Layout: desktop grid 2 kolom gap 12 (row gap 20 agar tag tidak menabrak kartu atas); mobile 1 kolom gap 20.
- Harga di buy bar mengikuti varian terpilih.

### Tabel (desktop)
- Kontainer `surface`, radius 24, padding 8, `shadow-card`.
- Header: padding `12px 16px`, gap 16, teks 12/600 `muted`.
- Baris: padding `14px 16px` (admin 12/16), gap 16, border-top 1px `hairline`. Kolom pertama 14/600 `ink`, lainnya 14/400 `muted`.
- Kolom tetap: Order 100–110, Tanggal 120, Status 130, Total/Jumlah 110–120, Aksi 190; kolom produk/keterangan `flex-1`.
- Mobile: tabel diganti list kartu (lihat "Item list mobile").

### Item list mobile
Baris `surface`, radius 20, padding 16, `justify-between`. Kiri: judul 14/600 + meta 13 `muted` (gap 2). Kanan: badge atau nominal 14/700.

### Toast
bg `ink`, radius 20, padding `14px 18px`, gap 12, lebar 340, `shadow-card`. Ikon lucide `circle-check` 20 `#7BE0A0` + pesan 14/500 putih. Posisi kanan atas di bawah navbar (desktop), bawah-tengah (mobile). Container `role="status" aria-live="polite"`, tombol tutup dengan `aria-label="Tutup"`.

### Kartu dashboard
- Statistik: radius 28, padding 24 (mini mobile 14, radius 20), gap 6, `shadow-card`. Label 14/500 `muted`, angka (lihat tipografi). Statistik utama berlatar `ink` (label `#C9CBD1`, angka putih).
- Kartu konten (form, ringkasan, rincian): `surface`, radius 28, padding 28 desktop / 20 mobile, gap 16, `shadow-card`, judul Inter Tight 20/600.
- Baris key-value: `justify-between`, kiri 14 `muted`, kanan 14/500–600 `ink`. Total: border-top 1px `hairline`, padding-top 14, label 16/600, nilai Inter Tight 22–24/700.

### Navigasi dashboard
Tidak ada sidebar. Navigasi berupa **baris tab pil** di bawah header halaman: Ringkasan (`layout-grid`), Saldo (`wallet`), Transaksi (`receipt`), plus Admin (`shield`) hanya untuk admin. Desktop: lebar sesuai isi, gap 8. Mobile: tab `flex-1`, tanpa ikon.

### Footer
Border-top 1px `hairline`, padding-top 24. Desktop: satu baris `justify-between`. Mobile: kolom, gap 12. Kiri: "© 2026 KampusRebahan. Semua hak dilindungi." (13 `muted`, tahun dinamis). Kanan: link Syarat (`/terms`), Privasi (`/privacy`), WhatsApp (13/500 `muted`, gap 24).

### State (loading, kosong, error)
- Loading: skeleton kartu (tile `pill` radius 20 tinggi 150, dua garis `pill` 14px radius full, lebar 160 dan 100).
- Kosong: kartu `surface` radius 28 padding 28 rata tengah, lingkaran 56 `pill` + ikon `inbox`, judul 20/600 "Belum ada pesanan", teks `muted` "Pesanan yang kamu buat akan muncul di sini.", tombol primer "Lihat produk".
- Error: sama, lingkaran `danger-bg` + ikon `triangle-alert` `danger`, judul "Produk gagal dimuat", teks "Server pemasok tidak merespons. Coba lagi beberapa saat.", tombol sekunder "Coba lagi".

---

## 3. Layar (21 desktop + 21 mobile = 42)

Format: **Nama frame (desktop / mobile)** → route. Section dari atas ke bawah. Semua layar diawali Navbar dan diakhiri Footer, kecuali auth (tanpa footer). Teks contoh (nama, harga, order ID) adalah dummy; ganti dengan data nyata.

### 3.1 Landing → `/` (`app/page.tsx`)
**Desktop** (gap section 48):
1. **Hero** (kolom, rata tengah, gap 8): H1 "Akun digital premium,\nharga mahasiswa." (84/700, -4px, lh .98, max-w 900). **Galeri** 1200×400 posisi absolut: 7 kartu (varian galeri) x = 45 + i·150, y = 60 + |3−i|·22, rotasi (3−i)·3° (kiri miring ke kiri, kanan ke kanan; CSS `rotate(-((3-i)*3)deg)` karena .pen berlawanan jarum jam). Urutan z: kartu tengah paling atas. Bubble "@netflix" (x20,y20) dan "@spotify" (x1010,y70). Subcopy 16 `muted` max-w 480 rata tengah: "Beli akun Netflix, Spotify, Canva, dan ratusan layanan lain. Bayar dengan QRIS atau saldo, kredensial langsung dikirim ke dashboard." CTA (padding-top 24, gap 12): primer "Lihat produk" → `/products`, sekunder "Cara beli" → anchor `#cara-beli`.
2. **Produk terlaris** (gap 28): header `justify-between` (H2 44 "Produk terlaris" + sekunder "Semua produk"), grid 4 kolom gap 24 kartu produk.
3. **Cara beli** (`#cara-beli`, kolom gap 36, padding-top 40):
   - **Header** baris `justify-between` align-end gap 48: kiri overline "CARA BELI" (12/600 +1.2px `muted`) + H2 44/700 -1.5px lh 1.05 "Tiga langkah, langsung pakai."; kanan lead 16 `muted` lh 1.5 lebar 420 "Tanpa chat admin. Pilih varian, scan QRIS, dan kredensial muncul sendiri di halaman pesanan."
   - **Langkah**: baris 3 kartu `flex-1` dengan konektor 44px di antaranya (lingkaran 32 `surface`, border `hairline`, `shadow-sm`, ikon `arrow-right` 16 `ink`; `aria-hidden`). Kartu: `surface`, radius 28, padding 20, gap 20, `shadow-card`. Isi kartu:
     1. **Visual** tinggi 220, radius 20, `overflow:hidden`, latar radial gradient (pusat 50% 35%, warna tint → `#F7F7F8`), berisi mini-UI dekoratif (`aria-hidden`) yang diposisikan absolut dan di tengah.
     2. **Teks** (padding `0 4 4 4`, gap 8): pil langkah (`ink`, radius full, padding `5 12 5 8`, ikon 14 putih + "Langkah {n}" 12/600 putih), judul Inter Tight 21/600 -0.5px, deskripsi 14 `muted` lh 1.5.
   - Isi tiap langkah:
     | # | Ikon pil | Tint | Judul | Deskripsi | Mini-UI di visual |
     |---|---|---|---|---|---|
     | 1 | `mouse-pointer-click` | `#FFE7DC` | Pilih produk dan varian | Bandingkan durasi, tipe akun, dan garansi sebelum checkout. | Kartu 230 (`surface`, radius 18, padding 12, gap 8–10, `shadow-card`): thumb 40 gradien Netflix + "Netflix Premium" 13/600 + "3 varian" 12 `muted`; 2 baris varian mini (padding `8 10`, radius 12, radio 14 + label 12/500 + harga 12/700): "Sharing Rp25.000" biasa (border 1 `hairline`) dan "Bergaransi Rp32.000" terpilih (border 1.5 `accent`, bg `#F4F6FE`, radio titik `accent`). Ikon `mouse-pointer-2` 22 `ink` di pojok kanan bawah varian terpilih. |
     | 2 | `scan-line` | `#E3E9FF` | Bayar dengan QRIS atau saldo | Scan dari e-wallet atau m-banking apa pun. Status terbaca otomatis. | Kartu 150 rata tengah (padding 12, gap 8): kotak QR 96 (border 1.5 `ink`, radius 12, ikon `qr-code` 70), "Rp32.000" Inter Tight 16/700, timer (`timer` 12 + "14:32" 12/600 `warn`). Badge Menunggu "Menunggu bayar" di kiri atas kartu, rotasi 6°. Chip "Lunas" (`success`, ikon `check` 12 putih + 12/600 putih, radius full, padding `5 10`, rotasi -4°, `shadow-sm`) di kanan bawah, tidak menutupi harga. |
     | 3 | `key-round` | `#DDF3E4` | Terima kredensial | Email dan password tampil di halaman pesanan, salinan dikirim ke email. | Kartu 240 (padding 12, gap 8): 2 baris `card` radius 10 padding `8 10` (label 12/600 `muted` + nilai 12/500 + ikon `copy` 14): "Email netflix.kr481@mail.com", "Password ••••••••••". Toast "Kredensial terkirim" (komponen Toast, lebar 230, padding `10 14`, teks 13) menumpuk di bawah kartu. |
   - **Carousel "Bisa bayar dari"** (kolom gap 16): header `justify-between` align-end: judul Inter Tight 20/600 "Bisa bayar dari" + sub 14 `muted` "Satu QRIS untuk semua e-wallet dan m-banking, atau pakai saldo."; kanan tombol ikon `chevron-left`/`chevron-right` (44px, `aria-label` "Sebelumnya"/"Berikutnya"). Viewport `overflow-x:auto` + `scroll-snap-type:x mandatory`, gap 12, padding `4 0 10`; fade kanan 96px (`linear-gradient(90deg, transparent, #F7F7F8)`, `pointer-events:none`). Tile logo 200×84, `surface`, border 1px `hairline`, radius 20, padding 16, `shadow-sm`, `scroll-snap-align:start`, logo `object-contain` tinggi 30–36. Urutan: QRIS, GoPay, OVO, DANA, ShopeePay, m-Banking (ikon `landmark` 22 + teks Inter Tight 17/700), Saldo (logo KampusRebahan). Indikator titik: aktif 20×6 `ink`, lainnya 6×6 `line`, radius full. Tanpa auto-scroll (kalau ditambah, wajib bisa di-pause dan hormati `prefers-reduced-motion`). `alt` logo = nama aplikasi.
     - Aset di `design/images/`: `gopay`, `ovo`, `dana` (`.svg` asli dari Wikimedia Commons + `.png` 160px), `logo_website.png`, `qris.png`. Salin ke `public/payments/`. `qris.png` adalah poster QR merchant; desain hanya memotong area logo kiri atas, jadi lebih baik siapkan file logo QRIS terpisah dan jangan tampilkan QR merchant di landing. `shopeepay.png` dari user. Implementasi: `components/landing/PaymentCarousel.tsx`, aset di `public/payments/` (QRIS memakai `qris-logo.png` hasil potong, bukan poster QR).
   - Hindari klaim angka tanpa sumber, misalnya "kurang dari 2 menit" (audit #1).
4. **Banner pembelian terbaru**: pil `surface` padding `16px 24px`, `shadow-sm`, titik 10px `success` + teks 14/500 (data `/api/recent-purchases`). Jangan `aria-live` yang berputar tiap 4 detik.

**Mobile**: H1 42/700 rata tengah. Galeri tinggi 196: 4 kartu 110×136 (padding 6, radius 20), x = 6 + i·70, y = 36 + |1.5−i|·12, rotasi (1.5−i)·5°, bubble "@netflix" di (0,0). Subcopy 15 "Bayar dengan QRIS atau saldo, kredensial langsung dikirim ke dashboard." CTA kolom full width (gap 10). "Produk terlaris" H2 28 lalu list item: thumb 64 radius 16 gradien + nama 14/600 + harga 13 `muted` + tombol "Beli" kecil (item `surface` radius 22 padding 10 gap 14). Cara beli mobile: overline, H2 30/700 -1.2px "Tiga langkah,
langsung pakai.", lead 15; 3 kartu bertumpuk gap 20 (radius 26, padding 14, gap 14) tanpa konektor; visual tinggi 170 radius 18 dengan mini-UI yang sama (kartu QR 140, kotak QR 86); judul 19/600. Carousel mobile: tanpa tombol panah, tile 132×64 radius 16 padding 12 (logo tinggi 24–28), fade kanan 48px, titik indikator di tengah; geser dengan swipe.

### 3.2 Produk → `/products`
**Desktop**: Heading rata tengah (gap 12): H1 64 "Semua produk" + 16 `muted` "{n} produk tersedia. Harga sudah termasuk biaya layanan." Toolbar `justify-between` gap 24: search 360 ("Cari produk, mis. Netflix"), chip kategori (Semua aktif, Streaming, Musik, Desain, AI, Belajar, Game; dari data kategori), sekunder "Termurah" (sort). Grid 4 kolom gap 24. Pagination tengah: lingkaran 40 (aktif `ink`/putih, lainnya `pill`), gap 8.
**Mobile**: H1 36, search full, chip baris scroll horizontal (`overflow-x-auto`), kartu 1 kolom (tile 130).
State: loading skeleton, kosong, dan **error terpisah dari kosong** (audit #9).

### 3.3 Detail Produk → `/products/[id]`
**Desktop**: breadcrumb 13 `muted` "Produk / Streaming / Netflix Premium". Baris gap 56: visual 560×520 radius 36 gradien + ikon 120, `shadow-card`. Info (gap 20): badge kategori (netral) + badge "Stok tersedia"; H1 56 nama; rating 14/500 `muted` "4,8 dari 5 · 126 ulasan" (bintang pakai ikon, bukan karakter ★); deskripsi 16 `muted`; label "Pilih varian" 13/600; **Kartu varian** (§2) grid 2 kolom (gap 12, row gap 20) dalam `role="radiogroup"`; buy bar (padding-top 16, gap 20): harga 36/700 + primer "Beli sekarang" + sekunder "Tambah ke wishlist"; catatan 13 `muted` "Bayar via QRIS atau saldo. Garansi ganti akun 7 hari." Ulasan: H2 32 "Ulasan pembeli", 3 kartu ulasan `surface` radius 24 padding 20 (nama 14/600, isi 14 `muted`).
**Mobile**: visual penuh 260 tinggi radius 28 (ikon 80), badge, H1 34, rating 13, deskripsi 15, kartu varian bertumpuk 1 kolom full width (gap 20). Buy bar kartu `surface` radius 24 padding 16 `shadow-card` (label "Total" 12/600 + harga 24/700 kiri, primer "Beli sekarang" kanan); boleh `sticky bottom`.

### 3.4 Checkout → `/checkout`
**Desktop**: H1 56 "Checkout". Baris gap 48: form `flex-1` (gap 24): judul 20/600 "Data pembeli", field "Email penerima" (`nama@email.com`), "Nomor WhatsApp" (`08xxxxxxxxxx`), judul "Metode pembayaran", 2 opsi sejajar (`surface`, radius 24, padding 20, gap 14, ikon lucide 24 `qr-code`/`wallet` + judul 14/600 + sub 13 `muted`: "Scan dari e-wallet atau bank" / "Rp{saldo} tersedia"; terpilih border 2px `ink`, lainnya 1px `hairline`; `role="radio"`), primer full "Bayar Rp{total}". Kanan: kartu Ringkasan 420 (judul "Ringkasan pesanan", item thumb 56 radius 16 + nama 14/600 + varian 13, baris Harga, Biaya layanan, Total).
**Mobile**: H1 36, ringkasan di atas, field, opsi metode bertumpuk (padding 16, radius 20, ikon 22), tombol bayar full.
Jangan tampilkan input voucher (fitur belum ada, audit #2).

### 3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)
**Desktop**: baris gap 48. Panel QR `flex-1` (`surface`, radius 36, padding 40, gap 20, rata tengah, `shadow-card`): badge "Menunggu pembayaran", H2 36 "Scan untuk membayar", QR 280×280 (bg putih, border 2px `ink`, radius 20; render QR asli dari `GatewayQr`), nominal 32/700, countdown (ikon `timer` 18 + "Berlaku mm:ss lagi" 14/600 `warn`). Kolom kanan 420 (gap 20): Ringkasan (baris Order "#KR-…", Metode "QRIS", Total), sekunder full "Batalkan pesanan", catatan 13 `muted` "Halaman ini diperbarui otomatis setelah pembayaran terdeteksi."
**Mobile**: panel QR penuh (padding 24, radius 28, QR 240, judul 26, nominal 28), lalu sekunder "Batalkan pesanan" full.

### 3.6 Detail Pesanan → `/order/[orderId]` (status selesai)
**Desktop**: header `justify-between` align-end: kiri "Pesanan #KR-20481" 14/500 `muted` + H1 56 nama produk; kanan badge status. Baris gap 48: kartu Kredensial `flex-1` (padding 32, radius 32): judul 22/600, 3 baris (bg `card`, radius 16, padding `14px 18px`: label 12/600 `muted` + nilai 14/500; tombol sekunder kecil "Salin"), catatan 13 `muted` "Jangan ubah email atau password. Garansi 7 hari dihitung dari waktu pembelian." Kanan kartu Timeline 420 (padding 28, radius 32): judul "Status pesanan", 3 langkah (ikon `circle-check` 22 `success` + judul 14/600 + waktu 13 `muted`, padding-top 18): Pesanan dibuat, Pembayaran diterima, Kredensial dikirim. Toast "Password disalin ke clipboard" muncul setelah Salin.
**Mobile**: meta, H1 34, badge, kartu kredensial (padding 20, radius 24) dengan baris padding `12px 14px` dan ikon `copy` 20 sebagai tombol salin (44px tap area, `aria-label`).
Password default disamarkan (`••••`), ada tombol tampilkan.

### 3.7 Sukses Bayar → `/payment/success`
Rata tengah vertikal dan horizontal (gap 20): lingkaran 96 `success-bg` + ikon `check` 48 `success`; H1 64 (mobile 32) "Pembayaran berhasil"; teks 16 `muted` max-w 480: "Kredensial {produk} sudah tersedia di halaman pesanan. Salinan juga dikirim ke email kamu."; tombol (gap 12, padding-top 12): primer "Lihat pesanan", sekunder "Belanja lagi". Mobile: tombol bertumpuk full width.

### 3.8 Batal Bayar → `/payment/cancel`
Sama dengan 3.7, ikon `x` di `danger-bg`/`danger`; H1 "Pesanan dibatalkan"; teks "Pesanan #{id} dibatalkan dan tidak ada saldo yang terpotong. Kamu bisa membuat pesanan baru kapan saja."; primer "Kembali ke produk", sekunder "Hubungi admin" (WhatsApp).

### 3.9 Auth (tanpa footer, konten di tengah vertikal)
Pola: heading rata tengah (gap 10): H1 64 (mobile 36) + subjudul 16 `muted` (max-w 420). Kartu form 420 (mobile full): `surface`, radius 32, padding 32 (mobile 20), gap 18, `shadow-card`, field lalu primer full. Di bawah kartu: teks 14 `muted` rata tengah dengan link (link 14/600 `ink`, underline saat hover/fokus). Gap antar blok 24.

| Frame | Route | H1 | Subjudul | Field (label / placeholder) | Tombol | Link bawah |
|---|---|---|---|---|---|---|
| Masuk | `/auth/signin` | Masuk | Masuk untuk melihat pesanan dan saldo. | Email / nama@email.com; Password / Minimal 8 karakter | Masuk | "Belum punya akun? Daftar · Lupa password?" |
| Daftar | `/auth/signup` | Daftar | Gratis, selesai dalam satu menit. | Nama / Nama lengkap; Email; Password | Buat akun | "Sudah punya akun? Masuk" |
| Lupa Password | `/auth/forgot-password` (langkah 1) | Lupa password | Masukkan email, kode reset dikirim ke inbox kamu. | Email | Kirim kode | "Ingat password? Masuk" |
| Reset Password | `/auth/forgot-password` (langkah 2, state halaman yang sama) | Reset password | Masukkan kode 6 digit dan password baru. | Kode 6 digit / 123456 (`inputMode="numeric"`); Password baru | Simpan password | "Belum menerima kode? Kirim ulang" |

Frame Masuk desktop menampilkan field Email dalam state fokus (border 2px `ink`) sebagai referensi.

### 3.10 Dashboard (pola umum)
Navbar, header (H1 56 / 34 + subjudul 16 / 14 `muted`, gap 6), baris tab (§2), konten (gap 28 desktop / 16–20 mobile), footer.

**Ringkasan** → `/dashboard`
- Desktop: 3 statistik sejajar gap 20 (Saldo [gelap] "Rp120.000", "Pesanan bulan ini" "8", "Total belanja" "Rp186.000"). Kartu Loyalitas (baris, padding 28, gap 24): judul "Program loyalitas" + teks "8 dari 10 pembelian. 2 lagi untuk voucher Rp10.000." (`flex-1`), progress bar 360×12 (track `pill`, isi `ink`, radius full, `role="progressbar"`), sekunder "Tukar voucher". Judul 24/600 "Pesanan terakhir" + tabel (Produk, Tanggal, Status, Total).
- Mobile: H1 "Halo, {nama}", sub "Ringkasan akun.", 2 statistik bertumpuk (angka 32), "Pesanan terakhir" 20/600, list item mobile.

**Saldo** → `/dashboard/balance`
- Desktop: baris gap 24: kartu saldo gelap 420 (padding 28, "Saldo aktif" + angka 56/700 putih) dan kartu "Isi saldo" `flex-1` (chip nominal Rp10.000, Rp25.000 [aktif], Rp50.000, Rp100.000; field "Nominal lain"; primer full "Isi saldo via QRIS"). Judul "Riwayat saldo" + tabel (Keterangan, Tanggal, Status, Jumlah).
- Mobile: kartu saldo (angka 36), kartu isi saldo dengan chip grid 2×2 (`flex-1`, padding `11px 8px`), list riwayat (nominal masuk `success`, keluar `ink`, 14/700).

**Top Up QRIS** → `/dashboard/balance/topup/[topupId]` (tab Saldo aktif)
- H1 "Isi saldo", sub "Top up #TOPUP-0912". Baris gap 32: panel QR (seperti 3.5, judul 32 "Scan untuk isi saldo", QR 260, nominal "Rp50.000"), kartu "Detail top up" 400 (Nominal, Biaya, Saldo setelah; catatan 13 "Saldo bertambah otomatis setelah pembayaran terdeteksi. Jangan tutup halaman ini."; sekunder full "Batalkan top up").
- Mobile: bertumpuk, QR 220, judul 24.

**Transaksi** → `/dashboard/transactions`
- Desktop: toolbar gap 16: search 360 "Cari order atau produk", chip filter Semua (aktif), Selesai, Menunggu, Dibatalkan. Tabel (Order 110, Produk, Tanggal 120, Status 130, Total 110). Baris klik → detail.
- Mobile: list item (judul produk, meta "#KR-… · Rp…", badge). Search dan filter: pakai pola yang sama seperti produk mobile (frame mobile tidak menggambarnya; tambahkan search full + chip scroll).

**Detail Transaksi** → `/dashboard/transactions/[orderId]` (tab Transaksi aktif)
- H1 nama produk, sub "Pesanan #KR-20481 · 12 Nov 2026, 10:02". Baris status: badge + "Dibayar via QRIS" 13 `muted`. Baris gap 32: kartu Kredensial `flex-1` (padding 32, 3 baris kredensial dengan tombol ikon `copy` 40×40, catatan garansi "Garansi aktif sampai {tanggal}. Klaim lewat WhatsApp dengan nomor pesanan."), kartu "Rincian pembayaran" 400 (Produk, Harga, Biaya layanan, Total; primer full "Beri ulasan"; sekunder full "Minta bantuan").
- Mobile: bertumpuk, judul kredensial 18.

**Admin** → `/dashboard/admin` (tab Admin aktif, hanya untuk admin)
- Desktop: header `justify-between`: H1 "Admin" + sub "Kelola pesanan, saldo, dan pengaturan toko." | sekunder "Ekspor CSV". 4 statistik gap 20 (Pendapatan hari ini [gelap], Pesanan masuk, Menunggu konfirmasi, Gagal diproses; angka 36). Baris gap 24: "Pesanan perlu tindakan" (24/600) + tabel (Order 100, Pembeli, Total 100, Status 120, Aksi 190: primer kecil "Konfirmasi" + bahaya kecil "Tolak" untuk status Menunggu; selain itu teks 13 `muted` "Tidak ada aksi"). Kanan kartu "Pengaturan toko" 380 (field "Markup harga (%)", "Nomor WhatsApp admin", primer full "Simpan pengaturan").
- Mobile: tab 4 kolom (teks 12), statistik gelap penuh (angka 30) + 3 mini statistik sejajar (Masuk, Menunggu, Gagal; angka 24), "Perlu tindakan" lalu kartu order (`surface` radius 22 padding 16 gap 12: "#ID · Rp" 14/600 + email 13 `muted` + badge; baris tombol Konfirmasi/Tolak `flex-1`). Pengaturan toko tidak digambar di mobile: tumpuk kartunya di bawah list.
- Konfirmasi dan Tolak butuh dialog konfirmasi. Tanpa emoji di label (audit #15).

### 3.11 Legal
**Syarat Layanan** → `/terms`, **Kebijakan Privasi** → `/privacy`. Artikel rata tengah (gap 28): H1 64 (mobile 36), "Terakhir diperbarui 1 November 2026" 13 `muted`, body max-w 720 (gap 24): tiap pasal judul Inter Tight 20/600 + paragraf 15 `muted` lh 1.6. Isi pasal di .pen adalah ringkasan contoh. Pakai teks hukum yang sudah ada di app (`LegalArticle`) dengan gaya ini.

### 3.12 404 → `app/not-found.tsx`
Rata tengah vertikal (gap 20): "404" 200/700 -10px lh .9 (mobile 120), H2 40 (mobile 26) "Halaman tidak ditemukan", teks 16 `muted` "Alamat yang kamu buka tidak ada atau sudah dipindahkan.", primer "Kembali ke beranda".

---

## 4. Aset

- **Ikon**: semua dari **lucide** (`lucide-react`, sudah terpasang). Nama yang dipakai: `user`, `sun` (+ `moon` untuk dark), `menu`, `search`, `clapperboard`, `music`, `palette`, `bot`, `graduation-cap`, `gamepad-2`, `cloud`, `shield-check`, `qr-code`, `wallet`, `timer`, `check`, `x`, `circle-check`, `copy`, `layout-grid`, `receipt`, `shield`, `inbox`, `triangle-alert`. Ganti emoji kategori di `lib/categoryIcons.ts` dengan ikon lucide atau logo dari `getProductImage` (audit #14).
- **Gambar produk**: di .pen berupa tile gradien + ikon (placeholder). Implementasi: pakai `ProductImage`/`getProductImage` (gambar di `public/products/`) dengan `object-cover` di tile radius 20. Jika gambar tidak ada, fallback ke gradien + ikon kategori di bawah.
- **Gradien tile** (linear, atas→bawah, `linear-gradient(180deg, A, B)`):
  | Kategori/produk | A | B | Ikon |
  |---|---|---|---|
  | Streaming / Netflix | `#FF8A5B` | `#D6336C` | clapperboard |
  | Musik / Spotify | `#34D399` | `#0F766E` | music |
  | Desain / Canva | `#FACC15` | `#F97316` | palette |
  | AI / ChatGPT | `#60A5FA` | `#4338CA` | bot |
  | Belajar / Coursera | `#F472B6` | `#9333EA` | graduation-cap |
  | Game | `#A3E635` | `#15803D` | gamepad-2 |
  | Cloud | `#38BDF8` | `#1D4ED8` | cloud |
  | VPN / Keamanan | `#C084FC` | `#6D28D9` | shield-check |
- **Latar halaman**: warna rata `#F7F7F8`, tanpa gradien atau shader. Komponen `HeroShader`, `DitheringShapes`, `GlassCard`, `ShineBorder` tidak dipakai di desain ini.
- **Logo**: desain memakai logo mark "K" (kotak `ink` + huruf putih). Jika `public/` punya logo resmi, pakai itu dengan ukuran 32/30px.
- **QR**: placeholder ikon di .pen. Render QR asli lewat `components/payment/GatewayQr`.
- **Ekspor dari .pen**: hanya via MCP pencil (`Export(nodeIds,"png",dir)`), file .pen terenkripsi. Ekspor tidak diperlukan untuk implementasi karena tidak ada bitmap custom.

## 5. Varian mobile

Semua 21 layar punya varian mobile (42 frame). Bagian yang tidak digambar di mobile dan perlu ditebak dengan pola di atas:
- Dashboard Transaksi mobile: search dan chip filter tidak digambar.
- Admin mobile: kartu "Pengaturan toko" dan pesanan berstatus Selesai tidak digambar.
- Landing mobile: banner pembelian terbaru tidak digambar (boleh disembunyikan).
- Detail Pesanan mobile: timeline status dan baris Profil tidak digambar.
- Produk mobile: pagination tidak digambar (pakai "Muat lebih banyak" atau pagination yang sama).

Tidak didesain sama sekali: **dark mode**, state hover (spesifikasinya ada di §2, tidak digambar), dialog konfirmasi, dropdown menu akun dan sheet menu mobile, breakpoint tablet.
