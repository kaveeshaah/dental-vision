export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 border-t border-slate-800 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 .364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white">
              Dental<span className="text-teal-400">Vision</span>
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
            <a href="#demo" className="hover:text-teal-400 transition-colors">Interactive Demo</a>
            <a href="#how-it-works" className="hover:text-teal-400 transition-colors">How It Works</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-teal-400 transition-colors">GitHub Repository</a>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DentalVision AI. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Designed for clinical research & auxiliary diagnostics.
            <span className="text-teal-400 bg-teal-400/5 px-2 py-0.5 rounded border border-teal-400/10 font-bold uppercase tracking-wider text-[8px]">
              HIPAA Protected
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
