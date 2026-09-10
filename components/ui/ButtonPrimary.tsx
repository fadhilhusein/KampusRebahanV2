import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonPrimaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
}

export default function ButtonPrimary({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonPrimaryProps) {
  if (variant === "ghost") {
    return (
      <button
        className={`text-foreground text-[12px] font-medium leading-4 hover:opacity-70 transition-opacity duration-150 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`bg-btn-fill text-btn-text text-[12px] font-medium leading-4 rounded-full px-[20px] py-[10px] hover:bg-btn-fill/90 active:scale-95 transition-all duration-150 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
