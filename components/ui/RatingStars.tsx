import { Star } from "lucide-react";
export default function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span
      role="img"
      className="inline-flex gap-0.5"
      aria-label={`${rating} dari 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden="true"
          style={{ animationDelay: `${i * 60}ms` }}
          className={`kr-fade-in ${
            i < Math.round(rating) ? "fill-warn text-warn" : "text-line"
          }`}
        />
      ))}
    </span>
  );
}
