'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { PermissionModel } from '@/schema/PermissionSchema';
import axiosInstance from '@/services/axios/axios';
import { AxiosError } from 'axios';
import { CheckCircle2Icon, MessageCircleWarningIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';

const formSchema = z.object({
	name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
	isActive: z.boolean(),
	isDefault: z.boolean(),
	permissions: z.array(z.string()),
});

interface PermissionGroup {
	name: string;
	groupOrder: number;
	permissions: PermissionModel[];
}

type FormValues = z.infer<typeof formSchema>;

export const CreateRoleForm = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);

	const session = useSession();

	const defaultValues = {
		name: '',
		isActive: true,
		isDefault: false,
		permissions: [],
	};

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const getPermissions = async () => {
		try {
			const { data } = await axiosInstance.get('/api/v1/common/all-permissions', {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (data.success && Array.isArray(data.data.items)) {
				// sort by group order
				const items = data.data.items as PermissionModel[];
				items.sort((a: PermissionModel, b: PermissionModel) => a.groupOrder - b.groupOrder);

				const groups: PermissionGroup[] = [];
				// Group permissions by group name sort by group order and item by order
				items.map((item: PermissionModel) => {
					if (!groups.find((group) => group.name === item.group)) {
						groups.push({
							name: item.group,
							groupOrder: item.groupOrder,
							permissions: [item],
						});
						return;
					} else {
						const group = groups.find((group) => group.name === item.group);
						if (group) {
							group.permissions.push(item);
						}
						return;
					}
				});
				// sort by group order
				groups.sort((a: PermissionGroup, b: PermissionGroup) => a.groupOrder - b.groupOrder);

				// sort items by order
				const sortedGroups = groups.map((group) => {
					return {
						groupOrder: group.groupOrder,
						name: group.name,
						permissions: group.permissions.sort(
							(a: PermissionModel, b: PermissionModel) => a.order - b.order,
						),
					};
				});

				setPermissionGroups(sortedGroups);
			} else {
				console.error('Unexpected data structure:', data);
				setPermissionGroups([]);
			}
		} catch (error) {
			console.error('Error fetching permissions:', error);
			setPermissionGroups([]);
		}
	};

	useEffect(() => {
		getPermissions();
	}, []);
	const onSubmit = async (data: FormValues) => {
		setLoading(true);
		try {
			const { name, isActive, permissions, isDefault } = data;
			setLoading(true);

			const body = {
				name: name,
				isActive: isActive,
				isDefault: isDefault,
				permissions: permissions,
			};
			await axiosInstance
				.post('/api/v1/roles', body, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
				.then((res) => {
					const message = (res.data.data.message as string) || 'Added successfully';

					toast(message, {
						icon: <CheckCircle2Icon className="text-success dark:text-success-foreground" />,
						style: {
							color: 'green',
						},
						closeButton: true,
						duration: 5000,
						position: 'top-right',
					});

					router.refresh();
					router.push('/dashboard/roles');
				})
				.catch((err: unknown) => {
					if (err instanceof AxiosError) {
						toast(err?.response?.data?.message as string, {
							icon: (
								<MessageCircleWarningIcon className="text-destructive dark:text-destructive-foreground" />
							),
							closeButton: true,
							duration: 5000,
							style: {
								color: 'red',
							},
							position: 'top-right',
						});
					}
				});
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast(error.message as string, {
					icon: 'error',
					closeButton: true,
					duration: 5000,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
					<div className="md:grid gap-8">
						<div className="sm:grid md:grid-cols-2 gap-8 ">
							{/* firstName */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Role name"
												{...field}
												className="border border-gray-300 rounded-md p-2"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* permissions */}
						<div>
							<h3 className="mb-4 text-lg font-medium">Permissions</h3>
							{permissionGroups.length > 0 ? (
								<div className="space-y-4">
									{permissionGroups.map((group) => (
										<Card key={group.name} className="p-4">
											<h4 className="mb-2 font-semibold capitalize">{group.name}</h4>
											<div className="grid grid-cols-2 gap-4">
												{group.permissions.map((permission) => (
													<FormField
														key={permission.id}
														control={form.control}
														name="permissions"
														render={({ field }) => (
															<FormItem className="flex flex-row items-start space-x-3 space-y-0">
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(permission.id.toString())}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([...field.value, permission.id.toString()])
																				: field.onChange(
																						field.value?.filter(
																							(value) => value !== permission.id.toString(),
																						),
																					);
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal">{permission.name}</FormLabel>
															</FormItem>
														)}
													/>
												))}
											</div>
										</Card>
									))}
								</div>
							) : (
								<p>No permissions available.</p>
							)}
						</div>

						<div className="flex justify-center space-x-4">
							{/* isDefault */}
							<FormField
								control={form.control}
								name="isDefault"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Default</FormLabel>
											<FormDescription>
												This permission will be default and can be assigned to roles.
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							{/* isActive */}
							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Active</FormLabel>
											<FormDescription>
												This role will be active and can be assigned to users.
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-center">
							<Button disabled={loading} className="bg-black" type="submit">
								Save
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
};
