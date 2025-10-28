import apiClient from '@/lib/apiClient';
import { AxiosResponse } from 'axios';

// Auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
    role: 'assets' | 'maintenance' | 'reliability';
}

export interface LoginResponse {
    data: {
        access_token: string;
        refresh_token: string;
        role: 'assets' | 'maintenance' | 'reliability';
        full_name: string;
    };
}



export interface User {
    id: string;
    email: string;
    role: 'assets' | 'maintenance' | 'reliability';
    name: string;
}

// Auth API functions
export const authApi = {
    // Login user
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response: AxiosResponse<LoginResponse> = await apiClient.post('v1/auth/login', credentials);
        return response.data;
    },

    // Logout user
    // logout: async (): Promise<void> => {
    //     await apiClient.post('/auth/logout');
    //     localStorage.removeItem('authToken');
    //     localStorage.removeItem('refreshToken');
    //     localStorage.removeItem('userRole');
    // },

    // Get current user profile
    // getProfile: async (): Promise<User> => {
    //     const response: AxiosResponse<User> = await apiClient.get('v1/auth/profile');
    //     return response.data;
    // },

    // Refresh token
    refreshToken: async (): Promise<{ refresh_token: string }> => {
        const response: AxiosResponse<{ refresh_token: string }> = await apiClient.post('v1/auth/refresh');
        return response.data;
    },

    // Register user (if needed)
    register: async (userData: RegisterRequest): Promise<LoginResponse> => {
        const response: AxiosResponse<LoginResponse> = await apiClient.post('v1/auth/register', userData);
        return response.data;
    },
};

// Helper functions for token management
export const tokenManager = {
    setToken: (token: string): void => {
        localStorage.setItem('authToken', token);
    },

    setRefreshToken: (refreshToken: string): void => {
        localStorage.setItem('refreshToken', refreshToken);
    },

    getToken: (): string | null => {
        return localStorage.getItem('authToken');
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem('refreshToken');
    },

    removeToken: (): void => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('authToken');
    },
};