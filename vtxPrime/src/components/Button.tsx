import { ArrowRight } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: boolean;
  className?: string;
}

const Button = ({
  children,
  variant = "primary",
  icon = true,
  className = "",
  ...props
}: ButtonProps) => {
  const styles =
    variant === "secondary"
      ? "border border-border-light bg-surface/70 text-silver hover:border-primary/70 hover:bg-card-hover/90"
      : "bg-primary text-white shadow-glow hover:bg-primary-hover";

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition duration-300 ${styles} ${className}`}
      {...props}
    >
      {children}
      {icon && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
};

export default Button;