import { useQuery } from '@tanstack/react-query'
import { checkHealth } from '../../../api'

export default function Hero() {
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
  })

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-sand">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Text Content */}
          <div className="max-w-xl">
            <div className="mb-6">
              <span className="text-xs font-bold tracking-widest text-sage uppercase">
                NEXT-GEN RADIOLOGY
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-[72px] font-semibold tracking-tight text-moss mb-6 leading-[1.05]">
              A gentler way to read panoramic X-rays
            </h1>

            <p className="text-lg md:text-xl text-bark-soft mb-10 leading-relaxed font-light">
              Empower your clinical decisions with AI-driven insights. 
              DentalVision reduces diagnostic fatigue while increasing 
              precision, blending seamlessly into your modern workflow.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-paper bg-clay hover:bg-clay-light shadow-lg shadow-clay/20 hover:shadow-clay/30 transition-all duration-300 text-center"
              >
                Try Interactive Demo
              </a>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-clay bg-transparent border-2 border-clay hover:bg-clay/5 transition-all duration-300 text-center"
              >
                Explore Capabilities
              </a>
            </div>
          </div>

          {/* Right Column - Image & Floating Card */}
          <div className="relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-moss/10 border border-line">
              <img 
                src="/hero-image.png" 
                alt="Modern panoramic X-ray machine in a warm clinic" 
                className="w-full h-auto object-cover object-center max-h-[600px]"
              />
              
              {/* Floating Status Card */}
              <div className="absolute bottom-6 left-6 glass rounded-2xl p-4 pr-12 flex items-center gap-4 shadow-lg shadow-moss/5 animate-fade-in border border-paper/40">
                <div className="w-8 h-8 rounded-full bg-fern/20 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-fern flex items-center justify-center">
                    <svg className="w-3 h-3 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-moss">Analysis Complete</div>
                  <div className="text-xs text-bark-soft mt-0.5">Patient: Jane Doe • 1.2 sec processing</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
