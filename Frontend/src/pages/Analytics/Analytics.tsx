import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAnalytics } from '../../api'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#4A7C59', '#C87941', '#8FC0A9', '#D38D5F', '#3E5C50']

export default function Analytics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  })

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss"></div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-20 text-red-500">
        Failed to load analytics data.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand text-bark-soft flex flex-col items-center pt-28 pb-12 px-6 relative overflow-hidden font-sans grain">
      <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] blob bg-fern/10 blur-[120px] pointer-events-none animate-sway" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blob-alt bg-clay/10 blur-[120px] pointer-events-none animate-soft-pulse" />

      <div className="relative z-10 w-full max-w-6xl space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-moss mb-2">Clinic Analytics</h1>
          <p className="text-bark">Overview of patient demographics, scan activity, and AI insights.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass rounded-3xl p-6 shadow-sm border border-white/50 flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-bark-soft mb-1 uppercase tracking-wider">Total Patients</h3>
            <p className="text-4xl font-bold text-moss">{data.total_patients}</p>
          </div>
          <div className="glass rounded-3xl p-6 shadow-sm border border-white/50 flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-bark-soft mb-1 uppercase tracking-wider">Total Scans</h3>
            <p className="text-4xl font-bold text-clay">{data.total_scans}</p>
          </div>
          <div className="glass rounded-3xl p-6 shadow-sm border border-white/50 flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-bark-soft mb-1 uppercase tracking-wider">Avg Findings/Scan</h3>
            <p className="text-4xl font-bold text-fern">{data.average_findings}</p>
          </div>
          <div className="bg-sage/20 border border-sage/40 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
             <div className="absolute right-[-10%] bottom-[-20%] text-6xl opacity-10">🤖</div>
             <h3 className="text-sm font-semibold text-moss mb-1 uppercase tracking-wider relative z-10">AI Usage Status</h3>
             <p className="text-xl font-bold text-moss relative z-10">{data.total_scans > 0 ? "Active & Learning" : "Awaiting Scans"}</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disease Distribution (Pie) */}
          <div className="glass rounded-3xl p-6 shadow-sm border border-white/50">
            <h2 className="text-lg font-bold text-moss mb-6">Disease Distribution</h2>
            <div className="h-80 w-full">
              {data?.disease_distribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.disease_distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.disease_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#3E5C50', fontWeight: 'bold' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-bark-soft italic">No disease data available yet.</div>
              )}
            </div>
          </div>

          {/* Age Distribution (Bar) */}
          <div className="glass rounded-3xl p-6 shadow-sm border border-white/50">
            <h2 className="text-lg font-bold text-moss mb-6">Patient Demographics (Age)</h2>
            <div className="h-80 w-full">
               {data?.total_patients > 0 && data?.age_distribution?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.age_distribution}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} allowDecimals={false} />
                      <Tooltip 
                         cursor={{ fill: 'rgba(143, 192, 169, 0.2)' }}
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" fill="#8FC0A9" radius={[6, 6, 0, 0]} barSize={50} name="Patients" />
                    </BarChart>
                  </ResponsiveContainer>
               ) : (
                 <div className="h-full flex items-center justify-center text-bark-soft italic">No patient data available yet.</div>
               )}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="glass rounded-3xl p-6 shadow-sm border border-white/50">
          <h2 className="text-lg font-bold text-moss mb-6">Scan Activity (Last 30 Active Days)</h2>
          <div className="h-80 w-full">
            {data?.activity_over_time?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.activity_over_time}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="scans" stroke="#C87941" strokeWidth={4} dot={{ r: 4, fill: '#C87941', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} name="Scans" />
                  </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-bark-soft italic">No scan activity recorded yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
