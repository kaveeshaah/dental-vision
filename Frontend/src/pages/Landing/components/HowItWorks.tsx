export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload Panoramic Scan',
      badge: 'Secure File Ingest',
      color: 'from-teal-600 to-teal-700',
    },
    {
      num: '02',
      title: 'AI Neural Inference',
      badge: '3-Second Run-time',
      color: 'from-teal-600 to-cyan-600',
    },
    {
      num: '03',
      title: 'Review Detections',
      badge: 'Clinician Interface',
      color: 'from-cyan-600 to-teal-600',
    },
    {
      num: '04',
      title: 'Export & Charting',
      badge: 'PMS Integration',
      color: 'from-cyan-600 to-cyan-700',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 relative bg-slate-50 border-b border-slate-200">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[30%] left-[10%] w-[35%] h-[35%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-teal-600 uppercase mb-3">Workflow</h2>
          <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How DentalVision Works
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Connector Line (visible on desktop) */}
              {idx < 3 && (
                <div className="hidden lg:block absolute top-8 left-[70%] w-full h-[2px] bg-gradient-to-r from-teal-500/20 to-slate-200 pointer-events-none z-0" />
              )}

              {/* Card Container */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative z-10 hover:border-teal-500/30 hover:shadow-md transition-all duration-300">
                {/* Step Circle */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white font-extrabold text-xl shadow-md mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  {step.num}
                </div>

                {/* Badge */}
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 mb-3 inline-block">
                  {step.badge}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
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
