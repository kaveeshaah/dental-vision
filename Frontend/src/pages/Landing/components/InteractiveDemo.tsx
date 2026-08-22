import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { predictXray, getPatients, generateReport, saveReport, type PredictResponse } from '../../../api'
import { usePatientStore } from '../../../store/patientStore'
import { useAuthStore } from '../../../store/authStore'

const typeConfig: Record<string, { color: string; dotColor: string; title: string }> = {
  Caries: {
    color: 'border-[#ea580c] bg-[#ea580c]/15 text-[#ea580c]',
    dotColor: 'bg-[#ea580c]',
    title: 'Caries / Decay',
  },
  Periapical_Lesion: {
    color: 'border-[#995333] bg-[#995333]/15 text-[#995333]',
    dotColor: 'bg-[#995333]',
    title: 'Periapical Lesion',
  },
  Impacted_Tooth: {
    color: 'border-moss bg-moss/15 text-moss',
    dotColor: 'bg-moss',
    title: 'Impacted Tooth',
  },
  Missing_Teeth: {
    color: 'border-[#ca8a04] bg-[#ca8a04]/15 text-[#ca8a04]',
    dotColor: 'bg-[#ca8a04]',
    title: 'Missing Teeth',
  },
  Bone_Loss: {
    color: 'border-[#9333ea] bg-[#9333ea]/15 text-[#9333ea]',
    dotColor: 'bg-[#9333ea]',
    title: 'Bone Loss',
  },
}

