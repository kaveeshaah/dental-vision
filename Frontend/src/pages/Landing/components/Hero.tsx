export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-50">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 z-0" />

      {/* Radial Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none z-0 animate-soft-pulse" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 mb-8 animate-fade-in shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-slate-700 uppercase">
              Clinical Vision AI
            </span>
            <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-full font-bold border border-teal-200">
              YOLO v8
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            AI-Powered Pathology Detection from{' '}
            <span className="bg-gradient-to-r from-teal-600 via-brand-teal to-cyan-600 bg-clip-text text-transparent glow-text">
              Panoramic X-Ray Images
            </span>
          </h1>


          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 via-brand-teal to-cyan-600 hover:from-teal-500 hover:to-cyan-500 shadow-lg shadow-teal-600/10 hover:shadow-teal-500/20 transition-all duration-300 transform scale-100 hover:scale-[1.03] active:scale-[0.97] text-center"
            >
              Try Interactive Demo
            </a>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all duration-300 text-center"
            >
              Explore Capabilities
            </a>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-200">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-3xl font-extrabold text-teal-600 tracking-tight mb-1">98.4%</div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Model Accuracy</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-3xl font-extrabold text-cyan-600 tracking-tight mb-1">&lt; 3.0s</div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Analysis Speed</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">10+</div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Pathologies Detected</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-3xl font-extrabold text-emerald-600 tracking-tight mb-1">HIPAA</div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Compliant Safety</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
