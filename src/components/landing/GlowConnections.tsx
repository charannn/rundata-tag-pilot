export default function GlowConnections() {
  return (
    <>
      {/* Horizontal glow lines */}
      <div className="hidden lg:block pointer-events-none absolute inset-0">
        {/* Row 1 */}
        <div
          className="
            absolute top-[20%] left-[18%] w-[64%] h-px
            bg-gradient-to-r from-transparent via-violet-400/60 to-transparent
            blur-sm opacity-70
            animate-[pulse_6s_ease-in-out_infinite]
          "
        />

        {/* Row 2 */}
        <div
          className="
            absolute top-[50%] left-[18%] w-[64%] h-px
            bg-gradient-to-r from-transparent via-violet-400/60 to-transparent
            blur-sm opacity-60
            animate-[pulse_7s_ease-in-out_infinite]
          "
        />
      </div>

      {/* Vertical glow lines */}
      <div className="hidden lg:block pointer-events-none absolute inset-0">
        {/* Column 1 */}
        <div
          className="
            absolute left-[33%] top-[15%] h-[70%] w-px
            bg-gradient-to-b from-transparent via-violet-400/50 to-transparent
            blur-sm opacity-60
            animate-[pulse_8s_ease-in-out_infinite]
          "
        />

        {/* Column 2 */}
        <div
          className="
            absolute left-[66%] top-[15%] h-[70%] w-px
            bg-gradient-to-b from-transparent via-violet-400/50 to-transparent
            blur-sm opacity-50
            animate-[pulse_9s_ease-in-out_infinite]
          "
        />
      </div>
    </>
  )
}
