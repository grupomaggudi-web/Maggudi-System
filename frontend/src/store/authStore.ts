import create from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/utils/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password })
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      setUser: (user: User) => set({ user }),
      setToken: (token: string) => set({ token }),
    }),
    {
      name: 'auth-store',
    },
  ),
)
