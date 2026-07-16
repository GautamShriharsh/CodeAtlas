'use client'

import { motion } from 'framer-motion'
import { Box, MessageSquareText, Search, Sparkles, UsersRound, WalletCards } from 'lucide-react'
import type { ReactNode } from 'react'

import { Reveal } from './motion/reveal'
import { GlassCard } from './ui/glass-card'
import { Section } from './ui/section'

const hoverTransition = { duration: 0.25 }

export function FeatureGrid() {
  return (
    <Section id="features" className="border-y border-neutral-900 bg-neutral-950/50 py-24 lg:py-32">
      <Reveal className="mb-12 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Built for signal</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-100 sm:text-4xl">Your repository, rendered legible.</h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div whileHover={{ y: -4 }} transition={hoverTransition} className="md:col-span-2">
          <GlassCard className="group relative h-full min-h-[280px] overflow-hidden rounded-2xl p-7">
            <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(transparent,rgba(0,0,0,0.65))]" />
            <div className="relative flex h-full flex-col gap-8">
              <FeatureIcon icon={<Sparkles className="h-5 w-5" />} />
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">Commit intelligence</p>
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-100">Git commit summary review</h3>
                <p className="mt-3 max-w-xl leading-7 text-neutral-400">Gemini reads the structure of each diff and transforms raw code logs into clear, human-readable engineering summaries.</p>
              </div>
            </div>
            <div className="absolute right-7 top-7 hidden w-64 rounded-xl border border-neutral-800 bg-black/70 p-3 font-mono text-[10px] leading-5 text-neutral-500 shadow-2xl lg:block">
              <span className="text-neutral-300">feat/checkout</span><br />
              + unified cart state<br />
              + resilient payment retry<br />
              <span className="text-neutral-700">impact: checkout flow</span>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={hoverTransition} className="md:col-span-2 lg:col-span-1">
         <GlassCard className="relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl p-7">
  <FeatureIcon icon={<MessageSquareText className="h-5 w-5" />} />

  <div className="mt-8">
    <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
      Workspace context
    </p>

    <h3 className="text-2xl font-semibold tracking-tight text-neutral-100">
      Codebase Q&amp;A chatbot
    </h3>

    <p className="mt-3 leading-7 text-neutral-400">
      Run direct, vector-powered semantic inquiries against every indexed
      repository file.
    </p>
  </div>

  {/* Pushes the search bar to the bottom */}
  <div className="mt-auto pt-8">
    <div className="rounded-xl border border-neutral-800 bg-black/40 p-3 text-xs text-neutral-400">
      <div className="flex items-center gap-2">
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          Where is session refresh handled?
        </span>
      </div>
    </div>
  </div>
</GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={hoverTransition}>
          <GlassCard className="h-full min-h-[240px] rounded-2xl p-7">
            <div className="flex h-full flex-col gap-8">
              <FeatureIcon icon={<Box className="h-5 w-5" />} />
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-neutral-100">Automated repository indexing</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">Analyze files effortlessly through secure, scoped GitHub integration tokens.</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={hoverTransition}>
          <GlassCard className="h-full min-h-[240px] rounded-2xl p-7">
            <div className="flex h-full flex-col gap-8">
              <FeatureIcon icon={<WalletCards className="h-5 w-5" />} />
              <div>
                <div className="mb-3 flex items-end justify-between"><span className="text-xs uppercase tracking-[0.14em] text-neutral-500">Credits</span><span className="font-mono text-sm text-neutral-200">84%</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-neutral-800"><div className="h-full w-[84%] rounded-full bg-neutral-300" /></div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-neutral-100">Token-based allocation</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">Clean usage metrics, wired to a resilient Stripe billing pipeline.</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={hoverTransition}>
          <GlassCard className="h-full min-h-[240px] rounded-2xl p-7">
            <div className="flex h-full flex-col gap-8">
              <FeatureIcon icon={<UsersRound className="h-5 w-5" />} />
              <div>
                <div className="mb-4 flex -space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-700 text-[10px] font-medium text-neutral-200">A</div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-600 text-[10px] font-medium text-neutral-200">M</div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-800 text-sm text-neutral-300">+</div>
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-neutral-100">Invite members to your workspace</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">Bring your team into the same codebase context so everyone can explore, ask, and ship together.</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Section>
  )
}

function FeatureIcon({ icon }: { icon: ReactNode }) {
  return <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 text-neutral-200">{icon}</div>
}
