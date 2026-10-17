interface BadgeProps {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "tertiary" | "default";
  className?: string;
}
const colors = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  tertiary: "bg-tertiary/10 text-tertiary border-tertiary/20",
  default: "bg-foreground/5 text-foreground/70 border-foreground/10",
};
export default function Badge({
  children,
  color = "default",
  className = "",
}: BadgeProps) {
  const label = typeof children === "string" ? children.toLowerCase() : "";
  const state = ["selesai", "completed"].includes(label)
    ? "success"
    : ["kadaluarsa", "expired"].includes(label)
      ? "expired"
      : "default";
  return (
    <span
      data-state={state}
      className={`kr-badge inline-flex items-center px-2 py-1 rounded text-[11px] font-medium border ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
