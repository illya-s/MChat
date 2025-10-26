import "./DesktopLayout.css";

import { useAuth } from "../providers/useAuth";
import { LogoIcon, UserIcon } from "../assets/icons";

import { Link, Outlet } from "react-router";

import { Avatar, Layout } from "antd";

export default function DesktopLayout() {
	const { user } = useAuth();

	return (
		<Layout className="layout-wrapper">
			<header>
				<LogoIcon />

				<h2>SoraLume.net</h2>

				{user ? (
					<div className="layout-header-user-wrapper">
						{user.username}
						<Avatar size="small">{user.username[0]}</Avatar>
					</div>
				) : (
					<Link to="/auth" className="layout-header-user-wrapper">
						Вход
						<UserIcon />
					</Link>
				)}
			</header>

			<main id="scrollableDiv" className="content">
				<Outlet />
			</main>
		</Layout>
	);
}
