// ChatLayout

import "./ChatLayout.css";

import { useAuth } from "../providers/useAuth";

import { Outlet } from "react-router";

import { Layout } from "antd";


export default function ChatLayout() {
    return (
        <Layout className="chat-layout-wrapper">
            <Outlet />
        </Layout>
    );
}
