import { Star } from "lucide-react";
export default function RatingStars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex gap-0.5"
      aria-label={`Rating ${rating} dari 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={13}
          aria-hidden="true"
          className={
            i < Math.round(rating)
              ? "fill-primary text-primary"
              : "text-foreground/30"
          }
        />
      ))}
    </span>
  );
}
