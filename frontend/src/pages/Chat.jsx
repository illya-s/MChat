import "./Chat.css";

import React, { useEffect, useState } from "react";

import { Input, Button } from "antd";
import { Section } from "../components/elements/Section";

import { useAuth } from "../providers/useAuth";
import requests from "../api/requests";

export default function Chat() {
    const { user } = useAuth();

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [chatList, setChatList] = useState([]);
    const [chat, setChat] = useState([]);

    useEffect(() => {
        requests
            .get("/chat/list")
            .then((res) => setChatList(res.data.list))
            .catch((exc) => console.error(exc));
    }, []);

    const handleChat = (hash) => {
        if (socket) {
            socket.close()
            setMessage("")
            setChat([])
        };

        const token = localStorage.getItem("access_token");
        const ws = new WebSocket(
            `ws://localhost:8000/ws/chat/${hash}/?access_token=${token}`,
        );
        setSocket(ws);
        
        ws.onopen = (e) => {
            console.log("WS Connected");
        };
        ws.onclose = (e) => {
            console.log("WS Disconnected");
        };
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setChat((prev) => [...prev, data]);
        };
        return () => ws.close();
    }

    const sendMessage = () => {
        if (socket && message.trim()) {
            socket.send(
                JSON.stringify({
                    action: "chat_message",
                    data: { text: message },
                }),
            );
            setMessage("");
        }
    };

    return (
        <>
            <Section className="chat-aside">
                {chatList.map((chat, i) => (
                    <Button
                        onClick={() => handleChat(chat.hash)}
                        block
                        key={`chat_${chat.hash}`}
                    >
                        {chat.name}
                    </Button>
                ))}
            </Section>

            <div className="chat-content">
                <div className="chat-content-list">
                    {chat.map(
                        (msg, i) => console.log(msg),
                        // <div
                        //     key={i}
                        //     className={`chat-message ${msg.user.username == user.username ? "current" : ""}`}
                        // >
                        //     <div className="chat-message-avatar">
                        //         {msg.user?.avatar ? (
                        //             <img src={msg.user.avatar} alt="" />
                        //         ) : (
                        //             <span>{msg.user.username[0]}</span>
                        //         )}
                        //     </div>
                        //     <p key={i}>{msg.text}</p>
                        // </div>
                    )}
                </div>
            </div>

            <Section className="chat-message-input-wrapper">
                <Input
                    placeholder="Сообщение..."
                    variant="filled"
                    value={message}
                    onInput={(e) => setMessage(e.target.value)}
                    onKeyDown={(key) => {
                        if (key.key == "Enter") sendMessage();
                    }}
                />
                <Button color="solid" variant="solid" onClick={sendMessage}>
                    Send
                </Button>
            </Section>
        </>
    );
}
