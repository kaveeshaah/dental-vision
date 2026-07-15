import { useState } from 'react'

const mockPatients = [
  { id: 'PT-1002', name: 'Alice Chen', age: 34, lastVisit: '2026-06-15', status: 'Healthy' },
  { id: 'PT-1003', name: 'Marcus Johnson', age: 45, lastVisit: '2026-07-02', status: 'Needs Review' },
  { id: 'PT-1004', name: 'Elena Rodriguez', age: 28, lastVisit: '2026-07-10', status: 'Treatment Plan' },
  { id: 'PT-1005', name: 'Samuel Smith', age: 52, lastVisit: '2026-05-20', status: 'Healthy' },
]

export default function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <button className="px-5 py-2.5 rounded-full text-sm font-semibold text-paper bg-clay hover:bg-clay-light shadow-md shadow-clay/20 hover:shadow-clay/30 transition-all duration-300 active:scale-[0.98]">
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
        <div className="bg-paper border border-line rounded-3xl p-1 shadow-lg overflow-x-auto relative">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-line/50">
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Patient ID</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Name</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Age</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Last Visit</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Status</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-bark-soft/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-line/30 hover:bg-sand/30 transition-colors group">
                    <td className="py-4 px-6 text-sm font-medium text-moss">{patient.id}</td>
                    <td className="py-4 px-6 text-sm text-bark font-semibold">{patient.name}</td>
                    <td className="py-4 px-6 text-sm text-bark-soft">{patient.age} yrs</td>
                    <td className="py-4 px-6 text-sm text-bark-soft">{patient.lastVisit}</td>
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
                    No patients found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
