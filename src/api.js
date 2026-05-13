import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // رابط الـ Laravel بتاعك
});

// الكود ده بيخلي أي طلب يتبعت ياخد الـ Token تلقائياً من الـ Browser
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;