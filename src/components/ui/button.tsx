import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "link" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseClass = "ui-button"
    const variantClass = `ui-button-${variant}`
    const sizeClass = `ui-button-${size}`
    const combinedClasses = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(" ")

    return (
      <button
        className={combinedClasses}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
