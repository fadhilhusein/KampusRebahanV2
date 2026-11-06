interface BadgeProps {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "tertiary" | "default";
  className?: string;
}
const colors = {
  primary: "bg-danger-bg text-danger",
  secondary: "bg-success-bg text-success",
  tertiary: "bg-warn-bg text-warn",
  default: "bg-pill text-muted",
};
export default function Badge({
  children,
  color = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-[5px] text-xs font-semibold transition-colors duration-[250ms] ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
