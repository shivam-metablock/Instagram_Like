import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://instagram-like.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const userAPI = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/users/Instagram', data);
        return response.data;
    },
    getLength: async () => {
        const response = await api.get('/users/length');
        return response.data;
    },
}

export const authAPI = {
    register: async (data: any) => {
        const response = await api.post('/auth/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    login: async (data: any) => {
        const response = await api.post('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    updateMe: async (data: { name: string;number: string }) => {
        const response = await api.post('/auth/me', data);
        return response.data;
    },
};

// Post API
export const postAPI = {
    getAll: async () => {
        const response = await api.get('/posts');
        return response.data;
    },

    getOne: async (id: any) => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/posts', data);
        return response.data;
    },

    update: async (id: any, data: any) => {
        const response = await api.put(`/posts/${id}`, data);
        return response.data;
    },

    delete: async (id: any) => {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    },
};

// Plan API
export const planAPI = {
    getAll: async (platform?: string) => {
        const params = platform ? { platform } : {};
        const response = await api.get('/plans', { params });
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/plans', data);
        return response.data;
    },

    update: async (id: any, data: any) => {
        const response = await api.put(`/plans/${id}`, data);
        return response.data;
    },

    delete: async (id: any) => {
        const response = await api.delete(`/plans/${id}`);
        return response.data;
    },
};

// Order API
export const orderAPI = {
    getAll: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    getMyOrders: async () => {
        const response = await api.get('/orders/my2');
        return response.data;
    },

    getOne: async (id: any) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    create: async (data: FormData) => {
        const response = await api.post('/orders', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    updateOrder: async (id: string, data: any) => {
        const response = await api.put(`/orders/${id}`, data);
        return response.data;
    },

    updateStatus: async (id: string, status: string, rejectionReason?: string) => {
        const response = await api.put(`/orders/${id}/status`, { status, rejectionReason });
        return response.data;
    }
};

// Proxy API (Admin only)
export const proxyAPI = {
    getAll: async () => {
        const response = await api.get('/proxies');
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/proxies', data);
        return response.data;
    },

    update: async (id: any, data: any) => {
        const response = await api.put(`/proxies/${id}`, data);
        return response.data;
    },

    delete: async (id: any) => {
        const response = await api.delete(`/proxies/${id}`);
        return response.data;
    },
};

// Config API
export const configAPI = {
    getPaymentConfig: async () => {
        const response = await api.get('/config/payment');
        return response.data;
    },

    updatePaymentConfig: async (data: any) => {
        const isFormData = data instanceof FormData;
        const response = await api.put('/config/payment', data, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
        });
        return response.data;
    }
};

export default api;
