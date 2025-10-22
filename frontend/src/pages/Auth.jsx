import './Auth.css'
import { config } from '@/config';
import { Section } from "../components/elements/Section"
import { useMessageApi } from "../providers/MessageProvider"

import axios from "axios"
import qs from "qs"
import { useNavigate } from "react-router"

import { Input, Button } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import useAuth from '../providers/useAuth';


export default function Auth() {
	const [user, setUser] = useState(null);
	const deviceId = null;
	
	// const { user, setUser, deviceId } = useAuth();

	console.log(user)
	console.log(deviceId)
	console.log(accessToken)

	const navigate = useNavigate();
	const message = useMessageApi();

	const [isRequest, setIsRequest] = useState(true);

	const [email, setEmail] = useState(null);
	const [emailIsValid, setEmailIsValid] = useState(null);

	const [code, setCode] = useState();

	const handleRequest = () => {
		if (!email || !emailIsValid) {
			setEmailIsValid(false)
			return
		}
		setIsRequest(false)

		axios.post(
			`${config.API_URL}/user/auth/request/`,
			{ "email": email },
			{
				withCredentials: true,
				paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" })
			}
		)
			.then(res => {
				message.success(res.data.message)
			})
			.catch(exc => {
				message.error(exc.response?.data?.message || "Ошибка соединения");
				setIsRequest(true)
			});

	}

	const handleEnter = () => {
		if (!email || !code) {
			message.error("Требуется адрес электронной почты и код")
			return
		}

		axios.post(
			`${config.API_URL}/user/auth/enter/`,
			{ "email": email, 'code': code, "device_id": deviceId },
			{
				withCredentials: true,
				paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" })
			}
		)
			.then(res => {
				message.success(res.data.message)
				setAccessToken(res.data.access_token)
				setIsEnter(true)
			})
			.catch(exc => {
				console.error
				message.error(exc.response?.data?.message || "Ошибка соединения");
			});
	}

	useEffect(() => {
		if (email == null || email == "") {
			setEmailIsValid(null);
		} else {
			const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			setEmailIsValid(re.test(email))
		}
	}, [email])

	useEffect(() => {
		if (code) {
			handleEnter()
		}
	}, [code])

	useEffect(() => {
		if (user) {
			navigate('/')
		}
	}, [user])

	return (
		<Section className='auth-wrapper'>
			{isRequest ? (
				<form
					method="post"
					className='auth-content-form'
				>
					<h1>Авторизация</h1>

					<div className='auth-content-form-block'>
						<Input
							placeholder="example@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							status={emailIsValid === null ? "" : emailIsValid ? "" : "warning"}
						/>
						{emailIsValid == false && <p className='auth-form-warning'>Пожалуйста, введите корректный адрес электронной почты!</p>}
					</div>

					<Button
						color="primary"
						variant="solid"
						block

						onClick={handleRequest}
					>Далее</Button>
				</form>
			) : (
				<form
					method="post"
					className='auth-content-form'
				>
					<div className='auth-content-form-block'>
						<span>Введите код</span>
						<Input.OTP
							formatter={(str) => str.replace(/\D/g, '')}
							maxLength={6}
							onChange={(value) => setCode(value)}
						/>
					</div>

					<Button
						color="primary"
						variant="solid"
						block

						onClick={handleEnter}
					>Далее</Button>
				</form>
			)}
		</Section>
	)
}