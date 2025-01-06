'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import ThemeToggle from '@/components/dashboard/layout/ThemeToggle';
import UserMenu from '@/components/dashboard/layout/UserMenu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import axiosInstance from '@/services/axios/axios';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Setting from './Setting';
import SwtichLanguage from './SwitchLanguage';

export default function Header() {
	const session = useSession();

	const router = useRouter();
	const pathname = usePathname();

	const navRef = useRef(null);

	const [scroll, setScroll] = useState(false);
	const [open, setOpen] = useState(false);

	async function verify() {
		const { data } = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session?.data?.user?.accessToken}`,
				},
			},
		);

		if (!data.success) {
			signOut();
		}
	}

	useEffect(() => {
		if (session?.data?.user?.accessToken && pathname !== '/login') {
			verify();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	return (
		<>
			<div
				className={cn(
					'sticky left-[250px] top-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20 pr-6',
				)}>
				<nav className="h-16 flex items-center justify-between px-4">
					<div className="flex items-center gap-0">
						<SidebarTrigger className="-ml-1" />
					</div>

					<div className="flex items-center gap-2">
						<SwtichLanguage />
						<ThemeToggle />
						<Setting />
						<UserMenu
							user={{
								name: session?.data?.user?.name ?? '',
								image: 'https://avatars.dicebear.com/api/avatars/123.svg',
								email: session?.data?.user?.email ?? '',
							}}
						/>
					</div>
				</nav>
			</div>
		</>
	);
}
