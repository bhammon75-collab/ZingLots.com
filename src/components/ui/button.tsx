import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#ef4444] text-white hover:bg-red-600 shadow-sm", // Red for primary CTAs
        destructive:
          "bg-[#ef4444] text-white hover:bg-red-600", // Also red for destructive actions
        outline:
          "border border-[#2563eb] text-[#2563eb] bg-transparent hover:bg-blue-50", // Blue outline for secondary
        secondary:
          "bg-[#2563eb] text-white hover:bg-blue-600", // Blue for secondary actions
        ghost: "hover:bg-accent/30 hover:text-accent-foreground",
        link: "text-[#2563eb] underline-offset-4 hover:underline", // Blue for links
        hero:
          "bg-gradient-to-tr from-[#ef4444] to-red-500 text-white shadow-[var(--shadow-glow)] hover:opacity-95 active:scale-[0.98]",
        pill:
          "rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
