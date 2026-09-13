import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import { Slot } from "@/components/ui/Slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary shadow-sm hover:shadow-md",
        secondary:
          "bg-white text-primary border border-primary hover:bg-primary hover:text-white",
        accent:
          "bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent",
        ghost: "bg-transparent text-text-primary hover:bg-background-secondary",
        outline:
          "bg-transparent text-text-primary border border-border hover:border-primary hover:text-primary",
        danger: "bg-error text-white hover:bg-red-700 focus-visible:ring-error",
        success: "bg-success text-white hover:bg-green-700",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-9 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, Button renders as its child element (e.g. a Next.js Link)
   * with the button styles applied, instead of wrapping it in a <button>.
   * This avoids invalid HTML like <a><button/></a>.
   */
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
