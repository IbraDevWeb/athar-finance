import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const screeningService = {
    checkHalal: async (ticker) => {
        const response = await api.get(`/screening/${ticker}`);
        return response.data;
    },
};

export default api;