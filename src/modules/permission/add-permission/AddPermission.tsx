'use client';
import BreadCrumb from '@/components/custom/BreadCrumb';
import { CreatePermissionForm } from '@/components/forms/permission/create-permission-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const breadcrumbItems = [
	{ title: 'Permissions', link: '/dashboard/permissions' },
	{ title: 'New Permission', link: '/dashboard/permissions/create' },
];
export default function AddPermission() {
	return (
		<>
			<div className="flex-1 space-y-4 p-2 md:px-0 pt-8">
				<BreadCrumb items={breadcrumbItems} />
				<div className="flex items-start justify-between">
					<Heading title={'Add New Permission'} description="Create a new Permission." />
				</div>
				<Separator />

				<Card>
					<CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
					<CardContent>
						<CreatePermissionForm />
					</CardContent>
				</Card>
			</div>
		</>
	);
}
