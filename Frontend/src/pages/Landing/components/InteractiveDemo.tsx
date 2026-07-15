import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { predictXray, type PredictResponse } from '../../../api'
import { useAuthStore } from '../../../store/authStore'

const typeConfig: Record<string, { color: string; dotColor: string; title: string }> = {
  Caries: {
    color: 'border-red-500 bg-red-500/15 text-red-500',
    dotColor: 'bg-red-500',
    title: 'Caries / Decay',
  },
  Periapical_Lesion: {
    color: 'border-orange-500 bg-orange-500/15 text-orange-600',
    dotColor: 'bg-orange-500',
    title: 'Periapical Lesion',
  },
  Impacted_Tooth: {
    color: 'border-indigo-500 bg-indigo-500/15 text-indigo-600',
    dotColor: 'bg-indigo-500',
    title: 'Impacted Tooth',
  },
  Missing_Teeth: {
    color: 'border-yellow-500 bg-yellow-500/15 text-yellow-600',
    dotColor: 'bg-yellow-500',
    title: 'Missing Teeth',
  },
  Bone_Loss: {
    color: 'border-fuchsia-500 bg-fuchsia-500/15 text-fuchsia-600',
    dotColor: 'bg-fuchsia-500',
    title: 'Bone Loss',
  },
}

