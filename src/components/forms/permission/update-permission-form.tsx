'use client';
import { Button } from '@/components/ui/button';
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
import {
	Check,
	CheckCircle2Icon,
	ChevronsUpDown,
	Command,
	MessageCircleWarningIcon,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';

import { Combobox, ComboboxOptions } from '@/components/ui/combobox';
import { AxiosError } from 'axios';

const formSchema = z.object({
	name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
	permissionGroup: z.string(),
	group: z.string().min(3, { message: 'Group must be at least 3 characters' }),
	groupOrder: z.string().min(1, { message: 'Group Order must be at least 1' }),
	order: z.string().min(1, { message: 'Order must be at least 1' }),
	isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export const UpdatePermissionForm = ({ item }: { item: PermissionModel }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const [groups, setGroups] = useState<PermissionModel[]>([]);
	const [permissions, setPermissions] = useState<PermissionModel[]>([]);

	const session = useSession();

	const defaultValues = {
		name: '',
		permissionGroup: '',
		group: '',
		groupOrder: '',
		order: '',
		isActive: true,
	};

	useEffect(() => {
		form.setValue('name', item.name);
		form.setValue('isActive', item.isActive);
	}, [item]);

	useEffect(() => {
		if (groups.length > 0) {
			const group = groups.find((group) => group.group === item.group);
			if (group) {
				form.setValue('permissionGroup', String(group.id));
				form.setValue('group', String(group.group));
				form.setValue('groupOrder', String(group.groupOrder));
				form.setValue('order', String(group.order));
			}
		}
	}, [item, groups]);

	const getAllGroups = async () => {
		const res = await axiosInstance.get('/api/v1/common/all-permissions');

		if (res.status === 200) {
			const permissions = res.data.data.items;
			setPermissions(permissions);

			// compare and keep unique groups same as permissions use type of PermissionModel
			const uniqueGroups = permissions.filter(
				(p: PermissionModel, index: number, self: PermissionModel[]) =>
					index === self.findIndex((t) => t.group === p.group),
			);

			setGroups(uniqueGroups);
		} else {
			setGroups([]);
			setPermissions([]);
			toast(res.data.message as string, {
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
	};

	useEffect(() => {
		getAllGroups();
	}, []);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const handleGroupChange = (value: ComboboxOptions) => {
		const permission = permissions.find((permission) => permission.id === Number(value.value));
		const groups = permissions.filter((permission) => permission.group === value.label);
		const maxOrder = Math.max(...groups.map((group) => group.order));
		const order = maxOrder + 1;

		form.setValue('permissionGroup', String(permission?.id));
		form.setValue('group', String(permission?.group));
		form.setValue('groupOrder', String(permission?.groupOrder));
		form.setValue('order', String(order));
	};

	const onSubmit = async (data: FormValues) => {
		setLoading(true);
		try {
			const { name, isActive, group, groupOrder, order } = data;
			setLoading(true);

			const body = {
				name: name,
				isActive: isActive,
				group: group,
				groupOrder: Number(groupOrder),
				order: Number(order),
			};
			await axiosInstance
				.put(`/api/v1/permissions/${item.id}`, body, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
				.then((res) => {
					const message = (res.data.data.message as string) || 'Updated successfully';

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
					router.push('/dashboard/permissions');
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
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* name */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Permission name"
												{...field}
												className="border border-gray-300 rounded-md p-2"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="permissionGroup"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Permission Group</FormLabel>
										<FormControl>
											<Combobox
												options={groups.map((group) => ({
													value: String(group.id),
													label: group.group,
												}))}
												placeholder="Select permission group"
												selected={field.value}
												onChange={(value: ComboboxOptions) => {
													handleGroupChange(value);
												}}
												// onCreate={handleAppendGroup}
												showCreate={false}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-center">
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
												This permission will be active and can be assigned to roles.
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
