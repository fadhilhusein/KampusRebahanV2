import * as motion from "motion/react-client";
import GradientBorder from "@/components/ui/GradientBorder";

const steps = [
  {
    num: "01",
    title: "Pilih Produk",
    desc: "Browse ratusan produk digital. Pilih layanan yang kamu butuhkan dan varian yang sesuai budget.",
  },
  {
    num: "02",
    title: "Checkout",
    desc: "Pilih varian, masukkan quantity, dan opsional kode voucher. Proses checkout kilat tanpa ribet.",
  },
  {
    num: "03",
    title: "Terima Akun",
    desc: "Akun langsung dikirim otomatis. Nikmati layanan premium tanpa antri.",
  },
];

export default function HowItWorks() {
  return (
    <motion.section
      className="py-24 px-8"
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <h2 className="text-[40px] font-semibold text-white leading-none tracking-tight mb-4">
            Cara Kerja
          </h2>
          <p className="text-[16px] text-white/40">
            3 langkah mudah untuk dapatkan akun digitalmu
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              className="h-full"
              initial={{ opacity: 0, y: 36, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.015 }}
            >
              <GradientBorder className="h-full">
                <div className="p-8 h-full flex flex-col">
                  <div
                    className="text-[48px] font-semibold leading-none mb-6"
                    style={{
                      background: "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.1))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-[18px] font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-white/40 leading-6">{step.desc}</p>
                </div>
              </GradientBorder>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