const ALL_TYPES = Object.keys(typeConfig)
const MAX_FILE_SIZE_MB = 10
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export default function InteractiveDemo() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(ALL_TYPES)
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(50)
  
  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }
  
  const [hoveredBox, setHoveredBox] = useState<number | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  
  // Action states
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isSavingReport, setIsSavingReport] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const isAuthenticated = useAuthStore((state) => !!state.token)
  const { selectedPatient, setSelectedPatient } = usePatientStore()

  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
    enabled: isAuthenticated,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation<PredictResponse, Error, File>({
    mutationFn: predictXray,
    onSuccess: (data) => {
      const detectedClasses = Object.entries(data.summary.by_class)
        .filter(([_, count]) => count > 0)
        .map(([cls]) => cls)
      setSelectedTypes(detectedClasses)
    },
    onError: (err: any) => {
      setFileError(err.response?.data?.error || 'Failed to analyze the image.')
      setImageUrl(null)
    }
  })

  const validateAndUpload = (file: File) => {
    setFileError(null)

    if (isAuthenticated && !selectedPatient) {
      setFileError('Please select a patient before uploading an X-ray.')
      return
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Please upload a JPEG or PNG image.')
      return
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(URL.createObjectURL(file))

    mutation.mutate(file)
  }

  const handleGenerateReport = async () => {
    if (!selectedPatient || !mutation.data) return
    try {
      setIsGeneratingReport(true)
      const blob = await generateReport(selectedPatient.id, mutation.data)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report_${selectedPatient.custom_id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('Error generating report:', err)
      setFileError('Failed to generate report.')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleSaveReport = async () => {
    if (!selectedPatient || !mutation.data) return
    try {
      setIsSavingReport(true)
      await saveReport(selectedPatient.id, mutation.data)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error saving report:', err)
      setFileError('Failed to save report to records.')
    } finally {
      setIsSavingReport(false)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) validateAndUpload(file)
    e.target.value = ''
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
    p => {
      const conf = p.confidence > 1 ? p.confidence : p.confidence * 100
      return selectedTypes.includes(p.disease_label) && conf >= confidenceThreshold
    }
  )

  return (
    <section id="demo" className="py-20 relative bg-[#fdfaf6] border-t border-b border-line">
      
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-moss mb-4 tracking-tight">Experience the Future of Radiology</h2>
          <p className="text-sm text-bark-soft/80 max-w-xl mx-auto">
            Interact with our clinical diagnostic dashboard to see how AI transforms raw X-rays into actionable insights.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start border border-line rounded-[2rem] bg-paper p-6 shadow-sm">
          
          {/* LEFT COLUMN: Patient Selection (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Patient Select Card */}
            <div className="p-5 rounded-[1.5rem] bg-paper border border-line shadow-sm">
              <h3 className="text-sm font-bold text-bark flex items-center gap-2 mb-6">
                <svg className="w-4 h-4 text-bark-soft/80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                Patient Selection
              </h3>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-bark-soft/60 font-semibold block mb-2">
                      Select Patient
                    </label>
                    <div className="relative">
                      <select
                        value={selectedPatient?.id || ''}
                        onChange={(e) => {
                          const patient = patients.find(p => p.id === parseInt(e.target.value))
                          setSelectedPatient(patient || null)
                        }}
                        disabled={isLoadingPatients}
                        className="w-full border rounded-xl px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:border-sage/50 bg-paper border-line text-bark appearance-none"
                      >
                        <option value="">{isLoadingPatients ? 'Loading...' : '-- Select Patient --'}</option>
                        {patients.map(patient => (
                          <option key={patient.id} value={patient.id}>
                            {patient.full_name} ({patient.custom_id})
                          </option>
                        ))}
                      </select>
                      <svg className="w-4 h-4 text-bark-soft absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-bark-soft/60 font-semibold block mb-2">Age</label>
                      <input
                        type="text"
                        disabled
                        value={selectedPatient?.age || ''}
                        className="w-full border rounded-xl px-3 py-2 text-sm bg-sand border-line text-bark-soft/60"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-bark-soft/60 font-semibold block mb-2">Status</label>
                      <input
                        type="text"
                        disabled
                        value={selectedPatient?.status || ''}
                        className="w-full border rounded-xl px-3 py-2 text-sm bg-[#efeada] border-line text-bark-soft/80"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-sand/50 p-4 rounded-xl border border-line text-sm text-bark-soft/80 text-center">
                  Log in to enable saving.
                </div>
              )}
            </div>

            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`p-6 rounded-[1.5rem] border border-dashed transition-colors duration-300 group cursor-pointer text-center ${isDragging
                ? 'border-sage bg-fern/10'
                : 'border-line hover:border-sage/50 bg-paper'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center mb-3 text-[#995333]">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                   </svg>
                </div>
                <p className="text-xs font-bold text-bark mb-1">Upload Panoramic X-Ray</p>
                <p className="text-[10px] text-bark-soft/60">Supports JPEG or PNG up to 10MB</p>
              </div>
            </div>
            
            {fileError && (
              <div className="text-xs text-clay font-medium text-center">{fileError}</div>
            )}
          </div>

          {/* CENTER COLUMN: Image Viewer (col-span-6) */}
          <div className="lg:col-span-6 flex flex-col h-full">
            
            {/* Status Header */}
            <div className="flex items-center gap-2 mb-3">
               <span className={`w-2 h-2 rounded-full ${mutation.isPending ? 'bg-clay animate-pulse' : 'bg-bark-soft/40'}`} />
               <span className="text-[10px] font-bold text-bark-soft/60 uppercase tracking-widest">
                 {mutation.isPending ? 'Analyzing Image...' : imageUrl ? 'Image Loaded' : 'No Image Loaded'}
               </span>
            </div>

            {/* Viewer Box */}
            <div 
              className="flex-1 w-full bg-[#354335] rounded-3xl relative overflow-hidden flex flex-col shadow-inner min-h-[450px]"
            >
              {imageUrl ? (
                <div className="w-full h-full p-4 flex items-center justify-center">
                  <div 
                    className="relative flex items-center justify-center"
                    style={imageDimensions ? {
                      aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
                      maxHeight: '100%',
                      maxWidth: '100%'
                    } : {}}
                  >
                    <img
                      src={imageUrl}
                      alt="Panoramic X-Ray"
                      className={`w-full h-full object-contain select-none transition-opacity duration-300 ${mutation.isPending ? 'opacity-50' : 'opacity-100'}`}
                    />
                    {imageDimensions && !mutation.isPending && filteredDetections.map((detection, i) => {
                    const config = typeConfig[detection.disease_label]
                    if (!config) return null

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
                        className={`absolute border-2 rounded transition-all duration-150 cursor-pointer group ${config.color} ${detection.low_confidence ? 'border-dashed' : ''} ${isHovered ? 'scale-105 shadow-lg border-white ring-2 ring-white/10 z-30' : 'z-20'}`}
                      >
                         {isHovered && (
                           <div className="absolute top-[110%] left-1/2 -translate-x-1/2 bg-moss border border-moss/70 p-2 rounded shadow-xl text-sand text-[10px] w-32 z-40 space-y-1 pointer-events-none text-left">
                             <p className="font-bold border-b border-sand/20 pb-0.5">{config.title}</p>
                             <p className="flex justify-between text-sand/80">
                               <span>Conf:</span>
                               <span className="font-semibold text-fern">{confidencePct}%</span>
                             </p>
                           </div>
                         )}
                      </div>
                    )
                  })}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-sand/60 gap-3">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-sand/40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-sand/70">Upload an X-ray to begin analysis</p>
                </div>
              )}
            </div>

            {/* Legend & Instructions */}
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-2 text-[10px] text-bark-soft/60">
                 <div className="w-3.5 h-3.5 rounded-full bg-[#995333] text-paper flex items-center justify-center shrink-0 mt-0.5">
                   <span className="font-bold leading-none text-[8px]">!</span>
                 </div>
                 <p>Hover over bounding boxes for details. Dashed borders indicate lower-confidence findings.</p>
              </div>

              <div className="flex flex-wrap gap-4 text-[9px] font-bold uppercase tracking-widest text-bark-soft/80">
                {Object.entries(typeConfig).map(([type, config]) => (
                  <span key={type} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} /> {config.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Save/Report Actions (Only show if image loaded) */}
            {mutation.isSuccess && (
               <div className="mt-4 flex gap-3">
                 <button
                   onClick={handleSaveReport}
                   disabled={isSavingReport || saveSuccess}
                   className="text-xs font-bold bg-sand border border-line hover:bg-line text-bark px-4 py-2 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                 >
                   {saveSuccess ? 'Saved' : isSavingReport ? 'Saving...' : 'Save to Records'}
                 </button>
                 <button
                   onClick={handleGenerateReport}
                   disabled={isGeneratingReport}
                   className="text-xs font-bold bg-[#efeada] border border-clay/20 text-[#995333] hover:bg-[#995333] hover:text-paper px-4 py-2 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                 >
                   {isGeneratingReport ? 'Generating...' : 'Download Report'}
                 </button>
               </div>
            )}
          </div>

          {/* RIGHT COLUMN: Inference Controls (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="p-5 rounded-[1.5rem] bg-paper border border-line shadow-sm min-h-[400px] flex flex-col">
              
              <h3 className="text-sm font-bold text-bark flex items-center gap-2 mb-6 border-b border-line pb-4">
                <svg className="w-4 h-4 text-bark-soft/80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
                Inference Controls
              </h3>

              <div className="flex-1 space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-bark-soft/60 font-semibold block">
                  Pathology Categories
                </label>
                <div className="space-y-2.5">
                  {Object.entries(typeConfig).map(([type, config]) => {
                    const isChecked = selectedTypes.includes(type)
                    return (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 ${
                          isChecked
                            ? 'bg-[#efeada] border-line shadow-sm'
                            : 'bg-transparent border-transparent hover:bg-sand'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
                          <span className="text-sm font-medium text-bark">{config.title}</span>
                        </div>
                        {isChecked && (
                          <div className="w-5 h-5 rounded flex items-center justify-center bg-[#718355] text-white shadow-sm">
                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Confidence Slider */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] uppercase tracking-widest text-bark-soft/60 font-semibold">
                    Confidence Threshold
                  </label>
                  <span className="text-xs font-bold text-[#995333]">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full h-1 bg-line rounded-lg appearance-none cursor-pointer accent-[#995333]"
                />
                <div className="flex justify-between text-[8px] text-bark-soft/50 font-bold uppercase tracking-widest mt-2">
                  <span>0% (Recall)</span>
                  <span>99% (Precision)</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}