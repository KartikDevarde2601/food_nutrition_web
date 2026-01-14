import { apiRequest } from './client'

export interface UserDetails {
    id: number
    full_name: string
    age: number | null
    phone: string | null
    userId: number
    gender: string | null
    createdAt: string
    updatedAt: string
}

export interface UserResponse {
    id: number
    role: string
    email: string
    program_id: number
    createdAt: string
    updatedAt: string
    userDetails: UserDetails
}

export const userApi = {
    getMe: async (): Promise<UserResponse> => {
        const response = await apiRequest<UserResponse>({
            url: '/users/me',
            method: 'GET',
        })
        return response.data
    },
}
