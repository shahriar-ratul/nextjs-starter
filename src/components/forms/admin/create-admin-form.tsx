'use client';
import { Button } from '@/components/ui/button';
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
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { type FileRejection, useDropzone } from 'react-dropzone';

import { toast } from 'sonner';

import Loader from '@/components/loader/Loader';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';

import { LoadingModal } from '@/components/loader/LoadingModal';
import { Combobox, ComboboxOptions } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { type AdminModel } from '@/schema/AdminSchema';
import { type RoleModel } from '@/schema/RoleSchema';
import axiosInstance from '@/services/axios/axios';
import { AxiosError } from 'axios';
import {
	ArrowUpIcon,
	CalendarIcon,
	Check,
	CheckCircle2Icon,
	ChevronsUpDown,
	MessageCircleWarningIcon,
	X,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

const formSchema = z.object({
	firstName: z.string().min(3, { message: 'First name must be at least 3 characters' }),
	lastName: z.string().min(3, { message: 'Last name must be at least 3 characters' }),
	username: z.string().min(3, { message: 'username must be at least 3 characters' }),
	email: z.string().email({ message: 'Please enter a valid email' }),
	phone: z.string().min(1, { message: 'Please enter a valid phone number' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
	dob: z
		.date({
			required_error: 'A date of birth is required.',
		})
		.optional(),
	joinedDate: z
		.date({
			required_error: 'A date of birth is required.',
		})
		.optional(),
	isActive: z.boolean().default(false),
	roles: z.array(z.string()).min(1, { message: 'At least one role is required' }),
	gender: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateAdminForm = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const [roles, setRoles] = useState<RoleModel[]>([]);

	const session = useSession();
	const [gender, setGender] = useState<string>('');

	// image
	// image upload

	const [files, setFiles] = useState<(File & { preview: string })[]>([]);
	const [rejected, setRejected] = useState<FileRejection[]>([]);

	const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
		if (acceptedFiles?.length) {
			// setFiles(previousFiles => [
			//   ...previousFiles,
			//   ...acceptedFiles.map(file =>
			//     Object.assign(file, { preview: URL.createObjectURL(file) })
			//   )
			// ]);
			setFiles(
				acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
			);
		}

		if (rejectedFiles?.length) {
			setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		maxFiles: 1,
		multiple: false,
		accept: {
			'image/*': [],
		},
		maxSize: 1024 * 2048,
		onDrop,
	});

	useEffect(() => {
		// Revoke the data uris to avoid memory leaks
		return () => {
			for (const file of files) {
				URL.revokeObjectURL(file.preview);
			}
		};
	}, [files]);

	const removeFile = (name: string) => {
		setFiles((files) => files.filter((file) => file.name !== name));
	};

	const removeAll = () => {
		setFiles([]);
		setRejected([]);
	};

	const removeRejected = (name: string) => {
		setRejected((files) => files.filter(({ file }) => file.name !== name));
	};

	const defaultValues = {
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		phone: '',
		password: '',
		dob: undefined,
		joinedDate: undefined,
		roles: undefined,
		isActive: true,
		gender: undefined,
	};

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const getRoles = async () => {
		const { data } = await axiosInstance.get('/api/v1/common/all-roles', {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (data.success) {
			setRoles(data.data.items as RoleModel[]);
		}
	};

	useEffect(() => {
		getRoles();
	}, []);

	const onSubmit = async (data: FormValues) => {
		try {
			const {
				firstName,
				lastName,
				username,
				email,
				phone,
				password,
				roles,
				dob,
				joinedDate,
				isActive,
			} = data;

			setLoading(true);

			const formData = new FormData();
			formData.append('firstName', firstName);
			formData.append('lastName', lastName);
			formData.append('username', username);
			formData.append('email', email);
			formData.append('phone', phone);
			formData.append('password', password);
			formData.append('roles', JSON.stringify(roles));
			formData.append('isActive', String(isActive));
			formData.append('createdBy', session.data?.user.id as string);
			formData.append('updatedBy', session.data?.user.id as string);
			formData.append('gender', gender);

			if (dob) {
				formData.append('dob', JSON.stringify(dob));
			}

			if (joinedDate) {
				formData.append('joinedDate', JSON.stringify(joinedDate));
			}

			if (files?.length > 0) {
				formData.append('image', files[0]);
			}

			await axiosInstance
				.post('/api/v1/admins', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
				.then((res) => {
					const message = (res.data.data.message as string) || 'Admin created successfully';

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
					router.push('/dashboard/admins');
				})
				.catch((err: unknown) => {
					if (err instanceof AxiosError) {
						toast(err?.response?.data.message as string, {
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
		<div className="relative w-full">
			{loading && <LoadingModal isOpen={loading} />}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
					<Card className="w-full">
						<CardHeader>
							<CardTitle>Personal Information</CardTitle>
							<CardDescription>
								Your simple personal information required for identification
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="md:grid md:grid-cols-2 gap-8">
								{/* firstName */}
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input disabled={loading} placeholder="First Name" {...field} type="text" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* lastName */}
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input disabled={loading} placeholder="Last Name" {...field} type="text" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* username */}
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Username &nbsp;
												<span className="text-destructive dark:text-destructive-foreground">
													( Username must be unique)
												</span>
											</FormLabel>
											<FormControl>
												<Input disabled={loading} placeholder="Username" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* email */}
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Email &nbsp;
												<span className="text-destructive dark:text-destructive-foreground">
													(Email must be unique)
												</span>
											</FormLabel>
											<FormControl>
												<Input disabled={loading} placeholder="Email" {...field} type="email" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* phone */}
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Phone &nbsp;
												<span className="text-destructive dark:text-destructive-foreground">
													(Please add country code before number)
												</span>
											</FormLabel>
											<FormControl>
												<Input type="text" disabled={loading} {...field} placeholder="Phone" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* password */}
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Password &nbsp;
												<span className="text-destructive dark:text-destructive-foreground">
													(Password at least 6 characters long)
												</span>
											</FormLabel>

											<FormControl>
												<Input
													type="password"
													disabled={loading}
													placeholder="Password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="joinedDate"
									render={({ field }) => (
										<FormItem className="flex flex-col p-2">
											<FormLabel>Joined Date</FormLabel>
											<DatePicker
												placeholder="Joined Date"
												onChange={field.onChange}
												value={field.value}
												startYear={1980}
												endYear={2030}
												displayFormat="dd-MM-yyyy"
											/>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="dob"
									render={({ field }) => (
										<FormItem className="flex flex-col p-2">
											<FormLabel>Date of birth</FormLabel>
											<DatePicker
												placeholder="Date of birth"
												onChange={field.onChange}
												value={field.value}
												startYear={1980}
												endYear={2030}
												displayFormat="dd-MM-yyyy"
											/>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="roles"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role</FormLabel>
											<MultiSelect
												options={roles.map((role) => ({
													label: role.name,
													value: role.id.toString(),
												}))}
												onValueChange={field.onChange}
												defaultValue={field.value}
												placeholder="Select Roles"
												variant="inverted"
												animation={0}
												maxCount={3}
											/>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="gender"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Gender</FormLabel>
											<FormControl>
												<Combobox
													options={[
														{ label: 'Male', value: 'male' },
														{ label: 'Female', value: 'female' },
													]}
													placeholder="Select Gender"
													selected={gender}
													onChange={(value: ComboboxOptions) => {
														setGender(value.value);
														field.onChange(value.value);
													}}
													showCreate={false}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>

						<CardHeader>
							<CardTitle>Profile Photo</CardTitle>
						</CardHeader>
						<CardContent>
							<div
								{...getRootProps({
									className:
										'p-16 mt-10 border border-4 border-black rounded-md p-16 mt-10 dark:border-white',
								})}>
								<input {...getInputProps()} />
								<div className="flex flex-col items-center justify-center gap-4 text-black dark:text-white">
									<ArrowUpIcon className="w-5 h-5 fill-current dark:fill-white" />
									{isDragActive ? (
										<p>Drop the files here ...</p>
									) : (
										<p>Drag & drop files here, or click to select files</p>
									)}
								</div>
							</div>

							{/* Preview */}
							<section className="mt-10">
								<div className="flex gap-4">
									<h2 className="title text-3xl font-semibold">Preview</h2>
									<button
										type="button"
										onClick={removeAll}
										className="ml-auto mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-purple-400 rounded-md px-3 hover:bg-purple-400 hover:text-white transition-colors dark:text-white dark:border-white">
										Remove all files
									</button>
								</div>

								{/* Accepted files */}
								<h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3 dark:text-white">
									Accepted Files
								</h3>
								<ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
									{files.map((file) => (
										<li
											key={file.name}
											className="relative h-32 rounded-md shadow-lg dark:shadow-white">
											<Image
												src={file.preview}
												alt={file.name}
												width={100}
												height={100}
												onLoad={() => {
													URL.revokeObjectURL(file.preview);
												}}
												className="h-full w-full object-contain rounded-md dark:object-cover"
											/>
											<button
												type="button"
												className="w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors dark:border-white dark:bg-white"
												onClick={() => removeFile(file.name)}>
												<X className="w-5 h-5 fill-white hover:fill-secondary-400 transition-colors dark:fill-white" />
											</button>
											<p className="mt-2 text-neutral-500 text-[12px] font-medium dark:text-white">
												{file.name}
											</p>
										</li>
									))}
								</ul>

								{/* Rejected Files */}
								<h3 className="title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3 dark:text-white">
									Rejected Files
								</h3>
								<ul className="mt-6 flex flex-col">
									{rejected.map(({ file, errors }) => (
										<li
											key={file.name}
											className="flex items-start justify-between dark:text-white">
											<div>
												<p className="mt-2 text-neutral-500 text-sm font-medium dark:text-white">
													{file.name}
												</p>
												<ul className="text-[12px] text-red-400 ">
													{errors.map((error) => (
														<li key={error.code}>{error.message}</li>
													))}
												</ul>
											</div>
											<button
												type="button"
												className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors dark:text-white dark:border-white"
												onClick={() => removeRejected(file.name)}>
												remove
											</button>
										</li>
									))}
								</ul>
							</section>
						</CardContent>

						<div className="flex justify-center">
							{/* isActive */}
							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Active</FormLabel>
											<FormDescription>This admin will be active.</FormDescription>
										</div>
									</FormItem>
								)}
							/>
						</div>

						<CardFooter className="flex justify-evenly">
							<Button disabled={loading} className="bg-black dark:bg-white" type="submit">
								Save
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</div>
	);
};
