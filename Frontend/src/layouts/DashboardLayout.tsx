import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import ChatWidget from '../components/Chat/ChatWidget'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuthStore()
  const location = useLocation()

  const navItems = [
    { name: 'Patients', path: '/dashboard/patient', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ]

  return (
    <div className="flex min-h-screen bg-sand font-sans text-bark-soft">
      {/* Sidebar */}
      <aside className="w-64 bg-[#efeada] border-r border-line/50 flex flex-col hidden md:flex sticky top-0 h-screen overflow-y-auto">

        {/* Logo */}
        <div className="p-6 pb-8">
          <Link to="/" className="flex items-center">
            <span className="font-display font-bold text-2xl tracking-tight text-clay">
              Dental<span className="text-moss">Vision</span>
            </span>
          </Link>
        </div>

        {/* User Profile Area */}
        <div className="px-6 mb-8">
          <div className="bg-line/40 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-clay overflow-hidden flex items-center justify-center text-paper font-bold text-lg shadow-inner">
              {user ? user.username.charAt(0).toUpperCase() : 'H'}
            </div>
            <div>
              <div className="font-bold text-sm text-moss">
                Dr. {user ? user.username : 'Henderson'}
              </div>
              <div className="text-xs text-bark-soft">Lead Radiologist</div>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="px-6 mb-8">
          <button className="w-full py-3 rounded-full text-sm font-semibold text-paper bg-[#995333] hover:bg-clay shadow-md shadow-clay/20 transition-all duration-300 active:scale-[0.98]">
            New Analysis
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            // Check if active
            const isActive = location.pathname.includes(item.path) || (item.name === 'Patients' && location.pathname.includes('/dashboard/patient'))

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? 'bg-[#bc6a44] text-paper font-semibold shadow-sm shadow-clay/20'
                    : 'text-bark-soft hover:bg-line/40 hover:text-moss'
                  }`}
              >
                <svg className={`w-5 h-5 ${isActive ? 'text-paper' : 'text-bark-soft/60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen relative">
        {children}
        <ChatWidget />
      </main>
    </div>
  )
}
