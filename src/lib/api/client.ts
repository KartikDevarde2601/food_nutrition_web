import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'

// API Response wrapper type
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

// Get API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in production mode
  const isProd = import.meta.env.PROD
  
  // Use environment-specific URL or fallback to default
  if (isProd && import.meta.env.VITE_API_BASE_URL_PROD) {
    return import.meta.env.VITE_API_BASE_URL_PROD
  }
  
  if (!isProd && import.meta.env.VITE_API_BASE_URL_DEV) {
    return import.meta.env.VITE_API_BASE_URL_DEV
  }
  
  // Fallback to VITE_API_BASE_URL or default localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
}

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle common errors and refresh token
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized - Refresh Token Logic
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Call refresh endpoint
        // Note: We need to manually pass the refresh token in the body or header depending on backend expectation.
        // The user's backend code snippet showed: @GetCurrentUser('refreshToken') refreshToken: string
        // This usually implies it extracts from the request user object (populated by guard) or body.
        // If the backend uses RtGuard, it likely expects:
        // 1. Bearer token in Authorization header (which is the refresh token for the refresh endpoint)
        // OR
        // 2. Cookie (which we are removing)
        
        // Since we are switching to localStorage, the RtGuard (Passport-JWT) will likely look for Bearer token.
        // So we should set the Authorization header to the Refresh Token for this specific request.
        
        const response = await axios.post(
          `${getApiBaseUrl()}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )

        const { access_token, refresh_token } = response.data

        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        
        // Update the original request header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`
        }

        // Retry original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        // Ideally use a store action or event to trigger logout UI
        // window.location.href = '/sign-in' 
        return Promise.reject(refreshError)
      }
    }

    // Handle other common error responses
    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 403:
          // Forbidden
          break
        case 404:
          // Not found
          break
        case 500:
          // Internal server error
          break
        default:
          break
      }
    }

    return Promise.reject(error)
  }
)

// Generic API request wrapper
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<T>(config)
    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    throw error
  }
}
