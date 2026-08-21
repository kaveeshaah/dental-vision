import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../api'
import { useAuthStore } from '../../store/authStore'
import { toast } from 'react-hot-toast'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in all fields.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await registerUser({ username: name, email, password })
      useAuthStore.getState().setAuth(response)
      toast.success('Account created successfully! Welcome to DentalVision.')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand text-bark-soft flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans grain">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] blob bg-fern/15 blur-[120px] pointer-events-none animate-sway" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] blob-alt bg-clay/10 blur-[120px] pointer-events-none animate-soft-pulse" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 blob bg-gradient-to-br from-sage to-clay flex items-center justify-center shadow-md shadow-sage/20 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-5 h-5 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 4.5 5.5 4.5c2.83 0 6.83-1.5 8.5-4.5" />
              </svg>
            </div>
            <span className="font-display font-semibold text-2xl tracking-tight text-moss">
              Dental<span className="text-clay">Vision</span>
            </span>
          </Link>
        </div>

        <div className="bg-paper border border-line rounded-3xl p-8 shadow-lg relative overflow-hidden">
          <h2 className="font-display text-xl font-semibold text-moss mb-1">Create Your Account</h2>
          <p className="text-sm text-bark-soft/60 mb-6">Join DentalVision to start analyzing scans.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Dr. Alex Rivera"
                className="w-full bg-sand border border-line rounded-2xl px-4 py-3 text-sm text-bark placeholder-bark-soft/40 focus:outline-none focus:border-sage/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                placeholder="alex@clinic.com"
                className="w-full bg-sand border border-line rounded-2xl px-4 py-3 text-sm text-bark placeholder-bark-soft/40 focus:outline-none focus:border-sage/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full bg-sand border border-line rounded-2xl px-4 py-3 text-sm text-bark placeholder-bark-soft/40 focus:outline-none focus:border-sage/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-bark-soft/60">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full bg-sand border border-line rounded-2xl px-4 py-3 text-sm text-bark placeholder-bark-soft/40 focus:outline-none focus:border-sage/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-clay hover:bg-clay-light text-sm font-bold text-paper shadow-md shadow-clay/20 hover:shadow-clay/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-paper border-t-transparent rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-bark-soft/60 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-clay font-semibold hover:text-clay-light transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
