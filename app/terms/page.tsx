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
          <p className="kr-fade-up text-[13px] text-muted" style={{ animationDelay: "60ms" }}>Terakhir diperbarui: Mei 2026</p>

          <div className="kr-fade-up w-full text-left" style={{ animationDelay: "120ms" }}><LegalArticle headings={["Penerimaan Syarat","Layanan","Pembayaran","Saldo Akun","Pengiriman Produk","Garansi & Refund","Larangan Penggunaan","Pembatasan Tanggung Jawab","Perubahan Syarat","Kontak"]}>

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
                <li>Pembayaran dilakukan melalui transfer bank ke rekening yang tertera saat checkout.</li>
                <li>Order baru diproses setelah pembayaran diverifikasi oleh admin.</li>
                <li>Nominal transfer harus sesuai dengan total yang tertera. Kelebihan atau kekurangan transfer dapat menghambat proses verifikasi.</li>
                <li>Simpan bukti transfer sebagai referensi jika diperlukan.</li>
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
              </ul>
            </section>

            <section>
              <h2>5. Pengiriman Produk</h2>
              <p>Detail akun akan dikirimkan melalui halaman riwayat transaksi setelah order diverifikasi dan diproses. Waktu pemrosesan umumnya 1–24 jam pada hari kerja.</p>
            </section>

            <section>
              <h2>6. Garansi & Refund</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Garansi berlaku sesuai yang tertera pada masing-masing produk.</li>
                <li>Refund hanya dapat diproses jika produk tidak dapat dikirimkan setelah pembayaran terverifikasi.</li>
                <li>Refund diproses sebagai saldo akun, bukan pengembalian uang tunai.</li>
                <li>Tidak ada refund untuk kesalahan penggunaan akun oleh pembeli.</li>
                <li>Hubungi admin untuk klaim garansi dengan menyertakan bukti order.</li>
              </ul>
            </section>

            <section>
              <h2>7. Larangan Penggunaan</h2>
              <p>Pengguna dilarang untuk:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Membagikan atau menjual kembali akun yang dibeli tanpa izin.</li>
                <li>Mengubah data akun (email, password, nomor telepon) tanpa izin.</li>
                <li>Menggunakan layanan untuk aktivitas ilegal.</li>
                <li>Melakukan chargeback atau dispute pembayaran secara tidak wajar.</li>
              </ul>
            </section>

            <section>
              <h2>8. Pembatasan Tanggung Jawab</h2>
              <p>KampusRebahan tidak bertanggung jawab atas kerugian tidak langsung akibat penggunaan layanan, termasuk kerusakan data atau kehilangan akses yang disebabkan oleh tindakan pengguna sendiri.</p>
            </section>

            <section>
              <h2>9. Perubahan Syarat</h2>
              <p>Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diumumkan melalui halaman ini. Penggunaan layanan setelah perubahan berarti Anda menyetujui syarat yang diperbarui.</p>
            </section>

            <section>
              <h2>10. Kontak</h2>
              <p>Untuk pertanyaan terkait syarat dan ketentuan, hubungi kami melalui email atau media sosial yang tersedia.</p>
            </section>

          </LegalArticle></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
