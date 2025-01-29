import type { Route } from '@/types/route';
import { BookOpen, Bot, Settings2, SquareTerminal, Users2Icon } from 'lucide-react';

export const routes: Route[] = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: SquareTerminal,
		isActive: true,
		isCollapsed: false,
		permission: 'admin.dashboard',
	},
	{
		title: 'Home',
		url: '#',
		icon: SquareTerminal,
		isActive: true,
		isCollapsed: true,
		permission: 'admin.dashboard',
		items: [
			{
				title: 'Intro',
				url: '/admin/home/intro',
				permission: 'admin.dashboard',
				isActive: true,
			},
			{
				title: 'About',
				url: '/admin/home/about',
				permission: 'home.about',
				isActive: true,
			},
			{
				title: 'Experience',
				url: '/admin/home/experience',
				permission: 'home.experience',
				isActive: true,
			},
			{
				title: 'Skills',
				url: '/admin/home/skills',
				permission: 'home.skills',
				isActive: true,
			},
		],
	},
	{
		title: 'Projects',
		url: '/dashboard/projects',
		icon: Bot,
		isCollapsed: true,
		permission: 'projects.module',
		isActive: true,
		items: [
			{
				title: 'list',
				url: '/dashboard/projects',
				permission: 'projects.list',
				isActive: true,
			},
		],
	},
	{
		title: 'Admins',
		url: '/dashboard/admins',
		icon: Users2Icon,
		permission: 'admin.module',
		isActive: true,
		isCollapsed: false,
	},
	{
		title: 'Roles & Permissions',
		url: '#',
		icon: BookOpen,
		permission: 'role.permission.module',
		isCollapsed: true,
		isActive: true,
		items: [
			{
				title: 'Roles',
				url: '/dashboard/roles',
				icon: Settings2,
				permission: 'role.view',
				isActive: true,
			},
			{
				title: 'Permissions',
				url: '/dashboard/permissions',
				icon: Settings2,
				permission: 'permission.view',
				isActive: true,
			},
		],
	},
	{
		title: 'Blogs',
		url: '#',
		icon: Settings2,
		permission: 'blog.module',
		isActive: true,
		isCollapsed: true,
		items: [
			{
				title: 'Blog',
				url: '/dashboard/blog',
				permission: 'blog.list',
				isActive: true,
			},
		],
	},
	{
		title: 'Kanban',
		url: '/dashboard/kanban',
		icon: Settings2,
		permission: 'kanban.module',
		isActive: true,
		isCollapsed: true,
		items: [
			{
				title: 'Kanban',
				url: '/dashboard/kanban',
				permission: 'kanban.view',
				isActive: true,
			},
			{
				title: 'Tasks',
				url: '/dashboard/kanban/tasks',
				permission: 'kanban.tasks',
				isActive: true,
			},
		],
	},
];
