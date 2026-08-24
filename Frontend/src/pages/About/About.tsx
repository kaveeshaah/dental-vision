import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-sand text-bark-soft flex flex-col items-center pt-28 pb-12 px-6 relative overflow-hidden font-sans grain">
      <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] blob bg-fern/10 blur-[120px] pointer-events-none animate-sway" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blob-alt bg-clay/10 blur-[120px] pointer-events-none animate-soft-pulse" />
      <div className="absolute top-[30%] right-[-5%] w-[30%] h-[30%] blob bg-sage/15 blur-[100px] pointer-events-none animate-sway" />

      <div className="relative z-10 w-full max-w-4xl space-y-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-moss mb-4 tracking-tight drop-shadow-sm">
            DentalVision
          </h1>
          <p className="text-lg text-bark font-medium max-w-2xl mx-auto mb-10">
            AI-Powered Dental Disease Detection and Diagnostic Support System
          </p>
          
          <div className="w-full max-w-3xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white/40 relative group">
             <div className="absolute inset-0 bg-gradient-to-t from-moss/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
             <img 
               src="/ai_dental_hero.jpg" 
               alt="Futuristic AI Dental Analysis" 
               className="w-full aspect-[16/9] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
             />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-sage/10 border border-sage/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm">
            <h2 className="text-xl font-bold text-moss mb-3 flex items-center gap-2">
              <span className="text-2xl">👁️‍🗨️</span> What it does
            </h2>
            <p className="text-bark leading-relaxed">
              The system analyses panoramic dental X-rays and detects five disease categories: Dental Caries, Missing Teeth, Periapical Lesion, Impacted Tooth, and Bone Loss.
            </p>
          </div>

          <div className="bg-clay/10 border border-clay/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm">
            <h2 className="text-xl font-bold text-moss mb-3 flex items-center gap-2">
              <span className="text-2xl">⚡</span> How it works
            </h2>
            <p className="text-bark leading-relaxed">
              A two-stage AI pipeline handles the detection. First, a YOLOv8 model detects regions of interest on the X-ray. Then, an EfficientNetB0 classifier assigns each region a disease label with a confidence score.
            </p>
          </div>
        </div>

        <div className="bg-white/60 border border-white/80 rounded-3xl p-8 shadow-sm backdrop-blur-md">
          <h2 className="text-xl font-bold text-moss mb-5 flex items-center gap-2">
            <span className="text-2xl">✨</span> Key features
          </h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            <li className="flex items-start bg-white/40 p-3 rounded-2xl border border-white/50 shadow-sm">
              <div className="bg-fern/20 text-fern rounded-full p-1.5 mr-3 mt-0.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
              <span className="text-bark font-medium text-sm">Secure doctor accounts (JWT)</span>
            </li>
            <li className="flex items-start bg-white/40 p-3 rounded-2xl border border-white/50 shadow-sm">
              <div className="bg-fern/20 text-fern rounded-full p-1.5 mr-3 mt-0.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
              <span className="text-bark font-medium text-sm">Patient record management</span>
            </li>
            <li className="flex items-start bg-white/40 p-3 rounded-2xl border border-white/50 shadow-sm">
              <div className="bg-fern/20 text-fern rounded-full p-1.5 mr-3 mt-0.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
              <span className="text-bark font-medium text-sm">Save findings to patient history</span>
            </li>
            <li className="flex items-start bg-white/40 p-3 rounded-2xl border border-white/50 shadow-sm">
              <div className="bg-fern/20 text-fern rounded-full p-1.5 mr-3 mt-0.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
              <span className="text-bark font-medium text-sm">Downloadable PDF reports</span>
            </li>
            <li className="flex items-start bg-white/40 p-3 rounded-2xl border border-white/50 shadow-sm sm:col-span-2">
              <div className="bg-fern/20 text-fern rounded-full p-1.5 mr-3 mt-0.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
              <span className="text-bark font-medium text-sm">Fully local/offline AI inference (patient data never leaves the system)</span>
            </li>
          </ul>
        </div>

        <div className="bg-red-50/70 border border-red-200 rounded-3xl p-8 shadow-sm relative overflow-hidden group hover:bg-red-50 transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
             <span className="text-8xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-3 flex items-center gap-2 relative z-10">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Important Disclaimer
          </h2>
          <p className="text-red-900/80 font-medium leading-relaxed relative z-10 max-w-2xl">
            DentalVision is a diagnostic support tool intended to assist a qualified dentist's judgement, not to replace it. All findings should be clinically verified by a professional.
          </p>
        </div>

        <div className="text-center pt-8 border-t border-line/50">
          <p className="text-sm text-bark-soft italic font-medium">
            Developed as a BSc (Hons) Software Engineering Final Year Project at ICBT Campus, affiliated with Cardiff Metropolitan University.
          </p>
        </div>
      </div>
    </div>
  )
}
