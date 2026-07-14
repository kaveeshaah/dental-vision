export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload Panoramic Scan',
      badge: 'Secure File Ingest',
      accent: 'bg-sage',
    },
    {
      num: '02',
      title: 'AI Neural Inference',
      badge: '3-Second Run-time',
      accent: 'bg-fern',
    },
    {
      num: '03',
      title: 'Review Detections',
      badge: 'Clinician Interface',
      accent: 'bg-clay',
    },
    {
      num: '04',
      title: 'Export & Charting',
      badge: 'PMS Integration',
      accent: 'bg-moss',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 relative bg-sand border-b border-line grain">
      {/* Decorative canopy blurs */}
      <div className="absolute top-[30%] left-[10%] w-[35%] h-[35%] blob bg-fern/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] blob-alt bg-clay/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-clay uppercase mb-3">Workflow</h2>
          <p className="font-display text-3xl md:text-4xl font-semibold text-moss mb-4">
            How DentalVision Works
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Organic connector dots (visible on desktop) */}
              {idx < 3 && (
                <div className="hidden lg:flex absolute top-9 left-[75%] w-full items-center gap-1.5 pointer-events-none z-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-line" />
                  <span className="w-1.5 h-1.5 rounded-full bg-line" />
                  <span className="w-1.5 h-1.5 rounded-full bg-line" />
                </div>
              )}

              {/* Card Container */}
              <div className="p-6 rounded-3xl bg-paper border border-line shadow-sm relative z-10 hover:border-clay/30 hover:shadow-md transition-all duration-300">
                {/* Step Marker */}
                <div className={`w-14 h-14 blob ${step.accent} flex items-center justify-center text-paper font-display font-semibold text-xl shadow-md mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  {step.num}
                </div>

                {/* Badge */}
                <span className="text-[10px] uppercase font-bold tracking-widest text-clay bg-clay/10 px-2.5 py-1 rounded-full border border-clay/20 mb-3 inline-block">
                  {step.badge}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-bark mb-2 group-hover:text-moss transition-colors">
                  {step.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
