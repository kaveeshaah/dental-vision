export default function Features() {
  return (
    <section id="features" className="py-24 bg-sand relative border-t border-line">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-moss mb-4">
            Intelligent Capabilities
          </h2>
          <p className="text-bark-soft">
            Designed to augment, not replace, clinical expertise. Our AI works silently in the background, providing clarity when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 - Precision Caries Detection (Spans 2 cols) */}
          <div className="md:col-span-2 p-8 rounded-[2rem] bg-paper border border-line shadow-sm relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10 w-full md:w-1/2">
              <div className="w-10 h-10 rounded-xl bg-clay text-paper flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-semibold text-moss mb-3">Precision Caries Detection</h3>
              <p className="text-sm text-bark-soft leading-relaxed">
                Identify interproximal and occlusal lesions with high sensitivity. The system highlights areas of concern with subtle, non-intrusive indicators.
              </p>
            </div>
            {/* Fade overlay for image */}
            <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/50 to-transparent z-10" />
              <img 
                src="/xray-image.png" 
                alt="AI X-ray analysis" 
                className="w-full h-full object-cover object-left opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Card 2 - Teeth Segmentation (Spans 1 col) */}
          <div className="p-8 rounded-[2rem] bg-paper border border-line shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-12">
              <div className="text-moss">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-fern/20 text-fern px-2.5 py-1 rounded-full">
                New
              </span>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-moss mb-2">Teeth Segmentation</h3>
              <p className="text-sm text-bark-soft leading-relaxed">
                Automatic numbering and boundary mapping for streamlined charting.
              </p>
            </div>
          </div>

          {/* Card 3 - Bone Level Analysis (Spans 1 col) */}
          <div className="p-8 rounded-[2rem] bg-paper border border-line shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="text-bark mb-12">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-moss mb-2">Bone Level Analysis</h3>
              <p className="text-sm text-bark-soft leading-relaxed">
                Quantify alveolar bone loss automatically for periodontal assessment.
              </p>
            </div>
          </div>

          {/* Card 4 - Seamless Integration (Spans 2 cols, Clay background) */}
          <div className="md:col-span-2 p-10 rounded-[2rem] bg-gradient-to-br from-[#bc6a44] to-[#995333] shadow-lg flex flex-col justify-center text-paper relative overflow-hidden group">
            {/* Subtle glow effect in the background */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700" />
            
            <div className="relative z-10 max-w-md">
              <h3 className="font-display text-2xl font-semibold mb-3">Seamless Integration</h3>
              <p className="text-paper/80 text-sm leading-relaxed mb-6">
                DentalVision integrates directly into your existing Practice Management Software and PACS, requiring zero change to your daily routine.
              </p>
              <a href="#" className="inline-flex items-center text-sm font-bold hover:text-white transition-colors">
                View Supported Systems
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
