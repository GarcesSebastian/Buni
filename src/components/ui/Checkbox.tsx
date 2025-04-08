"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

type VariantType = "circle" | "square";

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  variant?: VariantType;
}

const CheckBoxVariants = ({ variant = "circle" }: CheckboxProps) => {
  const baseStyles = "peer h-4 w-4 shrink-0 border-2 border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105"
  const variantStyles = {
    circle: "rounded-full",
    square: "rounded-md",
  }
  return `${baseStyles} ${variantStyles[variant]}`
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ variant = "circle", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={CheckBoxVariants({ variant })}
    {...props}
  >
    <CheckboxPrimitive.Indicator 
      className={`flex items-center justify-center text-current animate-in zoom-in-50 duration-300`}
    >
      <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

