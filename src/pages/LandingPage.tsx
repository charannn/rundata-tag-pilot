import { Link } from "react-router-dom"
import LandingHeader from "../components/landing/LandingHeader"
import GlowConnections from "../components/landing/GlowConnections"
import { useRef } from "react"

export default function LandingPage() {
  return (
    <div className="font-sans text-slate-100 overflow-x-hidden bg-[#0b0618]">
      {/* ================= HEADER ================= */}
      <LandingHeader />

      {/* ================= HERO ================= */}
      <section
        className="
        relative
        pt-44
        bg-[radial-gradient(ellipse_at_top,_#7c2d12_0%,_#3b1608_40%,_#0b0618_75%)]
        text-white
        "
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.35),transparent_55%)]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-20 pb-28 text-center">
          {/* Category badge */}
          <span
            className="
            inline-flex items-center gap-2 mb-10 px-6 py-2
            rounded-full text-base md:text-lg font-semibold
            bg-white/10 backdrop-blur
            border border-white/10
            text-violet-300
            shadow-[0_0_35px_rgba(139,92,246,0.45)]
            "
          >
            World’s First AI-Powered Tag Management System
          </span>

          {/* Headline */}
          <h1
            className="
            text-4xl lg:text-6xl font-extrabold leading-tight mb-8
            text-white
            drop-shadow-[0_12px_60px_rgba(139,92,246,0.45)]
            "
          >
            Tags that think.<br />
            Analytics that evolve.
          </h1>

          {/* Subheading */}
          <p className="text-lg lg:text-xl text-violet-300 max-w-3xl mx-auto mb-14">
            Rundata Tag Pilot uses artificial intelligence to automatically
            design, deploy, validate, and optimize tracking — without engineers,
            fragile scripts, or guesswork.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/app"
              className="
              px-10 py-4 rounded-xl
              bg-violet-600 text-white
              font-semibold text-lg
              shadow-[0_12px_55px_rgba(139,92,246,0.6)]
              hover:bg-violet-500 hover:scale-[1.04]
              transition
              "
            >
              Launch Platform
            </Link>

            <a
              href="#features"
              className="
              px-10 py-4 rounded-xl
              border border-violet-400/30
              text-violet-300
              font-semibold text-lg
              hover:bg-white/10
              hover:border-violet-400
              transition
              "
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="bg-[#120907] py-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm md:text-base text-violet-300">
          Built for modern data teams • Privacy-first • Cloud & edge ready
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="bg-[#0b0618] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-6">
            Reinventing tag management with AI
          </h2>

          <p className="text-lg text-violet-300 text-center max-w-3xl mx-auto mb-20">
            Unlike traditional tag managers, Rundata doesn’t wait for instructions.
            It understands events, predicts intent, and continuously improves your
            tracking setup.
          </p>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Feature title="AI-Generated Tags" desc="Automatically creates analytics, marketing, and conversion tags based on detected user behavior." />
            <Feature title="Self-Healing Tracking" desc="Detects broken, missing, or duplicated tags and fixes them before data loss happens." />
            <Feature title="Natural Language Rules" desc="Define tracking logic in plain English — AI converts it into precise execution rules." />
            <Feature title="Live Intelligence Debugger" desc="AI explains why a tag fired (or didn’t) with human-readable reasoning." />
            <Feature title="Zero-Deploy Updates" desc="Ship tracking changes instantly without touching production code or waiting on releases." />
            <Feature title="Privacy-First by Design" desc="Automatic PII detection, consent awareness, and regional compliance built-in." />
            <GlowConnections />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-[#120907] py-28 text-center border-t border-white/5">
        <h3 className="text-3xl lg:text-4xl font-bold mb-6">
          The future of analytics starts here
        </h3>
        <p className="text-lg text-violet-300 mb-12">
          Stop managing tags. Let AI do it for you.
        </p>

        <Link
          to="/app"
          className="
          inline-block px-12 py-4 rounded-xl
          bg-violet-600 text-white
          font-semibold text-lg
          shadow-[0_14px_65px_rgba(139,92,246,0.65)]
          hover:bg-violet-500 hover:scale-[1.04]
          transition
          "
        >
          Enter Rundata Tag Pilot
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black py-10 text-center text-sm text-violet-400">
        © {new Date().getFullYear()} Rundata Tag Pilot • AI-Powered Analytics Infrastructure
      </footer>
    </div>
  )
}



/* ================= FEATURE CARD ================= */
function Feature({ title, desc }: { title: string; desc: string }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    card.style.setProperty("--x", `${x}px`)
    card.style.setProperty("--y", `${y}px`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="
        relative overflow-hidden
        bg-[#140a06]
        rounded-2xl p-8
        border border-white/5
        transition
        group
      "
    >
      {/* AI glow trail */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-0 group-hover:opacity-100
          transition duration-300
          bg-[radial-gradient(
            circle_140px_at_var(--x)_var(--y),
            rgba(139,92,246,0.35),
            transparent_60%
          )]
        "
      />

      {/* Content */}
      <h4 className="relative z-10 text-xl font-semibold mb-3 text-white">
        {title}
      </h4>
      <p className="relative z-10 text-violet-300 leading-relaxed">
        {desc}
      </p>
    </div>
  )
}
