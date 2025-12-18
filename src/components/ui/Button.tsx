import clsx from "clsx"
import React from "react"

type ButtonVariant = "primary" | "secondary" | "ghost"

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export default function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "px-4 py-2 rounded-md text-sm font-medium transition",
        {
          "bg-indigo-600 text-white hover:bg-indigo-700":
            variant === "primary",
          "bg-slate-100 text-slate-700 hover:bg-slate-200":
            variant === "secondary",
          "bg-transparent text-slate-600 hover:bg-slate-100":
            variant === "ghost"
        },
        className
      )}
    />
  )
}
