// import './components/base/Theme.css'
import './components/base/Base.css'

import { ConfigProvider } from "antd";
// import '@ant-design/v5-patch-for-react-19';
import { createCache, StyleProvider } from "@ant-design/cssinjs";

import { hydrateRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from "react-router";

import { MessageProvider } from "./providers/MessageProvider.jsx";
import { routes } from "./routes.jsx";
import { useEffect, useState } from 'react';

import { lightTheme, darkTheme } from "./Theme.jsx"
import { AuthContext } from './providers/AuthContext.jsx';


const router = createBrowserRouter(routes);
const cache = createCache({ hashPriority: 'high' });

function Root() {
    const [mode, setMode] = useState("auto");
    const [systemDark, setSystemDark] = useState(false);

    useEffect(() => {
        if (mode === "auto") {
            const media = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = (e) => setSystemDark(e.matches);

            setSystemDark(media.matches);
            media.addEventListener("change", handler);
            return () => media.removeEventListener("change", handler);
        }
    }, [mode]);

    const isDark = mode === "dark" || (mode === "auto" && systemDark);

    return (
        <StyleProvider cache={cache}>
            <ConfigProvider
                // renderEmpty={customizeRenderEmpty}
                theme={isDark ? darkTheme : lightTheme}
            >
                <AuthContext>
                    <MessageProvider>
                        <RouterProvider router={router} />
                    </MessageProvider>
                </AuthContext>
            </ConfigProvider>
        </StyleProvider>
    )
}

hydrateRoot(document.getElementById('root'), <Root />);
