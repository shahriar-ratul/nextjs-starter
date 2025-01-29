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
import { PermissionModel } from '@/schema/PermissionSchema';
import { RoleModel } from '@/schema/RoleSchema';
import axiosInstance from '@/services/axios/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2Icon, MessageCircleWarningIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

interface PermissionGroup {
	name: string;
	groupOrder: number;
	permissions: PermissionModel[];
}

const formSchema = z.object({
	name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
	isActive: z.boolean(),
	isDefault: z.boolean(),
	permissions: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export const UpdateRoleForm = ({ item }: { item: RoleModel }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			isDefault: false,
			isActive: true,
			permissions: [],
		},
	});

	useEffect(() => {
		if (item) {
			form.setValue('name', item.name);
			form.setValue('isActive', item.isActive);
			form.setValue('isDefault', item.isDefault);
			if (item.permissions) {
				const permissionIds = item.permissions.map((p) => p.permissionId.toString());
				form.setValue('permissions', permissionIds);
			}
		}
	}, [item]);

	useEffect(() => {
		getPermissions();
	}, []);

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

	const onSubmit = async (data: FormValues) => {
		setLoading(true);
		try {
			const { name, isActive, permissions } = data;

			const body = {
				name,
				isActive,
				permissions,
			};

			await axiosInstance.put(`/api/v1/roles/${item.id}`, body, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			toast('Role updated successfully', {
				icon: <CheckCircle2Icon className="text-success dark:text-success-foreground" />,
				style: { color: 'green' },
				duration: 5000,
			});

			router.refresh();
			router.push('/dashboard/roles');
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast(error.message || 'An error occurred', {
					icon: (
						<MessageCircleWarningIcon className="text-destructive dark:text-destructive-foreground" />
					),
					style: { color: 'red' },
					duration: 5000,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
				<div className="md:grid gap-8">
					<div className="sm:grid md:grid-cols-2 gap-8">
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
																		const updatedPermissions = checked
																			? [...field.value, permission.id.toString()]
																			: field.value?.filter(
																					(value) => value !== permission.id.toString(),
																				);
																		field.onChange(updatedPermissions);
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
							Update
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
};
