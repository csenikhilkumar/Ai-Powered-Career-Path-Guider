import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { storage } from '@/utils/storage';
import { getMockData } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
// Force mock if backend is down or explicitly requested
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Better approach: Replace adapter for mocks
if (USE_MOCK) {
    client.defaults.adapter = async (config) => {
        console.log(`[Mock API] ${config.method?.toUpperCase()} ${config.url}`);

        // Remove baseURL from url to match mock keys
        const cleanUrl = config.url?.replace(config.baseURL || '', '') || '';
        const mockData = getMockData(cleanUrl, config.method || 'get');

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (mockData) {
                    resolve({
                        data: mockData,
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                        request: {}
                    });
                } else {
                    // Fallback to network or 404? 
                    // If we want to strictly mock, 404.
                    // But if we want hybrid, we'd need the original adapter.
                    // For now, let's 404 if not in mock to avoid confusion.
                    reject({
                        response: {
                            status: 404,
                            statusText: 'Not Found (Mock)'
                        }
                    });
                }
            }, 500);
        });
    };
}

client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            storage.clearToken();
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

