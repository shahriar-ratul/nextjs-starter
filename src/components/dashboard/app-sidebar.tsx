'use client';

import type * as React from 'react';

import { NavMain } from '@/components/dashboard/nav-main';
// import { NavProjects } from "@/components/dashboard/nav-projects";
import { NavUser } from '@/components/dashboard/nav-user';
// import { TeamSwitcher } from "@/components/dashboard/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar';
import { routes } from '@/data/route';
import type { Route } from '@/types/route';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { TopSidebar } from './top-sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const session = useSession();

	const [showRoutes, setShowRoutes] = useState<Route[]>([]);

	const user = {
		name: session.data?.user.username ?? '',
		email: session?.data?.user?.email ?? '',
		avatar: '/images/profile.jpg',
	};

	useEffect(() => {
		const filteredRoutes = routes.filter((route) => {
			if (route.items) {
				route.items = route.items.filter((item) => {
					if (!item.isActive) {
						return false;
					}
					return session.data?.user.permissions.includes(item.permission);
				});
			}
			if (!route.isActive) {
				return false;
			}

			if (route.permission) {
				return session.data?.user.permissions.includes(route.permission);
			}
			return false;
		});
		setShowRoutes(filteredRoutes);
	}, [routes, session.data?.user.permissions]);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TopSidebar />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={showRoutes} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
