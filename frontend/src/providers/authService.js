import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:8000",
	withCredentials: true,
});

export async function request(email) {
	return await api
		.post(
			"/user/auth/request/",
			{ email: email },
			{
				withCredentials: true,
			},
		)
		.then((res) => {
			return {
				success: true,
				message: res.data.message,
			};
		})
		.catch((exc) => {
			console.error(exc)
			return {
				success: false,
				message: exc.response?.data?.message || "Ошибка соединения",
			};
		});
}

export async function enter(email, code, deviceId) {
	return await api
		.post(
			"/user/auth/enter/",
			{ email: email, code: code, device_id: deviceId },
			{
				withCredentials: true,
			},
		)
		.then((res) => {
			return {
				success: true,
				access_token: res.data.access_token,
				message: res.data.message
			}
		})
		.catch((exc) => {
			console.error(exc)
			return {
				success: false,
				access_token: null,
				message: exc.response?.data?.message || "Ошибка соединения",
			}
		});
}

export async function refreshToken() {
	return await api
		.post(
			"/user/auth/refresh/",
			{},
			{
				withCredentials: true,
			},
		)
		.then((res) => res.data.access_token)
		.catch((exc) => null);
}

export async function getUser(accessToken) {
	return await api
		.get("/user/auth/session/", {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res.data);
}
