import { ActionResponse } from '@/types/common';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: process.env.BASE_URL || 'http://localhost:3000/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        // TODO: Add token logic here later
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse<ActionResponse>): AxiosResponse<ActionResponse> => {
        return response;
    },
    (error) => {
        console.error('Response error:', error);

        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    console.error('Unauthorized - redirecting to login');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Forbidden - insufficient permissions');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 500:
                    console.error('Internal server error');
                    break;
                default:
                    console.error(`HTTP Error ${status}:`, data?.message || 'Unknown error');
            }

            // Return a standardized error format
            return Promise.reject({
                status,
                message: data?.message || `HTTP Error ${status}`,
                data: data
            });
        } else if (error.request) {
            // Network error
            console.error('Network error - no response received');
            return Promise.reject({
                status: 0,
                message: 'Network error - please check your connection',
                data: null
            });
        } else {
            // Something else happened
            console.error('Request setup error:', error.message);
            return Promise.reject({
                status: 0,
                message: error.message || 'Request failed',
                data: null
            });
        }
    }
);

export default api;