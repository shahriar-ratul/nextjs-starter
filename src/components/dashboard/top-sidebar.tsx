'use client';

import * as React from 'react';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export function TopSidebar() {
	const session = useSession();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<Image
							className="size-4"
							src="/images/profile.jpg"
							alt="profile-pic"
							width={16}
							height={16}
						/>
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{session.data?.user?.email}</span>
						<span className="truncate text-xs">
							{session.data?.user?.roles?.map((role) => role.role.name).join(', ')}
						</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
