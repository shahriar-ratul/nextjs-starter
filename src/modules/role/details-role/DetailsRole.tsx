/* eslint-disable @typescript-eslint/no-explicit-any */
import BreadCrumb from '@/components/custom/BreadCrumb';
import Loader from '@/components/loader/Loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { type AdminModel } from '@/schema/AdminSchema';
import { RoleModel } from '@/schema/RoleSchema';
import axiosInstance from '@/services/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useState } from 'react';

const breadcrumbItems = [
	{ title: 'Roles', link: '/dashboard/roles' },
	{ title: 'Details', link: '' },
];
export default function DetailsRole({ id }: { id: string }) {
	const [item, SetItem] = useState<RoleModel | null>(null);
	const fetchData = async () => {
		const { data } = await axiosInstance.get(`/api/v1/roles/${id}`);
		return data;
	};

	const { isLoading, isError, error, isFetching } = useQuery<boolean, Error>({
		queryKey: ['roles-list', id],
		queryFn: async () => {
			const { data } = await fetchData();

			SetItem(data.item as RoleModel);

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
						<Heading title={'Role Details'} description="Details of Role" />
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
											<p className="text-sm font-medium leading-none">
												Description : {item.description}
											</p>
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
											<p className="text-sm font-medium leading-none">
												Created At :{' '}
												{item.createdAt && format(item.createdAt, 'dd-MM-yyyy HH:mm:ss a')}
											</p>
										</div>
									</div>

									<div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
										<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">
												Updated At :{' '}
												{item.updatedAt && format(item.updatedAt, 'dd-MM-yyyy HH:mm:ss a')}
											</p>
										</div>
									</div>
								</div>
							)}

							{item && (
								<>
									<div className="mb-4 flex justify-start items-start pb-4 last:mb-0 last:pb-2 ">
										<div className="space-y-1 pr-2">
											<span className="text-sm font-medium leading-none">
												Status :{' '}
												{item.isActive ? (
													<Badge variant="success">Active</Badge>
												) : (
													<Badge variant="destructive">Inactive</Badge>
												)}
											</span>
										</div>
										<div className="space-y-1">
											<span className="text-sm font-medium leading-none">
												Default :{' '}
												{item.isDefault ? (
													<Badge variant="success">Default</Badge>
												) : (
													<Badge variant="destructive">Not Default</Badge>
												)}
											</span>
										</div>
									</div>

									<div className="mb-4 flex justify-center pb-4 last:mb-0 last:pb-0">
										<div className="space-y-1">
											<span className="text-sm font-medium leading-none">
												Permissions :{' '}
												{item.permissions && item.permissions.length > 0
													? item.permissions.map((p) => (
															<Badge
																variant="outline"
																className="bg-black text-white  rounded-lg"
																key={p.permissionId}>
																{p.permission.name}
															</Badge>
														))
													: 'No permissions assigned'}
											</span>
										</div>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}
