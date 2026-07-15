import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse } from '../api'

interface AuthState {
  token: string | null
  user: AuthResponse['user'] | null
  setAuth: (data: AuthResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (data) => set({ token: data.access_token, user: data.user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
