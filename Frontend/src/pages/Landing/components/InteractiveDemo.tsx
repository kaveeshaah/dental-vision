import { useState } from 'react'
import xrayImg from '../../../assets/panoramic_xray.png'

interface Detection {
  id: number
  label: string
  type: 'caries' | 'lesion' | 'restoration' | 'impacted'
  confidence: number
  top: string // percentage
  left: string // percentage
  width: string // percentage
  height: string // percentage
}

const mockDetections: Detection[] = [
  {
    id: 1,
    label: 'Caries (Tooth #18)',
    type: 'caries',
    confidence: 89,
    top: '48%',
    left: '18%',
    width: '5%',
    height: '8%',
  },
  {
    id: 2,
    label: 'Impacted Tooth #32',
    type: 'impacted',
    confidence: 97,
    top: '56%',
    left: '79%',
    width: '8%',
    height: '18%',
  },
  {
    id: 3,
    label: 'Dental Crown (Tooth #14)',
    type: 'restoration',
    confidence: 99,
    top: '34%',
    left: '64%',
    width: '6%',
    height: '11%',
  },
  {
    id: 4,
    label: 'Restoration Fillings (Tooth #30)',
    type: 'restoration',
    confidence: 94,
    top: '56%',
    left: '26%',
    width: '6%',
    height: '9%',
  },
  {
    id: 5,
    label: 'Periapical Lesion (Tooth #9 root)',
    type: 'lesion',
    confidence: 76,
    top: '24%',
    left: '46%',
    width: '5%',
    height: '10%',
  },
  {
    id: 6,
    label: 'Incipient Caries (Tooth #4)',
    type: 'caries',
    confidence: 62,
    top: '30%',
    left: '32%',
    width: '4.5%',
    height: '7%',
  },
]

const typeConfig = {
  caries: {
    color: 'border-red-500 bg-red-500/15 text-red-500',
    dotColor: 'bg-red-500',
    title: 'Caries / Decay',
  },
  lesion: {
    color: 'border-orange-500 bg-orange-500/15 text-orange-600',
    dotColor: 'bg-orange-500',
    title: 'Periapical Lesions',
  },
  restoration: {
    color: 'border-yellow-500 bg-yellow-500/15 text-yellow-600',
    dotColor: 'bg-yellow-500',
    title: 'Crowns & Fillings',
  },
  impacted: {
    color: 'border-indigo-500 bg-indigo-500/15 text-indigo-600',
    dotColor: 'bg-indigo-500',
    title: 'Impacted Teeth',
  },
}

export default function InteractiveDemo() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['caries', 'lesion', 'restoration', 'impacted'])
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(60)
  const [hoveredBox, setHoveredBox] = useState<number | null>(null)
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const filteredDetections = mockDetections.filter(
    item => selectedTypes.includes(item.type) && item.confidence >= confidenceThreshold
  )

  return (
    <section id="demo" className="py-20 relative bg-slate-100/60 border-t border-b border-slate-200">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-teal-600 uppercase mb-3">Live Sandbox</h2>
          <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Interactive Diagnostic Dashboard
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* Control Panel Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Inference Controls
              </h3>

              {/* Pathology Filters */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Pathology Categories
                </label>
                <div className="space-y-2">
                  {Object.entries(typeConfig).map(([type, config]) => {
                    const isChecked = selectedTypes.includes(type)
                    return (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          isChecked
                            ? 'bg-slate-50 border-slate-200 text-slate-800'
                            : 'bg-transparent border-slate-100/50 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
                          <span>{config.title}</span>
                        </div>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          isChecked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                        }`}>
                          {isChecked && (
                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Confidence Threshold Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Confidence Threshold
                  </label>
                  <span className="text-sm font-bold text-teal-600">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>50% (Recall)</span>
                  <span>99% (Precision)</span>
                </div>
              </div>
            </div>

            {/* Simulated Upload Area */}
            <div className="p-6 rounded-2xl border border-dashed border-slate-300 bg-white hover:border-teal-500/50 hover:bg-slate-50/50 transition-colors duration-300 group cursor-pointer text-center relative overflow-hidden shadow-sm">
              <input type="file" className="hidden" disabled />
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  Upload Panoramic X-Ray
                </p>
                <p className="text-xs text-slate-400">
                  Supports DICOM, JPEG, or PNG up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Canvas */}
          <div className="lg:col-span-8">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg p-4">
              
              {/* Top Canvas Stats Overlay */}
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Panoramic View #2481-A</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  Detections: <span className="text-teal-600 font-bold">{filteredDetections.length}</span>
                </div>
              </div>

              {/* Main Image Viewport */}
              <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-100 aspect-[1.85/1]">
                <img
                  src={xrayImg}
                  alt="Panoramic X-Ray"
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-full object-cover select-none brightness-[0.8] contrast-[1.1] transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    Loading medical imaging asset...
                  </div>
                )}

                {/* Absolute overlay for YOLO Detection Bounding Boxes */}
                {filteredDetections.map((box) => {
                  const confColor = typeConfig[box.type]
                  const isHovered = hoveredBox === box.id

                  return (
                    <div
                      key={box.id}
                      style={{
                        top: box.top,
                        left: box.left,
                        width: box.width,
                        height: box.height,
                      }}
                      onMouseEnter={() => setHoveredBox(box.id)}
                      onMouseLeave={() => setHoveredBox(null)}
                      className={`absolute border-2 rounded transition-all duration-150 cursor-pointer group ${confColor.color} ${
                        isHovered ? 'scale-105 shadow-lg border-white ring-2 ring-white/10 z-30' : 'z-20'
                      }`}
                    >
                      {/* Box Label Indicator */}
                      <div className="absolute top-0 left-0 -translate-y-full bg-slate-900 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-t border-t border-x border-slate-700 scale-90 group-hover:scale-100 origin-bottom-left transition-transform duration-150 pointer-events-none whitespace-nowrap shadow-md">
                        T{box.id} {box.confidence}%
                      </div>

                      {/* Floating tooltip */}
                      {isHovered && (
                        <div className="absolute top-[110%] left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-slate-200 text-xs w-48 z-40 space-y-1 pointer-events-none text-left font-sans">
                          <p className="font-bold text-white border-b border-slate-700 pb-1 mb-1">{box.label}</p>
                          <p className="flex justify-between text-slate-400">
                            <span>Category:</span>
                            <span className="font-semibold text-teal-400 capitalize">{box.type}</span>
                          </p>
                          <p className="flex justify-between text-slate-400">
                            <span>Model Conf:</span>
                            <span className="font-semibold text-emerald-400">{box.confidence}%</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Bottom Info Banner */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 px-1 pt-1">
                <p className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-teal-600/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hover over bounding boxes on the X-ray image for clinical details.
                </p>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Caries</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Lesion</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" /> Restoration</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Impacted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
