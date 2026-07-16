import { useQuery } from '@tanstack/react-query'
import { checkHealth } from '../../../api'

export default function Hero() {
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
  })

  const accuracy = health?.model_accuracy !== undefined ? Number(health.model_accuracy).toFixed(1) : '98.4'

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-sand grain">
      <div className="absolute top-[-15%] left-[-12%] w-[45%] h-[45%] blob bg-fern/15 blur-[110px] pointer-events-none z-0 animate-sway" />
      <div className="absolute top-[10%] right-[-10%] w-[55%] h-[55%] blob-alt bg-clay/10 blur-[140px] pointer-events-none z-0 animate-soft-pulse" />
      <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] blob bg-sage/10 blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper border border-line mb-8 animate-fade-in shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fern opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-bark uppercase">
              Grown for Clinical Care
            </span>
            <span className="text-[10px] text-clay bg-clay/10 px-1.5 py-0.5 rounded-full font-bold border border-clay/20">
              YOLO v8
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-moss mb-6 leading-[1.1]">
            A gentler way to read{' '}
            <span className="italic text-clay glow-text">
              panoramic X-rays
            </span>
          </h1>

          <p className="text-base md:text-lg text-bark-soft max-w-2xl mx-auto mb-10 leading-relaxed">
            DentalVision pairs AI pathology detection with a calm, human interface — so
            clinicians spend less time squinting at scans and more time with patients.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-paper bg-clay hover:bg-clay-light shadow-lg shadow-clay/20 hover:shadow-clay/30 transition-all duration-300 transform scale-100 hover:scale-[1.03] active:scale-[0.97] text-center"
            >
              Try Interactive Demo
            </a>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-moss bg-paper hover:bg-sand border border-line shadow-sm transition-all duration-300 text-center"
            >
              Explore Capabilities
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8 border-t border-line">
            <div className="p-4 rounded-2xl bg-paper border border-line shadow-sm">
              <div className="font-display text-3xl font-semibold text-sage tracking-tight mb-1">{accuracy}%</div>
              <div className="text-xs uppercase font-semibold text-bark-soft/60 tracking-wider">Model Accuracy</div>
            </div>
            <div className="p-4 rounded-2xl bg-paper border border-line shadow-sm">
              <div className="font-display text-3xl font-semibold text-clay tracking-tight mb-1">&lt; 3.0s</div>
              <div className="text-xs uppercase font-semibold text-bark-soft/60 tracking-wider">Analysis Speed</div>
            </div>
            <div className="p-4 rounded-2xl bg-paper border border-line shadow-sm">
              <div className="font-display text-3xl font-semibold text-moss tracking-tight mb-1">10+</div>
              <div className="text-xs uppercase font-semibold text-bark-soft/60 tracking-wider">Pathologies Detected</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
