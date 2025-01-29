'use client';
import BreadCrumb from '@/components/custom/BreadCrumb';
import { CreateRoleForm } from '@/components/forms/role/create-role-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const breadcrumbItems = [
	{ title: 'Roles', link: '/roles' },
	{ title: 'New Role', link: '/roles/create' },
];
export default function AddRole() {
	return (
		<>
			<div className="flex-1 space-y-4 p-2 md:px-0 pt-8">
				<BreadCrumb items={breadcrumbItems} />
				<div className="flex items-start justify-between">
					<Heading title={'Add New Role'} description="Create a new Role." />
				</div>
				<Separator />

				<Card>
					<CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
					<CardContent>
						<CreateRoleForm />
					</CardContent>
				</Card>
			</div>
		</>
	);
}
