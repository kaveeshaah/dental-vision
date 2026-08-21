import { Link, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { usePatientStore } from '../../store/patientStore'
import { getReportHistory } from '../../api'

export default function PatientDashboard() {
  const selectedPatient = usePatientStore(state => state.selectedPatient)

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports', selectedPatient?.id],
    queryFn: () => selectedPatient ? getReportHistory(selectedPatient.id) : Promise.resolve([]),
    enabled: !!selectedPatient,
  })

  if (!selectedPatient) {
    return <Navigate to="/dashboard/patient" replace />
  }

  // Calculate approximate DOB based on age
  const currentYear = new Date().getFullYear()
  const dobYear = currentYear - selectedPatient.age

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto animate-fade-in pb-20">

      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-bark-soft mb-3">
          <Link to="/patient-records" className="hover:text-clay transition-colors">Patients</Link>
          <svg className="w-3 h-3 text-bark-soft/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-semibold text-bark">{selectedPatient.full_name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="font-display text-4xl md:text-[2.75rem] font-bold text-moss tracking-tight">
            {selectedPatient.full_name}
          </h1>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 rounded-full text-sm font-semibold text-clay border border-clay hover:bg-clay/5 transition-all duration-300">
              Edit Profile
            </button>
            <Link to="/#demo" className="px-6 py-2 rounded-full text-sm font-semibold text-paper bg-[#995333] hover:bg-clay shadow-md shadow-clay/20 hover:shadow-clay/30 transition-all duration-300 active:scale-[0.98]">
              New Scan
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (Patient Card & Timeline) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Patient Card */}
          <div className="bg-paper rounded-[2rem] p-8 border border-line shadow-sm flex flex-col items-center text-center relative">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-paper shadow-md bg-sand flex items-center justify-center text-clay text-4xl font-display font-bold">
                {selectedPatient.full_name.charAt(0)}
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-paper rounded-full flex items-center justify-center shadow-sm">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedPatient.status === 'Healthy' ? 'bg-fern' : selectedPatient.status === 'Needs Review' ? 'bg-clay' : 'bg-moss'}`}>
                  <svg className="w-2.5 h-2.5 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="font-display text-2xl font-semibold text-moss mb-1">{selectedPatient.full_name}</h2>
            <p className="text-sm text-bark-soft mb-8">Est. DOB: {dobYear} (Age {selectedPatient.age})</p>

            <div className="w-full bg-[#efeada] rounded-2xl p-5 text-left">
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-bark-soft/60 mb-3">Patient Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-bark">
                  <svg className="w-4 h-4 text-bark-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  ID: {selectedPatient.custom_id}
                </div>
                <div className="flex items-center gap-3 text-sm text-bark">
                  <svg className="w-4 h-4 text-bark-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Registered: {formatDate(selectedPatient.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Timeline */}
          <div className="bg-paper rounded-[2rem] p-8 border border-line shadow-sm relative min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-2xl font-semibold text-moss">Clinical Timeline</h2>
              <button className="text-xs font-bold text-clay hover:text-clay-light transition-colors uppercase tracking-wider">
                View All
              </button>
            </div>

            {isLoading ? (
              <p className="text-sm text-bark-soft">Loading timeline...</p>
            ) : reports.length > 0 ? (
              <div className="relative border-l border-line/60 ml-4 space-y-8 pb-4">
                {reports.map((report, index) => (
                  <div key={report.id} className="relative pl-8">
                    <div className={`absolute -left-[14px] top-1 w-7 h-7 rounded-full border-4 border-paper shadow-sm flex items-center justify-center ${index === 0 ? 'bg-[#995333] text-paper' : 'bg-[#efeada] text-bark-soft'}`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className={`border rounded-2xl p-4 ${index === 0 ? 'border-clay/30 bg-sand' : 'border-line bg-paper'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm text-moss">Scan<br />Analysis</h4>
                        <span className={`text-xs text-right ${index === 0 ? 'font-semibold text-clay' : 'text-bark-soft'}`}>
                          {formatDate(report.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-bark-soft leading-relaxed">
                        {report.findings.summary?.total_findings || 0} findings detected.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-bark-soft">No scans found.</p>
            )}
          </div>
        </div>

        {/* Right Column (Alerts, Stats, Gallery) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Medical Alerts (Keeping static for now as there's no backend field) */}
          <div className="bg-[#fee2e2] rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-[#991b1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="font-display text-2xl font-bold text-[#991b1b]">Status: {selectedPatient.status}</h2>
            </div>
            <ul className="list-none space-y-2 text-[#7f1d1d] font-medium text-sm">
              <li>Patient registered on {formatDate(selectedPatient.created_at)}</li>
            </ul>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-paper border border-line rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-bark-soft/60 mb-2">Total Scans</span>
              <span className="font-display text-2xl font-bold text-moss mt-auto">{reports.length}</span>
            </div>
            <div className="bg-paper border border-line rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-bark-soft/60 mb-2">Latest Scan</span>
              <span className="font-display text-xl font-bold text-clay mt-auto">
                {reports.length > 0 ? formatDate(reports[0].created_at) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Imaging Gallery */}
          <div className="bg-paper rounded-[2rem] p-8 border border-line shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-2xl font-semibold text-moss">Imaging Gallery</h2>
              <div className="flex items-center gap-4 text-bark-soft">
                <button className="hover:text-moss transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
                <button className="hover:text-moss transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>

            {isLoading ? (
              <p className="text-sm text-bark-soft">Loading images...</p>
            ) : reports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.slice(0, 3).map((report) => (
                  <div key={report.id} className="relative rounded-2xl overflow-hidden aspect-video border border-line shadow-sm group cursor-pointer">
                    <img src="/xray-image.png" alt="Scan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bark/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <h4 className="font-bold text-sm text-paper">Dental Scan</h4>
                      <p className="text-xs text-paper/80">{formatDate(report.created_at)}</p>
                    </div>
                  </div>
                ))}

                {reports.length > 3 && (
                  <div className="rounded-2xl border-2 border-dashed border-clay/30 bg-[#efeada]/50 aspect-[4/3] md:aspect-video flex flex-col items-center justify-center text-clay hover:bg-clay/5 transition-colors cursor-pointer">
                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-bold text-sm">View All {reports.length} Scans</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-bark-soft">No imaging data found for this patient.</p>
            )}
          </div>

        </div>
      </div>

      {/* Mini footer to match design */}
      <div className="mt-16 pt-8 border-t border-line flex flex-col md:flex-row justify-between items-center text-xs text-bark-soft gap-4">
        <p>© 2024 DentalVision AI. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-moss">Privacy Policy</a>
          <a href="#" className="hover:text-moss">Terms of Service</a>
          <a href="#" className="hover:text-moss">HIPAA Compliance</a>
          <a href="#" className="hover:text-moss">Contact</a>
        </div>
      </div>
    </div>
  )
}
