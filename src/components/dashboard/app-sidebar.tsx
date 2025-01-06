'use client';

import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
} from 'lucide-react';
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
import { useSession } from 'next-auth/react';
import { TopSidebar } from './top-sidebar';

// This is sample data.
const data = {
	teams: [
		{
			name: 'Acme Inc',
			logo: GalleryVerticalEnd,
			plan: 'Enterprise',
		},
		{
			name: 'Acme Corp.',
			logo: AudioWaveform,
			plan: 'Startup',
		},
		{
			name: 'Evil Corp.',
			logo: Command,
			plan: 'Free',
		},
	],
	navMain: [
		{
			title: 'Home',
			url: '#',
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: 'Intro',
					url: '/admin/home/intro',
				},
				{
					title: 'About',
					url: '/admin/home/about',
				},
				{
					title: 'Experience',
					url: '/admin/home/experience',
				},
				{
					title: 'Skills',
					url: '/admin/home/skills',
				},
			],
		},
		{
			title: 'Projects',
			url: '/admin/projects',
			icon: Bot,
			items: [
				{
					title: 'list',
					url: '/admin/projects',
				},
			],
		},
		{
			title: 'Contact',
			url: '/admin/contact',
			icon: BookOpen,
			items: [
				{
					title: 'List',
					url: '/admin/contact',
				},
				{
					title: 'config',
					url: '/admin/contact/config',
				},
			],
		},
		{
			title: 'Blogs',
			url: '#',
			icon: Settings2,
			items: [
				{
					title: 'Blog',
					url: '/admin/blog',
				},
			],
		},
	],
	projects: [
		{
			name: 'Design Engineering',
			url: '#',
			icon: Frame,
		},
		{
			name: 'Sales & Marketing',
			url: '#',
			icon: PieChart,
		},
		{
			name: 'Travel',
			url: '#',
			icon: Map,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const session = useSession();

	const user = {
		name: session.data?.user.username ?? '',
		email: session?.data?.user?.email ?? '',
		avatar: '/images/profile.jpg',
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TopSidebar />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				{/* <NavProjects projects={data.projects} /> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
