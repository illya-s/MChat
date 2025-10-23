import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";

import { routes } from "./routes.jsx";
import { ConfigProvider } from "antd";
import { lightTheme, darkTheme } from "./Theme.jsx";
import { AuthProvider } from "./providers/AuthContext.jsx";


export async function render(req, _url, themeMode="light") {
    const handler = createStaticHandler(
      routes,
      { location: _url }
    );
    const request = new Request(
        `http://localhost:5173${String(_url)}`,
        {method: "GET", headers: new Headers(req.headers)}
    );
    const context = await handler.query(request);
    const router = createStaticRouter(handler.dataRoutes, context);

    const cache = createCache({ hashPriority: 'high' });
    const html = renderToString(
        <StyleProvider cache={cache}>
            <ConfigProvider theme={themeMode === "dark" ? darkTheme : lightTheme}>
                <AuthProvider>
                    <StaticRouterProvider router={router} context={context} nonce="the-nonce" />
                </AuthProvider>
            </ConfigProvider>
        </StyleProvider>
    )
    return { html, head: extractStyle(cache) }
}
