import "./Chat.css";

import React, { useEffect, useState } from "react";

import { Avatar } from "antd";

import { Section, Button, Input } from "../components/Elements";

import { useAuth } from "../providers/useAuth";
import requests from "../api/requests";
import { SendIcon } from "../assets/icons";

export default function Chat() {
    const { user } = useAuth();

    const [chatList, setChatList] = useState([]);

    const [messageInputText, setMessageInputText] = useState("");

    const [chatHash, setChatHash] = useState(null);
    const [chatIcon, setChatIcon] = useState(null);
    const [chatName, setChatName] = useState(null);
    const [chatType, setChatType] = useState(null);
    const [chatCreatedAt, setChatCreatedAt] = useState(null);

    const [members, setMembers] = useState([]);
    const [messageList, setMessageList] = useState([]);

    const [chatSocket, setChatSocket] = useState(null);

    useEffect(() => {
        const wrapper = document.querySelector(".chat-content-list-wrapper");
        if (wrapper) {
            wrapper.scrollTop = wrapper.scrollHeight;
        }
    }, [messageList]);

    useEffect(() => {
        requests
            .get("/chat/list")
            .then((res) => setChatList(res.data.list))
            .catch((exc) => console.error(exc));
    }, []);

    const resetChatState = () => {
        setChatHash(null);
        setChatName(null);
        setChatIcon(null);
        setChatType(null);
        setChatCreatedAt(null);

        setMembers([]);
        setMessageList([]);

        if (chatSocket) {
            try {
                chatSocket.close();
            } catch (e) {}
        }
        setChatSocket(null);
    };

    const setChatData = (chat) => {
        setChatHash(chat.hash || null);
        setChatName(chat.name || null);
        setChatIcon(chat.icon || null);
        setChatType(chat.type || null);
        setChatCreatedAt(chat.created_at || null);

        setMembers(chat.members || []);
        setMessageList(chat.messageList || []);

        setChatSocket(chat.socket || null);
    };

    const handleChat = async (hash) => {
        resetChatState();

        const token = localStorage.getItem("access_token");
        const cChat = chatList.find((chat) => chat.hash.includes(hash));
        const ws = new WebSocket(
            `ws://localhost:8000/ws/chat/${hash}/?access_token=${token}`,
        );

        const ml = await requests
            .get(`/chat/${cChat.hash}/message/list/`)
            .then((res) => res.data.list)
            .catch((exc) => []);

        setChatData({
            ...cChat,
            icon: <Avatar src={cChat.icon}>{cChat.name[0]}</Avatar>,
            socket: ws,
            messageList: ml,
        });

        ws.onopen = (e) => {
            console.log("WS Connected");
        };
        ws.onclose = (e) => {
            console.log("WS Disconnected");
        };
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.status == "error") {
                console.error(data);
            } else {
                setMessageList((prev) => [...prev, data]);
            }
        };
        return () => ws.close();
    };

    const handleMessage = () => {
        if (chatSocket && messageInputText.trim()) {
            chatSocket.send(
                JSON.stringify({
                    action: "chat_message",
                    data: { text: messageInputText },
                }),
            );
            setMessageInputText("");
        }
    };

    return (
        <div className="chat-wrapper">
            <Section className="chat-aside">
                {user && (
                    <div className="chat-aside-user-wrapper">
                        <Avatar src={user.avatar}>{user.username[0]}</Avatar>
                        {user.username}
                    </div>
                )}

                {chatList.map((chat, i) => (
                    <button
                        key={`chat_${chat.hash}`}
                        className={`chat-aside-button ${chatHash == chat.hash && "active"}`}
                        onClick={() => handleChat(chat.hash)}
                    >
                        <Avatar src={chat.icon}>{chat.name[0]}</Avatar>
                        <span className="chat-aside-button-name">
                            {chat.name}
                        </span>
                        <span className="chat-aside-button-created_at">
                            {chat.created_at}
                        </span>
                    </button>
                ))}
            </Section>

            {chatHash ? (
                <div className="chat-content">
                    <Section className="chat-top-wrapper">
                        {chatIcon}

                        <div className="chat-top-middle">
                            <h2>{chatName}</h2>
                            <span>{members.length} участников</span>
                        </div>
                    </Section>

                    <div className="chat-content-list-wrapper">
                        <div className="chat-content-list">
                            {messageList.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`chat-message-wrapper ${msg.user.id == user.id ? "current" : ""}`}
                                >
                                    <Avatar src={msg.user?.avatar}>
                                        {msg.user.username[0]}
                                    </Avatar>

                                    <div className="chat-message-container">
                                        <span className="chat-message-username">
                                            {msg.user.username}
                                        </span>

                                        <div className="chat-message">
                                            <p className="chat-message-text">
                                                {msg.text}
                                            </p>
                                            <span className="chat-message-created_at">
                                                {msg.created_at}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Section className="chat-message-input-wrapper">
                        <Input
                            placeholder="Сообщение..."
                            type="default"
                            color="outlined"
                            size="ms"
                            value={messageInputText}
                            onInput={(e) => setMessageInputText(e.target.value)}
                            onKeyDown={(key) => {
                                if (key.key == "Enter") handleMessage();
                            }}
                        />
                        <Button
                            color="primary"
                            type="solid"
                            fontSize="md"
                            onClick={handleMessage}
                            icon={<SendIcon />}
                        />
                    </Section>
                </div>
            ) : (
                <div className="no-chat">
                    <Section>Выберите чат</Section>
                </div>
            )}
        </div>
    );
}
