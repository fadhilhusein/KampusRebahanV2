import { createElement } from "react";
import {
  Film,
  Music2,
  Gamepad2,
  NotebookPen,
  Palette,
  ShieldCheck,
  Cloud,
  BookOpen,
  Smartphone,
  Cpu,
  Globe,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
const iconMap: Record<string, LucideIcon> = {
  streaming: Film,
  video: Film,
  music: Music2,
  audio: Music2,
  gaming: Gamepad2,
  game: Gamepad2,
  productivity: NotebookPen,
  design: Palette,
  adobe: Palette,
  canva: Palette,
  vpn: ShieldCheck,
  security: ShieldCheck,
  cloud: Cloud,
  education: BookOpen,
  social: Smartphone,
  ai: Cpu,
  domain: Globe,
  utility: Package,
};
export function getCategoryIcon(category: string | null | undefined) {
  const key = category?.toLowerCase() ?? "";
  const icon =
    Object.entries(iconMap).find(([name]) => key.includes(name))?.[1] ??
    Package;
  return createElement(icon, {
    size: 22,
    strokeWidth: 1.7,
    "aria-hidden": true,
  });
}
export function getCategoryColor(
  category: string | null | undefined,
): "primary" | "secondary" | "tertiary" | "default" {
  const key = category?.toLowerCase() ?? "";
  if (key.includes("streaming")) return "primary";
  if (key.includes("music")) return "secondary";
  if (key.includes("productivity")) return "tertiary";
  return "default";
}
