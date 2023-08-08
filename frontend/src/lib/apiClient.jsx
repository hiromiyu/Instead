import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://instead.onrender.com/api",
    headers: {
        "Content-type": "application/json",
    },
});

export default apiClient;