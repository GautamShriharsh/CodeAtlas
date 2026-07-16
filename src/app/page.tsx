'use client'

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Pipeline } from "@/components/landing/pipeline";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import HeroCodebaseMockupPreview from "@/components/landing/hero-mockup";


export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-neutral-100 selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(115,115,115,0.16),transparent_28%),radial-gradient(circle_at_10%_35%,rgba(64,64,64,0.14),transparent_24%)]" />
      <Navbar />
      <Hero />
      <HeroCodebaseMockupPreview />
      <FeatureGrid />
      <Pipeline />
      <Cta />
      <Footer />
    </main>
  )
}
