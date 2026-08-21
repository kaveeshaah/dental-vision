import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getPatients, createPatient, getReportHistory, generateReport, type Patient, type ReportRecord } from '../../api'
import { usePatientStore } from '../../store/patientStore'
import { toast } from 'react-hot-toast'

export default function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({ full_name: '', age: '' })
  const [createdPatient, setCreatedPatient] = useState<Patient | null>(null)
  
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [historyPatient, setHistoryPatient] = useState<Patient | null>(null)
  
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const setSelectedPatient = usePatientStore(state => state.setSelectedPatient)

  const { data: reports = [], isLoading: isLoadingReports } = useQuery({
    queryKey: ['reports', historyPatient?.id],
    queryFn: () => historyPatient ? getReportHistory(historyPatient.id) : Promise.resolve([]),
    enabled: !!historyPatient,
  })

  const { data: patients = [], isLoading, isError } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  })

  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      setCreatedPatient(data)
      toast.success('Patient created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create patient.')
    }
  })

  const filteredPatients = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.custom_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPatient.full_name || !newPatient.age) return
    mutation.mutate({ full_name: newPatient.full_name, age: Number(newPatient.age) })
  }

  const formatDate = (isoString: string) => {
    const d = new Date(isoString)
    return d.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-sand text-bark-soft flex flex-col items-center pt-28 pb-12 px-6 relative overflow-hidden font-sans grain">
      <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] blob bg-fern/10 blur-[120px] pointer-events-none animate-sway" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blob-alt bg-clay/10 blur-[120px] pointer-events-none animate-soft-pulse" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-moss mb-2">Patient Records</h1>
            <p className="text-sm text-bark-soft/80">Manage and view your patient diagnostic history.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-paper bg-clay hover:bg-clay-light shadow-md shadow-clay/20 hover:shadow-clay/30 transition-all duration-300 active:scale-[0.98]"
          >
            + Add New Patient
          </button>
        </div>

        <div className="glass rounded-3xl p-4 mb-8 shadow-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-bark-soft/50 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none text-sm text-bark placeholder-bark-soft/40 focus:outline-none"
          />
        </div>

        <div className="bg-paper border border-line rounded-3xl p-1 shadow-lg overflow-x-auto relative min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-line/50">
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Patient ID</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Name</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Age</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Created</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Status</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-bark-soft/60">
                    Loading patients...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-clay">
                    Error loading patients. Please try again later.
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-line/30 hover:bg-sand/30 transition-colors group">
                    <td className="py-4 px-6 text-sm font-medium text-moss">{patient.custom_id}</td>
                    <td className="py-4 px-6 text-sm text-bark font-semibold">{patient.full_name}</td>
                    <td className="py-4 px-6 text-sm text-bark-soft">{patient.age} yrs</td>
                    <td className="py-4 px-6 text-sm text-bark-soft">{formatDate(patient.created_at)}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          patient.status === 'Healthy'
                            ? 'bg-fern/10 text-fern border border-fern/20'
                            : patient.status === 'Needs Review'
                            ? 'bg-clay/10 text-clay border border-clay/20'
                            : 'bg-moss/10 text-moss border border-moss/20'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 flex justify-start gap-2">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient)
                          navigate('/#demo')
                        }}
                        className="px-3 py-1.5 rounded-lg border border-transparent hover:border-sage/30 hover:bg-sage/10 text-sm font-semibold text-sage hover:text-moss transition-all cursor-pointer"
                      >
                        Scan
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPatient(patient)
                          navigate('/dashboard/patient')
                        }}
                        className="px-3 py-1.5 rounded-lg border border-transparent hover:border-clay/30 hover:bg-clay/10 text-sm font-medium text-clay hover:text-clay-light transition-all cursor-pointer"
                      >
                        View Dashboard
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-bark-soft/60">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bark/40 backdrop-blur-sm p-4">
          <div className="bg-paper rounded-3xl shadow-2xl p-6 w-full max-w-md border border-line">
            {createdPatient ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-fern/10 text-fern rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-moss">Patient Created!</h3>
                <p className="text-sm text-bark-soft/80">
                  {createdPatient.full_name} ({createdPatient.custom_id}) has been successfully added to your records.
                </p>
                <div className="flex flex-col gap-3 pt-6">
                  <button
                    onClick={() => {
                      setSelectedPatient(createdPatient)
                      navigate('/#demo')
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-paper bg-sage hover:bg-moss transition-colors shadow-sm"
                  >
                    Start Scan Now
                  </button>
                  <button
                    onClick={() => {
                      setCreatedPatient(null)
                      setIsModalOpen(false)
                      setNewPatient({ full_name: '', age: '' })
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium text-bark hover:bg-sand transition-colors border border-line"
                  >
                    View History
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-moss mb-4">Add New Patient</h3>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-bark-soft/60 font-semibold block mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={newPatient.full_name}
                  onChange={(e) => setNewPatient({ ...newPatient, full_name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-sand border border-line rounded-xl px-3 py-2.5 text-sm text-bark placeholder-bark-soft/40 focus:outline-none focus:border-sage/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-bark-soft/60 font-semibold block mb-1.5">Age</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="120"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                  placeholder="e.g. 34"
                  className="w-full bg-sand border border-line rounded-xl px-3 py-2.5 text-sm text-bark placeholder-bark-soft/40 focus:outline-none focus:border-sage/50 transition-colors"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-line mt-6">
                {mutation.isError && (
                  <span className="text-clay text-xs self-center flex-grow">
                    Failed to save: {mutation.error instanceof Error ? mutation.error.message : 'Unknown error'}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-bark hover:bg-sand transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-paper bg-sage hover:bg-moss transition-colors shadow-sm disabled:opacity-50"
                >
                  {mutation.isPending ? 'Saving...' : 'Save Patient'}
                </button>
              </div>
            </form>
              </>
            )}
          </div>
        </div>
      )}

      {historyModalOpen && historyPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bark/40 backdrop-blur-sm p-4">
          <div className="bg-paper rounded-3xl shadow-2xl p-6 w-full max-w-2xl border border-line max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-moss">History: {historyPatient.full_name}</h3>
              <button onClick={() => setHistoryModalOpen(false)} className="text-bark-soft hover:text-bark">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto flex-grow border border-line rounded-xl bg-sand/30 p-2">
              {isLoadingReports ? (
                 <div className="p-4 text-center text-sm text-bark-soft">Loading reports...</div>
              ) : reports.length > 0 ? (
                 <div className="space-y-3">
                   {reports.map((report) => (
                     <div key={report.id} className="bg-paper p-4 rounded-lg border border-line shadow-sm flex justify-between items-center">
                       <div>
                         <p className="text-sm font-bold text-bark">{formatDate(report.created_at)}</p>
                         <p className="text-xs text-bark-soft">
                           Findings: {report.findings.summary?.total_findings || 0} detected
                         </p>
                       </div>
                       <button
                         onClick={async () => {
                           try {
                             toast.loading('Generating report...', { id: 'report' })
                             const blob = await generateReport(historyPatient.id, report.findings)
                             const url = window.URL.createObjectURL(blob)
                             const link = document.createElement('a')
                             link.href = url
                             link.setAttribute('download', `report_${historyPatient.custom_id}_${report.id}.pdf`)
                             document.body.appendChild(link)
                             link.click()
                             link.remove()
                             window.URL.revokeObjectURL(url)
                             toast.success('Report downloaded!', { id: 'report' })
                           } catch (err) {
                             toast.error('Failed to generate report.', { id: 'report' })
                           }
                         }}
                         className="px-3 py-1.5 bg-sage hover:bg-moss text-paper text-xs font-semibold rounded-lg shadow-sm transition-colors"
                       >
                         Download PDF
                       </button>
                     </div>
                   ))}
                 </div>
              ) : (
                 <div className="p-8 text-center">
                   <p className="text-sm text-bark-soft mb-3">No saved reports found for this patient.</p>
                   <button
                     onClick={() => {
                       setSelectedPatient(historyPatient)
                       setHistoryModalOpen(false)
                       navigate('/#demo')
                     }}
                     className="px-4 py-2 bg-clay hover:bg-clay-light text-paper text-sm font-semibold rounded-xl shadow-sm transition-colors"
                   >
                     Run New Scan
                   </button>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
