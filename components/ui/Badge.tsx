interface BadgeProps {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "tertiary" | "default";
  className?: string;
}

const colors = {
  primary: "bg-primary/20 text-primary border-primary/30",
  secondary: "bg-secondary/20 text-secondary border-secondary/30",
  tertiary: "bg-tertiary/20 text-tertiary border-tertiary/30",
  default: "bg-white/10 text-white/70 border-white/20",
};

export default function Badge({ children, color = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
