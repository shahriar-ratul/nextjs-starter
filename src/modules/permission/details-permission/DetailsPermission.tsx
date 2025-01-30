import BreadCrumb from '@/components/custom/BreadCrumb';
import Loader from '@/components/loader/Loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PermissionModel } from '@/schema/PermissionSchema';
import { RoleModel } from '@/schema/RoleSchema';
import axiosInstance from '@/services/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { bn, enUS } from 'date-fns/locale';
import Image from 'next/image';
import React, { useState } from 'react';

const breadcrumbItems = [
	{ title: 'Permissions', link: '/permissions' },
	{ title: 'Details', link: '' },
];
export default function DetailsPermission({ id }: { id: number }) {
	const [item, SetItem] = useState<PermissionModel | null>(null);
	const fetchData = async () => {
		const { data } = await axiosInstance.get(`/api/v1/permissions/${id}`);

		return data;
	};

	const { isLoading, isError, error, isFetching } = useQuery<boolean, Error>({
		queryKey: ['permissions-list', id],
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
				<div className="flex-1 space-y-4 p-2 md:px-0 pt-8">
					<BreadCrumb items={breadcrumbItems} />
					<div className="flex items-start justify-between">
						<Heading title={'Permission Details'} description="Details of Permission" />
					</div>
					<Separator />

					{isError ? (
						<div className="text-red-600 text-center font-bold">{error?.message}</div>
					) : null}
					<Card>
						<CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
						<CardContent>
							{item && (
								<div className="grid grid-cols-3 gap-2">
									<div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
										<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">Name : {item.name}</p>
										</div>
									</div>
									<div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
										<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">Slug : {item.slug}</p>
										</div>
									</div>
									<div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
										<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">Group : {item.group}</p>
										</div>
									</div>

									<div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
										<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
										<div className="space-y-1">
											<span className="text-sm font-medium leading-none">
												Status :{' '}
												{item.isActive ? (
													<Badge variant="success">Active</Badge>
												) : (
													<Badge variant="destructive">Inactive</Badge>
												)}
											</span>
										</div>
									</div>

									<div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
										<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">
												Created At :{' '}
												{item.createdAt &&
													format(parseISO(item.createdAt), 'MMM dd, yyyy, h:mm:ss a')}
											</p>
										</div>
									</div>

									<div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
										<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">
												Updated At :{' '}
												{item.updatedAt &&
													format(parseISO(item.updatedAt), 'MMM dd, yyyy, h:mm:ss a')}
											</p>
										</div>
									</div>
								</div>
							)}
							{item && item.roles.length > 0 && (
								<div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
									<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
									<div className="space-y-1">
										<span className="text-sm font-medium leading-none">
											Used By Role :{' '}
											{item.roles.map((role) => (
												<Badge
													variant="default"
													key={role.role.id}
													className="text-sm space-y-4 mx-2">
													{role.role.name}
												</Badge>
											))}
										</span>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}
