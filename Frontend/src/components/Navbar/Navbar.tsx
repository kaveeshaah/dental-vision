import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-6xl mx-auto glass rounded-full px-5 py-3 shadow-sm shadow-moss/5 flex items-center justify-between transition-all duration-300">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 blob bg-gradient-to-br from-sage to-clay flex items-center justify-center shadow-md shadow-sage/20 animate-sway">
            <svg className="w-4.5 h-4.5 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 4.5 5.5 4.5c2.83 0 6.83-1.5 8.5-4.5" />
            </svg>
          </div>
          <span className="font-display font-semibold text-xl tracking-tight text-moss">
            Dental<span className="text-clay">Vision</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-bark-soft">
          <a href="#features" className="hover:text-clay transition-colors duration-200">Features</a>
          <a href="#demo" className="hover:text-clay transition-colors duration-200">Interactive Demo</a>
          <a href="#how-it-works" className="hover:text-clay transition-colors duration-200">How It Works</a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-full text-sm font-semibold text-bark-soft hover:text-moss transition-all"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-paper bg-clay hover:bg-clay-light shadow-md shadow-clay/20 hover:shadow-clay/30 transition-all duration-300 scale-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            Register
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
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

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 glass rounded-3xl px-6 py-5 flex flex-col gap-4 animate-fade-in">
          <a href="#features" onClick={() => setIsOpen(false)} className="text-bark-soft hover:text-clay py-1 transition-colors text-sm">Features</a>
          <a href="#demo" onClick={() => setIsOpen(false)} className="text-bark-soft hover:text-clay py-1 transition-colors text-sm">Interactive Demo</a>
          <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-bark-soft hover:text-clay py-1 transition-colors text-sm">How It Works</a>
          <div className="flex flex-col gap-2 pt-3 border-t border-line">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-full text-sm font-semibold text-bark-soft hover:text-moss"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-5 py-2.5 rounded-full text-sm font-semibold text-paper bg-clay"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
