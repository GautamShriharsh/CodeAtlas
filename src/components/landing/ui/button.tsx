import type { AnchorHTMLAttributes, ReactNode } from 'react'

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  variant?: 'dark' | 'light'
}

export function Button({ children, className = '', variant = 'dark', ...props }: ButtonProps) {
  const variants = {
    dark: 'border border-neutral-700 bg-neutral-900 text-white shadow-2xl hover:bg-neutral-800',
    light: 'bg-white text-black hover:bg-neutral-200',
  }

  return (
    <a
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
