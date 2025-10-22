import axios from "axios";

export async function login(email, password) {
	return await axios
		.post(
			"/api/auth/login/",
			{ email, password },
			{
				withCredentials: true,
			},
		)
		.then((res) => res.data.access_token);
}

export async function refreshToken() {
	return await axios
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
	return await axios
		.get("/user/auth/session/", {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res.data);
}
