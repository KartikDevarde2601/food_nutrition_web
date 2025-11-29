import { apiClient, apiRequest } from './client'
// import type { SignUpDto, SignInDto } from '@/features/auth/types' 
// Actually, let's check if types exist or define them inline/here for now to avoid errors.
// The user provided DTOs in the prompt, let's assume we need to match that structure.

export interface User {
  id: number
  email: string
  // Add other fields as needed
}

export interface Tokens {
  access_token: string
  refresh_token: string
}

// Re-defining DTOs here based on user request if not found elsewhere.
// But better to check if they exist. For now, I'll define them to be safe.

export interface SignUpPayload {
  email: string
  password: string
  full_name: string
}

export interface SignInPayload {
  email: string
  password: string
}

export const authApi = {
  signup: (data: SignUpPayload) => {
    return apiRequest<Tokens>({
      url: '/auth/local/signup',
      method: 'POST',
      data,
    })
  },

  signin: (data: SignInPayload) => {
    return apiRequest<Tokens>({
      url: '/auth/local/signin',
      method: 'POST',
      data,
    })
  },

  logout: () => {
    return apiRequest<void>({
      url: '/auth/logout',
      method: 'POST',
    })
  },

  refresh: () => {
    return apiClient.post<Tokens>('/auth/refresh')
  },
}
