const iconMap: Record<string, string> = {
  streaming: "🎬",
  video: "🎬",
  netflix: "🎬",
  disney: "🎬",
  hbo: "🎬",
  prime: "🎬",
  music: "🎵",
  spotify: "🎵",
  audio: "🎵",
  gaming: "🎮",
  game: "🎮",
  steam: "🎮",
  productivity: "⚡",
  office: "📝",
  microsoft: "📝",
  adobe: "🎨",
  design: "🎨",
  canva: "🎨",
  vpn: "🔒",
  security: "🔒",
  cloud: "☁️",
  storage: "☁️",
  drive: "☁️",
  education: "📚",
  belajar: "📚",
  kursus: "📚",
  social: "📱",
  ai: "🤖",
  gpt: "🤖",
};

export function getCategoryIcon(category: string | null | undefined): string {
  if (!category) return "💎";
  const key = category.toLowerCase();
  for (const [k, v] of Object.entries(iconMap)) {
    if (key.includes(k)) return v;
  }
  return "💎";
}

export function getCategoryColor(
  category: string | null | undefined
): "primary" | "secondary" | "tertiary" | "default" {
  if (!category) return "default";
  const key = category.toLowerCase();
  if (["streaming", "netflix", "disney", "hbo", "prime", "video"].some((k) => key.includes(k)))
    return "primary";
  if (["music", "spotify", "gaming", "game", "steam"].some((k) => key.includes(k)))
    return "secondary";
  if (["productivity", "adobe", "canva", "design", "ai", "gpt"].some((k) => key.includes(k)))
    return "tertiary";
  return "default";
}
