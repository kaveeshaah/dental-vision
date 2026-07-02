import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-600/10">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 .364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Dental<span className="text-teal-600">Vision</span>
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 ml-2">
            AI WORKSPACE
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-teal-600 transition-colors duration-200">Features</a>
          <a href="#demo" className="hover:text-teal-600 transition-colors duration-200">Interactive Demo</a>
          <a href="#how-it-works" className="hover:text-teal-600 transition-colors duration-200">How It Works</a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#login"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all"
          >
            Sign In
          </a>
          <a
            href="#register"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 shadow-md shadow-teal-600/10 hover:shadow-teal-500/20 transition-all duration-300 scale-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            Register
          </a>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors focus:outline-none"
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

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200 flex flex-col gap-4 animate-fade-in">
          <a href="#features" onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-teal-600 py-1 transition-colors text-sm">Features</a>
          <a href="#demo" onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-teal-600 py-1 transition-colors text-sm">Interactive Demo</a>
          <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-teal-600 py-1 transition-colors text-sm">How It Works</a>
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
            <a
              href="#login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Sign In
            </a>
            <a
              href="#register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600"
            >
              Register
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
