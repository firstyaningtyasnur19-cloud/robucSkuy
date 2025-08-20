# Robux skuy — Static Web
Website toko Robux modern (HTML, CSS, JS) siap upload ke GitHub Pages.

## Fitur
- Desain modern abu-abu & putih, aksen emerald
- Slider gambar dengan caption
- Grid produk (paket Robux & Premium)
- Keranjang (drawer) + penyimpanan `localStorage`
- Checkout (modal) **demo** — menghasilkan `orderId` dan menyimpan order terakhir di `localStorage`
- Pencarian produk (drawer)
- Animasi halus saat scroll + background partikel
- Responsif (mobile-first)
- Tanpa framework, hanya vanilla JS

> ⚠️ Ini template **demo**. Untuk produksi, integrasikan payment gateway resmi (mis. Midtrans, Xendit, DOKU), dan pastikan mematuhi kebijakan Roblox.

## Deploy ke GitHub Pages
1. Buat repo baru di GitHub, misalnya `robux-skuy`.
2. Upload semua file dari folder ini (atau upload `robux-skuy.zip` dan extract di repo).
3. Buka Settings → Pages → pilih branch `main` dan folder `/root` → Save.
4. Tunggu 1–2 menit lalu akses URL Pages-mu.

## Kustomisasi
- Edit daftar produk di `app.js` bagian `state.products`.
- Ubah warna aksen di `styles.css` (`--accent`).
- Ganti logo/ikon di folder `assets`.
