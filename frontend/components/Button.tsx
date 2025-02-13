"use client"

import { cn } from "@/utils/cn"
import type React from "react" // Import React

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

export default function Button({ variant = "default", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg py-2 px-4 text-lg font-medium",
        variant === "outline"
          ? "border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900"
          : "bg-blue-500 text-white hover:bg-blue-600",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

