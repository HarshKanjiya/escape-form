import { ActionResponse } from '@/types/common';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string | null) => void;
    reject: (error: any) => void;
}> = [];

let getAuthToken: (({ skipCache }: { skipCache: boolean }) => Promise<string | null>) | null = null;

export const registerTokenProvider = (fn: ({ skipCache }: { skipCache: boolean }) => Promise<string | null>) => {
    getAuthToken = fn;
};

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (getAuthToken) {
            try {
                const token = await getAuthToken({ skipCache: false });
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Error fetching token in interceptor", error);
            }
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse<ActionResponse>): AxiosResponse<ActionResponse> => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // --- RETRY LOGIC START ---
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (!getAuthToken) {
                return Promise.reject(error); // Can't refresh if no provider
            }

            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise<string | null>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Fetch new token (Clerk handles the refresh internally here)
                const newToken = await getAuthToken({ skipCache: true });

                console.log('newToken', newToken)

                // Update the header for the retry
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                }

                // Retry queued requests
                processQueue(null, newToken);

                // Retry the original request
                return api(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                // If refresh fails, user might actually be logged out
                // window.location.href = '/sign-in'; 
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        // --- RETRY LOGIC END ---

        console.error('Response error:', error);

        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
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

            return Promise.reject({
                status,
                message: data?.message || `HTTP Error ${status}`,
                data: data
            });
        } else if (error.request) {
            console.error('Network error - no response received');
            return Promise.reject({
                status: 0,
                message: 'Network error - please check your connection',
                data: null
            });
        } else {
            return Promise.reject({
                status: 0,
                message: error.message || 'Request failed',
                data: null
            });
        }
    }
);

export default api;