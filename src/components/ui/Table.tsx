// File: src/components/ui/Table.tsx
import React from 'react'
export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full table-auto text-sm">{children}</table>
}
export const THead = (p:{children:any}) => <thead className="text-left text-xs text-slate-600">{p.children}</thead>
export const TBody = (p:{children:any}) => <tbody>{p.children}</tbody>
export const TR = (p:{children:any}) => <tr className="border-b last:border-0 py-2">{p.children}</tr>
export const TH = (p:{children:any}) => <th className="px-2 py-3">{p.children}</th>
export const TD = (p:{children:any}) => <td className="px-2 py-3 align-top">{p.children}</td>
