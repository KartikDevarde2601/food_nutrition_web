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

// Queue for storing failed requests during token refresh
let isRefreshing = false
let failedRequestsQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
  config: AxiosRequestConfig
}> = []

// Process all queued requests after successful token refresh
const processQueue = (error: any = null, token: string | null = null) => {
  failedRequestsQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      // Update the request with new token and retry
      if (promise.config.headers && token) {
        promise.config.headers.Authorization = `Bearer ${token}`
      }
      apiClient(promise.config)
        .then((response) => promise.resolve(response))
        .catch((err) => promise.reject(err))
    }
  })
  failedRequestsQueue = []
}

// Response interceptor - handle common errors and refresh token
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized - Refresh Token Logic
    if (error.response?.status === 401 && !originalRequest.url?.includes('/auth/refresh')) {

      // If token refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject, config: originalRequest })
        })
      }

      // Mark that we're refreshing to prevent multiple refresh calls
      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Call refresh endpoint with refresh token in Authorization header
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

        // Update tokens in localStorage
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)

        // Update the original request header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`
        }

        // Process all queued requests with the new token
        processQueue(null, access_token)

        // Reset refresh flag
        isRefreshing = false

        // Retry original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - reject all queued requests and clear tokens
        processQueue(refreshError, null)
        isRefreshing = false

        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        // The main.tsx QueryCache onError will handle the redirect to login
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
