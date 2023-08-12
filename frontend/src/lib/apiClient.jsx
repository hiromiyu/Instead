import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASEURL,
    // baseURL: "http://localhost:4000/api",
    // headers: {
    //     "Content-type": "application/json",
    // },
});

export default apiClient;