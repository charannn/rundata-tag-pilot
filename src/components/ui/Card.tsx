// File: src/components/ui/Card.tsx
import React from 'react'
export function Card({ children, className='' }: React.PropsWithChildren<{className?:string}>) {
  return <div className={`border rounded p-4 bg-white ${className}`}>{children}</div>
}
