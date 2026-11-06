"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Bot,
  Clapperboard,
  Cloud,
  Gamepad2,
  GraduationCap,
  Music,
  Palette,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { getProductImage } from "@/lib/productImages";

const tiles: { match: RegExp; from: string; to: string; Icon: LucideIcon }[] = [
  { match: /stream|netflix|disney|hbo|vidio|prime|viu|wetv|iqiyi/i, from: "#FF8A5B", to: "#D6336C", Icon: Clapperboard },
  { match: /musik|music|spotify|joox|deezer/i, from: "#34D399", to: "#0F766E", Icon: Music },
  { match: /desain|design|canva|figma|adobe|capcut/i, from: "#FACC15", to: "#F97316", Icon: Palette },
  { match: /\bai\b|chatgpt|gemini|claude|copilot|midjourney|perplexity/i, from: "#60A5FA", to: "#4338CA", Icon: Bot },
  { match: /belajar|learn|coursera|udemy|ruangguru|duolingo|skillshare/i, from: "#F472B6", to: "#9333EA", Icon: GraduationCap },
  { match: /game|steam|roblox|xbox|playstation|mobile legends/i, from: "#A3E635", to: "#15803D", Icon: Gamepad2 },
  { match: /vpn|keamanan|security|nord|express/i, from: "#C084FC", to: "#6D28D9", Icon: ShieldCheck },
  { match: /cloud|drive|google one|dropbox|icloud/i, from: "#38BDF8", to: "#1D4ED8", Icon: Cloud },
];

export default function ProductImage({
  name,
  category = "",
  sizes = "50vw",
  priority = false,
  iconSize = 56,
}: {
  name: string;
  category?: string;
  sizes?: string;
  priority?: boolean;
  iconSize?: number;
}) {
  const source = getProductImage(name);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (source && failedSource !== source) {
    return (
      <Image
        src={source}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => setFailedSource(source)}
      />
    );
  }
  const tile =
    tiles.find((t) => t.match.test(`${category} ${name}`)) ??
    tiles[tiles.length - 1];
  return (
    <div
      role="img"
      aria-label={name}
      className="flex h-full w-full items-center justify-center text-white"
      style={{ background: `linear-gradient(180deg, ${tile.from}, ${tile.to})` }}
    >
      <tile.Icon size={iconSize} aria-hidden="true" />
    </div>
  );
}
