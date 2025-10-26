import { config } from "@/config";
import axios from "axios";

const requests = axios.create({
    baseURL: config.API_URL,
});

requests.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

requests.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response?.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
                localStorage.setItem("access_token", newToken);
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return requests(error.config);
            }
        }
        return Promise.reject(error);
    },
);

export default requests;