const ALL_TYPES = Object.keys(typeConfig)
const MAX_FILE_SIZE_MB = 10
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export default function InteractiveDemo() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(ALL_TYPES)
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(50)
  const [hoveredBox, setHoveredBox] = useState<number | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  
  const isAuthenticated = useAuthStore((state) => !!state.token)
  
  // Patient detail states
  const [isExistingPatient, setIsExistingPatient] = useState(false)
  const [searchId, setSearchId] = useState('')
  const [patientId] = useState(`PT-${Math.floor(1000 + Math.random() * 9000)}`)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation<PredictResponse, Error, File>({
    mutationFn: predictXray,
  })

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const validateAndUpload = (file: File) => {
    setFileError(null)

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Please upload a JPEG or PNG image.')
      return
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    // Revoke any previous object URL to avoid leaking memory across uploads.
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(URL.createObjectURL(file))

    mutation.mutate(file)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) validateAndUpload(file)
    e.target.value = '' // allow re-selecting the same file
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) validateAndUpload(file)
  }

  const predictions = mutation.data?.predictions ?? []
  const imageDimensions = mutation.data?.image_dimensions

  const filteredDetections = predictions.filter(
    p => selectedTypes.includes(p.disease_label) && p.confidence * 100 >= confidenceThreshold
  )

  return (
    <section id="demo" className="py-20 relative bg-paper border-t border-b border-line grain">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] blob bg-fern/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] blob-alt bg-clay/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-line pb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-moss mb-2">Clinical Diagnostic Dashboard</h2>
            <p className="text-sm text-bark-soft/80 max-w-xl">
              Upload patient X-rays, assign them to records, and configure inference settings to generate automated insights.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Patient Details & Upload */}
            <div className={`p-6 rounded-3xl bg-paper border border-line shadow-sm space-y-5 transition-all duration-500 ${imageUrl ? 'order-2' : 'order-1'}`}>
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="text-lg font-bold text-bark flex items-center gap-2">
                  <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {isAuthenticated ? 'Patient & Scan' : 'Upload Scan'}
                </h3>

                {/* Toggle switch for Existing Patient */}
                {isAuthenticated && (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <span className={`text-xs font-semibold uppercase tracking-wider transition-colors ${!isExistingPatient ? 'text-clay' : 'text-bark-soft/50'}`}>New</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={isExistingPatient} onChange={(e) => setIsExistingPatient(e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isExistingPatient ? 'bg-sage' : 'bg-line'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isExistingPatient ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wider transition-colors ${isExistingPatient ? 'text-sage' : 'text-bark-soft/50'}`}>Existing</span>
                  </label>
                )}
              </div>

              {isAuthenticated ? (
                <div className="space-y-3 relative">
                  {/* Optional overlay if existing patient selected to dim out the Name/Age fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-bark-soft/60 font-semibold block mb-1.5">
                        {isExistingPatient ? 'Search Patient ID' : 'Patient ID'}
                      </label>
                      <input
                        type="text"
                        disabled={!isExistingPatient}
                        value={isExistingPatient ? searchId : patientId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder={isExistingPatient ? "e.g. PT-1002" : ""}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:border-sage/50 ${
                          !isExistingPatient 
                            ? 'bg-sand border-line text-bark-soft/60 cursor-not-allowed' 
                            : 'bg-paper border-line text-bark placeholder-bark-soft/40'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-bark-soft/60 font-semibold block mb-1.5">Age</label>
                      <input
                        type="number"
                        disabled={isExistingPatient}
                        placeholder={isExistingPatient ? "Auto-filled" : "e.g. 34"}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm transition-colors focus:outline-none focus:border-sage/50 ${
                          isExistingPatient
                            ? 'bg-sand border-line text-transparent placeholder-bark-soft/30 cursor-not-allowed'
                            : 'bg-sand border-line text-bark placeholder-bark-soft/40'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-bark-soft/60 font-semibold block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      disabled={isExistingPatient}
                      placeholder={isExistingPatient ? "Auto-filled on search" : "e.g. John Doe"}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm transition-colors focus:outline-none focus:border-sage/50 ${
                        isExistingPatient
                          ? 'bg-sand border-line text-transparent placeholder-bark-soft/30 cursor-not-allowed'
                          : 'bg-sand border-line text-bark placeholder-bark-soft/40'
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-sand/50 p-4 rounded-2xl border border-line text-sm text-bark-soft/80 text-center shadow-sm">
                  <span className="font-bold text-clay">Try the Analyzer!</span> Log in to save scans to real patient records.
                </div>
              )}

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`p-6 rounded-2xl border border-dashed transition-colors duration-300 group cursor-pointer text-center relative overflow-hidden shadow-sm mt-4 ${isDragging
                  ? 'border-sage bg-fern/10'
                  : 'border-line bg-sand/30 hover:border-sage/50 hover:bg-sand'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="py-4 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 blob bg-paper border border-line flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                    <svg className="w-5 h-5 text-bark-soft/50 group-hover:text-sage transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-bark mb-1">
                    {imageUrl ? 'Upload a Different X-Ray' : 'Upload Panoramic X-Ray'}
                  </p>
                  <p className="text-[11px] text-bark-soft/50">
                    Supports JPEG or PNG up to {MAX_FILE_SIZE_MB}MB
                  </p>
                </div>
              </div>
            </div>

            {/* Control Panel Card */}
            <div className={`p-6 rounded-3xl bg-paper border border-line shadow-sm space-y-6 transition-all duration-500 ${imageUrl ? 'order-1' : 'order-2'}`}>
              <h3 className="text-lg font-bold text-bark flex items-center gap-2 border-b border-line pb-4">
                <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Inference Controls
              </h3>

              {/* Pathology Filters */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-bark-soft/60 font-semibold block">
                  Pathology Categories
                </label>
                <div className="space-y-2">
                  {Object.entries(typeConfig).map(([type, config]) => {
                    const isChecked = selectedTypes.includes(type)
                    const count = mutation.data?.summary.by_class[type] ?? 0
                    return (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-sm font-medium transition-all duration-200 ${isChecked
                          ? 'bg-sand border-line text-bark'
                          : 'bg-transparent border-line/50 text-bark-soft/50 hover:border-line hover:bg-sand'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
                          <span>{config.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {mutation.isSuccess && count > 0 && (
                            <span className="text-xs font-bold text-bark-soft/50">{count}</span>
                          )}
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${isChecked ? 'bg-sage border-sage text-paper' : 'border-line'
                            }`}>
                            {isChecked && (
                              <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Confidence Threshold Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-bark-soft/60 font-semibold">
                    Confidence Threshold
                  </label>
                  <span className="text-sm font-bold text-clay">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="99"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-line rounded-lg appearance-none cursor-pointer accent-clay"
                />
                <div className="flex justify-between text-[10px] text-bark-soft/50 font-semibold uppercase tracking-wider">
                  <span>0% (Recall)</span>
                  <span>99% (Precision)</span>
                </div>
              </div>
            </div>

            {fileError && (
              <div className={`p-3 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-xs flex items-center gap-2 order-3`}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{fileError}</span>
              </div>
            )}

            {mutation.isError && (
              <div className={`p-3 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-xs flex items-center gap-2 order-3`}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Analysis failed. Confirm the backend is running and try again.</span>
              </div>
            )}
          </div>

          {/* Right Panel: Interactive Canvas */}
          <div className="lg:col-span-8">
            <div className="relative rounded-3xl overflow-hidden border border-line bg-paper shadow-lg p-4">

              {/* Top Canvas Stats Overlay */}
              <div className="flex justify-between items-center mb-4 border-b border-line pb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${mutation.isPending ? 'bg-clay animate-pulse' : 'bg-fern'
                    }`} />
                  <span className="text-xs font-semibold text-bark-soft tracking-wide uppercase">
                    {mutation.isPending ? 'Analyzing...' : imageUrl ? 'Panoramic View' : 'No Image Loaded'}
                  </span>
                </div>
                {mutation.isSuccess && (
                  <div className="text-xs text-bark-soft font-semibold bg-sand px-2.5 py-1 rounded-full border border-line">
                    Detections: <span className="text-clay font-bold">{filteredDetections.length}</span>
                  </div>
                )}
              </div>

              {/* Main Image Viewport */}
              <div
                className="relative overflow-hidden rounded-2xl bg-moss border border-line"
                style={
                  imageDimensions
                    ? { aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}` }
                    : { aspectRatio: '1.85 / 1' }
                }
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Uploaded Panoramic X-Ray"
                    className={`w-full h-full object-contain select-none transition-opacity duration-300 ${mutation.isPending ? 'opacity-50' : 'opacity-100'
                      }`}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-sand/60 gap-2">
                    <svg className="w-10 h-10 text-sand/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    </svg>
                    <p className="text-xs">Upload an X-ray to begin analysis</p>
                  </div>
                )}

                {mutation.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center bg-moss/60">
                    <div className="flex flex-col items-center gap-3">
                      <span className="w-8 h-8 border-2 border-sand border-t-transparent rounded-full animate-spin" />
                      <span className="text-sand text-xs font-semibold">Running inference...</span>
                    </div>
                  </div>
                )}

                {/* Absolute overlay for real YOLO + classifier detections */}
                {imageDimensions && filteredDetections.map((detection, i) => {
                  const config = typeConfig[detection.disease_label]
                  if (!config) return null // unknown label -- skip rather than crash

                  const [x1, y1, x2, y2] = detection.bbox
                  const top = `${(y1 / imageDimensions.height) * 100}%`
                  const left = `${(x1 / imageDimensions.width) * 100}%`
                  const width = `${((x2 - x1) / imageDimensions.width) * 100}%`
                  const height = `${((y2 - y1) / imageDimensions.height) * 100}%`
                  const isHovered = hoveredBox === i
                  const confidencePct = Math.round(detection.confidence * 100)

                  return (
                    <div
                      key={i}
                      style={{ top, left, width, height }}
                      onMouseEnter={() => setHoveredBox(i)}
                      onMouseLeave={() => setHoveredBox(null)}
                      className={`absolute border-2 rounded transition-all duration-150 cursor-pointer group ${config.color} ${detection.low_confidence ? 'border-dashed' : ''
                        } ${isHovered ? 'scale-105 shadow-lg border-white ring-2 ring-white/10 z-30' : 'z-20'
                        }`}
                    >
                      {/* Box Label Indicator */}
                      <div className="absolute top-0 left-0 -translate-y-full bg-moss text-[10px] font-bold text-sand px-1.5 py-0.5 rounded-t border-t border-x border-moss/70 scale-90 group-hover:scale-100 origin-bottom-left transition-transform duration-150 pointer-events-none whitespace-nowrap shadow-md">
                        {confidencePct}%
                      </div>

                      {/* Floating tooltip */}
                      {isHovered && (
                        <div className="absolute top-[110%] left-1/2 -translate-x-1/2 bg-moss border border-moss/70 p-3 rounded-xl shadow-xl text-sand/80 text-xs w-48 z-40 space-y-1 pointer-events-none text-left font-sans">
                          <p className="font-bold text-sand border-b border-sand/20 pb-1 mb-1">{config.title}</p>
                          <p className="flex justify-between text-sand/60">
                            <span>Classifier Conf:</span>
                            <span className="font-semibold text-fern">{confidencePct}%</span>
                          </p>
                          <p className="flex justify-between text-sand/60">
                            <span>Detection Conf:</span>
                            <span className="font-semibold text-fern">
                              {Math.round(detection.detection_confidence * 100)}%
                            </span>
                          </p>
                          {detection.low_confidence && (
                            <p className="text-clay-light font-semibold pt-1">⚠ Low confidence finding</p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Bottom Info Banner */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-bark-soft/60 px-1 pt-1">
                <p className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-sage/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hover over bounding boxes on the X-ray image for details. Dashed borders indicate lower-confidence findings.
                </p>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(typeConfig).map(([type, config]) => (
                    <span key={type} className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} /> {config.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}