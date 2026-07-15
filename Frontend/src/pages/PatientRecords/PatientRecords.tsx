import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPatients, createPatient } from '../../api'

export default function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({ full_name: '', age: '' })
  const queryClient = useQueryClient()

  const { data: patients = [], isLoading, isError } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  })

  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      setIsModalOpen(false)
      setNewPatient({ full_name: '', age: '' })
    },
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

  // format date helper
  const formatDate = (isoString: string) => {
    const d = new Date(isoString)
    return d.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-sand text-bark-soft flex flex-col items-center pt-28 pb-12 px-6 relative overflow-hidden font-sans grain">
      {/* Background blobs */}
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

        {/* Search Bar */}
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

        {/* Records Table */}
        <div className="bg-paper border border-line rounded-3xl p-1 shadow-lg overflow-x-auto relative min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-line/50">
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Patient ID</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Name</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Age</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Created</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Status</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60 text-right">Actions</th>
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
                    <td className="py-4 px-6 text-right">
                      <button className="text-sm font-medium text-clay hover:text-clay-light transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                        View Details →
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

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bark/40 backdrop-blur-sm p-4">
          <div className="bg-paper rounded-3xl shadow-2xl p-6 w-full max-w-md border border-line">
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
          </div>
        </div>
      )}
    </div>
  )
}
