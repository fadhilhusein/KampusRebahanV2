"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { DitheringShader } from "@/components/ui/dithering-shader";

export default function HeroShader() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light";

  return (
    <DitheringShader
      width={1920}
      height={1080}
      shape="wave"
      type="8x8"
      colorBack={isLight ? "#F5F0FF" : "#11030a"}
      colorFront={isLight ? "#C4B5FD" : "#ff1f5b"}
      pxSize={3}
      speed={0.22}
      className={`pointer-events-none absolute inset-0 h-full w-full ${isLight ? "opacity-40" : "opacity-90"}`}
      style={{ position: "absolute", width: "100%", height: "100%" }}
    />
  );
}
