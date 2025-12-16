// File: src/components/ui/Button.tsx
import React from 'react'
export default function Button({ children, className='', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`px-3 py-2 rounded bg-indigo-600 text-white hover:opacity-95 ${className}`}>
      {children}
    </button>
  )
}
