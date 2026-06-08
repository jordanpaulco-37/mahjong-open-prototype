"use client";

import { forwardRef } from "react";

type Variant = "primary" | "ghost" | "gold" | "link";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: "btn btn-primary",
  ghost: "btn btn-ghost",
  gold: "btn btn-gold",
  link: "font-semibold text-pink-600 underline-offset-2 hover:underline",
};

const sizeClass: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "",
  lg: "text-base px-8 py-3.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const classes = [variantClass[variant], sizeClass[size], className]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
