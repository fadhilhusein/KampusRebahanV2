import Link from "next/link";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-8 pt-14">
      {/* Background orbs */}
      <div
        className="orb w-[500px] h-[500px] top-[-100px] left-[-100px] opacity-20"
        style={{ background: "#E11D48" }}
      />
      <div
        className="orb w-[400px] h-[400px] bottom-[-80px] right-[-80px] opacity-15"
        style={{ background: "#4338CA" }}
      />
      <div
        className="orb w-[300px] h-[300px] top-[30%] right-[20%] opacity-10"
        style={{ background: "#F97316" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255) 1px, #ffffff00 1px), linear-gradient(90deg, rgb(255 242 242) 2px, #000000 2px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] text-white/60 font-medium">
            Tersedia 50+ Produk Digital
          </span>
        </div>

        <h1
          className="font-semibold text-white leading-none tracking-[-0.025em] mb-6"
          style={{ fontSize: "clamp(40px, 7vw, 72px)", lineHeight: "1" }}
        >
          Akun Digital Premium
          <br />
          <span
            style={{
              background:
                "linear-gradient(to bottom, #f0f0f0, #707070)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Harga Terjangkau
          </span>
        </h1>

        <p className="text-[16px] text-white/50 leading-6 max-w-xl mx-auto mb-10">
          Netflix, Spotify, Disney+, dan puluhan layanan digital premium lainnya.
          Dapatkan akses instan dengan harga mahasiswa.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/products">
            <ButtonPrimary className="px-8 py-3 text-[14px]">
              Lihat Semua Produk
            </ButtonPrimary>
          </Link>
          <Link href="/products">
            <ButtonPrimary variant="ghost" className="text-[14px]">
              Pelajari Lebih →
            </ButtonPrimary>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-10 mt-16">
          {[
            { label: "Produk Tersedia", value: "50+" },
            { label: "Jam Layanan", value: "20/7" },
            { label: "Uptime Layanan", value: "99.9%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[28px] font-semibold text-white leading-none">
                {stat.value}
              </div>
              <div className="text-[11px] text-white/30 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
