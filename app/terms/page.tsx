import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalArticle from "@/components/layout/LegalArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
};

export default function TermsPage() {
  return (
    <div className="kr-page">
      <Navbar />
      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-7 text-center">
          <h1 className="kr-fade-up text-4xl font-bold tracking-[-1.5px] text-ink md:text-[64px] md:tracking-[-3px]">
            Syarat & Ketentuan
          </h1>
          <p className="kr-fade-up text-[13px] text-muted" style={{ animationDelay: "60ms" }}>Terakhir diperbarui: November 2026</p>

          <div className="kr-fade-up w-full text-left" style={{ animationDelay: "120ms" }}><LegalArticle headings={["Penerimaan Syarat","Layanan","Pembayaran","Saldo Akun","Pengiriman Produk","Garansi & Refund","Program Loyalitas","Program Afiliasi","Larangan Penggunaan","Pembatasan Tanggung Jawab","Perubahan Syarat","Kontak"]}>

            <section>
              <h2>1. Penerimaan Syarat</h2>
              <p>Dengan mengakses dan menggunakan layanan KampusRebahan, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui, harap tidak menggunakan layanan kami.</p>
            </section>

            <section>
              <h2>2. Layanan</h2>
              <p>KampusRebahan menyediakan layanan penjualan akun digital premium termasuk namun tidak terbatas pada layanan streaming, produktivitas, AI, dan gaming. Semua produk yang kami jual merupakan akun resmi yang diperoleh melalui mitra terpercaya.</p>
            </section>

            <section>
              <h2>3. Pembayaran</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Pembayaran dapat dilakukan melalui QRIS, saldo akun, saldo referensi, atau transfer bank, sesuai metode yang tersedia saat checkout.</li>
                <li>Pembayaran QRIS dan saldo dikonfirmasi otomatis. Pembayaran transfer bank diproses setelah diverifikasi oleh admin.</li>
                <li>Untuk transfer bank, nominal harus sesuai dengan total yang tertera, termasuk kode unik. Kelebihan atau kekurangan transfer dapat menghambat proses verifikasi.</li>
                <li>Simpan bukti pembayaran sebagai referensi jika diperlukan.</li>
              </ul>
            </section>

            <section>
              <h2>4. Saldo Akun</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Saldo dapat diisi (top up) melalui QRIS dengan nominal antara Rp10.000 – Rp500.000 per transaksi.</li>
                <li>Saldo hanya dapat digunakan untuk membayar produk di platform KampusRebahan, dan <strong>tidak dapat dicairkan atau ditarik dalam bentuk uang tunai</strong> dalam kondisi apa pun.</li>
                <li>Top up yang sudah masuk bersifat final. Tidak ada refund untuk saldo yang belum digunakan, kecuali melalui pembelian yang gagal diproses sesuai kebijakan Garansi & Refund pada bagian 6.</li>
                <li>Refund atas order yang gagal atau ditolak dapat dikembalikan dalam bentuk saldo (bukan uang tunai) atas keputusan admin.</li>
                <li>Saldo tidak memiliki masa kedaluwarsa.</li>
                <li>Saldo akun berbeda dengan saldo referensi dari Program Afiliasi. Ketentuan saldo referensi diatur pada bagian 8.</li>
              </ul>
            </section>

            <section>
              <h2>5. Pengiriman Produk</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Detail akun dikirimkan melalui halaman riwayat transaksi setelah pembayaran terkonfirmasi dan pesanan selesai diproses oleh mitra kami. Untuk produk instan, waktu pemrosesan umumnya beberapa menit hingga 24 jam.</li>
                <li>Produk berlabel <strong>PO (pre-order)</strong> membutuhkan waktu lebih lama. Selama akun belum dikirim, pesanan berstatus <strong>Diproses</strong>.</li>
                <li>Pesanan berstatus <strong>Selesai</strong> setelah mitra kami mengonfirmasi bahwa akun telah dikirim.</li>
              </ul>
            </section>

            <section>
              <h2>6. Garansi & Refund</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Garansi berlaku sesuai yang tertera pada masing-masing produk.</li>
                <li>Pengajuan refund atau komplain dilakukan melalui WhatsApp admin, menggunakan tombol <strong>Ajukan refund / komplain</strong> di halaman detail pesanan agar ID pesanan dan detail produk terlampir.</li>
                <li>Refund dapat diproses jika produk tidak dapat dikirimkan setelah pembayaran terkonfirmasi. Untuk pesanan yang sudah selesai, refund diberikan atas keputusan admin setelah pemeriksaan.</li>
                <li>Refund diproses sebagai saldo akun, bukan pengembalian uang tunai. Pesanan yang dibayar dengan saldo referensi dikembalikan ke saldo referensi.</li>
                <li>Jika refund membuat total belanja Anda turun di bawah syarat Program Loyalitas, berlaku ketentuan pada bagian 7: kupon yang belum ditukar dicabut, dan untuk kupon yang sudah ditukar, nilai hadiah dipotong dari nominal refund.</li>
                <li>Pesanan yang direfund berstatus <strong>Direfund</strong> di riwayat transaksi.</li>
                <li>Tidak ada refund untuk kesalahan penggunaan akun oleh pembeli.</li>
              </ul>
            </section>

            <section>
              <h2>7. Program Loyalitas</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Setiap akun berhak atas satu kupon hadiah Gemini AI Pro setelah total belanja mencapai Rp200.000.</li>
                <li>Total belanja hanya dihitung dari pesanan berstatus <strong>Selesai</strong>, sesuai harga yang dibayarkan. Pesanan yang masih diproses (termasuk PO), ditolak, direfund, atau pesanan hadiah dari kupon tidak dihitung.</li>
                <li>Kupon terbit 2×24 jam setelah pesanan yang membuat total belanja mencapai Rp200.000 diterima. Waktu terbuka kupon ditampilkan di dashboard.</li>
                <li>Jika refund membuat total belanja turun di bawah Rp200.000 sebelum kupon ditukar, kupon dicabut. Kupon dapat aktif kembali jika total belanja memenuhi syarat lagi.</li>
                <li>Jika kupon sudah ditukar lalu refund membuat total belanja turun di bawah Rp200.000, nilai hadiah dipotong dari nominal refund. Potongan ini hanya berlaku satu kali.</li>
                <li>Kupon tidak dapat diuangkan atau dipindahtangankan.</li>
              </ul>
            </section>

            <section>
              <h2>8. Program Afiliasi</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Setiap pengguna terdaftar dapat bergabung secara gratis melalui menu Afiliasi di dashboard dan mendapatkan kode afiliasi unik.</li>
                <li>Pembelian dihitung untuk afiliasi jika pembeli membuka link KampusRebahan yang memuat kode Anda, lalu menyelesaikan pembelian dalam 30 hari. Jika pembeli membuka link dengan kode lain, kode terakhir yang berlaku.</li>
                <li>Komisi dihitung dari total pembelian produk dengan persentase yang ditampilkan di menu Afiliasi, dan masuk ke saldo referensi setelah pesanan berstatus <strong>Selesai</strong>. Setiap pesanan menghasilkan paling banyak satu komisi.</li>
                <li>Komisi tidak berlaku untuk pembelian dari akun Anda sendiri, pesanan hadiah dari kupon, dan top up saldo.</li>
                <li>Jika pesanan yang menghasilkan komisi ditolak atau direfund, komisi ditarik kembali dari saldo referensi, dan saldo referensi dapat menjadi negatif.</li>
                <li>Saldo referensi dapat dipakai untuk membayar produk di checkout (menutup seluruh total pembayaran, tidak digabung dengan metode lain) atau dicairkan ke DANA, OVO, GoPay, ShopeePay, atau rekening bank.</li>
                <li>Pencairan memiliki nominal minimum yang ditampilkan di menu Afiliasi dan diproses manual oleh admin, umumnya dalam 2×24 jam. Jika pencairan ditolak, saldo dikembalikan ke saldo referensi. Pastikan nomor dan nama pemilik akun tujuan benar.</li>
                <li>KampusRebahan berhak membatalkan komisi atau menahan pencairan yang terindikasi penyalahgunaan, misalnya pembelian fiktif atau akun ganda.</li>
              </ul>
            </section>

            <section>
              <h2>9. Larangan Penggunaan</h2>
              <p>Pengguna dilarang untuk:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Membagikan atau menjual kembali akun yang dibeli tanpa izin.</li>
                <li>Mengubah data akun (email, password, nomor telepon) tanpa izin.</li>
                <li>Menggunakan layanan untuk aktivitas ilegal.</li>
                <li>Melakukan chargeback atau dispute pembayaran secara tidak wajar.</li>
              </ul>
            </section>

            <section>
              <h2>10. Pembatasan Tanggung Jawab</h2>
              <p>KampusRebahan tidak bertanggung jawab atas kerugian tidak langsung akibat penggunaan layanan, termasuk kerusakan data atau kehilangan akses yang disebabkan oleh tindakan pengguna sendiri.</p>
            </section>

            <section>
              <h2>11. Perubahan Syarat</h2>
              <p>Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diumumkan melalui halaman ini. Penggunaan layanan setelah perubahan berarti Anda menyetujui syarat yang diperbarui.</p>
            </section>

            <section>
              <h2>12. Kontak</h2>
              <p>Untuk pertanyaan terkait syarat dan ketentuan, refund, atau program afiliasi, hubungi admin melalui WhatsApp di menu Bantuan, atau melalui email dan media sosial yang tersedia.</p>
            </section>

          </LegalArticle></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
