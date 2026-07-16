'use client'

import { FiGithub } from 'react-icons/fi'
import { Braces, Layers3, Sparkles } from 'lucide-react'

import { Reveal } from './motion/reveal'
import { Section } from './ui/section'

const workflow = [
  { number: '01', title: 'Connect repo', description: 'Authenticate your workspace with a scoped GitHub token.', icon: FiGithub },
  { number: '02', title: 'Index files', description: 'Structure, symbols, and context are read with precision.', icon: Braces },
  { number: '03', title: 'Vector sync', description: 'Your repository becomes a searchable semantic map.', icon: Layers3 },
  { number: '04', title: 'Generate logs', description: 'Gemini turns diffs into useful engineering signal.', icon: Sparkles },
]

export function Pipeline() {
  return (
    <Section id="architecture" className="py-24 lg:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Architecture</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-100 sm:text-4xl">From repository to reasoning layer.</h2>
      </Reveal>

      <div className="mt-16 grid gap-0 md:grid-cols-4">
        {workflow.map((step, index) => {
          const Icon = step.icon
          return (
            <Reveal key={step.number} delay={index * 0.20} y={18} className="relative border-l border-neutral-800 px-6 pb-10 first:border-l-0 md:pb-0 md:first:pl-0">
              {index < workflow.length - 1 && (
                <div
                  className={`pointer-events-none absolute ${index === 0 ? 'left-10' : 'left-16'} -right-6 top-5 hidden h-px bg-neutral-800 md:block`}
                />
              )}
              <div className="relative z-10 mb-8 flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/60 text-neutral-300"><Icon className="h-[18px] w-[18px]" /></div>
              <p className="font-mono text-xs text-neutral-600">{step.number}</p>
              <h3 className="mt-2 text-lg font-medium tracking-tight text-neutral-100">{step.title}</h3>
              <p className="mt-2 max-w-[14rem] text-sm leading-6 text-neutral-400">{step.description}</p>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
