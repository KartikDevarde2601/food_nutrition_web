import { create } from 'zustand'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'

interface AuthUser {
  id: number
  email: string
  // Add other fields as needed
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string | null
    refreshToken: string | null
    setTokens: (accessToken: string, refreshToken: string) => void
    resetTokens: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN)

  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: accessToken,
      refreshToken: refreshToken,
      setTokens: (accessToken, refreshToken) =>
        set((state) => {
          localStorage.setItem(ACCESS_TOKEN, accessToken)
          localStorage.setItem(REFRESH_TOKEN, refreshToken)
          return {
            ...state,
            auth: { ...state.auth, accessToken, refreshToken },
          }
        }),
      resetTokens: () =>
        set((state) => {
          localStorage.removeItem(ACCESS_TOKEN)
          localStorage.removeItem(REFRESH_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, accessToken: null, refreshToken: null },
          }
        }),
      reset: () =>
        set((state) => {
          localStorage.removeItem(ACCESS_TOKEN)
          localStorage.removeItem(REFRESH_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: null, refreshToken: null },
          }
        }),
    },
  }
})
