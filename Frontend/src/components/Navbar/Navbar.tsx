import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { toast } from 'react-hot-toast'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false
    return location.pathname.startsWith(path) || location.hash === path
  }

  const baseLinkClass = "transition-colors duration-200"
  const activeLinkClass = "font-medium text-bark border-b-2 border-clay pb-1"
  const inactiveLinkClass = "hover:text-clay"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-6xl mx-auto glass rounded-full px-5 py-3 shadow-sm shadow-moss/5 flex items-center justify-between transition-all duration-300">
        <Link to="/" className="flex items-center">
          <span className="font-display font-bold text-2xl tracking-tight text-clay">
            Dental<span className="text-moss">Vision</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-bark-soft">
          <Link to="/" className={`${baseLinkClass} ${isActive('/') && !location.hash ? activeLinkClass : inactiveLinkClass}`}>Dashboard</Link>
          <Link to="/patient-records" className={`${baseLinkClass} ${isActive('/patient-records') || isActive('/dashboard/patient') ? activeLinkClass : inactiveLinkClass}`}>Records</Link>
          <Link to="/#demo" className={`${baseLinkClass} ${location.hash === '#demo' ? activeLinkClass : inactiveLinkClass}`}>Diagnostics</Link>
          <Link to="/about" className={`${baseLinkClass} ${isActive('/about') ? activeLinkClass : inactiveLinkClass}`}>About</Link>
          <Link to="/analytics" className={`${baseLinkClass} ${isActive('/analytics') ? activeLinkClass : inactiveLinkClass}`}>Analytics</Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-semibold text-clay hover:text-clay-light transition-colors">
            Support
          </a>
          {user ? (
            <button
              onClick={() => {
                logout()
                toast.success('Logged out successfully.')
              }}
              className="px-6 py-2 rounded-full text-sm font-semibold text-paper bg-clay hover:bg-clay-light shadow-md transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 rounded-full text-sm font-semibold text-paper bg-clay hover:bg-clay-light shadow-md shadow-clay/20 hover:shadow-clay/30 transition-all duration-300 scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-bark-soft hover:text-moss transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 glass rounded-3xl px-6 py-5 flex flex-col gap-4 animate-fade-in">
          <a href="#features" onClick={() => setIsOpen(false)} className="text-bark-soft hover:text-clay py-1 transition-colors text-sm">Features</a>
          <a href="#demo" onClick={() => setIsOpen(false)} className="text-bark-soft hover:text-clay py-1 transition-colors text-sm">Interactive Demo</a>
          <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-bark-soft hover:text-clay py-1 transition-colors text-sm">How It Works</a>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-bark-soft hover:text-clay py-1 transition-colors text-sm">About</Link>
          <Link to="/analytics" onClick={() => setIsOpen(false)} className="text-bark-soft hover:text-clay py-1 transition-colors text-sm">Analytics</Link>
          {user && (
            <Link to="/patient-records" onClick={() => setIsOpen(false)} className="text-bark-soft hover:text-clay py-1 transition-colors text-sm">Patient Records</Link>
          )}
          <div className="flex flex-col gap-2 pt-3 border-t border-line">
            {user ? (
              <>
                <span className="w-full text-center py-2.5 text-sm font-semibold text-moss">
                  Dr. {user.username}
                </span>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                    toast.success('Logged out successfully.')
                  }}
                  className="w-full text-center px-5 py-2.5 rounded-full text-sm font-semibold text-paper bg-clay hover:bg-clay-light transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-full text-sm font-semibold text-bark-soft hover:text-moss transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-5 py-2.5 rounded-full text-sm font-semibold text-paper bg-clay hover:bg-clay-light transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
