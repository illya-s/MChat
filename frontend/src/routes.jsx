// import MobileLayout from "./layouts/MobileLayout.jsx";
import ChatLayout from "./layouts/ChatLayout.jsx";
import DesktopLayout from "./layouts/DesktopLayout.jsx";
import About from "./pages/About.jsx";
import Auth from "./pages/Auth.jsx";

import Chat from './pages/Chat.jsx';
import Home from "./pages/Home.jsx";
import NotFound from './pages/NotFound.jsx';


// const Layout = isMobile ? MobileLayout : DesktopLayout;
const Layout = DesktopLayout;

export const routes = [
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: '/about',
				element: <About />,
			},
			{
				path: '/auth',
				children: [
					{
						index: true,
						element: <Auth />,
					}
				]
			}
		]
	},
	{
		path: '/',
		element: <ChatLayout />,
		children: [
			{
				path: "/chat",
				element: <Chat />,
			},
		]
	},
	{
		path: '*',
		element: <NotFound />,
	},
];
