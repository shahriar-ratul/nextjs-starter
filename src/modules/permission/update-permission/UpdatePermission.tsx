import BreadCrumb from '@/components/custom/BreadCrumb';
import { UpdatePermissionForm } from '@/components/forms/permission/update-permission-form';
import Loader from '@/components/loader/Loader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PermissionModel } from '@/schema/PermissionSchema';
import axiosInstance from '@/services/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

const breadcrumbItems = [
	{ title: 'Permissions', link: '/dashboard/permissions' },
	{ title: 'Update Permission', link: '' },
];
export default function UpdatePermission({ id }: { id: number }) {
	const session = useSession();

	const [item, SetItem] = useState<PermissionModel | null>(null);
	const fetchData = async () => {
		const { data } = await axiosInstance.get(`/api/v1/permissions/${id}`);
		return data;
	};

	const { isLoading, isError, error, isFetching } = useQuery<boolean, Error>({
		queryKey: ['permission-list', id],
		queryFn: async () => {
			const { data } = await fetchData();

			SetItem(data.item as PermissionModel);

			return true;
		},
	});

	return (
		<>
			{isLoading || isFetching ? (
				<Loader />
			) : (
				<div className="flex-1 space-y-4 px-2 md:px-2 py-4 md:py-8 pt-6">
					<BreadCrumb items={breadcrumbItems} />
					<div className="flex items-start justify-between">
						<Heading title={'User Update'} description="update" />
					</div>
					<Separator />

					{isError ? (
						<div className="text-red-600 text-center font-bold">{error?.message}</div>
					) : null}
					<Card>
						<CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
						<CardContent>{item && <UpdatePermissionForm item={item} />}</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}
