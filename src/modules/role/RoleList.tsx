'use client';
import BreadCrumb from '@/components/custom/BreadCrumb';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Forbidden from '@/modules/errorPage/Forbidden';
import ability from '@/services/guard/ability';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import RoleTable from './role-list/role-table';

const breadcrumbItems = [{ title: 'Roles', link: '/dashboard/roles' }];
export default function RoleList() {
	return (
		<>
			{ability.can('role.view', '') ? (
				<div className="flex-1 space-y-4 p-2 md:px-0 pt-8 ">
					<BreadCrumb items={breadcrumbItems} />
					<Separator />

					<Card className="overflow-hidden">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex flex-col">
									<CardTitle>Roles List</CardTitle>
									<CardDescription>Manage Roles</CardDescription>
								</div>
								<Link
									href={'/dashboard/roles/create'}
									className={cn(buttonVariants({ variant: 'default' }))}>
									<Plus className="mr-2 h-4 w-4" /> Add New
								</Link>
							</div>
						</CardHeader>
						<CardContent>
							<RoleTable />
						</CardContent>
					</Card>
				</div>
			) : (
				<Forbidden />
			)}
		</>
	);
}
