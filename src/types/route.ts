import type { LucideIcon } from 'lucide-react';

export interface Route {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive: boolean;
	items?: ItemRoute[];
	permission: string;
	isCollapsed: boolean;
}

export interface ItemRoute {
	title: string;
	url: string;
	permission: string;
	icon?: LucideIcon;
	isActive: boolean;
}
