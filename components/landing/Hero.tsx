import Link from "next/link";
import * as motion from "motion/react-client";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { DitheringShader } from "@/components/ui/dithering-shader";
import RecentPurchaseBanner from "@/components/landing/RecentPurchaseBanner";

export default function Hero() {
  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-8 pt-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#030407_0%,#090205_35%,#4c0618_78%,#72081f_100%)]" />
      <DitheringShader
        width={1920}
        height={1080}
        shape="wave"
        type="8x8"
        colorBack="#11030a"
        colorFront="#ff1f5b"
        pxSize={3}
        speed={0.22}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),rgba(0,0,0,0)_34%),linear-gradient(to_bottom,rgba(0,0,0,0.04),rgba(0,0,0,0.58))]" />

      <motion.div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255) 1px, #ffffff00 1px), linear-gradient(90deg, rgb(255 255 255) 1px, #ffffff00 1px)",
          backgroundSize: "40px 40px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />

      <div className="relative z-10 text-center max-w-6xl w-full mx-auto">
        <motion.div
          className="inline-flex items-center gap-2 glass backdrop-blur-[12px] bg-black/70 rounded-full px-4 py-1.5 mb-8"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] text-white/60 font-medium">
            Tersedia 50+ Produk Digital
          </span>
        </motion.div>

        <motion.h1
          className="font-semibold text-white leading-none tracking-[-0.025em] mb-6 max-w-6xl mx-auto"
          style={{ fontSize: "clamp(42px, 6vw, 82px)", lineHeight: "1" }}
          initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, delay: 0.2, ease: "easeOut" }}
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
        </motion.h1>

        <motion.p
          className="text-[16px] text-white/50 leading-6 max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34, ease: "easeOut" }}
        >
          Netflix, Spotify, Disney+, dan puluhan layanan digital premium lainnya.
          Dapatkan akses instan dengan harga mahasiswa.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.46, ease: "easeOut" }}
        >
          <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link href="/products">
              <ButtonPrimary className="px-8 py-3 text-[14px]">
                Lihat Semua Produk
              </ButtonPrimary>
            </Link>
          </motion.div>
          <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
            <Link href="/products">
              <ButtonPrimary variant="ghost" className="text-[14px]">
                Pelajari Lebih →
              </ButtonPrimary>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-10 mt-16"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          {[
            { label: "Produk Tersedia", value: "50+" },
            { label: "Jam Layanan", value: "6AM - 10PM" },
            { label: "Uptime Layanan", value: "99.9%" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.68 + index * 0.08, ease: "easeOut" }}
            >
              <div className="text-[28px] font-semibold text-white leading-none">
                {stat.value}
              </div>
              <div className="text-[11px] text-white/30 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <RecentPurchaseBanner />
    </motion.section>
  );
}
