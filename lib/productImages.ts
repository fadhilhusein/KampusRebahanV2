const productImageMap: Record<string, string> = {
  "zoom": "/products/zoom-premium-1770486513.png",
  "windows": "/products/windows-10-11-pro-1770493761.png",
  "youku": "/products/youku-premium-1772129735.png",
  "crunchyroll": "/products/crunchyroll-1772129950.png",
  "bstation": "/products/bstation-1772127195.png",
  "vidio": "/products/vidio-platinum-1772127344.png",
  "scribd": "/products/scribd-1772129256.png",
  "office 365": "/products/office365-lifetime-1770493190.png",
  "office365": "/products/office365-lifetime-1770493190.png",
  "prime video": "/products/prime-video-1772130447.png",
  "prime": "/products/prime-video-1772130447.png",
  "viu": "/products/viu-premium-1772126011.png",
  "canva premium": "/products/canva-member-1770483590.png",
  "canva pro": "/products/canva-member-1770483590.png",
  "canva": "/products/canva-member-1770483590.png",
  "domain": "/products/domain-tech-1778360523.png",
  "ilovepdf": "/products/i-love-pdf-1772130142.png",
  "i love pdf": "/products/i-love-pdf-1772130142.png",
  "apple music": "/products/apple-music-1772524843.png",
  "kiro": "/products/kiro-ai-1778536029.png",
  "spotify": "/products/spotify-premium-1770495170.png",
  "netflix": "/products/netflix-premium-1770492967.png",
  "capcut": "/products/canva-head-1770484784.png",
  "devin": "/products/devin-ai-windsurf-1777302799.png",
  "windsurf": "/products/devin-ai-windsurf-1777302799.png",
  "api testing": "/products/test-api-1772991062.png",
  "gemini ai": "/products/gemini_ai.png",
  "loklok": "/products/loklok.png",
  "claude": "/products/claude_ai.png"
};

export function getProductImage(productName: string): string | null {
  if (!productName) return null;
  const lower = productName.toLowerCase();
  for (const [key, path] of Object.entries(productImageMap)) {
    if (lower.includes(key)) return path;
  }
  return null;
}
