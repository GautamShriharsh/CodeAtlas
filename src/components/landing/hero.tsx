"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Reveal } from "./motion/reveal";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-40 pb-0 sm:px-8 sm:pt-48"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-30">
        <div className="absolute top-24 left-1/2 h-[700px] w-[1200px] -translate-x-1/2 rounded-full bg-neutral-600/10 blur-[180px]" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* <Reveal className="mb-7" y={16}>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-400 shadow-2xl backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
            Introducing CodeAtlas
          </div>
        </Reveal> */}

        <Reveal delay={0.50}>
          <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-neutral-100 sm:text-6xl lg:text-8xl lg:leading-[0.98]">
            Map your codebase.
            <br />
            <span className="text-neutral-500">Summarize every commit.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.70}>
          <p className="mt-7 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg">
            CodeAtlas transforms messy repository logic into clean, atomic AI
            summaries and lets your team instantly search, understand, and
            navigate your entire workspace.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <Button href="/dashboard" className="group mt-9 gap-2">
            Launch Dashboard
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </Reveal>
      </div>
{/* 
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.9,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative mt-10 flex justify-center"
      > */}
        {/* Background atmosphere */}
        {/* <div className="absolute inset-0 -z-20 flex items-center justify-center">
          <div className="h-[650px] w-[1400px] rounded-full bg-gradient-to-b from-neutral-700/12 via-neutral-800/6 to-transparent blur-[180px]" />
        </div> */}

        {/* subtle floor shadow */}
        {/* <div className="absolute bottom-0 left-1/2 -z-10 h-28 w-[75%] -translate-x-1/2 rounded-full bg-black/60 blur-3xl" /> */}

        {/* <img
          src="/hero-final1.png"
          alt="CodeAtlas Dashboard"
          className="hero-dashboard w-[92vw] max-w-[1550px] object-cover"
          style={{
            transform: "perspective(2200px) rotateX(6deg) scale(1.02)",
          }}
        />
      </motion.div> */}
    </section>
  );
}
