import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-[36px] font-semibold text-white tracking-tight mb-2">
            Kebijakan Privasi
          </h1>
          <p className="text-[13px] text-white/30 mb-10">Terakhir diperbarui: Mei 2026</p>

          <div className="space-y-8 text-[14px] leading-relaxed text-white/70">

            <section>
              <h2 className="text-[16px] font-semibold text-white mb-3">1. Informasi yang Kami Kumpulkan</h2>
              <p>Kami mengumpulkan informasi berikut saat Anda menggunakan layanan KampusRebahan:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong className="text-white/80">Data Akun:</strong> Nama, alamat email, dan password terenkripsi saat registrasi.</li>
                <li><strong className="text-white/80">Data Transaksi:</strong> Riwayat order, nominal pembayaran, dan referensi transfer.</li>
                <li><strong className="text-white/80">Data Teknis:</strong> Informasi perangkat dan browser untuk keamanan sesi.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-white mb-3">2. Penggunaan Informasi</h2>
              <p>Informasi yang kami kumpulkan digunakan untuk:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Memproses dan memverifikasi pesanan Anda.</li>
                <li>Mengirimkan detail produk yang dibeli.</li>
                <li>Meningkatkan keamanan akun dan mendeteksi aktivitas mencurigakan.</li>
                <li>Menghubungi Anda terkait status order atau perubahan layanan.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-white mb-3">3. Keamanan Data</h2>
              <p>Kami menerapkan langkah-langkah keamanan berikut:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Password disimpan dalam bentuk hash menggunakan bcrypt — kami tidak dapat melihat password Anda.</li>
                <li>Sesi autentikasi dienkripsi menggunakan JWT.</li>
                <li>Koneksi database menggunakan SSL/TLS.</li>
                <li>Data sensitif akun (email/password produk) hanya dapat diakses oleh pembeli yang bersangkutan.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-white mb-3">4. Berbagi Data dengan Pihak Ketiga</h2>
              <p>Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Data hanya dibagikan kepada:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong className="text-white/80">Mitra penyedia produk</strong> (hanya data yang diperlukan untuk fulfillment order).</li>
                <li><strong className="text-white/80">Penyedia infrastruktur</strong> (database cloud) dengan standar keamanan tinggi.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-white mb-3">5. Penyimpanan Data</h2>
              <p>Data akun dan transaksi disimpan selama akun Anda aktif. Anda dapat meminta penghapusan akun dengan menghubungi kami. Data transaksi dapat disimpan lebih lama untuk keperluan audit internal.</p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-white mb-3">6. Cookie & Sesi</h2>
              <p>Kami menggunakan cookie sesi untuk menjaga status login Anda. Cookie ini tidak digunakan untuk pelacakan iklan dan akan dihapus saat Anda logout atau cookie kedaluwarsa.</p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-white mb-3">7. Hak Anda</h2>
              <p>Anda memiliki hak untuk:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Mengakses data pribadi yang kami simpan tentang Anda.</li>
                <li>Meminta koreksi data yang tidak akurat.</li>
                <li>Meminta penghapusan akun dan data terkait.</li>
              </ul>
              <p className="mt-2">Hubungi kami untuk menggunakan hak-hak tersebut.</p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-white mb-3">8. Perubahan Kebijakan</h2>
              <p>Kebijakan privasi ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui halaman ini. Penggunaan layanan setelah perubahan berarti Anda menerima kebijakan yang diperbarui.</p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-white mb-3">9. Kontak</h2>
              <p>Pertanyaan mengenai kebijakan privasi dapat disampaikan melalui email atau media sosial resmi KampusRebahan.</p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
