import type { HTMLAttributes, ReactNode } from 'react'

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function GlassCard({ children, className = '', ...props }: GlassCardProps) {
  return (
    <div
      className={`border border-neutral-800/50 bg-neutral-900/40 shadow-2xl backdrop-blur-md ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
