import './Chat.css'

import React, { useEffect, useState } from "react";

import { Input, Button } from "antd";


export default function Chat() {
	const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState("");
	const [chat, setChat] = useState([
		{
			'user': {
				'username': 'Alex',
				'avatar': null,
				'is_current': false
			},
			'text': 'lkewjrhfoiwer'
		}
	]);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8000/ws/chat/");
		ws.onmessage = (e) => {
			console.log('WS Connected...')
			const data = JSON.parse(e.data);
			setChat((prev) => [...prev, data.message]);
		};
		ws.onclose = (e) => {console.log("WS Disconnected.")};
		setSocket(ws);
		return () => ws.close();
	}, []);

	const sendMessage = () => {
		if (socket && message.trim()) {
			socket.send(message);
			setMessage("");
		}
	};

	return (
		<div className='chat-wrapper'>
			<div className='chat-content'>
				{chat.map((msg, i) => (
					<div key={i} className={`chat-message ${msg.user.is_current ? 'current' : ''}`}>
						<div className="chat-message-avatar">
							{msg.user?.avatar ? (
								<img src={msg.user.avatar} alt="" />
							) : (
								<span>{msg.user.username[0]}</span>
							)}
						</div>
						<p key={i}>{msg.text}</p>
					</div>
				))}
			</div>

			<div className='chat-message-input-wrapper'>
				<Input
					placeholder='Сообщение...'
					variant='filled'
					value={message}
					onInput={(e) => setMessage(e.target.value)}
					onKeyDown={(key => {
						if (key.key == "Enter") sendMessage();
					})}
				/>
				<Button
					color='solid'
					variant='solid'
					onClick={sendMessage}
				>Send</Button>
			</div>
		</div>
	);
}
