export default function Footer() {
  return (
    <footer className="bg-moss py-12 border-t border-moss relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-sand/10 pb-8 mb-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 blob bg-gradient-to-br from-sage to-clay flex items-center justify-center">
              <svg className="w-4 h-4 text-sand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 4.5 5.5 4.5c2.83 0 6.83-1.5 8.5-4.5" />
              </svg>
            </div>
            <span className="font-display font-semibold text-lg text-sand">
              Dental<span className="text-clay-light">Vision</span>
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-sand/60">
            <a href="#features" className="hover:text-fern transition-colors">Features</a>
            <a href="#demo" className="hover:text-fern transition-colors">Interactive Demo</a>
            <a href="#how-it-works" className="hover:text-fern transition-colors">How It Works</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-fern transition-colors">GitHub Repository</a>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand/40">
          <p>© {new Date().getFullYear()} DentalVision AI. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Designed for clinical research & auxiliary diagnostics.
            <span className="text-fern bg-fern/10 px-2 py-0.5 rounded-full border border-fern/20 font-bold uppercase tracking-wider text-[8px]">
              HIPAA Protected
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
