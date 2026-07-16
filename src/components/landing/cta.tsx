import { ArrowRight, CircleDot } from 'lucide-react'

import { Reveal } from './motion/reveal'
import { Button } from './ui/button'
import { GlassCard } from './ui/glass-card'
import { Section } from './ui/section'

export function Cta() {
  return (
    <Section id="getStarted" className="py-12 lg:py-20">
      <Reveal>
        <GlassCard className="relative overflow-hidden rounded-3xl px-6 py-20 text-center sm:px-12 sm:py-28">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(115,115,115,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(115,115,115,0.15)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(ellipse_70%_85%_at_50%_50%,black,transparent)]" />
          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto mb-6 grid h-11 w-11 place-items-center rounded-xl border border-neutral-700 bg-black/50"><CircleDot className="h-5 w-5 text-neutral-200" /></div>
            <h2 className="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">Your codebase has a story. Start reading it.</h2>
            <p className="mt-5 text-neutral-400">Connect a repository in minutes and give every engineering decision the context it deserves.</p>
            <Button href="/dashboard" variant="light" className="mt-9 gap-2 font-semibold hover:-translate-y-0.5">
              Start Building Free <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </GlassCard>
      </Reveal>
    </Section>
  )
}
