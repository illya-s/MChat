import axios from "axios";
import { refreshToken } from "../providers/authService";

const api = axios.create({
	baseURL: "http://localhost:8000",
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("access_token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

api.interceptors.response.use(
	(res) => res,
	async (error) => {
		if (error.response?.status === 401) {
			const newToken = await refreshToken();
			if (newToken) {
				localStorage.setItem("access_token", newToken);
				error.config.headers.Authorization = `Bearer ${newToken}`;
				return api(error.config);
			}
		}
		return Promise.reject(error);
	},
);

export default api;
