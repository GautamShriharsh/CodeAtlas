import type { HTMLAttributes, ReactNode } from 'react'

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
}

export function Section({ children, className = '', ...props }: SectionProps) {
  return (
    <section className={`px-5 sm:px-8 ${className}`} {...props}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}
