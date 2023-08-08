import { axios } from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_PUBLIC_API_BASEURL,
    headers: {
        "Content-type": "application/json",
    },
});

export default apiClient;