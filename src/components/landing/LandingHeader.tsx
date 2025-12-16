import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed top-4 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-7xl px-6 pointer-events-auto">
        <div
          className={`
            group
            flex items-center justify-between
            rounded-2xl
            transition-all duration-300 ease-out
            border border-white/10
            ${
              scrolled
                ? "px-5 py-3 bg-[#120a2a]/90 backdrop-blur-2xl shadow-[0_0_30px_rgba(168,85,247,0.25)]"
                : "px-6 py-4 bg-[#1a103d]/80 backdrop-blur-xl shadow-[0_0_45px_rgba(168,85,247,0.35)]"
            }
          `}
        >
          {/* ===== TEXT LOGO ===== */}
          <div
            className={`
              flex items-center
              font-semibold tracking-tight whitespace-nowrap
              transition-all duration-300
              ${scrolled ? "text-sm" : "text-base"}
            `}
          >
            {/* AI (glow) */}
            <span
              className="
                font-extrabold tracking-wide
                text-transparent bg-clip-text
                bg-gradient-to-r from-violet-300 to-violet-100
                drop-shadow-[0_0_12px_rgba(168,85,247,0.55)]
                group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.9)]
                transition
              "
            >
              AI
            </span>

            {/* Tag Pilot */}
            <span className="ml-1 font-semibold tracking-wide text-white">
              Tag&nbsp;Pilot
            </span>

            {/* Animated divider */}
            <span
              className="
                mx-3 font-light
                text-violet-400
                opacity-80
                group-hover:opacity-100
                group-hover:text-violet-300
                group-hover:animate-pulse
                transition
              "
            >
              |
            </span>

            {/* Rundata */}
            <span className="text-violet-300 font-medium tracking-wide">
              Rundata
            </span>
          </div>

          {/* ===== NAV ===== */}
          <nav
            className={`
              hidden md:flex items-center gap-8
              text-sm font-medium
              transition-colors duration-300
              ${scrolled ? "text-violet-300" : "text-violet-200"}
            `}
          >
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#ai" className="hover:text-white transition">
              AI Powered
            </a>
            <a href="#security" className="hover:text-white transition">
              Security
            </a>
            <a href="#pricing" className="hover:text-white transition">
              Pricing
            </a>
            <a href="#contact" className="hover:text-white transition">
              Contact
            </a>
          </nav>

          {/* ===== CTA ===== */}
          <Link
            to="/app"
            className={`
              rounded-xl
              bg-violet-600 text-white
              font-semibold text-sm
              transition-all duration-300
              hover:bg-violet-500 hover:scale-[1.05]
              ${
                scrolled
                  ? "px-4 py-2 shadow-[0_6px_25px_rgba(168,85,247,0.45)]"
                  : "px-5 py-2.5 shadow-[0_10px_35px_rgba(168,85,247,0.55)]"
              }
            `}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
