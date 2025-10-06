import React from "react";
import { cn } from "../utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseClasses = cn(
      "inline-flex items-center justify-center font-medium transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "active:scale-95",

      fullWidth && "w-full",

      iconOnly && "aspect-square",

      {
        "px-3 py-1.5 text-sm": size === "sm" && !iconOnly,
        "px-4 py-2 text-base": size === "md" && !iconOnly,
        "px-6 py-3 text-lg": size === "lg" && !iconOnly,
        "p-1.5": size === "sm" && iconOnly,
        "p-2": size === "md" && iconOnly,
        "p-3": size === "lg" && iconOnly,
      },

      {
        "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 active:bg-primary-700":
          variant === "primary",

        "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500 active:bg-secondary-300":
          variant === "secondary",

        "border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100":
          variant === "outline",

        "text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500 active:bg-secondary-200":
          variant === "ghost",

        "bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 active:bg-error-700":
          variant === "danger",
      },

      className
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className={cn("animate-spin -ml-1 mr-2", {
              "h-4 w-4": size === "sm",
              "h-5 w-5": size === "md",
              "h-6 w-6": size === "lg",
            })}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!loading && leftIcon && (
          <span className={cn("mr-2", iconOnly && "mr-0")}>{leftIcon}</span>
        )}

        {!iconOnly && children && (
          <span className={loading ? "opacity-0" : ""}>{children}</span>
        )}

        {!loading && rightIcon && (
          <span className={cn("ml-2", iconOnly && "ml-0")}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
