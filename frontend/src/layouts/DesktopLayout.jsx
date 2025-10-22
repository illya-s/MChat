import './DesktopLayout.css'

import useAuth from '../providers/useAuth';
import { UserIcon } from '../assets/icons';

import { Outlet } from "react-router";

import { Avatar, Layout } from 'antd';


export default function DesktopLayout() {
	const data = useAuth();

	return (
		<Layout className='layout-wrapper'>
			<header>
				<img src="./android-chrome-512x512.png" alt="" />

				<h2>SoraLume.net</h2>

				{/* <div>
					{data?.user ? (
						<Avatar size='small'>{user.username[0]}</Avatar>
					) : (
						<UserIcon />
					)}
				</div>*/}
			</header>

			<main id='scrollableDiv' className="content">
				<Outlet />
			</main>
		</Layout>
	)
}