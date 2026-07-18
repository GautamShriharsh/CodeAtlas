"use client";

import { ArrowRight } from "lucide-react";

import { Reveal } from "./motion/reveal";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pt-40 pb-0 sm:px-12 sm:pt-48 md:px-16 lg:px-24"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-30">
        <div className="absolute top-24 left-1/4 h-[700px] w-[1200px] rounded-full bg-neutral-600/5 blur-[180px]" />
      </div>

      {/* Primary Left-Aligned Content Container */}
      <div className="flex w-full flex-col items-start text-left">
        <Reveal delay={0.50}>
          {/* Sightly increased typography footprint to text-7xl for better balanced emphasis */}
          <h1 className="text-5xl font-semibold tracking-tight text-neutral-100 sm:text-6xl lg:text-7xl lg:leading-[1.08]">
            Map your codebase.
            <br />
            <span className="text-neutral-500">Summarize every commit.</span>
          </h1>
        </Reveal>

        {/* Uses items-end on desktop grid matching so the link stays pinned to the far right baseline */}
        <div className="mt-8 flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <div className="max-w-2xl">
            <Reveal delay={0.70}>
              <p className="text-sm leading-relaxed text-neutral-400 sm:text-base">
                CodeAtlas transforms messy repository logic into clean, atomic AI
                summaries and lets your team instantly search, understand, and
                navigate your entire workspace.
              </p>
            </Reveal>
          </div>

          <div className="shrink-0 pb-1 mr-3">
            <Reveal delay={1.84}>
              <Button 
                href="/dashboard" 
                className="group flex items-center gap-1.5 border-none bg-transparent p-0 text-sm font-medium text-neutral-400 shadow-none outline-none transition-colors duration-200 hover:bg-transparent hover:text-neutral-200"
              >
                Launch Dashboard
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}